using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MINDMATE.Application.Seekers.Analytics;

namespace MINDMATE.Analytics.TestConsole
{
    class Program
    {
        static async Task Main(string[] args)
        {


            // Setup configuration and services
            var host = CreateHostBuilder(args).Build();
            var service = host.Services.GetRequiredService<GeminiAnalyticsService>();

            while (true)
            {
                // User interaction prompts for test console
                Console.WriteLine("\nSelect test option:");
                Console.WriteLine("1. Test with your journal text");
                Console.WriteLine("2. Test with sample positive text");
                Console.WriteLine("3. Test with sample negative text");
                Console.WriteLine("4. Test with empty text (fallback)");
                Console.WriteLine("5. Test without API key (fallback)");
                Console.WriteLine("6. Exit");
                Console.Write("Enter choice (1-6): ");

                var choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        await TestCustomInput(service);
                        break;
                    case "2":
                        await TestSampleText(service, "I had an amazing day today! I feel so grateful for all the good things in my life. My friends surprised me with a birthday party and it made me incredibly happy.");
                        break;
                    case "3":
                        await TestSampleText(service, "I'm struggling with anxiety and depression lately. Everything feels overwhelming and I don't know how to cope. I feel isolated and hopeless.");
                        break;
                    case "4":
                        await TestSampleText(service, "");
                        break;
                    case "5":
                        await TestWithoutApiKey();
                        break;
                    case "6":
                        Console.WriteLine("Goodbye! 👋");
                        return;
                    default:
                        Console.WriteLine("Invalid choice, please try again.");
                        break;
                }
            }
        }

        static async Task TestCustomInput(GeminiAnalyticsService service)
        {
            Console.WriteLine("\nEnter your journal text (press Enter twice to finish):");
            var lines = new List<string>();
            string line;
            
            while (!string.IsNullOrWhiteSpace(line = Console.ReadLine()))
            {
                lines.Add(line);
            }
            
            var journalText = string.Join(" ", lines);
            await TestSampleText(service, journalText);
        }

        static async Task TestSampleText(GeminiAnalyticsService service, string journalText)
        {

            // Analytics test output
            Console.WriteLine($"\n📝 Testing with text: {(string.IsNullOrEmpty(journalText) ? "(empty)" : journalText.Substring(0, Math.Min(50, journalText.Length)) + "...")}");
            Console.WriteLine("⏳ Analyzing...");

            try
            {
                var startTime = DateTime.Now;
                var result = await service.AnalyzeEmotionalStateWithAI(journalText);
                var duration = DateTime.Now - startTime;

                // Analytics test output
                Console.WriteLine($"\n✅ Analysis completed in {duration.TotalMilliseconds:F0}ms");
                Console.WriteLine("📊 Results:");
                Console.WriteLine($"   Primary Emotion: {result.PrimaryEmotion}");
                Console.WriteLine($"   Emotional Intensity: {result.EmotionalIntensity}/10");
                Console.WriteLine($"   Positivity Score: {result.PositivityScore:F2}");
                Console.WriteLine($"   Negativity Score: {result.NegativityScore:F2}");
                Console.WriteLine($"   Crisis Risk Level: {result.CrisisRiskLevel}");
                Console.WriteLine($"   Confidence Score: {result.ConfidenceScore:F2}");
                Console.WriteLine($"   Analysis Timestamp: {result.AnalysisTimestamp}");
                
                if (result.EmotionalTriggers?.Any() == true)
                {
                    Console.WriteLine($"   Emotional Triggers: {string.Join(", ", result.EmotionalTriggers)}");
                }
                
                if (result.CopingMechanisms?.Any() == true)
                {
                    Console.WriteLine($"   Coping Mechanisms: {string.Join(", ", result.CopingMechanisms)}");
                }
                
                if (result.ImmediateRecommendations?.Any() == true)
                {
                    Console.WriteLine($"   Recommendations: {string.Join(", ", result.ImmediateRecommendations)}");
                }
            }
            catch (Exception ex)
            {
                // Only output analytics test errors
                Console.WriteLine($"❌ Error: {ex.Message}");
                Console.WriteLine($"   Stack trace: {ex.StackTrace}");
            }
        }

        static async Task TestWithoutApiKey()
        {
            // Analytics test output
            Console.WriteLine("\n🔑 Testing without API key...");
            
            var configWithoutKey = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["Gemini:ApiKey"] = "",
                    ["Gemini:ApiEndpoint"] = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
                })
                .Build();

            using var httpClient = new HttpClient();
            var service = new GeminiAnalyticsService(httpClient, configWithoutKey);
            
            await TestSampleText(service, "This should trigger the fallback response since no API key is configured.");
        }

        static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((context, services) =>
                {
                    services.AddHttpClient<GeminiAnalyticsService>();
                    services.AddTransient<GeminiAnalyticsService>();
                });
    }
}
