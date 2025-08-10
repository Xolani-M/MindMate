using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace MINDMATE.Application.Chatbot
{
    public static class CrisisDetectionService
    {
        // Crisis detection patterns with severity levels
        private static readonly Dictionary<string, int> CrisisKeywords = new Dictionary<string, int>
        {
            // High severity (5 points) - immediate crisis indicators
            { "suicide", 5 }, { "kill myself", 5 }, { "end it all", 5 }, { "want to die", 5 },
            { "harm myself", 5 }, { "hurt myself", 5 }, { "no point living", 5 },
            
            // Medium-high severity (4 points) - serious distress
            { "panic attack", 4 }, { "can't breathe", 4 }, { "overwhelming", 4 },
            { "breaking down", 4 }, { "falling apart", 4 }, { "losing control", 4 },
            { "can't cope", 4 }, { "can't handle", 4 }, { "too much", 4 },
            
            // Medium severity (3 points) - significant concern
            { "anxious", 3 }, { "panic", 3 }, { "terrified", 3 }, { "scared", 3 },
            { "worried sick", 3 }, { "crisis", 3 }, { "emergency", 3 },
            { "desperate", 3 }, { "hopeless", 3 }, { "helpless", 3 },
            
            // Work/life specific (3 points)
            { "getting fired", 3 }, { "losing job", 3 }, { "fired", 3 },
            { "judge me", 3 }, { "everyone hates me", 3 }, { "failure", 3 },
            { "bad track record", 3 }, { "screwed up", 3 }, { "ruined", 3 },
            
            // Lower severity (2 points) - needs attention
            { "stressed", 2 }, { "worried", 2 }, { "nervous", 2 },
            { "upset", 2 }, { "frustrated", 2 }, { "angry", 2 },
            { "sad", 2 }, { "down", 2 }, { "low", 2 }
        };

        // Positive emotional indicators that might offset crisis signals
        private static readonly Dictionary<string, int> PositiveIndicators = new Dictionary<string, int>
        {
            { "feeling better", -2 }, { "improving", -2 }, { "hopeful", -2 },
            { "positive", -2 }, { "good day", -2 }, { "thankful", -2 },
            { "grateful", -2 }, { "proud", -2 }, { "accomplished", -2 },
            { "happy", -2 }, { "excited", -2 }, { "looking forward", -2 }
        };

        // Context patterns that amplify crisis signals
        private static readonly Dictionary<string, int> CrisisAmplifiers = new Dictionary<string, int>
        {
            { "can't take it anymore", 2 }, { "had enough", 2 },
            { "at my breaking point", 2 }, { "rock bottom", 2 },
            { "nothing left", 2 }, { "given up", 2 },
            { "no way out", 2 }, { "trapped", 2 }
        };

        // Professional tone triggers (separate from crisis)
        private static readonly HashSet<string> ProfessionalTriggers = new HashSet<string>
        {
            "please be serious", "this isn't funny", "stop joking",
            "not in the mood", "formal", "professional", "clinical"
        };

        public static CrisisAssessment AnalyzeCrisisLevel(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return new CrisisAssessment { Level = CrisisLevel.None, Score = 0 };

            var normalizedMessage = message.ToLowerInvariant();
            var crisisScore = 0;
            var detectedIndicators = new List<string>();

            // Check crisis keywords
            foreach (var keyword in CrisisKeywords)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    crisisScore += keyword.Value;
                    detectedIndicators.Add($"{keyword.Key} (+{keyword.Value})");
                }
            }

            // Check crisis amplifiers
            foreach (var amplifier in CrisisAmplifiers)
            {
                if (normalizedMessage.Contains(amplifier.Key))
                {
                    crisisScore += amplifier.Value;
                    detectedIndicators.Add($"{amplifier.Key} (+{amplifier.Value} amplifier)");
                }
            }

            // Check positive indicators (can reduce crisis score)
            foreach (var positive in PositiveIndicators)
            {
                if (normalizedMessage.Contains(positive.Key))
                {
                    crisisScore += positive.Value; // negative values reduce score
                    detectedIndicators.Add($"{positive.Key} ({positive.Value})");
                }
            }

            // Determine crisis level
            var level = DetermineCrisisLevel(crisisScore);
            
            // Check for professional tone requests
            var needsProfessionalTone = ProfessionalTriggers.Any(trigger => 
                normalizedMessage.Contains(trigger));

            return new CrisisAssessment
            {
                Level = level,
                Score = crisisScore,
                DetectedIndicators = detectedIndicators,
                NeedsProfessionalTone = needsProfessionalTone || level >= CrisisLevel.Medium,
                RecommendedResponse = GetRecommendedResponse(level)
            };
        }

        public static CrisisAssessment AnalyzeConversationHistory(
            List<MINDMATE.Application.Chatbot.Dto.ChatHistoryItem> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
                return new CrisisAssessment { Level = CrisisLevel.None, Score = 0 };

            var userMessages = conversationHistory
                .Where(h => h.Sender == "user")
                .Select(h => h.Message)
                .Where(m => !string.IsNullOrWhiteSpace(m))
                .ToList();

            if (!userMessages.Any())
                return new CrisisAssessment { Level = CrisisLevel.None, Score = 0 };

            // Analyze recent messages with more weight
            var totalScore = 0;
            var allIndicators = new List<string>();
            var messageCount = userMessages.Count;

            for (int i = 0; i < userMessages.Count; i++)
            {
                var assessment = AnalyzeCrisisLevel(userMessages[i]);
                
                // Weight recent messages more heavily
                var weight = (i + 1.0) / messageCount; // More recent = higher weight
                var weightedScore = (int)(assessment.Score * weight);
                
                totalScore += weightedScore;
                allIndicators.AddRange(assessment.DetectedIndicators);
            }

            // Check for escalating pattern
            var recentMessages = userMessages.TakeLast(3).ToList();
            var hasEscalatingPattern = CheckEscalatingPattern(recentMessages);
            
            if (hasEscalatingPattern)
            {
                totalScore += 2; // Bonus for escalating crisis
                allIndicators.Add("Escalating crisis pattern detected (+2)");
            }

            var level = DetermineCrisisLevel(totalScore);
            
            return new CrisisAssessment
            {
                Level = level,
                Score = totalScore,
                DetectedIndicators = allIndicators.Distinct().ToList(),
                NeedsProfessionalTone = level >= CrisisLevel.Medium,
                RecommendedResponse = GetRecommendedResponse(level)
            };
        }

        private static CrisisLevel DetermineCrisisLevel(int score)
        {
            return score switch
            {
                >= 8 => CrisisLevel.High,      // Immediate professional intervention
                >= 5 => CrisisLevel.Medium,    // Professional tone, careful monitoring
                >= 3 => CrisisLevel.Low,       // Gentle, supportive tone
                >= 1 => CrisisLevel.Mild,      // Slight concern, normal support
                _ => CrisisLevel.None          // Normal conversation
            };
        }

        private static bool CheckEscalatingPattern(List<string> recentMessages)
        {
            if (recentMessages.Count < 2) return false;

            var scores = recentMessages.Select(msg => AnalyzeCrisisLevel(msg).Score).ToList();
            
            // Check if scores are generally increasing
            var increases = 0;
            for (int i = 1; i < scores.Count; i++)
            {
                if (scores[i] > scores[i - 1])
                    increases++;
            }

            return increases >= scores.Count / 2; // At least half the transitions show increase
        }

        private static string GetRecommendedResponse(CrisisLevel level)
        {
            return level switch
            {
                CrisisLevel.High => "CRISIS MODE: Use only professional, supportive language. No humor. Consider crisis resources.",
                CrisisLevel.Medium => "PROFESSIONAL MODE: Supportive, empathetic tone. Minimal humor only if appropriate.",
                CrisisLevel.Low => "CAREFUL MODE: Gentle, supportive tone. Light humor only if user shows receptiveness.",
                CrisisLevel.Mild => "SUPPORTIVE MODE: Normal supportive conversation. Gentle humor acceptable.",
                CrisisLevel.None => "NORMAL MODE: Standard adaptive humor approach.",
                _ => "NORMAL MODE: Standard adaptive humor approach."
            };
        }
    }

    public class CrisisAssessment
    {
        public CrisisLevel Level { get; set; }
        public int Score { get; set; }
        public List<string> DetectedIndicators { get; set; } = new List<string>();
        public bool NeedsProfessionalTone { get; set; }
        public string RecommendedResponse { get; set; } = string.Empty;
    }

    public enum CrisisLevel
    {
        None = 0,
        Mild = 1,
        Low = 2,
        Medium = 3,
        High = 4
    }
}
