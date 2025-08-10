using System;
using System.Collections.Generic;
using System.Linq;
using MINDMATE.Application.Chatbot.Dto;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Chatbot
{
    /// <summary>
    /// Comprehensive conversation analysis service that integrates multiple detection systems
    /// Used for generating nuanced, context-aware AI responses
    /// </summary>
    public static class ConversationAnalysisService
    {
        /// <summary>
        /// Performs comprehensive analysis of a single message across all detection systems
        /// </summary>
        public static ConversationAnalysis AnalyzeMessage(string message)
        {
            var crisisAssessment = CrisisDetectionService.AnalyzeCrisisLevel(message);
            var humorAssessment = HumorDetectionService.AnalyzeHumorPreferences(message);
            var emotionalAssessment = EmotionalStateDetectionService.AnalyzeEmotionalState(message);

            return new ConversationAnalysis
            {
                CrisisAssessment = crisisAssessment,
                HumorAssessment = humorAssessment,
                EmotionalAssessment = emotionalAssessment,
                OverallRecommendation = GenerateIntegratedRecommendation(crisisAssessment, humorAssessment, emotionalAssessment),
                AnalysisTimestamp = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Performs comprehensive analysis of entire conversation history
        /// </summary>
        public static ConversationAnalysis AnalyzeConversation(List<ChatHistoryItem> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0)
            {
                return new ConversationAnalysis
                {
                    CrisisAssessment = new CrisisAssessment { Level = CrisisLevel.None },
                    HumorAssessment = new HumorAssessment { Level = HumorLevel.Unknown },
                    EmotionalAssessment = new EmotionalStateAssessment { State = EmotionalState.Neutral },
                    OverallRecommendation = "No conversation history available - use standard supportive approach",
                    AnalysisTimestamp = DateTime.UtcNow
                };
            }

            var crisisAssessment = CrisisDetectionService.AnalyzeConversationHistory(conversationHistory);
            var humorAssessment = HumorDetectionService.AnalyzeConversationHistory(conversationHistory);
            var emotionalAssessment = EmotionalStateDetectionService.AnalyzeConversationEmotionalJourney(conversationHistory);

            return new ConversationAnalysis
            {
                CrisisAssessment = crisisAssessment,
                HumorAssessment = humorAssessment,
                EmotionalAssessment = emotionalAssessment,
                OverallRecommendation = GenerateIntegratedRecommendation(crisisAssessment, humorAssessment, emotionalAssessment),
                ConversationLength = conversationHistory.Count,
                AnalysisTimestamp = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Generates integrated recommendation based on all assessment types
        /// Priority: Crisis > Emotional State > Humor Preferences
        /// </summary>
        private static string GenerateIntegratedRecommendation(
            CrisisAssessment crisis, 
            HumorAssessment humor, 
            EmotionalStateAssessment emotional)
        {
            // Crisis takes absolute priority
            if (crisis.Level >= CrisisLevel.Medium)
            {
                return $"CRISIS PROTOCOL: {crisis.RecommendedResponse}. Emotional state: {emotional.State}. Avoid all humor.";
            }

            if (crisis.Level == CrisisLevel.Low)
            {
                return $"MILD CRISIS: {crisis.RecommendedResponse}. Use minimal humor only if emotionally appropriate. Current emotional state: {emotional.State}.";
            }

            // No crisis - balance emotional state with humor preferences
            var recommendation = $"Emotional approach: {emotional.RecommendedApproach}";
            
            // Adjust humor based on emotional state
            if (emotional.State <= EmotionalState.SlightlyNegative)
            {
                recommendation += " Use very minimal humor, focus on emotional support.";
            }
            else if (emotional.State >= EmotionalState.Positive)
            {
                recommendation += $" User is in positive emotional state - {humor.RecommendedApproach.ToLower()}";
            }
            else
            {
                recommendation += $" Neutral emotional state - {humor.RecommendedApproach.ToLower()}";
            }

            // Add trend information if available
            if (emotional.EmotionalTrend == EmotionalTrend.Improving)
            {
                recommendation += " Acknowledge their emotional improvement.";
            }
            else if (emotional.EmotionalTrend == EmotionalTrend.Declining)
            {
                recommendation += " Be extra supportive as their mood is declining.";
            }

            return recommendation;
        }

        /// <summary>
        /// Provides quick flags for immediate response adjustments
        /// </summary>
        public static ResponseFlags GetResponseFlags(ConversationAnalysis analysis)
        {
            return new ResponseFlags
            {
                RequiresCrisisProtocol = analysis.CrisisAssessment.Level >= CrisisLevel.Medium,
                NeedsProfessionalTone = analysis.CrisisAssessment.NeedsProfessionalTone || 
                                       analysis.EmotionalAssessment.State <= EmotionalState.Negative,
                CanUseHumor = analysis.CrisisAssessment.Level <= CrisisLevel.Low && 
                             analysis.HumorAssessment.Level >= HumorLevel.Light &&
                             analysis.EmotionalAssessment.State >= EmotionalState.Neutral,
                NeedsEmotionalSupport = analysis.EmotionalAssessment.State <= EmotionalState.SlightlyNegative ||
                                       analysis.CrisisAssessment.Level >= CrisisLevel.Low,
                CanCelebrate = analysis.EmotionalAssessment.State >= EmotionalState.Positive &&
                              analysis.CrisisAssessment.Level == CrisisLevel.None,
                ShouldEncourageProgress = analysis.EmotionalAssessment.EmotionalTrend == EmotionalTrend.Improving
            };
        }

        /// <summary>
        /// Generates structured context for AI prompt engineering
        /// </summary>
        public static string GenerateContextualPrompt(ConversationAnalysis analysis, string seekerName)
        {
            var flags = GetResponseFlags(analysis);
            var prompt = $"CONVERSATION ANALYSIS FOR {seekerName}:\n\n";

            // Crisis status
            prompt += $"Crisis Level: {analysis.CrisisAssessment.Level} - {analysis.CrisisAssessment.RecommendedResponse}\n";
            
            // Emotional context
            prompt += $"Emotional State: {analysis.EmotionalAssessment.State}";
            if (analysis.EmotionalAssessment.EmotionalTrend != EmotionalTrend.Stable)
            {
                prompt += $" (Trend: {analysis.EmotionalAssessment.EmotionalTrend})";
            }
            prompt += "\n";

            // Humor guidance
            prompt += $"Humor Approach: {analysis.HumorAssessment.RecommendedApproach}\n";

            // Response flags
            prompt += "\nRESPONSE GUIDELINES:\n";
            if (flags.RequiresCrisisProtocol) prompt += "- CRISIS PROTOCOL ACTIVE - Professional, supportive tone only\n";
            if (flags.NeedsProfessionalTone) prompt += "- Use professional, empathetic tone\n";
            if (flags.NeedsEmotionalSupport) prompt += "- Prioritize emotional support and validation\n";
            if (flags.CanUseHumor) prompt += "- Gentle humor is appropriate if contextually suitable\n";
            if (flags.CanCelebrate) prompt += "- Celebrate their positive emotional state\n";
            if (flags.ShouldEncourageProgress) prompt += "- Acknowledge and encourage their emotional progress\n";

            prompt += $"\nOVERALL RECOMMENDATION: {analysis.OverallRecommendation}\n";

            return prompt;
        }
    }

    public class ConversationAnalysis
    {
        public CrisisAssessment CrisisAssessment { get; set; }
        public HumorAssessment HumorAssessment { get; set; }
        public EmotionalStateAssessment EmotionalAssessment { get; set; }
        public string OverallRecommendation { get; set; } = "";
        public int ConversationLength { get; set; }
        public DateTime AnalysisTimestamp { get; set; }
    }

    public class ResponseFlags
    {
        public bool RequiresCrisisProtocol { get; set; }
        public bool NeedsProfessionalTone { get; set; }
        public bool CanUseHumor { get; set; }
        public bool NeedsEmotionalSupport { get; set; }
        public bool CanCelebrate { get; set; }
        public bool ShouldEncourageProgress { get; set; }
    }
}
