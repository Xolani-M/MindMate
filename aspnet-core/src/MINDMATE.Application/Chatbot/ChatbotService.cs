using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Abp.Dependency;
using System;

namespace MINDMATE.Application.Chatbot
{


public class ChatbotService : ITransientDependency
    {
        private readonly HttpClient _httpClient;
        private readonly string _geminiEndpoint;
        private readonly string _geminiKey;
        private readonly Seekers.SeekerAppService _seekerAppService;

        public ChatbotService(IConfiguration configuration, Seekers.SeekerAppService seekerAppService)
        {
            // Try environment variables first (Render uses Gemini__ApiKey), then configuration
            _geminiKey = Environment.GetEnvironmentVariable("Gemini__ApiKey") ?? 
                        Environment.GetEnvironmentVariable("GEMINI_API_KEY") ?? 
                        configuration["Gemini:ApiKey"];
            _geminiEndpoint = configuration["Gemini:ApiEndpoint"];
            _httpClient = new HttpClient();
            _seekerAppService = seekerAppService;
        }


        public async Task<string> GetChatbotResponseAsync(string userMessage)
        {
            try
            {
                // Fetch personalized seeker info for the current user

                var dashboard = await _seekerAppService.GetMyDashboardAsync();

                // Add null checks and safe defaults for all dashboard properties
                var seekerName = !string.IsNullOrWhiteSpace(dashboard.DisplayName) ? dashboard.DisplayName : (dashboard.Name ?? "Seeker");
                var latestMood = dashboard.LatestMood ?? "Unknown";
                var averageMood = dashboard.AverageMoodLast7Days.ToString("0.##");
                var riskLevel = dashboard.RiskLevel ?? "Unknown";
                var latestPhq9 = dashboard.LatestPhq9Score?.ToString() ?? "N/A";
                var latestGad7 = dashboard.LatestGad7Score?.ToString() ?? "N/A";
                var totalJournalEntries = dashboard.TotalJournalEntries;

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

                var endpointWithKey = _geminiEndpoint.Contains("?")
                    ? _geminiEndpoint + "&key=" + _geminiKey
                    : _geminiEndpoint + "?key=" + _geminiKey;
                var request = new HttpRequestMessage(HttpMethod.Post, endpointWithKey);
                request.Content = content;
                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var responseString = await response.Content.ReadAsStringAsync();
                dynamic result = JsonConvert.DeserializeObject(responseString);
                try {
                    return result.candidates[0].content.parts[0].text != null ? result.candidates[0].content.parts[0].text.ToString() : "Sorry, I couldn't generate a response.";
                } catch {
                    return "Sorry, I couldn't generate a response.";
                }
            }
            catch (Exception ex)
            {
                throw new Abp.UI.UserFriendlyException($"Chatbot error: {ex.Message}\n{ex.StackTrace}");
            }
        }
    }
}
