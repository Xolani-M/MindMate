using System;
using System.Collections.Generic;

namespace MINDMATE.Application.Seekers.Analytics.Dto
{
    /// <summary>
    /// Therapeutic goals based on emotional patterns and analytics
    /// Uses AI-driven analysis to suggest personalized therapeutic objectives
    /// </summary>
    public class TherapeuticGoalsDto
    {
        /// <summary>
        /// Short-term therapeutic goals (1-4 weeks)
        /// </summary>
        public List<TherapeuticGoalDto> ShortTermGoals { get; set; } = new List<TherapeuticGoalDto>();

        /// <summary>
        /// Long-term therapeutic goals (1-6 months)
        /// </summary>
        public List<TherapeuticGoalDto> LongTermGoals { get; set; } = new List<TherapeuticGoalDto>();

        /// <summary>
        /// Actionable plans to achieve the goals
        /// </summary>
        public List<ActionPlanDto> ActionPlans { get; set; } = new List<ActionPlanDto>();

        /// <summary>
        /// Personality profile analysis
        /// </summary>
        public PersonalityProfileDto PersonalityProfile { get; set; }

        /// <summary>
        /// Recommended therapeutic approaches
        /// </summary>
        public List<string> RecommendedTherapies { get; set; } = new List<string>();

        /// <summary>
        /// Date when goals were generated
        /// </summary>
        public DateTime GoalGeneratedDate { get; set; }

        /// <summary>
        /// Recommended date for goal review
        /// </summary>
        public DateTime ReviewRecommendedDate { get; set; }
    }

    /// <summary>
    /// Individual therapeutic goal
    /// </summary>
    public class TherapeuticGoalDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int Priority { get; set; }
        public int EstimatedDays { get; set; }
        public List<string> Milestones { get; set; } = new List<string>();
        public List<string> SuccessMetrics { get; set; } = new List<string>();
    }

    /// <summary>
    /// Action plan for achieving goals
    /// </summary>
    public class ActionPlanDto
    {
        public string GoalId { get; set; }
        public string GoalTitle { get; set; }
        public string ActionTitle { get; set; }
        public string Description { get; set; }
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> Resources { get; set; } = new List<string>();
        public List<string> PotentialObstacles { get; set; } = new List<string>();
        public List<string> CopingStrategies { get; set; } = new List<string>();
        public int EstimatedTimeMinutes { get; set; }
        public string Frequency { get; set; }
    }

    /// <summary>
    /// Personality profile analysis
    /// </summary>
    public class PersonalityProfileDto
    {
        public List<string> Strengths { get; set; } = new List<string>();
        public List<string> StrengthAreas { get; set; } = new List<string>();
        public List<string> GrowthAreas { get; set; } = new List<string>();
        public List<string> CopingStrategies { get; set; } = new List<string>();
        public List<string> PreferredCopingStyles { get; set; } = new List<string>();
        public List<string> CommunicationPreferences { get; set; } = new List<string>();
        public string PersonalityType { get; set; }
        public string MotivationalStyle { get; set; }
        public double ResilienceScore { get; set; }
    }
}
