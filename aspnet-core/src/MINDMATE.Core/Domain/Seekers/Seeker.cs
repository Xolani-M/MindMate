using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using System;
using System.Collections.Generic;


namespace MINDMATE.Domain.Seekers
{
    public class Seeker : Person
    {
        public string DisplayName { get; set; }
        public RiskLevel CurrentRiskLevel { get; private set; } = RiskLevel.Low;
        public RiskLevel PHQ9RiskLevel { get; private set; }
        public RiskLevel GAD7RiskLevel { get; private set; }
        public int LastPHQ9Score { get; private set; }
        public int LastGAD7Score { get; private set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhone { get; set; }
        public virtual ICollection<JournalEntry> JournalEntries { get; set; } = new List<JournalEntry>();
        public virtual ICollection<AssessmentResult> AssessmentResults { get; set; } = new List<AssessmentResult>();
        public MoodTrendSummary LatestMoodTrend { get; private set; }
        public virtual ICollection<MoodEntry> Moods { get; set; } = new List<MoodEntry>();

        public void SetLastPHQ9Score(int score) => LastPHQ9Score = score;
        public void SetLastGAD7Score(int score) => LastGAD7Score = score;

        public void UpdatePHQ9RiskLevel(RiskLevel newLevel)
        {
            if (PHQ9RiskLevel == RiskLevel.Crisis && newLevel < PHQ9RiskLevel)
                throw new InvalidOperationException("Cannot downgrade from Crisis risk without review");
            PHQ9RiskLevel = newLevel;
            UpdateOverallRiskLevel();
        }

        public void UpdateGAD7RiskLevel(RiskLevel newLevel)
        {
            if (GAD7RiskLevel == RiskLevel.Crisis && newLevel < GAD7RiskLevel)
                throw new InvalidOperationException("Cannot downgrade from Crisis risk without review");
            GAD7RiskLevel = newLevel;
            UpdateOverallRiskLevel();
        }

        private void UpdateOverallRiskLevel()
        {
            var maxRisk = (RiskLevel)Math.Max((int)PHQ9RiskLevel, (int)GAD7RiskLevel);
            if (CurrentRiskLevel == RiskLevel.Crisis && maxRisk < CurrentRiskLevel)
                throw new InvalidOperationException("Cannot downgrade from Crisis risk without review");
            CurrentRiskLevel = maxRisk;
        }

        public void UpdateMoodTrend(MoodTrendSummary moodTrendSummary)
        {
            LatestMoodTrend = moodTrendSummary;
            var moodRiskLevel = MapMoodTrendToRiskLevel(moodTrendSummary?.MoodTrend);
            if (moodRiskLevel > CurrentRiskLevel)
            {
                CurrentRiskLevel = moodRiskLevel;
            }
        }

        private RiskLevel MapMoodTrendToRiskLevel(MoodTrendDirection? moodTrend)
        {
            if (!moodTrend.HasValue)
                return RiskLevel.Low;
            return moodTrend.Value switch
            {
                MoodTrendDirection.Improving => RiskLevel.Low,
                MoodTrendDirection.Stable => RiskLevel.Medium,
                MoodTrendDirection.Declining => RiskLevel.High,
                _ => RiskLevel.Low
            };
        }

        // Domain behavior for direct risk update
        public void UpdateRiskLevel(RiskLevel newLevel)
        {
            if (CurrentRiskLevel == RiskLevel.Crisis && newLevel < CurrentRiskLevel)
                throw new InvalidOperationException("Cannot downgrade from Crisis risk without review");
            CurrentRiskLevel = newLevel;
        }
    }
}
