using System;
using System.Collections.Generic;
using System.Linq;
using MINDMATE.Application.Chatbot.Dto;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Chatbot
{
    /// <summary>
    /// Service for detecting emotional state and sentiment from user messages
    /// Uses comprehensive keyword analysis and context awareness
    /// </summary>
    public class EmotionalStateDetectionService
    {
        // Positive emotional indicators with weighted scores
        private static readonly Dictionary<string, int> PositiveEmotionKeywords = new Dictionary<string, int>
        {
            // Strong positive emotions
            {"ecstatic", 5}, {"thrilled", 5}, {"overjoyed", 5}, {"elated", 5}, {"euphoric", 5},
            {"amazing", 4}, {"fantastic", 4}, {"wonderful", 4}, {"excellent", 4}, {"brilliant", 4},
            {"great", 3}, {"good", 2}, {"happy", 3}, {"pleased", 3}, {"satisfied", 3},
            {"excited", 4}, {"enthusiastic", 4}, {"optimistic", 3}, {"hopeful", 3}, {"confident", 3},
            
            // Achievement emotions
            {"proud", 4}, {"accomplished", 4}, {"successful", 3}, {"achieved", 3}, {"completed", 2},
            {"progress", 3}, {"improvement", 3}, {"better", 2}, {"recovered", 4}, {"healing", 3},
            
            // Social positive emotions
            {"loved", 4}, {"appreciated", 3}, {"supported", 3}, {"connected", 3}, {"included", 2},
            {"grateful", 4}, {"thankful", 3}, {"blessed", 3}
        };

        // Negative emotional indicators with weighted scores
        private static readonly Dictionary<string, int> NegativeEmotionKeywords = new Dictionary<string, int>
        {
            // Strong negative emotions
            {"devastated", 5}, {"heartbroken", 5}, {"shattered", 5}, {"destroyed", 5}, {"crushed", 5},
            {"terrible", 4}, {"awful", 4}, {"horrible", 4}, {"miserable", 4}, {"dreadful", 4},
            {"sad", 3}, {"upset", 3}, {"disappointed", 3}, {"frustrated", 3}, {"angry", 3},
            {"worried", 3}, {"concerned", 2}, {"nervous", 3}, {"anxious", 4}, {"scared", 4},
            
            // Mental health related
            {"depressed", 5}, {"hopeless", 5}, {"worthless", 5}, {"empty", 4}, {"numb", 4},
            {"overwhelmed", 4}, {"stressed", 3}, {"exhausted", 3}, {"drained", 3}, {"burnt out", 4},
            
            // Social negative emotions
            {"lonely", 4}, {"isolated", 4}, {"rejected", 4}, {"abandoned", 5}, {"betrayed", 4},
            {"misunderstood", 3}, {"ignored", 3}, {"excluded", 3}
        };

        // Emotional intensity modifiers
        private static readonly Dictionary<string, double> IntensityModifiers = new Dictionary<string, double>
        {
            // Amplifiers
            {"extremely", 2.0}, {"incredibly", 2.0}, {"absolutely", 1.8}, {"completely", 1.8},
            {"totally", 1.5}, {"really", 1.3}, {"very", 1.2}, {"quite", 1.1}, {"pretty", 1.1},
            
            // Diminishers
            {"slightly", 0.7}, {"somewhat", 0.8}, {"a bit", 0.7}, {"a little", 0.7}, {"kind of", 0.8},
            {"sort of", 0.8}, {"maybe", 0.6}, {"perhaps", 0.6}
        };

        // Context indicators that affect emotional assessment
        private static readonly Dictionary<string, int> ContextIndicators = new Dictionary<string, int>
        {
            // Time-based context
            {"today", 2}, {"this week", 1}, {"lately", 2}, {"recently", 2}, {"right now", 3},
            {"always", 2}, {"never", 2}, {"constantly", 3}, {"forever", 2},
            
            // Progression indicators
            {"getting worse", 3}, {"getting better", -2}, {"improving", -3}, {"declining", 3},
            {"stable", -1}, {"consistent", -1}, {"changing", 1}
        };

        public static EmotionalStateAssessment AnalyzeEmotionalState(string message)
        {
            var normalizedMessage = message?.ToLower() ?? "";
            
            var positiveScore = 0.0;
            var negativeScore = 0.0;
            var contextScore = 0;
            var detectedEmotions = new List<string>();
            var intensityMultiplier = 1.0;

            // Analyze positive emotions
            foreach (var keyword in PositiveEmotionKeywords)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    positiveScore += keyword.Value;
                    detectedEmotions.Add($"Positive: {keyword.Key}");
                }
            }

            // Analyze negative emotions
            foreach (var keyword in NegativeEmotionKeywords)
            {
                if (normalizedMessage.Contains(keyword.Key))
                {
                    negativeScore += keyword.Value;
                    detectedEmotions.Add($"Negative: {keyword.Key}");
                }
            }

            // Apply intensity modifiers
            foreach (var modifier in IntensityModifiers)
            {
                if (normalizedMessage.Contains(modifier.Key))
                {
                    intensityMultiplier *= modifier.Value;
                    detectedEmotions.Add($"Intensity: {modifier.Key} (x{modifier.Value})");
                }
            }

            // Analyze context
            foreach (var indicator in ContextIndicators)
            {
                if (normalizedMessage.Contains(indicator.Key))
                {
                    contextScore += indicator.Value;
                    detectedEmotions.Add($"Context: {indicator.Key}");
                }
            }

            // Apply intensity to emotional scores
            positiveScore *= intensityMultiplier;
            negativeScore *= intensityMultiplier;

            // Determine emotional state
            var emotionalState = DetermineEmotionalState(positiveScore, negativeScore, contextScore);
            var recommendation = GenerateEmotionalStateRecommendation(emotionalState, positiveScore, negativeScore);

            return new EmotionalStateAssessment
            {
                State = emotionalState,
                PositiveScore = positiveScore,
                NegativeScore = negativeScore,
                ContextScore = contextScore,
                IntensityMultiplier = intensityMultiplier,
                DetectedEmotions = detectedEmotions,
                RecommendedApproach = recommendation
            };
        }

        public static EmotionalStateAssessment AnalyzeConversationEmotionalJourney(List<ChatHistoryItem> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
            {
                return new EmotionalStateAssessment
                {
                    State = EmotionalState.Neutral,
                    PositiveScore = 0,
                    NegativeScore = 0,
                    DetectedEmotions = new List<string>(),
                    RecommendedApproach = "No emotional context available - use supportive and adaptive approach"
                };
            }

            var userMessages = conversationHistory.Where(h => h.Sender == "user").ToList();
            var emotionalProgression = new List<EmotionalStateAssessment>();
            
            // Analyze each message to track emotional journey
            foreach (var message in userMessages)
            {
                var assessment = AnalyzeEmotionalState(message.Message);
                emotionalProgression.Add(assessment);
            }

            // Weight recent emotions more heavily
            var weightedPositiveScore = 0.0;
            var weightedNegativeScore = 0.0;
            var allDetectedEmotions = new List<string>();

            for (int i = 0; i < emotionalProgression.Count; i++)
            {
                var assessment = emotionalProgression[i];
                var weight = i >= emotionalProgression.Count - 3 ? 1.0 : 0.7; // Recent messages weighted more

                weightedPositiveScore += assessment.PositiveScore * weight;
                weightedNegativeScore += assessment.NegativeScore * weight;
                allDetectedEmotions.AddRange(assessment.DetectedEmotions);
            }

            // Analyze emotional trend
            var trend = AnalyzeEmotionalTrend(emotionalProgression);
            var overallState = DetermineEmotionalState(weightedPositiveScore, weightedNegativeScore, 0);
            var recommendation = GenerateJourneyRecommendation(overallState, trend, emotionalProgression.Count);

            return new EmotionalStateAssessment
            {
                State = overallState,
                PositiveScore = weightedPositiveScore,
                NegativeScore = weightedNegativeScore,
                DetectedEmotions = allDetectedEmotions.Distinct().ToList(),
                RecommendedApproach = recommendation,
                EmotionalTrend = trend
            };
        }

        private static EmotionalState DetermineEmotionalState(double positiveScore, double negativeScore, int contextScore)
        {
            var netScore = positiveScore - negativeScore + (contextScore * -1); // Negative context increases negative score

            if (netScore >= 10) return EmotionalState.VeryPositive;
            if (netScore >= 5) return EmotionalState.Positive;
            if (netScore >= 2) return EmotionalState.SlightlyPositive;
            if (netScore >= -2) return EmotionalState.Neutral;
            if (netScore >= -5) return EmotionalState.SlightlyNegative;
            if (netScore >= -10) return EmotionalState.Negative;
            return EmotionalState.VeryNegative;
        }

        private static EmotionalTrend AnalyzeEmotionalTrend(List<EmotionalStateAssessment> progression)
        {
            if (progression.Count < 2) return EmotionalTrend.Stable;

            var recentNet = progression.TakeLast(3).Average(p => p.PositiveScore - p.NegativeScore);
            var earlierNet = progression.Take(progression.Count - 3).Average(p => p.PositiveScore - p.NegativeScore);

            var trendDifference = recentNet - earlierNet;

            if (trendDifference >= 2) return EmotionalTrend.Improving;
            if (trendDifference <= -2) return EmotionalTrend.Declining;
            return EmotionalTrend.Stable;
        }

        private static string GenerateEmotionalStateRecommendation(EmotionalState state, double positiveScore, double negativeScore)
        {
            return state switch
            {
                EmotionalState.VeryPositive => "User is in an excellent emotional state - celebrate their progress and maintain positive momentum",
                EmotionalState.Positive => "User is feeling good - acknowledge their positive state and encourage continued growth",
                EmotionalState.SlightlyPositive => "User is leaning positive - gentle encouragement and support their optimism",
                EmotionalState.Neutral => "User shows balanced emotions - assess their needs and provide appropriate support",
                EmotionalState.SlightlyNegative => "User may be struggling - offer gentle support and validate their feelings",
                EmotionalState.Negative => "User is experiencing negative emotions - prioritize empathy and emotional support",
                EmotionalState.VeryNegative => "User is in significant emotional distress - provide strong emotional support and consider crisis protocols",
                _ => "Emotional state unclear - use adaptive approach and gentle inquiry"
            };
        }

        private static string GenerateJourneyRecommendation(EmotionalState state, EmotionalTrend trend, int messageCount)
        {
            var baseRecommendation = GenerateEmotionalStateRecommendation(state, 0, 0);
            var trendContext = trend switch
            {
                EmotionalTrend.Improving => "User's emotional state is improving - acknowledge their progress",
                EmotionalTrend.Declining => "User's emotional state is declining - increase support and check for crisis indicators",
                EmotionalTrend.Stable => "User's emotional state is stable",
                _ => "Emotional trend unclear"
            };
            
            return $"{baseRecommendation}. {trendContext} (Based on {messageCount} messages)";
        }
    }

    public class EmotionalStateAssessment
    {
        public EmotionalState State { get; set; }
        public double PositiveScore { get; set; }
        public double NegativeScore { get; set; }
        public int ContextScore { get; set; }
        public double IntensityMultiplier { get; set; } = 1.0;
        public List<string> DetectedEmotions { get; set; } = new List<string>();
        public string RecommendedApproach { get; set; } = "";
        public EmotionalTrend EmotionalTrend { get; set; } = EmotionalTrend.Stable;
    }

    public enum EmotionalTrend
    {
        Declining = 1,
        Stable = 2,
        Improving = 3
    }
}
