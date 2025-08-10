using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Abp.Dependency;
using Microsoft.Extensions.Configuration;
using MINDMATE.Application.Chatbot;
using MINDMATE.Application.Chatbot.Dto;
using MINDMATE.Application.Seekers.Analytics.Dto;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Seekers.Analytics
{
    /// <summary>
    /// AI-powered analytics service using Gemini AI for advanced emotional analysis
    /// This service provides intelligent insights beyond simple keyword matching
    /// </summary>
    public class GeminiAnalyticsService : ITransientDependency
    {
        private readonly HttpClient _httpClient;
        private readonly string _geminiEndpoint;
        private readonly string _geminiKey;

        public GeminiAnalyticsService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));

            // Use same Gemini configuration as ChatbotService
            _geminiKey = Environment.GetEnvironmentVariable("Gemini__ApiKey") ??
                        Environment.GetEnvironmentVariable("GEMINI_API_KEY") ??
                        configuration["Gemini:ApiKey"];
            _geminiEndpoint = configuration["Gemini:ApiEndpoint"];

            // Handle unresolved placeholders or invalid config
            if (string.IsNullOrWhiteSpace(_geminiEndpoint) || _geminiEndpoint.Contains("${"))
                _geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

            if (string.IsNullOrWhiteSpace(_geminiKey))
                throw new InvalidOperationException("Gemini API key is not configured for analytics.");

            // Extract base URI from full endpoint URL
            if (Uri.TryCreate(_geminiEndpoint, UriKind.Absolute, out var fullUri))
            {
                var baseUri = new Uri($"{fullUri.Scheme}://{fullUri.Host}");
                _httpClient.BaseAddress = baseUri;
            }
            else
            {
                throw new InvalidOperationException($"Gemini API endpoint is not a valid absolute URI: '{_geminiEndpoint}'");
            }
        }

        #region Advanced Emotional Analysis

        /// <summary>
        /// Uses Gemini AI to perform deep emotional analysis of journal entries
        /// </summary>
        public async Task<GeminiEmotionalAnalysisDto> AnalyzeEmotionalStateWithAI(string journalText)
        {
            var prompt = CreateEmotionalAnalysisPrompt(journalText);
            var response = await CallGeminiApiAsync(prompt);
            return ParseEmotionalAnalysisResponse(response);
        }

        /// <summary>
        /// Analyzes multiple journal entries to identify patterns using AI
        /// </summary>
        public async Task<GeminiPatternAnalysisDto> AnalyzePatternsWithAI(List<JournalEntry> journalEntries)
        {
            var prompt = CreatePatternAnalysisPrompt(journalEntries);
            var response = await CallGeminiApiAsync(prompt);
            return ParsePatternAnalysisResponse(response);
        }

        /// <summary>
        /// Uses AI to predict crisis risk with sophisticated analysis
        /// </summary>
        public async Task<GeminiCrisisAnalysisDto> PredictCrisisRiskWithAI(List<JournalEntry> journalEntries, List<MoodEntry> moodEntries)
        {
            var prompt = CreateCrisisAnalysisPrompt(journalEntries, moodEntries);
            var response = await CallGeminiApiAsync(prompt);
            return ParseCrisisAnalysisResponse(response);
        }

        /// <summary>
        /// Generates personalized therapeutic recommendations using AI
        /// </summary>
        public async Task<GeminiRecommendationsDto> GenerateTherapeuticRecommendationsWithAI(
            List<JournalEntry> journalEntries, 
            List<MoodEntry> moodEntries,
            string currentEmotionalState)
        {
            var prompt = CreateRecommendationsPrompt(journalEntries, moodEntries, currentEmotionalState);
            var response = await CallGeminiApiAsync(prompt);
            return ParseRecommendationsResponse(response);
        }

        #endregion

        #region Prompt Creation

        private string CreateEmotionalAnalysisPrompt(string journalText)
        {
            return $@"
As an AI mental health analyst, analyze this journal entry for emotional state and insights:

JOURNAL ENTRY:
""{journalText}""

Please provide a comprehensive emotional analysis in JSON format:
{{
    ""primaryEmotion"": ""dominant emotion (e.g., anxious, hopeful, frustrated)"",
    ""emotionalIntensity"": 1-10 scale,
    ""emotionalState"": ""VeryNegative, Negative, SlightlyNegative, Neutral, SlightlyPositive, Positive, or VeryPositive"",
    ""mood"": ""overall mood description"",
    ""keyThemes"": [""theme1"", ""theme2"", ""theme3""],
    ""triggerEvents"": [""potential trigger events mentioned""],
    ""copingMechanisms"": [""coping strategies mentioned""],
    ""riskFactors"": [""concerning elements""],
    ""positiveIndicators"": [""hopeful or resilient elements""],
    ""recommendedFocus"": ""area needing attention"",
    ""confidenceScore"": 0.0-1.0
}}

Focus on nuanced emotional understanding beyond simple keyword matching.";
        }

        private string CreatePatternAnalysisPrompt(List<JournalEntry> journalEntries)
        {
            var entriesText = string.Join("\n---\n", journalEntries.Take(10).Select(e => 
                $"Date: {e.EntryDate:yyyy-MM-dd}\nContent: {e.EntryText}"));

            return $@"
As an AI mental health analyst, analyze these journal entries to identify emotional patterns and trends:

JOURNAL ENTRIES:
{entriesText}

Provide pattern analysis in JSON format:
{{
    ""emotionalTrend"": ""Improving, Stable, or Declining"",
    ""recurringThemes"": [""consistent themes across entries""],
    ""triggerPatterns"": [
        {{
            ""trigger"": ""trigger description"",
            ""frequency"": ""how often it appears"",
            ""emotionalImpact"": ""impact description""
        }}
    ],
    ""copingEvolution"": ""how coping strategies have changed"",
    ""riskProgression"": ""Low, Medium, or High"",
    ""strengthsIdentified"": [""personal strengths noted""],
    ""concernAreas"": [""areas needing attention""],
    ""progressIndicators"": [""signs of improvement""],
    ""timeBasedPatterns"": ""patterns related to time/days"",
    ""recommendedInterventions"": [""suggested therapeutic approaches""],
    ""confidenceScore"": 0.0-1.0
}}

Focus on sophisticated pattern recognition that goes beyond simple sentiment analysis.";
        }

        private string CreateCrisisAnalysisPrompt(List<JournalEntry> journalEntries, List<MoodEntry> moodEntries)
        {
            var recentEntries = journalEntries.Take(5).Select(e => 
                $"Date: {e.EntryDate:yyyy-MM-dd}, Emotion: {e.EmotionalState}, Content: {e.EntryText.Substring(0, Math.Min(200, e.EntryText.Length))}...");
            var recentMoods = moodEntries.Take(7).Select(m => 
                $"Date: {m.EntryDate:yyyy-MM-dd}, Level: {m.Level}");

            return $@"
As an AI crisis assessment specialist, analyze this mental health data for crisis risk prediction:

RECENT JOURNAL ENTRIES:
{string.Join("\n", recentEntries)}

RECENT MOOD LEVELS:
{string.Join("\n", recentMoods)}

Provide crisis risk analysis in JSON format:
{{
    ""immediateRiskLevel"": ""None, Low, Medium, High, or Critical"",
    ""riskProbability"": 0-100,
    ""predictionTimeframe"": ""3-7 days"",
    ""primaryRiskFactors"": [""specific risk indicators""],
    ""protectiveFactors"": [""elements that reduce risk""],
    ""earlyWarningSignals"": [""signals to monitor""],
    ""escalationTriggers"": [""events that could worsen situation""],
    ""immediateRecommendations"": [""urgent action items""],
    ""professionalReferralNeeded"": true/false,
    ""supportSystemActivation"": [""who to contact""],
    ""monitoringFrequency"": ""hours between check-ins"",
    ""safetyPlan"": [""immediate safety strategies""],
    ""confidenceScore"": 0.0-1.0
}}

Use sophisticated psychological assessment techniques, not just keyword detection.";
        }

        private string CreateRecommendationsPrompt(List<JournalEntry> journalEntries, List<MoodEntry> moodEntries, string currentEmotionalState)
        {
            var userContext = $"Current emotional state: {currentEmotionalState}\n";
            userContext += $"Recent journal themes: {string.Join(", ", journalEntries.Take(3).Select(e => e.Emotion ?? "neutral"))}\n";
            userContext += $"Mood trend: {string.Join(" → ", moodEntries.Take(5).Select(m => m.Level.ToString()))}";

            return $@"
As an AI therapeutic advisor, create personalized mental health recommendations:

USER CONTEXT:
{userContext}

Generate therapeutic recommendations in JSON format:
{{
    ""immediateActions"": [
        {{
            ""action"": ""specific action to take"",
            ""timeframe"": ""when to do it"",
            ""expectedBenefit"": ""how it helps"",
            ""difficulty"": ""Easy, Medium, or Hard""
        }}
    ],
    ""dailyPractices"": [""sustainable daily habits""],
    ""weeklyGoals"": [""achievable weekly objectives""],
    ""copingStrategies"": [
        {{
            ""strategy"": ""coping technique"",
            ""situation"": ""when to use"",
            ""instructions"": ""how to implement""
        }}
    ],
    ""therapeuticApproaches"": [""recommended therapy types""],
    ""lifestyle modifications"": [""health and wellness changes""],
    ""socialSupport"": [""relationship and community recommendations""],
    ""mindfulnessPractices"": [""meditation and awareness exercises""],
    ""emergencyStrategies"": [""crisis moment techniques""],
    ""progressTracking"": [""ways to measure improvement""],
    ""personalizationFactors"": [""why these are suited to this person""],
    ""confidenceScore"": 0.0-1.0
}}

Base recommendations on evidence-based therapeutic practices and individual patterns.";
        }

        #endregion

        #region Response Parsing

        private GeminiEmotionalAnalysisDto ParseEmotionalAnalysisResponse(string response)
        {
            try
            {
                var cleanJson = ExtractJsonFromResponse(response);
                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                // Parse PrimaryEmotion as enum if possible, else fallback to Neutral
                var primaryEmotionStr = GetStringProperty(analysis, "primaryEmotion");
                EmotionalState primaryEmotionEnum = EmotionalState.Neutral;
                Enum.TryParse(primaryEmotionStr, true, out primaryEmotionEnum);

                var crisisRiskLevelStr = GetStringProperty(analysis, "riskLevel");
                CrisisLevel crisisRiskLevelEnum = CrisisLevel.Low;
                Enum.TryParse(crisisRiskLevelStr, true, out crisisRiskLevelEnum);

                return new GeminiEmotionalAnalysisDto
                {
                    PrimaryEmotion = primaryEmotionEnum,
                    EmotionalIntensity = GetDoubleProperty(analysis, "emotionalIntensity"),
                    PositivityScore = GetDoubleProperty(analysis, "positivityScore"),
                    NegativityScore = GetDoubleProperty(analysis, "negativityScore"),
                    EmotionalTriggers = GetStringArrayProperty(analysis, "keyThemes"),
                    CopingMechanisms = GetStringArrayProperty(analysis, "copingMechanisms"),
                    ImmediateRecommendations = GetStringArrayProperty(analysis, "recommendations"),
                    CrisisRiskLevel = crisisRiskLevelEnum,
                    ConfidenceScore = GetDoubleProperty(analysis, "confidence"),
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                // Fallback to basic analysis if AI parsing fails
                return new GeminiEmotionalAnalysisDto
                {
                    PrimaryEmotion = EmotionalState.Neutral,
                    EmotionalIntensity = 0,
                    PositivityScore = 0,
                    NegativityScore = 0,
                    EmotionalTriggers = new List<string> { "AI analysis unavailable" },
                    CopingMechanisms = new List<string>(),
                    ImmediateRecommendations = new List<string>(),
                    CrisisRiskLevel = CrisisLevel.Low,
                    ConfidenceScore = 0.0,
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }
        }

        private GeminiPatternAnalysisDto ParsePatternAnalysisResponse(string response)
        {
            try
            {
                var cleanJson = ExtractJsonFromResponse(response);
                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                return new GeminiPatternAnalysisDto
                {
                    KeyInsights = GetStringArrayProperty(analysis, "patterns"),
                    RecommendedInterventions = GetStringArrayProperty(analysis, "recommendations"),
                    PatternConfidence = GetDoubleProperty(analysis, "confidence"),
                    AnalyzedEntriesCount = GetIntProperty(analysis, "entryCount"),
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                return new GeminiPatternAnalysisDto
                {
                    KeyInsights = new List<string> { "AI analysis unavailable" },
                    RecommendedInterventions = new List<string>(),
                    PatternConfidence = 0.0,
                    AnalyzedEntriesCount = 0,
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }
        }

        private GeminiCrisisAnalysisDto ParseCrisisAnalysisResponse(string response)
        {
            try
            {
                var cleanJson = ExtractJsonFromResponse(response);
                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                return new GeminiCrisisAnalysisDto
                {
                    ImmediateRiskLevel = ParseCrisisLevel(GetStringProperty(analysis, "immediateRiskLevel")),
                    RiskProbability = GetIntProperty(analysis, "riskProbability"),
                    PredictionTimeframe = GetStringProperty(analysis, "predictionTimeframe"),
                    PrimaryRiskFactors = GetStringArrayProperty(analysis, "primaryRiskFactors"),
                    ProtectiveFactors = GetStringArrayProperty(analysis, "protectiveFactors"),
                    EarlyWarningSignals = GetStringArrayProperty(analysis, "earlyWarningSignals"),
                    EscalationTriggers = GetStringArrayProperty(analysis, "escalationTriggers"),
                    ImmediateRecommendations = GetStringArrayProperty(analysis, "immediateRecommendations"),
                    ProfessionalReferralNeeded = GetBoolProperty(analysis, "professionalReferralNeeded"),
                    SupportSystemActivation = GetStringArrayProperty(analysis, "supportSystemActivation"),
                    MonitoringFrequency = GetStringProperty(analysis, "monitoringFrequency"),
                    SafetyPlan = GetStringArrayProperty(analysis, "safetyPlan"),
                    ConfidenceScore = GetDoubleProperty(analysis, "confidenceScore")
                };
            }
            catch (Exception ex)
            {
                return new GeminiCrisisAnalysisDto
                {
                    ImmediateRiskLevel = CrisisLevel.Low,
                    RiskProbability = 20,
                    ConfidenceScore = 0.5,
                    ErrorMessage = $"AI parsing error: {ex.Message}"
                };
            }
        }

        private GeminiRecommendationsDto ParseRecommendationsResponse(string response)
        {
            try
            {
                var cleanJson = ExtractJsonFromResponse(response);
                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                return new GeminiRecommendationsDto
                {
                    ImmediateActions = GetStringArrayProperty(analysis, "immediateActions").Select(a => new TherapeuticRecommendationDto { Title = a }).ToList(),
                    ShortTermStrategies = GetStringArrayProperty(analysis, "weeklyGoals").Select(a => new TherapeuticRecommendationDto { Title = a }).ToList(),
                    SelfCareActivities = GetStringArrayProperty(analysis, "selfCareActivities").Select(a => new SelfCareRecommendationDto { ActivityName = a }).ToList(),
                    ProfessionalSupport = new List<ProfessionalSupportDto>(),
                    Resources = new List<ResourceRecommendationDto>(),
                    RecommendationConfidence = GetDoubleProperty(analysis, "confidence"),
                    RecommendationDate = DateTime.UtcNow,
                    NextReviewDate = DateTime.UtcNow.AddDays(7)
                };
            }
            catch (Exception ex)
            {
                return new GeminiRecommendationsDto
                {
                    ImmediateActions = new List<TherapeuticRecommendationDto>(),
                    ShortTermStrategies = new List<TherapeuticRecommendationDto>(),
                    SelfCareActivities = new List<SelfCareRecommendationDto>(),
                    ProfessionalSupport = new List<ProfessionalSupportDto>(),
                    Resources = new List<ResourceRecommendationDto>(),
                    RecommendationConfidence = 0.0,
                    RecommendationDate = DateTime.UtcNow,
                    NextReviewDate = DateTime.UtcNow.AddDays(7)
                };
            }
        }

        #endregion

        #region Helper Methods

        private async Task<string> CallGeminiApiAsync(string prompt)
        {
            try
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0.3, // Lower temperature for more consistent analysis
                        topK = 40,
                        topP = 0.95,
                        maxOutputTokens = 2048
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var relativeEndpoint = "v1beta/models/gemini-2.0-flash:generateContent?key=" + _geminiKey;
                var response = await _httpClient.PostAsync(relativeEndpoint, content);

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"Gemini API call failed: {response.StatusCode}");
                }

                var responseBody = await response.Content.ReadAsStringAsync();
                var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);

                return responseJson
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString() ?? "";
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Gemini AI analysis failed: {ex.Message}", ex);
            }
        }

        private string ExtractJsonFromResponse(string response)
        {
            // Find JSON content within the response
            var startIndex = response.IndexOf('{');
            var lastIndex = response.LastIndexOf('}');
            
            if (startIndex >= 0 && lastIndex > startIndex)
            {
                return response.Substring(startIndex, lastIndex - startIndex + 1);
            }
            
            return response;
        }

        private string GetStringProperty(JsonElement element, string propertyName)
        {
            return element.TryGetProperty(propertyName, out var prop) ? 
                prop.GetString() ?? "" : "";
        }

        private int GetIntProperty(JsonElement element, string propertyName)
        {
            return element.TryGetProperty(propertyName, out var prop) ? 
                prop.GetInt32() : 0;
        }

        private double GetDoubleProperty(JsonElement element, string propertyName)
        {
            return element.TryGetProperty(propertyName, out var prop) ? 
                prop.GetDouble() : 0.0;
        }

        private bool GetBoolProperty(JsonElement element, string propertyName)
        {
            return element.TryGetProperty(propertyName, out var prop) && 
                prop.GetBoolean();
        }

        private List<string> GetStringArrayProperty(JsonElement element, string propertyName)
        {
            if (element.TryGetProperty(propertyName, out var prop) && prop.ValueKind == JsonValueKind.Array)
            {
                return prop.EnumerateArray()
                    .Select(item => item.GetString() ?? "")
                    .Where(s => !string.IsNullOrEmpty(s))
                    .ToList();
            }
            return new List<string>();
        }

        private EmotionalState ParseEmotionalState(string state)
        {
            return state?.ToLower() switch
            {
                "verynegative" => EmotionalState.VeryNegative,
                "negative" => EmotionalState.Negative,
                "slightlynegative" => EmotionalState.SlightlyNegative,
                "neutral" => EmotionalState.Neutral,
                "slightlypositive" => EmotionalState.SlightlyPositive,
                "positive" => EmotionalState.Positive,
                "verypositive" => EmotionalState.VeryPositive,
                _ => EmotionalState.Neutral
            };
        }

        private CrisisLevel ParseCrisisLevel(string level)
        {
            return level?.ToLower() switch
            {
                "none" => CrisisLevel.None,
                "low" => CrisisLevel.Low,
                "medium" => CrisisLevel.Medium,
                "high" => CrisisLevel.High,
                "critical" => CrisisLevel.High, // Map critical to high
                _ => CrisisLevel.Low
            };
        }

        #endregion
    }
}
