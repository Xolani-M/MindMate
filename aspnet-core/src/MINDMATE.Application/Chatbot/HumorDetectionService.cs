using System;
using System.Collections.Generic;
using System.Linq;
using MINDMATE.Application.Chatbot.Dto;

namespace MINDMATE.Application.Chatbot
{
    public class HumorDetectionService
    {
        // Comprehensive humor engagement indicators with weighted scores
        private static readonly Dictionary<string, int> HumorEngagementKeywords = new Dictionary<string, int>
        {
            // Strong positive humor signals
            {"😂", 5}, {"🤣", 5}, {"😆", 4}, {"😄", 3}, {"😁", 3}, {"😊", 2},
            {"lol", 4}, {"lmao", 5}, {"rofl", 5}, {"haha", 3}, {"hehe", 3}, {"hilarious", 5},
            {"funny", 3}, {"witty", 4}, {"clever", 3}, {"amusing", 3}, {"joke", 2},
            
            // Appreciation signals
            {"made me smile", 4}, {"made me laugh", 5}, {"you're funny", 5}, {"love your humor", 5},
            {"that's hilarious", 5}, {"crack me up", 4}, {"good one", 3}, {"nice joke", 3},
            
            // Request signals
            {"make me laugh", 4}, {"tell me a joke", 4}, {"something funny", 3}, {"cheer me up", 3},
            {"lighten the mood", 3}, {"be silly", 3}, {"more jokes", 4},
            
            // Playful language
            {"awesome", 2}, {"cool", 1}, {"wow", 1}, {"omg", 2}, {"yay", 3}, {"woohoo", 4},
            {"heck yeah", 3}, {"absolutely", 2}, {"totally", 2}, {"definitely", 1},
            
            // Exclamations and enthusiasm
            {"!", 1}, {"!!", 2}, {"!!!", 3}
        };

        // Formality and seriousness indicators
        private static readonly Dictionary<string, int> FormalityKeywords = new Dictionary<string, int>
        {
            // Direct requests for seriousness
            {"please be serious", 10}, {"this isn't funny", 8}, {"stop joking", 8}, {"be professional", 6},
            {"this is serious", 6}, {"no jokes please", 8}, {"i need serious help", 7},
            
            // Professional language
            {"furthermore", 3}, {"however", 2}, {"therefore", 3}, {"nevertheless", 3}, {"consequently", 3},
            {"regarding", 2}, {"concerning", 2}, {"pursuant", 4}, {"accordingly", 3},
            
            // Formal expressions
            {"thank you very much", 3}, {"i appreciate", 2}, {"could you please", 2}, {"would you kindly", 3},
            {"i would like", 2}, {"i am writing", 3}, {"dear sir", 5}, {"yours sincerely", 5},
            
            // Academic/clinical language
            {"symptoms", 2}, {"diagnosis", 3}, {"treatment", 2}, {"therapy", 2}, {"clinical", 3},
            {"psychological", 2}, {"assessment", 2}, {"intervention", 3}, {"methodology", 4}
        };

        // Context amplifiers that increase humor appropriateness
        private static readonly Dictionary<string, int> HumorAmplifiers = new Dictionary<string, int>
        {
            // Light topics
            {"weekend", 2}, {"coffee", 2}, {"monday", 2}, {"tired", 1}, {"busy", 1},
            {"work", 1}, {"school", 1}, {"weather", 2}, {"food", 2}, {"movie", 2},
            
            // Positive contexts
            {"celebrating", 3}, {"happy", 2}, {"excited", 2}, {"good news", 3}, {"success", 2},
            {"achievement", 2}, {"progress", 2}, {"better", 1}, {"improving", 2},
            
            // Social contexts
            {"friends", 2}, {"family", 1}, {"party", 3}, {"vacation", 3}, {"holiday", 2},
            {"birthday", 3}, {"anniversary", 2}
        };

        // Contexts where humor should be reduced or avoided
        private static readonly Dictionary<string, int> HumorInhibitors = new Dictionary<string, int>
        {
            // Serious personal topics
            {"death", 5}, {"dying", 5}, {"funeral", 5}, {"grief", 4}, {"mourning", 4},
            {"divorce", 3}, {"breakup", 2}, {"relationship problems", 3}, {"family issues", 2},
            
            // Health concerns
            {"diagnosis", 3}, {"hospital", 3}, {"surgery", 4}, {"illness", 3}, {"disease", 3},
            {"pain", 2}, {"chronic", 3}, {"medication", 2}, {"doctor", 2},
            
            // Financial stress
            {"bankruptcy", 4}, {"debt", 3}, {"money problems", 3}, {"fired", 3}, {"unemployed", 3},
            {"eviction", 4}, {"bills", 2}, {"financial stress", 3},
            
            // Legal issues
            {"court", 3}, {"lawsuit", 4}, {"arrest", 4}, {"legal", 2}, {"police", 2}
        };

        public static HumorAssessment AnalyzeHumorPreferences(string message)
        {
            var normalizedMessage = message?.ToLower() ?? "";
            
            var humorScore = 0;
            var formalityScore = 0;
            var amplifierScore = 0;
            var inhibitorScore = 0;
            var detectedSignals = new List<string>();

            // Analyze humor engagement
            foreach (var keyword in HumorEngagementKeywords)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    humorScore += keyword.Value;
                    detectedSignals.Add($"Humor: {keyword.Key}");
                }
            }

            // Analyze formality preference
            foreach (var keyword in FormalityKeywords)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    formalityScore += keyword.Value;
                    detectedSignals.Add($"Formal: {keyword.Key}");
                }
            }

            // Analyze context amplifiers
            foreach (var keyword in HumorAmplifiers)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    amplifierScore += keyword.Value;
                    detectedSignals.Add($"Amplifier: {keyword.Key}");
                }
            }

            // Analyze inhibitors
            foreach (var keyword in HumorInhibitors)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    inhibitorScore += keyword.Value;
                    detectedSignals.Add($"Inhibitor: {keyword.Key}");
                }
            }

            // Calculate final scores with context
            var adjustedHumorScore = Math.Max(0, humorScore + amplifierScore - inhibitorScore);
            var adjustedFormalityScore = formalityScore + inhibitorScore;

            // Determine humor level
            var humorLevel = DetermineHumorLevel(adjustedHumorScore, adjustedFormalityScore, normalizedMessage);
            var recommendation = GenerateHumorRecommendation(humorLevel, adjustedHumorScore, adjustedFormalityScore);

            return new HumorAssessment
            {
                Level = humorLevel,
                HumorScore = adjustedHumorScore,
                FormalityScore = adjustedFormalityScore,
                DetectedSignals = detectedSignals,
                RecommendedApproach = recommendation,
                MessageLength = message?.Length ?? 0
            };
        }

        public static HumorAssessment AnalyzeConversationHistory(List<ChatHistoryItem> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
            {
                return new HumorAssessment
                {
                    Level = HumorLevel.Unknown,
                    HumorScore = 0,
                    FormalityScore = 0,
                    DetectedSignals = new List<string>(),
                    RecommendedApproach = "User preference unknown - start with minimal humor and adapt based on response patterns",
                    MessageLength = 0
                };
            }

            var userMessages = conversationHistory.Where(h => h.Sender == "user").ToList();
            var totalHumorScore = 0;
            var totalFormalityScore = 0;
            var allDetectedSignals = new List<string>();
            var totalMessageLength = 0;

            // Weight recent messages more heavily
            for (int i = 0; i < userMessages.Count; i++)
            {
                var message = userMessages[i];
                var assessment = AnalyzeHumorPreferences(message.Message);
                
                // Recent messages get higher weight (last 3 messages get full weight, older get reduced)
                var weight = i >= userMessages.Count - 3 ? 1.0 : 0.6;
                
                totalHumorScore += (int)(assessment.HumorScore * weight);
                totalFormalityScore += (int)(assessment.FormalityScore * weight);
                allDetectedSignals.AddRange(assessment.DetectedSignals);
                totalMessageLength += assessment.MessageLength;
            }

            // Calculate conversation patterns
            var averageMessageLength = userMessages.Count > 0 ? totalMessageLength / userMessages.Count : 0;
            var humorLevel = DetermineHumorLevel(totalHumorScore, totalFormalityScore, "", averageMessageLength);
            var recommendation = GenerateConversationHumorRecommendation(humorLevel, totalHumorScore, totalFormalityScore, userMessages.Count);

            return new HumorAssessment
            {
                Level = humorLevel,
                HumorScore = totalHumorScore,
                FormalityScore = totalFormalityScore,
                DetectedSignals = allDetectedSignals.Distinct().ToList(),
                RecommendedApproach = recommendation,
                MessageLength = averageMessageLength
            };
        }

        private static HumorLevel DetermineHumorLevel(int humorScore, int formalityScore, string message, int messageLength = 0)
        {
            // Strong formality signals override humor
            if (formalityScore >= 8) return HumorLevel.Avoid;
            if (formalityScore >= 5) return HumorLevel.Minimal;

            // Very short messages (under 10 chars) suggest casual interaction
            if (messageLength > 0 && messageLength < 10 && humorScore > 0) return HumorLevel.Light;

            // Strong humor engagement
            if (humorScore >= 10) return HumorLevel.High;
            if (humorScore >= 6) return HumorLevel.Moderate;
            if (humorScore >= 3) return HumorLevel.Light;
            if (humorScore >= 1) return HumorLevel.Minimal;

            // Default based on formality
            if (formalityScore >= 3) return HumorLevel.Minimal;
            if (formalityScore >= 1) return HumorLevel.Light;

            return HumorLevel.Unknown;
        }

        private static string GenerateHumorRecommendation(HumorLevel level, int humorScore, int formalityScore)
        {
            return level switch
            {
                HumorLevel.High => "User actively enjoys humor - safe to use jokes, wordplay, emojis, and playful banter",
                HumorLevel.Moderate => "User appreciates light humor - use gentle jokes, encouraging tone, and occasional emojis",
                HumorLevel.Light => "User shows some humor appreciation - use minimal light humor and positive encouragement",
                HumorLevel.Minimal => "User prefers more serious tone - use supportive language with very occasional light touches",
                HumorLevel.Avoid => "User requests professional tone - avoid humor entirely, focus on supportive and empathetic responses",
                HumorLevel.Unknown => "User preference unclear - start conservatively and adapt based on their responses",
                _ => "Use moderate approach and gauge user reactions"
            };
        }

        private static string GenerateConversationHumorRecommendation(HumorLevel level, int totalHumorScore, int totalFormalityScore, int messageCount)
        {
            var baseRecommendation = GenerateHumorRecommendation(level, totalHumorScore, totalFormalityScore);
            var conversationContext = messageCount > 5 ? "well-established conversation" : "early conversation stage";
            
            return $"{baseRecommendation} (Based on {conversationContext} with {messageCount} user messages)";
        }
    }

    public class HumorAssessment
    {
        public HumorLevel Level { get; set; }
        public int HumorScore { get; set; }
        public int FormalityScore { get; set; }
        public List<string> DetectedSignals { get; set; } = new List<string>();
        public string RecommendedApproach { get; set; } = "";
        public int MessageLength { get; set; }
    }

    public enum HumorLevel
    {
        Unknown = 0,
        Avoid = 1,
        Minimal = 2,
        Light = 3,
        Moderate = 4,
        High = 5
    }
}
