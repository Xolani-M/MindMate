using System;
using System.Collections.Generic;

namespace MINDMATE.Application.Seekers.Analytics.Dto
{
    /// <summary>
    /// Crisis prevention analytics using predictive modeling
    /// Analyzes historical patterns to predict and prevent potential crisis situations
    /// </summary>
    public class CrisisPreventionDto
    {
        /// <summary>
        /// Risk prediction for the specified time period
        /// </summary>
        public RiskPredictionDto RiskPrediction { get; set; }

        /// <summary>
        /// Identified trigger patterns that may lead to crisis
        /// </summary>
        public List<CrisisTriggerPatternDto> TriggerPatterns { get; set; } = new List<CrisisTriggerPatternDto>();

        /// <summary>
        /// Early warning signals to watch for
        /// </summary>
        public List<EarlyWarningSignalDto> EarlyWarningSignals { get; set; } = new List<EarlyWarningSignalDto>();

        /// <summary>
        /// Recommended prevention strategies
        /// </summary>
        public List<PreventionStrategyDto> PreventionStrategies { get; set; } = new List<PreventionStrategyDto>();

        /// <summary>
        /// Recommended frequency for check-ins
        /// </summary>
        public string RecommendedCheckInFrequency { get; set; }

        /// <summary>
        /// Support network recommendations
        /// </summary>
        public List<string> SupportNetworkRecommendations { get; set; } = new List<string>();

        /// <summary>
        /// Confidence level in the prediction (0-100%)
        /// </summary>
        public double PredictionConfidence { get; set; }

        /// <summary>
        /// Date when analysis was performed
        /// </summary>
        public DateTime AnalysisDate { get; set; }
    }

    /// <summary>
    /// Risk prediction data
    /// </summary>
    public class RiskPredictionDto
    {
        public string RiskLevel { get; set; }
        public double RiskScore { get; set; }
        public List<string> RiskFactors { get; set; } = new List<string>();
        public List<string> ProtectiveFactors { get; set; } = new List<string>();
        public int PredictionDays { get; set; }
    }

    /// <summary>
    /// Crisis-specific trigger pattern that may lead to crisis
    /// </summary>
    public class CrisisTriggerPatternDto
    {
        public string PatternName { get; set; }
        public string Description { get; set; }
        public double Frequency { get; set; }
        public string Severity { get; set; }
        public List<string> TypicalTriggers { get; set; } = new List<string>();
    }

    /// <summary>
    /// Early warning signal
    /// </summary>
    public class EarlyWarningSignalDto
    {
        public string SignalName { get; set; }
        public string Description { get; set; }
        public string SignalType { get; set; } // Behavioral, Emotional, Physical, etc.
        public int DaysBeforeCrisis { get; set; }
        public double ReliabilityScore { get; set; }
        public List<string> DetectionMethods { get; set; } = new List<string>();
    }

    /// <summary>
    /// Prevention strategy
    /// </summary>
    public class PreventionStrategyDto
    {
        public string StrategyName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string TriggerEvent { get; set; }
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> ActionSteps { get; set; } = new List<string>();
        public List<string> RequiredResources { get; set; } = new List<string>();
        public double EffectivenessScore { get; set; }
        public string WhenToUse { get; set; }
    }
}
