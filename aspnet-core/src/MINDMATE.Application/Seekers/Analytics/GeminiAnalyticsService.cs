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
            try
            {
                // Use same Gemini configuration as ChatbotService
                _geminiKey = Environment.GetEnvironmentVariable("Gemini__ApiKey") ??
                            Environment.GetEnvironmentVariable("GEMINI_API_KEY") ??
                            configuration["Gemini:ApiKey"];
                var geminiEndpoint = Environment.GetEnvironmentVariable("Gemini__ApiEndpoint") ??
                                     configuration["Gemini:ApiEndpoint"];
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

                _geminiEndpoint = baseUri.ToString();

                // Log configuration status for debugging
                var hasKey = !string.IsNullOrWhiteSpace(_geminiKey);
                System.Diagnostics.Debug.WriteLine($"GeminiAnalyticsService initialized - HasApiKey: {hasKey}, Endpoint: {_geminiEndpoint}");

                if (string.IsNullOrWhiteSpace(_geminiKey))
                {
                    throw new InvalidOperationException("Gemini API key is not configured. Please set Gemini:ApiKey in configuration or GEMINI_API_KEY environment variable.");
                }

                // Always set BaseAddress to the base URL (no path)
                _httpClient.BaseAddress = baseUri;
                System.Diagnostics.Debug.WriteLine($"HttpClient BaseAddress set to: {baseUri}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"ERROR initializing GeminiAnalyticsService: {ex}");
                throw;
            }
        }

        #region Advanced Emotional Analysis

        /// <summary>
        /// Uses Gemini AI to perform deep emotional analysis of journal entries
        /// </summary>
        public async Task<GeminiEmotionalAnalysisDto> AnalyzeEmotionalStateWithAI(string journalText)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(journalText))
                {
                    return CreateFallbackEmotionalAnalysis("No journal text provided");
                }

                var prompt = CreateEmotionalAnalysisPrompt(journalText);
                var response = await CallGeminiApiAsync(prompt);
                return ParseEmotionalAnalysisResponse(response);
            }
            catch (Exception ex)
            {
                // Log the exception (you can replace this with your logging framework)
                System.Diagnostics.Debug.WriteLine($"GeminiAnalyticsService.AnalyzeEmotionalStateWithAI failed: {ex}");
                return CreateFallbackEmotionalAnalysis($"AI analysis failed: {ex.Message}");
            }
        }

        /// <summary>
        /// Analyzes multiple journal entries to identify patterns using AI
        /// </summary>
        public async Task<GeminiPatternAnalysisDto> AnalyzePatternsWithAI(List<JournalEntry> journalEntries)
        {
            try
            {
                if (journalEntries == null || !journalEntries.Any())
                {
                    return CreateFallbackPatternAnalysis("No journal entries provided");
                }

                var prompt = CreatePatternAnalysisPrompt(journalEntries);
                var response = await CallGeminiApiAsync(prompt);

                // Log the raw Gemini AI response for debugging
                System.Diagnostics.Debug.WriteLine($"[GeminiAnalyticsService] Raw Gemini AI response: {response}");

                return ParsePatternAnalysisResponse(response);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"GeminiAnalyticsService.AnalyzePatternsWithAI failed: {ex}");
                return CreateFallbackPatternAnalysis($"AI pattern analysis failed: {ex.Message}");
            }
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
                
                if (string.IsNullOrWhiteSpace(cleanJson))
                {
                    System.Diagnostics.Debug.WriteLine("No JSON found in Gemini response");
                    return CreateFallbackEmotionalAnalysis("Invalid AI response format");
                }

                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                // Parse PrimaryEmotion as enum if possible, else fallback to Neutral
                var primaryEmotionStr = GetStringProperty(analysis, "primaryEmotion");
                if (!Enum.TryParse<EmotionalState>(primaryEmotionStr, true, out var primaryEmotionEnum))
                {
                    primaryEmotionEnum = EmotionalState.Neutral;
                }

                var crisisRiskLevelStr = GetStringProperty(analysis, "riskLevel");
                if (!Enum.TryParse<CrisisLevel>(crisisRiskLevelStr, true, out var crisisRiskLevelEnum))
                {
                    crisisRiskLevelEnum = CrisisLevel.Low;
                }

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
                    ConfidenceScore = GetDoubleProperty(analysis, "confidenceScore"),
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }
            catch (JsonException ex)
            {
                System.Diagnostics.Debug.WriteLine($"JSON parsing error in emotional analysis: {ex}");
                return CreateFallbackEmotionalAnalysis($"JSON parsing error: {ex.Message}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Unexpected error in emotional analysis parsing: {ex}");
                return CreateFallbackEmotionalAnalysis($"Parsing error: {ex.Message}");
            }
        }

        private GeminiPatternAnalysisDto ParsePatternAnalysisResponse(string response)
        {
            try
            {
                var cleanJson = ExtractJsonFromResponse(response);
                System.Diagnostics.Debug.WriteLine($"[GeminiAI] Raw Pattern Analysis JSON: {cleanJson}");
                var analysis = JsonSerializer.Deserialize<JsonElement>(cleanJson);

                var emotionalTrend = GetStringProperty(analysis, "emotionalTrend");
                return new GeminiPatternAnalysisDto
                {
                    KeyInsights = GetStringArrayProperty(analysis, "recurringThemes"),
                    RecommendedInterventions = GetStringArrayProperty(analysis, "recommendedInterventions"),
                    PatternConfidence = GetDoubleProperty(analysis, "confidenceScore"),
                    Trend = emotionalTrend,
                    ConcernAreas = GetStringArrayProperty(analysis, "concernAreas"),
                    StrengthsIdentified = GetStringArrayProperty(analysis, "strengthsIdentified"),
                    ProgressIndicators = GetStringArrayProperty(analysis, "progressIndicators"),
                    TimeBasedPatterns = GetStringProperty(analysis, "timeBasedPatterns"),
                    AnalyzedEntriesCount = 0,
                    AnalysisTimestamp = DateTime.UtcNow,
                    ProgressTrend = new ProgressTrendDto {
                        OverallTrend = emotionalTrend
                    }
                };
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[GeminiAI] Pattern Analysis Parsing Error: {ex}");
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
                if (string.IsNullOrWhiteSpace(_geminiKey))
                {
                    throw new InvalidOperationException("Gemini API key is not configured");
                }

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

                // Always use the same relative endpoint as ChatbotService
                var relativeEndpoint = "v1beta/models/gemini-2.0-flash:generateContent?key=" + _geminiKey;
                System.Diagnostics.Debug.WriteLine($"Calling Gemini API: {_httpClient.BaseAddress}{relativeEndpoint}");
                var response = await _httpClient.PostAsync(relativeEndpoint, content);

                var responseBody = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    System.Diagnostics.Debug.WriteLine($"Gemini API error response: {response.StatusCode} - {responseBody}");
                    throw new HttpRequestException($"Gemini API call failed: {response.StatusCode} - {responseBody}");
                }

                var responseJson = JsonSerializer.Deserialize<JsonElement>(responseBody);

                // Check if the response has the expected structure
                if (!responseJson.TryGetProperty("candidates", out var candidates) || 
                    candidates.GetArrayLength() == 0)
                {
                    throw new InvalidOperationException("Gemini API response missing candidates");
                }

                var candidate = candidates[0];
                if (!candidate.TryGetProperty("content", out var contentElement) ||
                    !contentElement.TryGetProperty("parts", out var parts) ||
                    parts.GetArrayLength() == 0)
                {
                    throw new InvalidOperationException("Gemini API response missing content structure");
                }

                var textContent = parts[0].GetProperty("text").GetString();
                
                if (string.IsNullOrWhiteSpace(textContent))
                {
                    throw new InvalidOperationException("Gemini API returned empty response");
                }

                return textContent;
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Gemini API network error: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Gemini API response parsing error: {ex.Message}", ex);
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

        #region Fallback Methods

        private GeminiEmotionalAnalysisDto CreateFallbackEmotionalAnalysis(string errorMessage)
        {
            return new GeminiEmotionalAnalysisDto
            {
                PrimaryEmotion = EmotionalState.Neutral,
                EmotionalIntensity = 0,
                PositivityScore = 0,
                NegativityScore = 0,
                EmotionalTriggers = new List<string> { errorMessage },
                CopingMechanisms = new List<string>(),
                ImmediateRecommendations = new List<string> { "Consider journaling about your feelings", "Practice deep breathing exercises" },
                CrisisRiskLevel = CrisisLevel.Low,
                ConfidenceScore = 0.0,
                AnalysisTimestamp = DateTime.UtcNow
            };
        }

        private GeminiPatternAnalysisDto CreateFallbackPatternAnalysis(string errorMessage)
        {
            return new GeminiPatternAnalysisDto
            {
                KeyInsights = new List<string> { errorMessage },
                RecommendedInterventions = new List<string> { "Continue regular journaling", "Monitor mood patterns" },
                PatternConfidence = 0.0,
                AnalyzedEntriesCount = 0,
                AnalysisTimestamp = DateTime.UtcNow
            };
        }

        #endregion
    }
}
