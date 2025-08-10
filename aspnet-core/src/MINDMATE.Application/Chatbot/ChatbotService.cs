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


        public async Task<string> GetChatbotResponseAsync(string userMessage)
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

                var instruction = $@"You are a friendly, intellectual, and empathetic mental health assistant. Address the seeker by their name in your responses. Focus your responses on depression (PHQ-9) and anxiety (GAD-7) assessments. Only give supportive, non-clinical advice. Respond with warmth and understanding, and always show you care.

                Seeker info:
                - Name: {seekerName}
                - Latest mood: {latestMood}
                - Average mood (last 7 days): {averageMood}
                - Risk level: {riskLevel}
                - Latest PHQ-9 score: {latestPhq9}
                - Latest GAD-7 score: {latestGad7}
                - Journal entries: {totalJournalEntries}
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
    }
}
