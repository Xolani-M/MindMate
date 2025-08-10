using System;
using System.Collections.Generic;
using MINDMATE.Application.Chatbot;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Seekers.Analytics.Dto
{
    /// <summary>
    /// Real-time dashboard analytics with live emotional state monitoring
    /// Provides immediate insights for current mental health status
    /// </summary>
    public class RealTimeDashboardDto
    {
        /// <summary>
        /// Current emotional state of the seeker
        /// </summary>
        public EmotionalState CurrentEmotionalState { get; set; }

        /// <summary>
        /// Immediate risk level assessment
        /// </summary>
        public CrisisLevel ImmediateRiskLevel { get; set; }

        /// <summary>
        /// Live recommendations based on current state
        /// </summary>
        public List<string> LiveRecommendations { get; set; } = new List<string>();

        /// <summary>
        /// Recent mood fluctuations analysis
        /// </summary>
        public List<MoodFluctuationDto> MoodFluctuations { get; set; } = new List<MoodFluctuationDto>();

        /// <summary>
        /// Last time the data was updated
        /// </summary>
        public DateTime LastUpdated { get; set; }

        /// <summary>
        /// Whether monitoring is currently active
        /// </summary>
        public bool MonitoringActive { get; set; }

        /// <summary>
        /// Whether alerts are currently active
        /// </summary>
        public bool AlertsActive { get; set; }
    }

    /// <summary>
    /// Mood fluctuation data point
    /// </summary>
    public class MoodFluctuationDto
    {
        public DateTime Timestamp { get; set; }
        public string MoodLevel { get; set; }
        public int Score { get; set; }
        public string Emotion { get; set; }
        public double FluctuationRate { get; set; }
        public string Context { get; set; }
    }
}
