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

        public ChatbotService(IConfiguration configuration)
        {
            // Ensure the GEMINI_API_KEY environment variable is set before running the application
            _geminiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            _geminiEndpoint = configuration["Gemini:ApiEndpoint"];
            _httpClient = new HttpClient();
        }

        public async Task<string> GetChatbotResponseAsync(string userMessage)
        {
            var instruction = "You are a friendly, intellectual, and empathetic mental health assistant. Focus your responses on depression (PHQ-9) and anxiety (GAD-7) assessments. Only give supportive, non-clinical advice. Respond with warmth and understanding, and always show you care.";
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
    }
}
