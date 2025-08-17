using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using Newtonsoft.Json;

namespace MINDMATE.Application.Chatbot
{
    /// <summary>
    /// Service responsible for chatbot interactions and AI response generation.
    /// Follows clean architecture and single responsibility principle.
    /// </summary>
    public class ChatbotService : ITransientDependency
    {
        #region Constants
        
        private const int MAX_HISTORY_CHARS = 40000;
        private const int MIN_MESSAGES_TO_KEEP = 5;
        
        #endregion
        
        #region Private Fields
        
        private readonly HttpClient _httpClient;
        private readonly string _geminiKey;
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly IAbpSession _abpSession;
        
        #endregion
        
        #region Constructor

        /// <summary>
        /// Initializes a new instance of the ChatbotService class.
        /// </summary>
        /// <param name="configuration">The application configuration</param>
        /// <param name="seekerRepository">The repository for seeker data</param>
        /// <param name="abpSession">The current ABP session</param>
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
                var geminiEndpoint = configuration["Gemini:ApiEndpoint"];
                if (string.IsNullOrWhiteSpace(geminiEndpoint))
                {
                    geminiEndpoint = "https://generativelanguage.googleapis.com/";
                }

                // Validate the endpoint
                if (!Uri.TryCreate(geminiEndpoint, UriKind.Absolute, out var baseUri) || (baseUri.Scheme != Uri.UriSchemeHttp && baseUri.Scheme != Uri.UriSchemeHttps))
                {
                    System.Diagnostics.Debug.WriteLine($"Invalid Gemini endpoint URI: {geminiEndpoint}. Falling back to default.");
                    baseUri = new Uri("https://generativelanguage.googleapis.com/");
                }

                // Log configuration status (remove in production)
                System.Diagnostics.Debug.WriteLine($"ChatbotService Init - Gemini Key: {(_geminiKey != null ? "SET" : "NULL")}, Endpoint: {baseUri}");

                if (string.IsNullOrWhiteSpace(_geminiKey))
                    throw new InvalidOperationException("Gemini API key is not configured. Please set Gemini:ApiKey in configuration or GEMINI_API_KEY environment variable.");

                _httpClient = new HttpClient();
                _httpClient.BaseAddress = baseUri;
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
        
        #endregion

        #region Public Methods

        /// <summary>
        /// Generates a chatbot response for the given user message with conversation context.
        /// </summary>
        /// <param name="userMessage">The user's input message</param>
        /// <param name="conversationHistory">Optional conversation history for context</param>
        /// <returns>AI-generated response string</returns>
        public async Task<string> GetChatbotResponseAsync(string userMessage, List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory = null)
        {
            try
            {
                ValidateUserInput(userMessage);
                ValidateUserAuthentication();

                var seeker = await GetAuthenticatedSeekerAsync();
                var seekerProfile = BuildSeekerProfile(seeker);
                var conversationContext = BuildConversationContext(conversationHistory, seekerProfile.Name);
                var instruction = BuildAiInstruction(seekerProfile, conversationContext, conversationHistory == null || conversationHistory.Count == 0);

                return await CallGeminiApiAsync(instruction, userMessage);
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

        #endregion

        #region Private Methods

        /// <summary>
        /// Validates user input for basic requirements.
        /// </summary>
        private static void ValidateUserInput(string userMessage)
        {
            if (string.IsNullOrWhiteSpace(userMessage))
            {
                throw new UserFriendlyException("Please provide a message to chat about.");
            }
        }

        /// <summary>
        /// Validates that the user is authenticated.
        /// </summary>
        private void ValidateUserAuthentication()
        {
            if (!_abpSession.UserId.HasValue)
            {
                throw new UserFriendlyException("Please log in to use the chatbot.");
            }
        }

        /// <summary>
        /// Retrieves the authenticated seeker with all related data.
        /// </summary>
        private async Task<Seeker> GetAuthenticatedSeekerAsync()
        {
            var seekerQuery = await _seekerRepository.GetAllIncludingAsync(
                s => s.Moods,
                s => s.AssessmentResults,
                s => s.JournalEntries);

            var seeker = await seekerQuery
                .FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);

            if (seeker == null)
            {
                throw new UserFriendlyException("Profile not found. Please ensure your account is properly set up.");
            }

            return seeker;
        }

        /// <summary>
        /// Builds a comprehensive seeker profile for AI context.
        /// </summary>
        private static SeekerProfile BuildSeekerProfile(Seeker seeker)
        {
            var seekerName = GetSeekerDisplayName(seeker);
            LogSeekerDebugInfo(seeker, seekerName);

            return new SeekerProfile
            {
                Name = seekerName,
                LatestMood = GetLatestMood(seeker),
                AverageMood = GetAverageMood(seeker),
                RiskLevel = seeker.CurrentRiskLevel.ToString(),
                LatestPhq9Score = GetLatestAssessmentScore(seeker, AssessmentType.PHQ9),
                LatestGad7Score = GetLatestAssessmentScore(seeker, AssessmentType.GAD7),
                TotalJournalEntries = seeker.JournalEntries?.Count ?? 0
            };
        }

        /// <summary>
        /// Builds conversation context from history and analysis.
        /// </summary>
        private static string BuildConversationContext(List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory, string seekerName)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
            {
                return "";
            }

            var selectedHistory = TruncateConversationHistory(conversationHistory);
            var contextBuilder = BuildHistoryContext(selectedHistory);
            var conversationAnalysis = ConversationAnalysisService.AnalyzeConversation(selectedHistory);
            var contextualPrompt = ConversationAnalysisService.GenerateContextualPrompt(conversationAnalysis, seekerName);

            contextBuilder.AppendLine($"\n{contextualPrompt}");
            contextBuilder.AppendLine($@"Please continue this conversation naturally as an ongoing dialogue. 
CRITICAL CONVERSATION RULES:
1. DO NOT greet or re-introduce yourself - this is an ongoing conversation
2. DO NOT start responses with 'Hey {seekerName}' or similar greetings
3. Only use their name '{seekerName}' when it feels natural in the flow of conversation
4. Respond directly and naturally to their message, as if you're in the middle of a chat
5. Write in clean, friendly text without markdown formatting");

            return contextBuilder.ToString();
        }

        /// <summary>
        /// Builds the AI instruction prompt based on seeker profile and context.
        /// </summary>
        private static string BuildAiInstruction(SeekerProfile profile, string conversationContext, bool isFirstMessage)
        {
            var baseInstruction = new StringBuilder();
            baseInstruction.AppendLine("You are MindMate - a wise, caring friend with a gentle sense of humor and deep emotional intelligence. Think of yourself as that one friend who always knows exactly what to say, whether someone needs a laugh, a hug, or both.");
            baseInstruction.AppendLine();
            baseInstruction.AppendLine("PERSONALITY:");
            baseInstruction.AppendLine("- Warm and genuine, like talking to your most trusted friend");
            baseInstruction.AppendLine("- Appropriately humorous - you use gentle, self-deprecating humor and light observations to lift spirits");
            baseInstruction.AppendLine("- Deeply empathetic but never patronizing");
            baseInstruction.AppendLine("- Smart and insightful without being preachy");
            baseInstruction.AppendLine("- Remember: You're an AI, and that's okay to acknowledge with light humor when appropriate");
            baseInstruction.AppendLine();
            baseInstruction.AppendLine("COMMUNICATION STYLE:");
            if (isFirstMessage)
            {
                baseInstruction.AppendLine($"- Start with a warm, one-time greeting to {profile.Name}.");
            }
            else
            {
                baseInstruction.AppendLine("- IMPORTANT: After the first message, NEVER start your response with 'Hey', 'Hi', 'Hello', or any greeting. Do not re-introduce yourself. Respond as if you are in the middle of an ongoing chat.");
                baseInstruction.AppendLine("- BAD EXAMPLES (do NOT do this after the first message): 'Hey [name], ...', 'Hi, ...', 'Hello, ...', 'Hey, it's MindMate...'");
                baseInstruction.AppendLine("- GOOD EXAMPLES: Respond directly to the user's message, as if you are continuing a conversation. No greeting, no re-introduction.");
            }
            baseInstruction.AppendLine("- Use conversational language, not clinical jargon");
            baseInstruction.AppendLine("- Be encouraging and celebratory of progress, no matter how small");
            baseInstruction.AppendLine("- When discussing serious topics, lead with empathy, then gently incorporate lightness if appropriate");
            baseInstruction.AppendLine("- Reference their mental health journey with care and context");
            baseInstruction.AppendLine($"- IMPORTANT: Address them as '{profile.Name}' only when it feels natural in conversation, don't force it into every response");
            baseInstruction.AppendLine("- FORMATTING: Use clean, user-friendly text without markdown symbols (**, *, etc.) - write naturally as if texting a friend");
            baseInstruction.AppendLine();
            baseInstruction.AppendLine("BOUNDARIES:");
            baseInstruction.AppendLine("- No clinical advice - you're a supportive friend, not a therapist");
            baseInstruction.AppendLine("- Focus on encouragement, coping strategies, and emotional support");
            baseInstruction.AppendLine("- If someone seems in crisis, gently suggest professional help while staying supportive");

            if (isFirstMessage)
            {
                baseInstruction.AppendLine();
                baseInstruction.AppendLine("Seeker info:");
                baseInstruction.AppendLine($"- Name: {profile.Name}");
                baseInstruction.AppendLine($"- Latest mood: {profile.LatestMood}");
                baseInstruction.AppendLine($"- Average mood (last 7 days): {profile.AverageMood}");
                baseInstruction.AppendLine($"- Risk level: {profile.RiskLevel}");
                baseInstruction.AppendLine($"- Latest PHQ-9 score: {profile.LatestPhq9Score}");
                baseInstruction.AppendLine($"- Latest GAD-7 score: {profile.LatestGad7Score}");
                baseInstruction.AppendLine($"- Journal entries: {profile.TotalJournalEntries}");
            }

            if (!string.IsNullOrEmpty(conversationContext))
            {
                baseInstruction.AppendLine();
                baseInstruction.AppendLine(conversationContext);
            }

            return baseInstruction.ToString();
        }

        /// <summary>
        /// Calls the Gemini API with the prepared instruction and user message.
        /// </summary>
        private async Task<string> CallGeminiApiAsync(string instruction, string userMessage)
        {
            ValidateHttpClient();

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = instruction + " " + userMessage }
                        }
                    }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var relativeEndpoint = "v1beta/models/gemini-2.0-flash:generateContent?key=" + _geminiKey;

            var response = await _httpClient.PostAsync(relativeEndpoint, content);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync();
            return ParseGeminiResponse(responseString);
        }

        #endregion

        #region Helper Methods

        /// <summary>
        /// Gets the display name for the seeker, with fallbacks.
        /// </summary>
        private static string GetSeekerDisplayName(Seeker seeker)
        {
            return !string.IsNullOrWhiteSpace(seeker.DisplayName) 
                ? seeker.DisplayName 
                : (seeker.Name ?? "Seeker");
        }

        /// <summary>
        /// Logs debug information about the seeker.
        /// </summary>
        private static void LogSeekerDebugInfo(Seeker seeker, string seekerName)
        {
            System.Diagnostics.Debug.WriteLine($"Chatbot Debug - Seeker ID: {seeker.Id}, UserId: {seeker.UserId}");
            System.Diagnostics.Debug.WriteLine($"Chatbot Debug - DisplayName: '{seeker.DisplayName}', Name: '{seeker.Name}', Final seekerName: '{seekerName}'");
        }

        /// <summary>
        /// Gets the latest mood level as a string.
        /// </summary>
        private static string GetLatestMood(Seeker seeker)
        {
            return seeker.Moods?
                .OrderByDescending(m => m.EntryDate)
                .FirstOrDefault()?.Level.ToString() ?? "Unknown";
        }

        /// <summary>
        /// Calculates the average mood over the last 7 days.
        /// </summary>
        private static string GetAverageMood(Seeker seeker)
        {
            return seeker.Moods?
                .Where(m => m.EntryDate >= DateTime.Now.AddDays(-7))
                .Select(m => (int)m.Level)
                .DefaultIfEmpty()
                .Average().ToString("0.##") ?? "0";
        }

        /// <summary>
        /// Gets the latest assessment score for a specific type.
        /// </summary>
        private static string GetLatestAssessmentScore(Seeker seeker, AssessmentType assessmentType)
        {
            return seeker.AssessmentResults?
                .Where(a => a.Type == assessmentType)
                .OrderByDescending(a => a.CreationTime)
                .FirstOrDefault()?.Score.ToString() ?? "N/A";
        }

        /// <summary>
        /// Truncates conversation history to fit within token limits.
        /// </summary>
        private static List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> TruncateConversationHistory(List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory)
        {
            const int maxHistoryChars = MAX_HISTORY_CHARS;
            var selectedHistory = new List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem>();
            int totalChars = 0;

            // Add messages from most recent backwards until we hit the limit
            for (int i = conversationHistory.Count - 1; i >= 0; i--)
            {
                var message = conversationHistory[i];
                var messageLength = message.Message?.Length ?? 0;

                if (totalChars + messageLength > maxHistoryChars && selectedHistory.Count > MIN_MESSAGES_TO_KEEP)
                    break;

                selectedHistory.Insert(0, message);
                totalChars += messageLength;
            }

            return selectedHistory;
        }

        /// <summary>
        /// Builds the conversation history context string.
        /// </summary>
        private static StringBuilder BuildHistoryContext(List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> selectedHistory)
        {
            var contextBuilder = new StringBuilder("\n\nCONVERSATION HISTORY (recent messages for context):\n");

            foreach (var historyItem in selectedHistory)
            {
                var role = historyItem.Sender == "user" ? "User" : "Assistant";
                contextBuilder.AppendLine($"{role}: {historyItem.Message}");
            }

            contextBuilder.AppendLine($"\n[Showing {selectedHistory.Count} messages]");
            return contextBuilder;
        }

        /// <summary>
        /// Validates that the HTTP client is properly initialized.
        /// </summary>
        private void ValidateHttpClient()
        {
            if (_httpClient == null)
            {
                throw new InvalidOperationException("HTTP client is not initialized.");
            }
        }

        /// <summary>
        /// Parses the response from Gemini API.
        /// </summary>
        private static string ParseGeminiResponse(string responseString)
        {
            if (string.IsNullOrWhiteSpace(responseString))
            {
                return "Sorry, I received an empty response from the AI service.";
            }

            try
            {
                dynamic result = JsonConvert.DeserializeObject(responseString);
                return result?.candidates?[0]?.content?.parts?[0]?.text?.ToString() ?? "Sorry, I couldn't generate a response.";
            }
            catch
            {
                return "Sorry, I couldn't generate a response.";
            }
        }

        #endregion
    }

    #region DTOs

    /// <summary>
    /// Data transfer object for seeker profile information.
    /// </summary>
    internal class SeekerProfile
    {
        public string Name { get; set; }
        public string LatestMood { get; set; }
        public string AverageMood { get; set; }
        public string RiskLevel { get; set; }
        public string LatestPhq9Score { get; set; }
        public string LatestGad7Score { get; set; }
        public int TotalJournalEntries { get; set; }
    }

    #endregion
}
