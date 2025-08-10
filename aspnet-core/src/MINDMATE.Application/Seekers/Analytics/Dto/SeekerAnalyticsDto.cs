using System;
using System.Collections.Generic;
using MINDMATE.Application.Chatbot;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Seekers.Analytics.Dto
{
    /// <summary>
    /// Comprehensive analytics data transfer object for seeker dashboard
    /// </summary>
    public class SeekerAnalyticsDto
    {
        // Core Emotional Metrics
        public EmotionalState CurrentEmotionalState { get; set; }
        public EmotionalTrend EmotionalTrend { get; set; }
        public EmotionalJourneyAnalysisDto EmotionalJourneyDetails { get; set; }
        
        // Mood Analytics
        public MoodTrendsAnalysisDto MoodTrends { get; set; }
        
        // Safety & Crisis Assessment
        public CrisisLevel CrisisRiskLevel { get; set; }
        
        // Insights & Recommendations
        public List<string> ActivityInsights { get; set; } = new List<string>();
        public List<string> RecommendedActions { get; set; } = new List<string>();
        
        // Progress Tracking
        public double ProgressScore { get; set; }
        public DateTime AnalysisTimestamp { get; set; }
        
        // Summary Statistics
        public SeekerSummaryStatsDto SummaryStats { get; set; }
    }

    /// <summary>
    /// Emotional journey analysis data transfer object
    /// </summary>
    public class EmotionalJourneyAnalysisDto
    {
        public EmotionalState CurrentState { get; set; }
        public EmotionalTrend Trend { get; set; }
        public int AnalyzedEntries { get; set; }
        public double AveragePositiveScore { get; set; }
        public double AverageNegativeScore { get; set; }
        public List<EmotionalProgressionPoint> EmotionalProgression { get; set; } = new List<EmotionalProgressionPoint>();
        public List<string> KeyInsights { get; set; } = new List<string>();
    }

    /// <summary>
    /// Mood trends analysis data transfer object
    /// </summary>
    public class MoodTrendsAnalysisDto
    {
        public double AverageMoodLevel { get; set; }
        public string TrendDirection { get; set; }
        public int AnalyzedDays { get; set; }
        public List<WeeklyMoodDataPointDto> WeeklyMoodData { get; set; } = new List<WeeklyMoodDataPointDto>();
        public double MoodStability { get; set; }
        public MoodPeriodDto HighestMoodPeriod { get; set; }
        public MoodPeriodDto LowestMoodPeriod { get; set; }
    }

    /// <summary>
    /// Detailed mood analysis data transfer object
    /// </summary>
    public class DetailedMoodAnalysisDto
    {
        public int AnalysisPeriodDays { get; set; }
        public int TotalEntries { get; set; }
        public double AverageMoodLevel { get; set; }
        public Dictionary<string, int> MoodDistribution { get; set; } = new Dictionary<string, int>();
        public List<WeeklyMoodDataPointDto> WeeklyTrends { get; set; } = new List<WeeklyMoodDataPointDto>();
        public double ConsistencyScore { get; set; }
        public List<string> Insights { get; set; } = new List<string>();
    }

    /// <summary>
    /// Seeker summary statistics data transfer object
    /// </summary>
    public class SeekerSummaryStatsDto
    {
        public int TotalJournalEntries { get; set; }
        public int RecentJournalEntries { get; set; }
        public int TotalMoodEntries { get; set; }
        public int RecentMoodEntries { get; set; }
        public int TotalAssessments { get; set; }
        public int DaysActive { get; set; }
        public int StreakDays { get; set; }
        
        // Latest data for dashboard
        public LatestJournalEntryDto LatestJournalEntry { get; set; }
        public LatestMoodEntryDto LatestMood { get; set; }
        public LatestAssessmentScoresDto LatestAssessmentScores { get; set; }
        public double SevenDayMoodAverage { get; set; }
        public string CurrentRiskLevel { get; set; }
    }

    /// <summary>
    /// Latest journal entry information
    /// </summary>
    public class LatestJournalEntryDto
    {
        public DateTime? Date { get; set; }
        public string Content { get; set; }
        public string Emotion { get; set; }
        public int? MoodScore { get; set; }
    }

    /// <summary>
    /// Latest mood entry information
    /// </summary>
    public class LatestMoodEntryDto
    {
        public DateTime? Date { get; set; }
        public int? Level { get; set; }
        public string Notes { get; set; }
    }

    /// <summary>
    /// Latest assessment scores (PHQ-9, GAD-7)
    /// </summary>
    public class LatestAssessmentScoresDto
    {
        public int? LatestPHQ9Score { get; set; }
        public DateTime? LatestPHQ9Date { get; set; }
        public int? LatestGAD7Score { get; set; }
        public DateTime? LatestGAD7Date { get; set; }
        public double? SevenDayPHQ9Average { get; set; }
        public double? SevenDayGAD7Average { get; set; }
    }

    /// <summary>
    /// Weekly mood data point for trend analysis
    /// </summary>
    public class WeeklyMoodDataPointDto
    {
        public DateTime WeekStartDate { get; set; }
        public double AverageMood { get; set; }
        public int EntryCount { get; set; }
        public int HighestMood { get; set; }
        public int LowestMood { get; set; }
    }

    /// <summary>
    /// Mood period information
    /// </summary>
    public class MoodPeriodDto
    {
        public DateTime Date { get; set; }
        public int MoodLevel { get; set; }
        public string Notes { get; set; }
    }

    /// <summary>
    /// Emotional progression point for journey tracking
    /// </summary>
    public class EmotionalProgressionPoint
    {
        public int Sequence { get; set; }
        public EmotionalState EmotionalState { get; set; }
        public double PositiveScore { get; set; }
        public double NegativeScore { get; set; }
        public double NetScore { get; set; }
    }

    // Supporting DTOs for the advanced features

    /// <summary>
    /// Individual action step
    /// </summary>
    public class ActionStepDto
    {
        public int Order { get; set; }
        public string Description { get; set; }
        public int EstimatedMinutes { get; set; }
        public string Frequency { get; set; } // Daily, Weekly, etc.
        public bool IsCompleted { get; set; }
    }

    /// <summary>
    /// Crisis risk prediction
    /// </summary>
    public class CrisisRiskPredictionDto
    {
        public CrisisLevel PredictedRiskLevel { get; set; }
        public double RiskProbability { get; set; } // 0-100%
        public List<DateTime> HighRiskPeriods { get; set; } = new List<DateTime>();
        public List<string> RiskFactors { get; set; } = new List<string>();
        public List<string> ProtectiveFactors { get; set; } = new List<string>();
    }

    /// <summary>
    /// Trigger pattern identification
    /// </summary>
    public class TriggerPatternDto
    {
        public string TriggerType { get; set; }
        public string Description { get; set; }
        public double Frequency { get; set; } // How often this trigger occurs
        public double Severity { get; set; } // Average impact when triggered
        public List<string> RelatedEmotions { get; set; } = new List<string>();
        public List<string> CommonContexts { get; set; } = new List<string>();
    }
}
