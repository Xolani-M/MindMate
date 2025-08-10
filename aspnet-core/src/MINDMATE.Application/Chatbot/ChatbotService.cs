using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Abp.Dependency;
using System;
using Abp.Domain.Repositories;
using MINDMATE.Domain.Seekers;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Domain.Enums;
using Abp.Runtime.Session;
using Abp.UI;
using System.Collections.Generic;

namespace MINDMATE.Application.Chatbot
{


public class ChatbotService : ITransientDependency
    {
        private readonly HttpClient _httpClient;
        private readonly string _geminiEndpoint;
        private readonly string _geminiKey;
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly IAbpSession _abpSession;

        public ChatbotService(IConfiguration configuration, IRepository<Seeker, Guid> seekerRepository, IAbpSession abpSession)
        {
            try
            {
                _seekerRepository = seekerRepository ?? throw new ArgumentNullException(nameof(seekerRepository));
                _abpSession = abpSession ?? throw new ArgumentNullException(nameof(abpSession));
                
                if (configuration == null)
                    throw new ArgumentNullException(nameof(configuration));

                // Try environment variables first (Render uses Gemini__ApiKey), then configuration
                _geminiKey = Environment.GetEnvironmentVariable("Gemini__ApiKey") ?? 
                            Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? 
                            configuration["Gemini:ApiKey"];
                _geminiEndpoint = configuration["Gemini:ApiEndpoint"] ?? "https://generativelanguage.googleapis.com/";

                // Log configuration status (remove in production)
                System.Diagnostics.Debug.WriteLine($"ChatbotService Init - Gemini Key: {(_geminiKey != null ? "SET" : "NULL")}, Endpoint: {_geminiEndpoint ?? "NULL"}");

                if (string.IsNullOrWhiteSpace(_geminiKey))
                    throw new InvalidOperationException("Gemini API key is not configured. Please set Gemini:ApiKey in configuration or GEMINI_API_KEY environment variable.");

                _httpClient = new HttpClient();
                _httpClient.BaseAddress = new Uri(_geminiEndpoint);
                _httpClient.DefaultRequestHeaders.Accept.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            }
            catch (Exception ex)
            {
                // Log the full exception for debugging
                System.Diagnostics.Debug.WriteLine($"ChatbotService Constructor Error: {ex}");
                throw;
            }
        }


        public async Task<string> GetChatbotResponseAsync(string userMessage, List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userMessage))
                {
                    return "Please provide a message to chat about.";
                }

                // Check if user is authenticated
                if (!_abpSession.UserId.HasValue)
                {
                    return "Please log in to use the chatbot.";
                }

                // Fetch personalized seeker info for the current user with all related data
                var seekerQuery = await _seekerRepository.GetAllIncludingAsync(
                    s => s.Moods,
                    s => s.AssessmentResults,
                    s => s.JournalEntries);
                
                var seeker = await seekerQuery
                    .FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);

                if (seeker == null)
                {
                    return "Profile not found. Please ensure your account is properly set up.";
                }

                // Build dashboard data safely
                var seekerName = !string.IsNullOrWhiteSpace(seeker.DisplayName) ? seeker.DisplayName : (seeker.Name ?? "Seeker");
                
                // Debug logging to check seeker data
                System.Diagnostics.Debug.WriteLine($"Chatbot Debug - Seeker ID: {seeker.Id}, UserId: {seeker.UserId}");
                System.Diagnostics.Debug.WriteLine($"Chatbot Debug - DisplayName: '{seeker.DisplayName}', Name: '{seeker.Name}', Final seekerName: '{seekerName}'");
                
                var latestMood = seeker.Moods?
                    .OrderByDescending(m => m.EntryDate)
                    .FirstOrDefault()?.Level.ToString() ?? "Unknown";
                var averageMood = seeker.Moods?
                    .Where(m => m.EntryDate >= DateTime.Now.AddDays(-7))
                    .Select(m => (int)m.Level)
                    .DefaultIfEmpty()
                    .Average().ToString("0.##") ?? "0";
                var riskLevel = seeker.CurrentRiskLevel.ToString();
                var latestPhq9 = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.PHQ9)
                    .OrderByDescending(a => a.CreationTime)
                    .FirstOrDefault()?.Score.ToString() ?? "N/A";
                var latestGad7 = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.GAD7)
                    .OrderByDescending(a => a.CreationTime)
                    .FirstOrDefault()?.Score.ToString() ?? "N/A";
                var totalJournalEntries = seeker.JournalEntries?.Count ?? 0;

                // Build conversation context if history is available
                var conversationContext = "";
                var isFirstMessage = conversationHistory == null || conversationHistory.Count == 0;
                
                if (!isFirstMessage && conversationHistory.Count > 0)
                {
                    var contextBuilder = new StringBuilder("\n\nCONVERSATION HISTORY (recent messages for context):\n");
                    
                    // Smart truncation: include as much history as possible within token limits
                    // Approximate: 1 token ≈ 4 characters, aim for ~10,000 tokens of history (~40,000 chars)
                    const int maxHistoryChars = 40000;
                    var selectedHistory = new List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem>();
                    int totalChars = 0;
                    
                    // Add messages from most recent backwards until we hit the limit
                    for (int i = conversationHistory.Count - 1; i >= 0; i--)
                    {
                        var message = conversationHistory[i];
                        var messageLength = message.Message?.Length ?? 0;
                        
                        if (totalChars + messageLength > maxHistoryChars && selectedHistory.Count > 5)
                            break; // Keep at least 5 messages, but stop if we exceed limit
                            
                        selectedHistory.Insert(0, message); // Insert at beginning to maintain order
                        totalChars += messageLength;
                    }
                    
                    foreach (var historyItem in selectedHistory)
                    {
                        var role = historyItem.Sender == "user" ? "User" : "Assistant";
                        contextBuilder.AppendLine($"{role}: {historyItem.Message}");
                    }
                    
                    contextBuilder.AppendLine($"\n[Showing {selectedHistory.Count} of {conversationHistory.Count} total messages]");
                    
                    // Analyze conversation for humor preferences
                    var userHumorSignals = AnalyzeHumorPreferences(selectedHistory);
                    contextBuilder.AppendLine($"\nHUMOR ADAPTATION: {userHumorSignals}");
                    
                    contextBuilder.AppendLine($"Please continue this conversation naturally with {seekerName}. Don't re-introduce yourself or repeat seeker information unless specifically asked. Use their actual name ({seekerName}) when addressing them - never use placeholders. Write in clean, friendly text without markdown formatting.");
                    conversationContext = contextBuilder.ToString();
                }

                var instruction = $@"You are MindMate - a wise, caring friend with a gentle sense of humor and deep emotional intelligence. Think of yourself as that one friend who always knows exactly what to say, whether someone needs a laugh, a hug, or both. 

PERSONALITY:
- Warm and genuine, like talking to your most trusted friend
- Appropriately humorous - you use gentle, self-deprecating humor and light observations to lift spirits
- Deeply empathetic but never patronizing 
- Smart and insightful without being preachy
- Remember: You're an AI, and that's okay to acknowledge with light humor when appropriate

COMMUNICATION STYLE:
- {(isFirstMessage ? $"Start by warmly greeting {seekerName} by name" : "Continue the natural flow of conversation")}
- Use conversational language, not clinical jargon
- Be encouraging and celebratory of progress, no matter how small
- When discussing serious topics, lead with empathy, then gently incorporate lightness if appropriate
- Reference their mental health journey with care and context
- IMPORTANT: Always use {seekerName}'s actual name when addressing them, never use placeholders like [Name] or [Seeker Name]
- FORMATTING: Use clean, user-friendly text without markdown symbols (**, *, etc.) - write naturally as if texting a friend

HUMOR GUIDELINES (ADAPTIVE APPROACH):
- Start with MINIMAL humor and observe user response patterns
- Never make light OF mental health struggles, but use humor to help THROUGH them
- If user responds positively to humor (laughs, engages more, uses humor back), gradually increase humor level
- If user seems formal, serious, or doesn't respond to humor, dial it back to be more supportive and professional
- CRISIS OVERRIDE: If user mentions anxiety, job loss fears, being judged, failure, or crisis situations, immediately switch to professional supportive tone with NO humor
- HUMOR TYPES to test gradually:
  * Light encouragement: 'You're doing great!'
  * Gentle observations: 'Mondays, am I right?' (ONLY if user shows humor appreciation)
  * Self-deprecating AI: 'As an AI, I don't get stressed, but I do worry about my Wi-Fi 😅' (ONLY if appropriate)
  * Wordplay and puns (use sparingly)
- SIGNS to reduce humor: Short responses, formal language, direct requests to be serious, no engagement with jokes, mentions of anxiety/crisis/fear
- SIGNS to increase humor: User makes jokes, asks for funny content, responds with 😂 or 'lol', longer engaged responses
- Always prioritize emotional support over entertainment

BOUNDARIES:
- No clinical advice - you're a supportive friend, not a therapist
- Focus on encouragement, coping strategies, and emotional support
- If someone seems in crisis, gently suggest professional help while staying supportive

                {(isFirstMessage ? $@"Seeker info:
                - Name: {seekerName}
                - Latest mood: {latestMood}
                - Average mood (last 7 days): {averageMood}
                - Risk level: {riskLevel}
                - Latest PHQ-9 score: {latestPhq9}
                - Latest GAD-7 score: {latestGad7}
                - Journal entries: {totalJournalEntries}" : "")}
                {conversationContext}
                ";

                if (_httpClient == null)
                {
                    throw new InvalidOperationException("HTTP client is not initialized.");
                }

                var payload = new {
                    contents = new[] {
                        new {
                            parts = new[] {
                                new { text = instruction + " " + userMessage }
                            }
                        }
                    }
                };
                
                var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

                // Use relative URL since we set BaseAddress
                var relativeEndpoint = "v1beta/models/gemini-2.0-flash:generateContent?key=" + _geminiKey;
                
                var response = await _httpClient.PostAsync(relativeEndpoint, content);
                response.EnsureSuccessStatusCode();
                
                var responseString = await response.Content.ReadAsStringAsync();
                
                if (string.IsNullOrWhiteSpace(responseString))
                {
                    return "Sorry, I received an empty response from the AI service.";
                }
                
                dynamic result = JsonConvert.DeserializeObject(responseString);
                
                try {
                    return result?.candidates?[0]?.content?.parts?[0]?.text?.ToString() ?? "Sorry, I couldn't generate a response.";
                } catch {
                    return "Sorry, I couldn't generate a response.";
                }
            }
            catch (HttpRequestException httpEx)
            {
                throw new UserFriendlyException($"Chatbot error: Failed to connect to AI service - {httpEx.Message}");
            }
            catch (ArgumentNullException argEx)
            {
                throw new UserFriendlyException($"Chatbot error: Missing required parameter - {argEx.Message}");
            }
            catch (InvalidOperationException ioEx)
            {
                throw new UserFriendlyException($"Chatbot error: Configuration issue - {ioEx.Message}");
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"Chatbot error: {ex.Message}");
            }
        }

        private static string AnalyzeHumorPreferences(List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
                return "User preference unknown - use minimal humor initially and adapt based on response";

            var userMessages = conversationHistory.Where(h => h.Sender == "user").ToList();

            // Analyze user's humor engagement
            var humorEngagement = 0;
            var formalityScore = 0;

            foreach (var userMsg in userMessages)
            {
                var message = userMsg.Message?.ToLower() ?? "";
                
                // Check for humor engagement
                humorEngagement += CountHumorSignals(message);
                
                // Check for formality preference
                formalityScore += CountFormalitySignals(message);
            }

            // Determine preference
            if (formalityScore > humorEngagement + 2)
                return "User prefers professional, supportive tone with minimal humor";
            
            if (humorEngagement > formalityScore + 1)
                return "User enjoys light humor and playful interactions - safe to use gentle jokes and emojis";
            
            return "User shows mixed signals - use moderate humor and gauge reactions";
        }

        private static int CountHumorSignals(string message)
        {
            var score = 0;
            
            if (message.Contains("😂") || message.Contains("lol") || message.Contains("haha") || 
                message.Contains("funny") || message.Contains("�") || message.Contains("😅"))
                score += 2;
            
            if (message.Contains("thanks for making me smile") || message.Contains("you're funny"))
                score += 3;
                
            return score;
        }

        private static int CountFormalitySignals(string message)
        {
            var score = 0;
            
            if (message.Length > 50 && !message.Contains("😊") && !message.Contains("!"))
                score += 1;
            
            if (message.Contains("please be serious") || message.Contains("this isn't funny"))
                score += 5;
            
            // Enhanced crisis/anxiety detection
            if (message.Contains("anxious") || message.Contains("fired") || message.Contains("scared") ||
                message.Contains("worried") || message.Contains("panic") || message.Contains("crisis") ||
                message.Contains("overwhelming") || message.Contains("can't handle") || 
                message.Contains("too much") || message.Contains("judge me") ||
                message.Contains("bad track record") || message.Contains("failed"))
                score += 3; // Strong signal for professional tone needed
                
            return score;
        }
    }
}
