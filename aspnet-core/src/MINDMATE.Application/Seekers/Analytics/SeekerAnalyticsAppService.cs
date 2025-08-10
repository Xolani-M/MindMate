using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.UI;
using Microsoft.AspNetCore.Mvc;

namespace MINDMATE.Application.Seekers.Analytics
{
    /// <summary>
    /// Application service for AI-powered analytics endpoints
    /// Exposes Gemini-based emotional analysis for frontend consumption
    /// </summary>
    [AbpAuthorize]
    public class SeekerAnalyticsAppService : ApplicationService
    {
        private readonly SeekerAnalyticsService _analyticsService;

        public SeekerAnalyticsAppService(SeekerAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService ?? throw new System.ArgumentNullException(nameof(analyticsService));
        }

        /// <summary>
        /// Performs AI-powered emotional analysis of journal text
        /// Uses Google Gemini for advanced emotional insights
        /// </summary>
        /// <param name="request">Request containing journal text to analyze</param>
        /// <returns>AI emotional analysis with insights and recommendations</returns>
        [HttpPost]
        public async Task<object> GetAIEmotionalAnalysis([FromBody] dynamic request)
        {
            var journalText = request?.journalText?.ToString() ?? "";
            if (string.IsNullOrWhiteSpace(journalText))
                throw new UserFriendlyException("Journal text is required for analysis");

            return await _analyticsService.GetAIEmotionalAnalysisAsync(journalText);
        }

        /// <summary>
        /// Analyzes patterns across multiple journal entries using AI
        /// Identifies emotional trends and recurring themes
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 30)</param>
        /// <returns>AI pattern analysis with trends and insights</returns>
        public async Task<object> GetAIPatternAnalysis(int days = 30)
        {
            return await _analyticsService.GetAIPatternAnalysisAsync(days);
        }

        /// <summary>
        /// Generates AI-powered personalized recommendations
        /// Based on emotional patterns and mental health data
        /// </summary>
        /// <param name="days">Number of days to analyze for recommendations (default: 14)</param>
        /// <returns>AI recommendations for therapeutic interventions and self-care</returns>
        public async Task<object> GetAIRecommendations(int days = 14)
        {
            return await _analyticsService.GetAIRecommendationsAsync(days);
        }

        /// <summary>
        /// Gets real-time analytics dashboard data
        /// </summary>
        /// <returns>Real-time dashboard analytics</returns>
        public async Task<object> GetRealTimeAnalytics()
        {
            return await _analyticsService.GetRealTimeAnalyticsAsync();
        }

        /// <summary>
        /// Generates therapeutic goals with AI recommendations
        /// </summary>
        /// <param name="analysisDepthDays">Number of days for analysis depth (default: 30)</param>
        /// <returns>AI-generated therapeutic goals and action plans</returns>
        public async Task<object> GenerateTherapeuticGoals(int analysisDepthDays = 30)
        {
            return await _analyticsService.GenerateTherapeuticGoalsAsync(analysisDepthDays);
        }

        /// <summary>
        /// Gets crisis prevention analytics with predictive modeling
        /// </summary>
        /// <param name="predictionDays">Number of days for prediction (default: 7)</param>
        /// <returns>Crisis prevention analytics and recommendations</returns>
        public async Task<object> GetCrisisPreventionAnalytics(int predictionDays = 7)
        {
            return await _analyticsService.GetCrisisPreventionAnalyticsAsync(predictionDays);
        }

        /// <summary>
        /// Gets comprehensive analytics dashboard
        /// </summary>
        /// <returns>Complete seeker analytics dashboard</returns>
        public async Task<object> GetAnalyticsDashboard()
        {
            return await _analyticsService.GetAnalyticsDashboardAsync();
        }

        /// <summary>
        /// Gets detailed mood analysis
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 30)</param>
        /// <returns>Detailed mood analysis with trends</returns>
        public async Task<object> GetDetailedMoodAnalysis(int days = 30)
        {
            return await _analyticsService.GetDetailedMoodAnalysisAsync(days);
        }

        /// <summary>
        /// Gets emotional journey analysis
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 14)</param>
        /// <returns>Emotional journey analysis</returns>
        public async Task<object> GetEmotionalJourneyAnalysis(int days = 14)
        {
            return await _analyticsService.GetEmotionalJourneyAnalysisAsync(days);
        }
    }
}
