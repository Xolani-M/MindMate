using System;
using System.Collections.Generic;
using MINDMATE.Application.Chatbot;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;

namespace MINDMATE.Application.Seekers.Analytics.Dto
{
    /// <summary>
    /// Gemini AI emotional analysis response data transfer object
    /// Contains advanced emotional insights from Gemini 2.0-flash
    /// </summary>
    public class GeminiEmotionalAnalysisDto
    {
        public EmotionalState PrimaryEmotion { get; set; }
        public List<SecondaryEmotionDto> SecondaryEmotions { get; set; } = new List<SecondaryEmotionDto>();
        public double EmotionalIntensity { get; set; } // 0-10 scale
        public double PositivityScore { get; set; } // 0-100
        public double NegativityScore { get; set; } // 0-100
        public CrisisLevel CrisisRiskLevel { get; set; }
        public List<string> EmotionalTriggers { get; set; } = new List<string>();
        public List<string> CopingMechanisms { get; set; } = new List<string>();
        public List<string> ImmediateRecommendations { get; set; } = new List<string>();
        public string EmotionalSummary { get; set; }
        public DateTime AnalysisTimestamp { get; set; }
        public double ConfidenceScore { get; set; } // 0-100
        /// <summary>
        /// API response mapping for frontend compatibility
        /// </summary>
        public GeminiEmotionalAnalysisApiDto ToApiDto()
        {
            return new GeminiEmotionalAnalysisApiDto
            {
                primaryEmotion = PrimaryEmotion.ToString(),
                emotionalIntensity = EmotionalIntensity,
                positivityScore = PositivityScore,
                negativityScore = NegativityScore,
                keyThemes = EmotionalTriggers ?? new List<string>(),
                triggers = EmotionalTriggers ?? new List<string>(),
                copingMechanisms = CopingMechanisms ?? new List<string>(),
                recommendations = ImmediateRecommendations ?? new List<string>(),
                riskLevel = CrisisRiskLevel.ToString().ToLower(),
                confidence = ConfidenceScore,
                timestamp = AnalysisTimestamp.ToString("o")
            };
        }
    }

    /// <summary>
    /// API DTO for frontend (matches IAIEmotionalAnalysis)
    /// </summary>
    public class GeminiEmotionalAnalysisApiDto
    {
        public string primaryEmotion { get; set; }
        public double emotionalIntensity { get; set; }
        public double positivityScore { get; set; }
        public double negativityScore { get; set; }
        public List<string> keyThemes { get; set; }
        public List<string> triggers { get; set; }
        public List<string> copingMechanisms { get; set; }
        public List<string> recommendations { get; set; }
        public string riskLevel { get; set; }
        public double confidence { get; set; }
        public string timestamp { get; set; }
    }

    // Repeat for PatternAnalysis and Recommendations

    public class GeminiPatternAnalysisApiDto
    {
        public int analyzedDays { get; set; }
        public int entryCount { get; set; }
        public List<string> patterns { get; set; }
        public string trends { get; set; }
        public List<string> recommendations { get; set; }
        public double confidence { get; set; }
        public string timestamp { get; set; }
    }

    public class GeminiRecommendationsApiDto
    {
        public int analyzedDays { get; set; }
        public GeminiRecommendationDataPoints dataPoints { get; set; }
        public List<string> immediateActions { get; set; }
        public List<string> weeklyGoals { get; set; }
        public List<string> selfCareActivities { get; set; }
        public List<string> copingStrategies { get; set; }
        public bool professionalSupport { get; set; }
        public string motivationalMessage { get; set; }
        public double confidence { get; set; }
        public string timestamp { get; set; }
    }

    public class GeminiRecommendationDataPoints
    {
        public int journalEntries { get; set; }
        public int moodEntries { get; set; }
    }

    /// <summary>
    /// Secondary emotion detected by Gemini AI
    /// </summary>
    public class SecondaryEmotionDto
    {
        public string EmotionName { get; set; }
        public double Intensity { get; set; } // 0-10 scale
        public string Context { get; set; }
    }

    /// <summary>
    /// Gemini AI pattern analysis response data transfer object
    /// Contains sophisticated pattern recognition across multiple journal entries
    /// </summary>
    public class GeminiPatternAnalysisDto
    {
        public List<EmotionalPatternDto> EmotionalPatterns { get; set; } = new List<EmotionalPatternDto>();
        public List<BehavioralPatternDto> BehavioralPatterns { get; set; } = new List<BehavioralPatternDto>();
        public List<TriggerPatternDto> TriggerPatterns { get; set; } = new List<TriggerPatternDto>();
        public List<CopingPatternDto> CopingPatterns { get; set; } = new List<CopingPatternDto>();
        public ProgressTrendDto ProgressTrend { get; set; }
        public List<string> KeyInsights { get; set; } = new List<string>();
        public List<string> RecommendedInterventions { get; set; } = new List<string>();
        public int AnalyzedEntriesCount { get; set; }
        public DateTime AnalysisPeriodStart { get; set; }
        public DateTime AnalysisPeriodEnd { get; set; }
        public double PatternConfidence { get; set; } // 0-100
        public DateTime AnalysisTimestamp { get; set; }
    }

    /// <summary>
    /// Emotional pattern identified by Gemini AI
    /// </summary>
    public class EmotionalPatternDto
    {
        public string PatternName { get; set; }
        public string Description { get; set; }
        public double Frequency { get; set; } // How often this pattern occurs (0-100%)
        public List<string> TriggerEvents { get; set; } = new List<string>();
        public List<string> EmotionalSequence { get; set; } = new List<string>();
        public string Duration { get; set; } // How long the pattern typically lasts
        public double Severity { get; set; } // Impact level (0-10)
        public List<string> AssociatedThoughts { get; set; } = new List<string>();
    }

    /// <summary>
    /// Behavioral pattern identified by Gemini AI
    /// </summary>
    public class BehavioralPatternDto
    {
        public string PatternName { get; set; }
        public string Description { get; set; }
        public List<string> Behaviors { get; set; } = new List<string>();
        public string Context { get; set; }
        public double Frequency { get; set; } // 0-100%
        public string Impact { get; set; } // Positive, Negative, Neutral
        public List<string> Recommendations { get; set; } = new List<string>();
    }

    /// <summary>
    /// Coping pattern identified by Gemini AI
    /// </summary>
    public class CopingPatternDto
    {
        public string CopingStrategy { get; set; }
        public string Description { get; set; }
        public double Effectiveness { get; set; } // 0-100% based on emotional outcomes
        public List<string> UsageContexts { get; set; } = new List<string>();
        public string CopingType { get; set; } // Adaptive, Maladaptive, Mixed
        public List<string> ImprovementSuggestions { get; set; } = new List<string>();
        public double Frequency { get; set; } // How often this coping strategy is used
    }

    /// <summary>
    /// Progress trend analysis by Gemini AI
    /// </summary>
    public class ProgressTrendDto
    {
        public string OverallTrend { get; set; } // Improving, Stable, Declining
        public double TrendStrength { get; set; } // 0-100% confidence in trend direction
        public List<ProgressMilestoneDto> Milestones { get; set; } = new List<ProgressMilestoneDto>();
        public List<string> PositiveChanges { get; set; } = new List<string>();
        public List<string> AreasOfConcern { get; set; } = new List<string>();
        public string TimeToImprovement { get; set; } // Estimated timeframe for significant improvement
        public double ResilienceScore { get; set; } // 0-100 based on recovery patterns
    }

    /// <summary>
    /// Progress milestone identified by Gemini AI
    /// </summary>
    public class ProgressMilestoneDto
    {
        public DateTime Date { get; set; }
        public string MilestoneType { get; set; } // Breakthrough, Setback, Progress
        public string Description { get; set; }
        public double SignificanceLevel { get; set; } // 0-10
        public List<string> ContributingFactors { get; set; } = new List<string>();
    }

    /// <summary>
    /// Gemini AI therapeutic recommendations response data transfer object
    /// Contains personalized mental health strategies and interventions
    /// </summary>
    public class GeminiRecommendationsDto
    {
        public List<TherapeuticRecommendationDto> ImmediateActions { get; set; } = new List<TherapeuticRecommendationDto>();
        public List<TherapeuticRecommendationDto> ShortTermStrategies { get; set; } = new List<TherapeuticRecommendationDto>();
        public List<TherapeuticRecommendationDto> LongTermGoals { get; set; } = new List<TherapeuticRecommendationDto>();
        public List<SelfCareRecommendationDto> SelfCareActivities { get; set; } = new List<SelfCareRecommendationDto>();
        public List<ProfessionalSupportDto> ProfessionalSupport { get; set; } = new List<ProfessionalSupportDto>();
        public List<ResourceRecommendationDto> Resources { get; set; } = new List<ResourceRecommendationDto>();
        public CrisisPreventionPlanDto CrisisPreventionPlan { get; set; }
        public PersonalizedInsightsDto PersonalizedInsights { get; set; }
        public DateTime RecommendationDate { get; set; }
        public DateTime NextReviewDate { get; set; }
        public double RecommendationConfidence { get; set; } // 0-100
        public string OverallWellnessScore { get; set; } // Current overall assessment
    }

    /// <summary>
    /// Individual therapeutic recommendation from Gemini AI
    /// </summary>
    public class TherapeuticRecommendationDto
    {
        public string RecommendationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; } // Emotional, Behavioral, Cognitive, Physical, Social
        public int Priority { get; set; } // 1-5 (1 = highest priority)
        public string Timeframe { get; set; } // When to implement: Immediate, Daily, Weekly, etc.
        public List<string> ActionSteps { get; set; } = new List<string>();
        public List<string> ExpectedBenefits { get; set; } = new List<string>();
        public List<string> PotentialChallenges { get; set; } = new List<string>();
        public double DifficultyLevel { get; set; } // 1-10 (1 = easiest)
        public string TrackingMethod { get; set; } // How to measure progress
        public bool RequiresProfessionalSupport { get; set; }
    }

    /// <summary>
    /// Self-care activity recommendation from Gemini AI
    /// </summary>
    public class SelfCareRecommendationDto
    {
        public string ActivityName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; } // Physical, Emotional, Mental, Social, Spiritual
        public int Duration { get; set; } // Minutes required
        public string Frequency { get; set; } // Daily, 3x week, Weekly, etc.
        public List<string> Benefits { get; set; } = new List<string>();
        public List<string> Instructions { get; set; } = new List<string>();
        public string WhenToPractice { get; set; } // Morning, Evening, When stressed, etc.
        public double PersonalizationScore { get; set; } // 0-100 how well-suited for this person
        public List<string> Variations { get; set; } = new List<string>();
    }

    /// <summary>
    /// Professional support recommendation from Gemini AI
    /// </summary>
    public class ProfessionalSupportDto
    {
        public string SupportType { get; set; } // Therapist, Psychiatrist, Support Group, etc.
        public string Reason { get; set; }
        public string Specialization { get; set; } // CBT, DBT, Trauma, etc.
        public string Urgency { get; set; } // Low, Medium, High, Crisis
        public List<string> WhatToLookFor { get; set; } = new List<string>();
        public List<string> QuestionsToAsk { get; set; } = new List<string>();
        public string ExpectedTimeline { get; set; }
        public bool IsCritical { get; set; }
    }

    /// <summary>
    /// Resource recommendation from Gemini AI
    /// </summary>
    public class ResourceRecommendationDto
    {
        public string ResourceName { get; set; }
        public string ResourceType { get; set; } // App, Book, Website, Hotline, etc.
        public string Description { get; set; }
        public string Url { get; set; }
        public string ReasonForRecommendation { get; set; }
        public List<string> KeyFeatures { get; set; } = new List<string>();
        public bool IsFree { get; set; }
        public string AccessibilityLevel { get; set; } // Beginner, Intermediate, Advanced
        public double RelevanceScore { get; set; } // 0-100 relevance to user's situation
    }

    /// <summary>
    /// Crisis prevention plan from Gemini AI
    /// </summary>
    public class CrisisPreventionPlanDto
    {
        public List<string> EarlyWarningSignals { get; set; } = new List<string>();
        public List<string> CopingStrategies { get; set; } = new List<string>();
        public List<EmergencyContactDto> EmergencyContacts { get; set; } = new List<EmergencyContactDto>();
        public List<string> SafetyPlan { get; set; } = new List<string>();
        public List<string> EnvironmentalChanges { get; set; } = new List<string>();
        public string ProfessionalSupportPlan { get; set; }
        public List<string> SelfCarePriorities { get; set; } = new List<string>();
        public string ReviewFrequency { get; set; }
    }

    /// <summary>
    /// Emergency contact information
    /// </summary>
    public class EmergencyContactDto
    {
        public string Name { get; set; }
        public string Relationship { get; set; }
        public string PhoneNumber { get; set; }
        public string WhenToContact { get; set; }
        public bool IsAvailable24x7 { get; set; }
        public bool IsProfessional { get; set; }
    }

    /// <summary>
    /// Personalized insights from Gemini AI
    /// </summary>
    public class PersonalizedInsightsDto
    {
        public List<string> Strengths { get; set; } = new List<string>();
        public List<string> GrowthAreas { get; set; } = new List<string>();
        public List<string> SuccessFactors { get; set; } = new List<string>();
        public List<string> RiskFactors { get; set; } = new List<string>();
        public string PersonalityProfile { get; set; }
        public string PreferredLearningStyle { get; set; }
        public string MotivationStyle { get; set; }
        public List<string> OptimalEnvironments { get; set; } = new List<string>();
        public string CommunicationPreferences { get; set; }
        public double ResilienceLevel { get; set; } // 0-100
        public string MentalHealthJourneyStage { get; set; }
    }

    /// <summary>
    /// Crisis analysis response from Gemini AI
    /// Used for crisis prediction and risk assessment
    /// </summary>
    public class GeminiCrisisAnalysisDto
    {
        public CrisisLevel ImmediateRiskLevel { get; set; }
        public int RiskProbability { get; set; }
        public string PredictionTimeframe { get; set; } = "";
        public List<string> PrimaryRiskFactors { get; set; } = new List<string>();
        public List<string> ProtectiveFactors { get; set; } = new List<string>();
        public List<string> EarlyWarningSignals { get; set; } = new List<string>();
        public List<string> EscalationTriggers { get; set; } = new List<string>();
        public List<string> ImmediateRecommendations { get; set; } = new List<string>();
        public bool ProfessionalReferralNeeded { get; set; }
        public List<string> SupportSystemActivation { get; set; } = new List<string>();
        public string MonitoringFrequency { get; set; } = "";
        public List<string> SafetyPlan { get; set; } = new List<string>();
        public double ConfidenceScore { get; set; }
        public string ErrorMessage { get; set; } = "";
    }
}
