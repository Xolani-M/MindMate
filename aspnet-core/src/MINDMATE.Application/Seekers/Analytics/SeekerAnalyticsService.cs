using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Application.Chatbot;
using MINDMATE.Application.Seekers.Analytics.Dto;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Assessments;

namespace MINDMATE.Application.Seekers.Analytics
{
    /// <summary>
    /// Comprehensive analytics service for seeker dashboard and insights
    /// Follows clean architecture patterns and integrates with existing seeker services
    /// </summary>
    public class SeekerAnalyticsService : ITransientDependency
    {
        #region Constants
        
        private const string TrendStable = "Stable";
        private const string TrendImproving = "Improving";
        private const string TrendDeclining = "Declining";
        private const string MoodNeutral = "Neutral";
        private const string MoodVeryLow = "VeryLow";
        private const string MoodLow = "Low";
        private const string MoodGood = "Good";
        private const string MoodVeryGood = "VeryGood";
        
        #endregion

        #region Private Fields
        
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly IRepository<JournalEntry, Guid> _journalRepository;
        private readonly IRepository<MoodEntry, Guid> _moodRepository;
        private readonly IAbpSession _abpSession;
        private readonly GeminiAnalyticsService _geminiAnalyticsService;
        
        #endregion

        #region Constructor

        public SeekerAnalyticsService(
            IRepository<Seeker, Guid> seekerRepository,
            IRepository<JournalEntry, Guid> journalRepository,
            IRepository<MoodEntry, Guid> moodRepository,
            IAbpSession abpSession,
            GeminiAnalyticsService geminiAnalyticsService)
        {
            _seekerRepository = seekerRepository ?? throw new ArgumentNullException(nameof(seekerRepository));
            _journalRepository = journalRepository ?? throw new ArgumentNullException(nameof(journalRepository));
            _moodRepository = moodRepository ?? throw new ArgumentNullException(nameof(moodRepository));
            _abpSession = abpSession ?? throw new ArgumentNullException(nameof(abpSession));
            _geminiAnalyticsService = geminiAnalyticsService ?? throw new ArgumentNullException(nameof(geminiAnalyticsService));
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Gets comprehensive analytics dashboard for the authenticated seeker
        /// </summary>
        /// <returns>Complete analytics dashboard with insights and recommendations</returns>
        public async Task<SeekerAnalyticsDto> GetAnalyticsDashboardAsync()
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var recentJournalEntries = await GetRecentJournalEntriesAsync(seeker.Id);
            var recentMoodEntries = await GetRecentMoodEntriesAsync(seeker.Id);

            var emotionalJourney = AnalyzeEmotionalJourney(recentJournalEntries);
            var moodTrends = AnalyzeMoodTrends(recentMoodEntries);
            var crisisRiskLevel = AnalyzeCrisisRisk(recentJournalEntries);
            var activityInsights = GenerateActivityInsights(recentJournalEntries, recentMoodEntries);
            var recommendedActions = GeneratePersonalizedRecommendations(emotionalJourney, crisisRiskLevel, moodTrends);
            var progressScore = CalculateOverallProgressScore(emotionalJourney, moodTrends);

            return new SeekerAnalyticsDto
            {
                // Core Emotional Metrics
                CurrentEmotionalState = emotionalJourney.CurrentState,
                EmotionalTrend = emotionalJourney.Trend,
                EmotionalJourneyDetails = emotionalJourney,
                
                // Mood Analytics
                MoodTrends = moodTrends,
                
                // Safety & Crisis Assessment
                CrisisRiskLevel = crisisRiskLevel,
                
                // Insights & Recommendations
                ActivityInsights = activityInsights,
                RecommendedActions = recommendedActions,
                
                // Progress Tracking
                ProgressScore = progressScore,
                AnalysisTimestamp = DateTime.UtcNow,
                
                // Summary Statistics
                SummaryStats = GenerateSummaryStatistics(seeker, recentJournalEntries, recentMoodEntries)
            };
        }

        /// <summary>
        /// Gets detailed mood analysis for a specific time period
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 30)</param>
        /// <returns>Detailed mood analysis</returns>
        public async Task<DetailedMoodAnalysisDto> GetDetailedMoodAnalysisAsync(int days = 30)
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var moodEntries = await GetMoodEntriesForPeriodAsync(seeker.Id, days);
            
            return new DetailedMoodAnalysisDto
            {
                AnalysisPeriodDays = days,
                TotalEntries = moodEntries.Count,
                AverageMoodLevel = moodEntries.Any() ? moodEntries.Average(m => (int)m.Level) : 5,
                MoodDistribution = CalculateMoodDistribution(moodEntries),
                WeeklyTrends = GenerateWeeklyMoodTrends(moodEntries),
                ConsistencyScore = CalculateMoodConsistencyScore(moodEntries, days),
                Insights = GenerateMoodInsights(moodEntries)
            };
        }

        /// <summary>
        /// Gets emotional journey analysis from journal entries
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 14)</param>
        /// <returns>Emotional journey analysis</returns>
        public async Task<EmotionalJourneyAnalysisDto> GetEmotionalJourneyAnalysisAsync(int days = 14)
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var journalEntries = await GetJournalEntriesForPeriodAsync(seeker.Id, days);
            
            return AnalyzeEmotionalJourney(journalEntries);
        }

        /// <summary>
        /// Gets real-time dashboard analytics with live emotional state monitoring
        /// Provides immediate insights for current mental health status
        /// </summary>
        /// <returns>Real-time analytics with live monitoring data</returns>
        public async Task<RealTimeDashboardDto> GetRealTimeAnalyticsAsync()
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var recentJournalEntries = await GetRecentJournalEntriesAsync(seeker.Id, 1); // Last 24 hours
            var recentMoodEntries = await GetRecentMoodEntriesAsync(seeker.Id, 1);
            
            var currentEmotionalState = AnalyzeCurrentEmotionalState(recentJournalEntries);
            var immediateRiskLevel = AnalyzeImmediateRisk(recentJournalEntries, recentMoodEntries);
            var liveRecommendations = GenerateLiveRecommendations(currentEmotionalState, immediateRiskLevel);
            var moodFluctuations = AnalyzeMoodFluctuations(recentMoodEntries);
            
            return new RealTimeDashboardDto
            {
                CurrentEmotionalState = currentEmotionalState,
                ImmediateRiskLevel = immediateRiskLevel,
                LiveRecommendations = liveRecommendations,
                MoodFluctuations = moodFluctuations,
                LastUpdated = DateTime.UtcNow,
                MonitoringActive = true,
                AlertsActive = immediateRiskLevel >= CrisisLevel.Medium
            };
        }

        /// <summary>
        /// Generates therapeutic goals based on emotional patterns and analytics
        /// Uses AI-driven analysis to suggest personalized therapeutic objectives
        /// </summary>
        /// <param name="analysisDepthDays">Number of days to analyze for goal generation (default: 30)</param>
        /// <returns>Personalized therapeutic goals with action plans</returns>
        public async Task<TherapeuticGoalsDto> GenerateTherapeuticGoalsAsync(int analysisDepthDays = 30)
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var journalEntries = await GetJournalEntriesForPeriodAsync(seeker.Id, analysisDepthDays);
            var moodEntries = await GetMoodEntriesForPeriodAsync(seeker.Id, analysisDepthDays);
            
            var emotionalPatterns = AnalyzeEmotionalPatterns(journalEntries);
            var moodPatterns = AnalyzeMoodPatterns(moodEntries);
            var personalityProfile = BuildPersonalityProfile(seeker, journalEntries, moodEntries);
            
            var shortTermGoals = GenerateShortTermGoals(emotionalPatterns, moodPatterns);
            var longTermGoals = GenerateLongTermGoals(personalityProfile, emotionalPatterns);
            var actionPlans = CreateActionPlans(shortTermGoals, longTermGoals, personalityProfile);
            
            return new TherapeuticGoalsDto
            {
                ShortTermGoals = shortTermGoals,
                LongTermGoals = longTermGoals,
                ActionPlans = actionPlans,
                PersonalityProfile = personalityProfile,
                RecommendedTherapies = SuggestTherapeuticApproaches(emotionalPatterns),
                GoalGeneratedDate = DateTime.UtcNow,
                ReviewRecommendedDate = DateTime.UtcNow.AddDays(14)
            };
        }

        /// <summary>
        /// Provides crisis prevention analytics using predictive modeling
        /// Analyzes historical patterns to predict and prevent potential crisis situations
        /// </summary>
        /// <param name="predictionDays">Number of days to predict ahead (default: 7)</param>
        /// <returns>Crisis prevention analytics with predictive insights</returns>
        public async Task<CrisisPreventionDto> GetCrisisPreventionAnalyticsAsync(int predictionDays = 7)
        {
            ValidateUserAuthentication();
            
            var seeker = await GetAuthenticatedSeekerAsync();
            var historicalJournals = await GetJournalEntriesForPeriodAsync(seeker.Id, 90); // 3 months of history
            var historicalMoods = await GetMoodEntriesForPeriodAsync(seeker.Id, 90);
            
            var riskPrediction = PredictCrisisRisk(historicalJournals, historicalMoods, predictionDays);
            var triggerPatterns = IdentifyTriggerPatterns(historicalJournals, historicalMoods);
            var earlyWarningSignals = DetectEarlyWarningSignals(historicalJournals, historicalMoods);
            var preventionStrategies = GeneratePreventionStrategies(triggerPatterns, earlyWarningSignals);
            
            return new CrisisPreventionDto
            {
                RiskPrediction = ConvertToRiskPredictionDto(riskPrediction),
                TriggerPatterns = ConvertToCrisisTriggerPatternDtos(triggerPatterns),
                EarlyWarningSignals = earlyWarningSignals,
                PreventionStrategies = preventionStrategies,
                RecommendedCheckInFrequency = CalculateOptimalCheckInFrequency(riskPrediction).ToString(),
                SupportNetworkRecommendations = GenerateSupportNetworkRecommendations(riskPrediction),
                PredictionConfidence = CalculatePredictionConfidence(historicalJournals.Count, historicalMoods.Count),
                AnalysisDate = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Gets AI-powered emotional analysis using Gemini
        /// Provides deep insights beyond simple keyword matching
        /// </summary>
        /// <param name="journalText">Journal entry text to analyze</param>
        /// <returns>Advanced emotional analysis from Gemini AI</returns>
        [AbpAuthorize]
        public async Task<object> GetAIEmotionalAnalysisAsync(string journalText)
        {
            ValidateUserAuthentication();
            if (string.IsNullOrWhiteSpace(journalText))
                throw new UserFriendlyException("Journal text cannot be empty for AI analysis.");
            try
            {
                var analysis = await _geminiAnalyticsService.AnalyzeEmotionalStateWithAI(journalText);
                return analysis.ToApiDto();
            }
            catch (Exception ex)
            {
                return new
                {
                    error = true,
                    message = "AI analysis temporarily unavailable. Using basic analysis.",
                    basicAnalysis = EmotionalStateDetectionService.AnalyzeEmotionalState(journalText),
                    timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Gets AI-powered pattern analysis across multiple journal entries
        /// Uses Gemini to identify sophisticated emotional patterns
        /// </summary>
        /// <param name="days">Number of days to analyze (default: 30)</param>
        /// <returns>Advanced pattern analysis from Gemini AI</returns>
        [AbpAuthorize]
        public async Task<object> GetAIPatternAnalysisAsync(int days = 30)
        {
            ValidateUserAuthentication();
            try
            {
                var seeker = await GetAuthenticatedSeekerAsync();
                var journalEntries = await GetJournalEntriesForPeriodAsync(seeker.Id, days);
                if (!journalEntries.Any())
                {
                    return new
                    {
                        message = "No journal entries found for pattern analysis",
                        analyzedDays = days,
                        entryCount = 0,
                        timestamp = DateTime.UtcNow
                    };
                }
                var patternAnalysis = await _geminiAnalyticsService.AnalyzePatternsWithAI(journalEntries);
                // You may want to add a ToApiDto() for patternAnalysis if not present
                return new
                {
                    analyzedDays = days,
                    entryCount = journalEntries.Count,
                    patterns = patternAnalysis.KeyInsights,
                    trends = patternAnalysis.ProgressTrend?.OverallTrend,
                    recommendations = patternAnalysis.RecommendedInterventions,
                    confidence = patternAnalysis.PatternConfidence,
                    timestamp = patternAnalysis.AnalysisTimestamp.ToString("o")
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    error = true,
                    message = "Pattern analysis temporarily unavailable",
                    analyzedDays = days,
                    timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Gets AI-powered therapeutic recommendations
        /// Uses Gemini to generate personalized mental health strategies
        /// </summary>
        /// <param name="days">Number of days of data to consider (default: 14)</param>
        /// <returns>Personalized recommendations from Gemini AI</returns>
        [AbpAuthorize]
        public async Task<object> GetAIRecommendationsAsync(int days = 14)
        {
            ValidateUserAuthentication();
            try
            {
                var seeker = await GetAuthenticatedSeekerAsync();
                var journalEntries = await GetJournalEntriesForPeriodAsync(seeker.Id, days);
                var moodEntries = await GetMoodEntriesForPeriodAsync(seeker.Id, days);
                var recommendations = await _geminiAnalyticsService.GenerateTherapeuticRecommendationsWithAI(journalEntries, moodEntries, "");
                // You may want to add a ToApiDto() for recommendations if not present
                return new
                {
                    analyzedDays = days,
                    dataPoints = new { journalEntries = journalEntries.Count, moodEntries = moodEntries.Count },
                    immediateActions = recommendations.ImmediateActions?.ConvertAll(r => r.Title),
                    weeklyGoals = recommendations.ShortTermStrategies?.ConvertAll(r => r.Title),
                    selfCareActivities = recommendations.SelfCareActivities?.ConvertAll(a => a.ActivityName),
                    copingStrategies = recommendations.ShortTermStrategies?.ConvertAll(r => r.Title),
                    professionalSupport = recommendations.ProfessionalSupport?.Count > 0,
                    motivationalMessage = recommendations.PersonalizedInsights?.Strengths?.Count > 0 ? string.Join(", ", recommendations.PersonalizedInsights.Strengths) : null,
                    confidence = recommendations.RecommendationConfidence,
                    timestamp = recommendations.RecommendationDate.ToString("o")
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    error = true,
                    message = "AI recommendations temporarily unavailable",
                    fallbackRecommendations = new[] { 
                        "Continue journaling regularly", 
                        "Practice mindfulness", 
                        "Maintain healthy sleep habits",
                        "Stay connected with support network"
                    },
                    timestamp = DateTime.UtcNow
                };
            }
        }

        /// <summary>
        /// Helper method to extract emotion from AI response text
        /// </summary>
        private static string ExtractEmotion(string aiResponse)
        {
            if (string.IsNullOrWhiteSpace(aiResponse)) return "neutral";
            
            var emotions = new[] { "happy", "sad", "angry", "anxious", "excited", "calm", "frustrated", "content", "worried", "hopeful" };
            foreach (var emotion in emotions)
            {
                if (aiResponse.ToLower().Contains(emotion))
                    return emotion;
            }
            return "neutral";
        }

        #endregion

        #region Private Helper Methods

        #region Validation & Data Retrieval

        /// <summary>
        /// Validates that the user is authenticated
        /// </summary>
        private void ValidateUserAuthentication()
        {
            if (!_abpSession.UserId.HasValue)
            {
                throw new UserFriendlyException("User must be logged in to access analytics.");
            }
        }

        /// <summary>
        /// Retrieves the authenticated seeker with all related data
        /// </summary>
        /// <returns>Seeker entity with related data</returns>
        private async Task<Seeker> GetAuthenticatedSeekerAsync()
        {
            var seekerQuery = await _seekerRepository
                .GetAllIncludingAsync(s => s.Moods, s => s.AssessmentResults, s => s.JournalEntries);
                
            var seeker = await seekerQuery
                .FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);

            if (seeker == null)
            {
                throw new UserFriendlyException("Seeker profile not found for the current user.");
            }

            return seeker;
        }

        /// <summary>
        /// Gets recent journal entries for analysis
        /// </summary>
        /// <param name="seekerId">Seeker ID</param>
        /// <param name="days">Number of days to retrieve (default: 14)</param>
        /// <returns>List of recent journal entries</returns>
        private async Task<List<JournalEntry>> GetRecentJournalEntriesAsync(Guid seekerId, int days = 14)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-days);
            
            var allJournals = await _journalRepository.GetAllAsync();
            return await allJournals
                .Where(j => j.SeekerId == seekerId && j.EntryDate >= cutoffDate)
                .OrderByDescending(j => j.EntryDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets recent mood entries for analysis
        /// </summary>
        /// <param name="seekerId">Seeker ID</param>
        /// <param name="days">Number of days to retrieve (default: 30)</param>
        /// <returns>List of recent mood entries</returns>
        private async Task<List<MoodEntry>> GetRecentMoodEntriesAsync(Guid seekerId, int days = 30)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-days);
            
            var allMoods = await _moodRepository.GetAllAsync();
            return await allMoods
                .Where(m => m.SeekerId == seekerId && m.EntryDate >= cutoffDate)
                .OrderByDescending(m => m.EntryDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets journal entries for a specific period
        /// </summary>
        /// <param name="seekerId">Seeker ID</param>
        /// <param name="days">Number of days</param>
        /// <returns>Journal entries for the period</returns>
        private async Task<List<JournalEntry>> GetJournalEntriesForPeriodAsync(Guid seekerId, int days)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-days);
            
            var allJournals = await _journalRepository.GetAllAsync();
            return await allJournals
                .Where(j => j.SeekerId == seekerId && j.EntryDate >= cutoffDate)
                .OrderByDescending(j => j.EntryDate)
                .ToListAsync();
        }

        /// <summary>
        /// Gets mood entries for a specific period
        /// </summary>
        /// <param name="seekerId">Seeker ID</param>
        /// <param name="days">Number of days</param>
        /// <returns>Mood entries for the period</returns>
        private async Task<List<MoodEntry>> GetMoodEntriesForPeriodAsync(Guid seekerId, int days)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-days);
            
            var allMoods = await _moodRepository.GetAllAsync();
            return await allMoods
                .Where(m => m.SeekerId == seekerId && m.EntryDate >= cutoffDate)
                .OrderByDescending(m => m.EntryDate)
                .ToListAsync();
        }

        #endregion

        #region Analysis Methods

        /// <summary>
        /// Analyzes emotional journey from journal entries
        /// </summary>
        /// <param name="entries">Journal entries to analyze</param>
        /// <returns>Emotional journey analysis</returns>
        private static EmotionalJourneyAnalysisDto AnalyzeEmotionalJourney(List<JournalEntry> entries)
        {
            if (!entries.Any())
            {
                return CreateEmptyEmotionalJourneyAnalysis();
            }

            var emotionalAnalyses = entries
                .Select(entry => EmotionalStateDetectionService.AnalyzeEmotionalState(entry.EntryText))
                .ToList();

            var currentState = emotionalAnalyses[0].State;
            var trend = DetermineEmotionalTrend(emotionalAnalyses);
            var averagePositive = emotionalAnalyses.Average(a => a.PositiveScore);
            var averageNegative = emotionalAnalyses.Average(a => a.NegativeScore);

            return new EmotionalJourneyAnalysisDto
            {
                CurrentState = currentState,
                Trend = trend,
                AnalyzedEntries = entries.Count,
                AveragePositiveScore = averagePositive,
                AverageNegativeScore = averageNegative,
                EmotionalProgression = GenerateEmotionalProgression(emotionalAnalyses),
                KeyInsights = GenerateEmotionalInsights(emotionalAnalyses, entries)
            };
        }

        /// <summary>
        /// Creates empty emotional journey analysis for cases with no data
        /// </summary>
        /// <returns>Empty emotional journey analysis</returns>
        private static EmotionalJourneyAnalysisDto CreateEmptyEmotionalJourneyAnalysis()
        {
            return new EmotionalJourneyAnalysisDto
            {
                CurrentState = EmotionalState.Neutral,
                Trend = EmotionalTrend.Stable,
                AnalyzedEntries = 0,
                AveragePositiveScore = 0,
                AverageNegativeScore = 0,
                EmotionalProgression = new List<EmotionalProgressionPoint>(),
                KeyInsights = new List<string> { "Start journaling to track your emotional journey" }
            };
        }

        /// <summary>
        /// Analyzes mood trends from mood entries
        /// </summary>
        /// <param name="moodEntries">Mood entries to analyze</param>
        /// <returns>Mood trends analysis</returns>
        private static MoodTrendsAnalysisDto AnalyzeMoodTrends(List<MoodEntry> moodEntries)
        {
            if (!moodEntries.Any())
            {
                return CreateEmptyMoodTrendsAnalysis();
            }

            var moodValues = moodEntries.Select(m => (int)m.Level).ToList();
            var averageMood = moodValues.Average();
            var trendDirection = DetermineMoodTrendDirection(moodEntries);
            var weeklyData = GenerateWeeklyMoodData(moodEntries);

            return new MoodTrendsAnalysisDto
            {
                AverageMoodLevel = averageMood,
                TrendDirection = trendDirection,
                AnalyzedDays = moodEntries.Count,
                WeeklyMoodData = weeklyData,
                MoodStability = CalculateMoodStability(moodValues),
                HighestMoodPeriod = FindHighestMoodPeriod(moodEntries),
                LowestMoodPeriod = FindLowestMoodPeriod(moodEntries)
            };
        }

        /// <summary>
        /// Creates empty mood trends analysis for cases with no data
        /// </summary>
        /// <returns>Empty mood trends analysis</returns>
        private static MoodTrendsAnalysisDto CreateEmptyMoodTrendsAnalysis()
        {
            return new MoodTrendsAnalysisDto
            {
                AverageMoodLevel = 5,
                TrendDirection = TrendStable,
                AnalyzedDays = 0,
                WeeklyMoodData = new List<WeeklyMoodDataPointDto>(),
                MoodStability = 0,
                HighestMoodPeriod = null,
                LowestMoodPeriod = null
            };
        }

        #endregion

        #region Utility Methods

        /// <summary>
        /// Determines emotional trend from emotional analyses
        /// </summary>
        /// <param name="analyses">List of emotional state assessments</param>
        /// <returns>Overall emotional trend</returns>
        private static EmotionalTrend DetermineEmotionalTrend(List<EmotionalStateAssessment> analyses)
        {
            if (analyses.Count < 3) return EmotionalTrend.Stable;

            var recentAverage = analyses.Take(3).Average(a => a.PositiveScore - a.NegativeScore);
            var olderAverage = analyses.Skip(3).Average(a => a.PositiveScore - a.NegativeScore);
            var difference = recentAverage - olderAverage;

            return difference switch
            {
                >= 2 => EmotionalTrend.Improving,
                <= -2 => EmotionalTrend.Declining,
                _ => EmotionalTrend.Stable
            };
        }

        /// <summary>
        /// Determines mood trend direction from mood entries
        /// </summary>
        /// <param name="moodEntries">Mood entries to analyze</param>
        /// <returns>Trend direction string</returns>
        private static string DetermineMoodTrendDirection(List<MoodEntry> moodEntries)
        {
            if (moodEntries.Count < 7) return TrendStable;

            var recentWeekAverage = moodEntries.Take(7).Average(m => (int)m.Level);
            var previousWeekAverage = moodEntries.Skip(7).Take(7).DefaultIfEmpty().Average(m => (int?)m?.Level);

            if (previousWeekAverage == null) return TrendStable;

            var difference = recentWeekAverage - previousWeekAverage.Value;

            return difference switch
            {
                > 0.5 => TrendImproving,
                < -0.5 => TrendDeclining,
                _ => TrendStable
            };
        }

        /// <summary>
        /// Analyzes crisis risk from journal entries and seeker data
        /// </summary>
        /// <param name="entries">Recent journal entries</param>
        /// <returns>Crisis risk level</returns>
        private static CrisisLevel AnalyzeCrisisRisk(List<JournalEntry> entries)
        {
            if (!entries.Any()) return CrisisLevel.None;

            var recentEntries = entries.Take(5);
            var crisisLevels = recentEntries
                .Select(entry => CrisisDetectionService.AnalyzeCrisisLevel(entry.EntryText))
                .Select(assessment => assessment.Level)
                .ToList();

            return crisisLevels.Any() ? crisisLevels.Max() : CrisisLevel.None;
        }

        /// <summary>
        /// Generates activity insights for the seeker
        /// </summary>
        /// <param name="recentJournalEntries">Recent journal entries</param>
        /// <param name="recentMoodEntries">Recent mood entries</param>
        /// <returns>List of activity insights</returns>
        private static List<string> GenerateActivityInsights(List<JournalEntry> recentJournalEntries, List<MoodEntry> recentMoodEntries)
        {
            var insights = new List<string>();

            // Journal activity insights
            GenerateJournalInsights(recentJournalEntries, insights);
            
            // Mood tracking insights
            GenerateMoodTrackingInsights(recentMoodEntries, insights);
            
            // Overall engagement insights
            GenerateEngagementInsights(recentJournalEntries, recentMoodEntries, insights);

            return insights;
        }

        /// <summary>
        /// Generates journal-specific insights
        /// </summary>
        /// <param name="journalEntries">Recent journal entries</param>
        /// <param name="insights">Insights list to populate</param>
        private static void GenerateJournalInsights(List<JournalEntry> journalEntries, List<string> insights)
        {
            var journalFrequency = journalEntries.Count;
            
            switch (journalFrequency)
            {
                case >= 7:
                    insights.Add("🌟 Excellent journaling consistency this week!");
                    break;
                case >= 3:
                    insights.Add("📝 Good journaling activity - you're building a healthy habit");
                    break;
                case >= 1:
                    insights.Add("📚 Some journaling activity - consider writing more regularly for better insights");
                    break;
                default:
                    insights.Add("💭 No recent journal entries - journaling can help track your emotional journey");
                    break;
            }
        }

        /// <summary>
        /// Generates mood tracking insights
        /// </summary>
        /// <param name="moodEntries">Recent mood entries</param>
        /// <param name="insights">Insights list to populate</param>
        private static void GenerateMoodTrackingInsights(List<MoodEntry> moodEntries, List<string> insights)
        {
            var weeklyMoods = moodEntries.Where(m => m.EntryDate >= DateTime.UtcNow.AddDays(-7)).ToList();
            
            switch (weeklyMoods.Count)
            {
                case >= 5:
                    insights.Add("📊 Consistent mood tracking this week - great for pattern recognition");
                    break;
                case >= 1:
                    insights.Add("📈 Some mood tracking - daily logging provides better emotional insights");
                    break;
                default:
                    insights.Add("🎯 Consider tracking your mood daily for personalized insights");
                    break;
            }
        }

        /// <summary>
        /// Generates overall engagement insights
        /// </summary>
        /// <param name="journalEntries">Recent journal entries</param>
        /// <param name="moodEntries">Recent mood entries</param>
        /// <param name="insights">Insights list to populate</param>
        private static void GenerateEngagementInsights(List<JournalEntry> journalEntries, List<MoodEntry> moodEntries, List<string> insights)
        {
            var totalActivity = journalEntries.Count + moodEntries.Count;
            
            if (totalActivity >= 10)
            {
                insights.Add("🏆 High engagement level - you're actively participating in your mental health journey");
            }
            else if (totalActivity >= 5)
            {
                insights.Add("⭐ Moderate engagement - keep up the good work!");
            }
            else if (totalActivity > 0)
            {
                insights.Add("🌱 Starting your mental health tracking journey - consistency is key");
            }
        }

        /// <summary>
        /// Generates personalized recommendations based on analysis
        /// </summary>
        /// <param name="emotionalJourney">Emotional journey analysis</param>
        /// <param name="crisisLevel">Crisis risk level</param>
        /// <param name="moodTrends">Mood trends analysis</param>
        /// <returns>List of personalized recommendations</returns>
        private static List<string> GeneratePersonalizedRecommendations(EmotionalJourneyAnalysisDto emotionalJourney, CrisisLevel crisisLevel, MoodTrendsAnalysisDto moodTrends)
        {
            var recommendations = new List<string>();

            // Crisis-based recommendations (highest priority)
            if (crisisLevel >= CrisisLevel.Medium)
            {
                recommendations.Add("🚨 Your recent entries indicate distress. Consider reaching out to a mental health professional.");
                recommendations.Add("📞 Emergency support: Contact your local crisis hotline if you need immediate help.");
                recommendations.Add("👥 Reach out to trusted friends, family, or your emergency contact.");
                return recommendations; // Return early for crisis situations
            }

            // Emotional state-based recommendations
            AddEmotionalStateRecommendations(emotionalJourney.CurrentState, recommendations);

            // Trend-based recommendations
            AddTrendBasedRecommendations(emotionalJourney.Trend, moodTrends.TrendDirection, recommendations);

            // General wellness recommendations
            AddGeneralWellnessRecommendations(recommendations);

            return recommendations;
        }

        /// <summary>
        /// Adds emotional state-specific recommendations
        /// </summary>
        /// <param name="emotionalState">Current emotional state</param>
        /// <param name="recommendations">Recommendations list to populate</param>
        private static void AddEmotionalStateRecommendations(EmotionalState emotionalState, List<string> recommendations)
        {
            switch (emotionalState)
            {
                case EmotionalState.VeryNegative:
                case EmotionalState.Negative:
                    recommendations.Add("🫁 Practice deep breathing exercises or meditation");
                    recommendations.Add("🚶\u200D♀️ Try gentle physical activity like walking or stretching");
                    recommendations.Add("💬 Consider talking to someone you trust about your feelings");
                    break;
                
                case EmotionalState.SlightlyNegative:
                    recommendations.Add("📝 Journal about your feelings to process emotions");
                    recommendations.Add("🙏 Practice gratitude by listing three positive things from your day");
                    recommendations.Add("🎨 Engage in a creative activity or hobby you enjoy");
                    break;
                
                case EmotionalState.Positive:
                case EmotionalState.VeryPositive:
                    recommendations.Add("🎉 Celebrate your positive mood and acknowledge your progress!");
                    recommendations.Add("🤝 Share your good feelings with others who matter to you");
                    recommendations.Add("⚡ Use this positive energy for activities that bring you joy");
                    break;
                
                default:
                    recommendations.Add("🌿 Continue your current self-care routine");
                    recommendations.Add("🎯 Consider setting small, achievable goals for personal growth");
                    break;
            }
        }

        /// <summary>
        /// Adds trend-based recommendations
        /// </summary>
        /// <param name="emotionalTrend">Emotional trend</param>
        /// <param name="moodTrendDirection">Mood trend direction</param>
        /// <param name="recommendations">Recommendations list to populate</param>
        private static void AddTrendBasedRecommendations(EmotionalTrend emotionalTrend, string moodTrendDirection, List<string> recommendations)
        {
            if (emotionalTrend == EmotionalTrend.Declining || moodTrendDirection == TrendDeclining)
            {
                recommendations.Add("📈 Monitor your emotional patterns closely");
                recommendations.Add("🛡️ Consider increasing self-care activities and stress management");
                recommendations.Add("🔍 Reflect on recent changes that might be affecting your mood");
            }
            else if (emotionalTrend == EmotionalTrend.Improving || moodTrendDirection == TrendImproving)
            {
                recommendations.Add("🌟 Great progress! Keep up the positive momentum");
                recommendations.Add("💭 Reflect on what strategies have been helping you feel better");
                recommendations.Add("📚 Consider documenting your successful coping strategies");
            }
        }

        /// <summary>
        /// Adds general wellness recommendations
        /// </summary>
        /// <param name="recommendations">Recommendations list to populate</param>
        private static void AddGeneralWellnessRecommendations(List<string> recommendations)
        {
            recommendations.Add("💤 Maintain a consistent sleep schedule");
            recommendations.Add("🥗 Focus on nutritious meals and staying hydrated");
            recommendations.Add("🧘\u200D♂️ Incorporate mindfulness or relaxation techniques into your routine");
        }

        /// <summary>
        /// Calculates overall progress score based on multiple factors
        /// </summary>
        /// <param name="emotionalJourney">Emotional journey analysis</param>
        /// <param name="moodTrends">Mood trends analysis</param>
        /// <returns>Progress score (0-100)</returns>
        private static double CalculateOverallProgressScore(EmotionalJourneyAnalysisDto emotionalJourney, MoodTrendsAnalysisDto moodTrends)
        {
            const double baseScore = 50.0; // Neutral baseline

            // Emotional state contribution (40%)
            var emotionalContribution = GetEmotionalStateScore(emotionalJourney.CurrentState);

            // Trend contribution (30%)
            var trendContribution = GetTrendScore(emotionalJourney.Trend);

            // Mood trend contribution (30%)
            var moodContribution = GetMoodTrendScore(moodTrends.TrendDirection);

            var totalScore = baseScore + emotionalContribution + trendContribution + moodContribution;
            
            // Clamp between 0-100
            return Math.Max(0, Math.Min(100, totalScore));
        }

        /// <summary>
        /// Gets score contribution from emotional state
        /// </summary>
        /// <param name="state">Emotional state</param>
        /// <returns>Score contribution</returns>
        private static double GetEmotionalStateScore(EmotionalState state)
        {
            return state switch
            {
                EmotionalState.VeryPositive => 40,
                EmotionalState.Positive => 30,
                EmotionalState.SlightlyPositive => 20,
                EmotionalState.Neutral => 0,
                EmotionalState.SlightlyNegative => -20,
                EmotionalState.Negative => -30,
                EmotionalState.VeryNegative => -40,
                _ => 0
            };
        }

        /// <summary>
        /// Gets score contribution from emotional trend
        /// </summary>
        /// <param name="trend">Emotional trend</param>
        /// <returns>Score contribution</returns>
        private static double GetTrendScore(EmotionalTrend trend)
        {
            return trend switch
            {
                EmotionalTrend.Improving => 30,
                EmotionalTrend.Stable => 0,
                EmotionalTrend.Declining => -30,
                _ => 0
            };
        }

        /// <summary>
        /// Gets score contribution from mood trend
        /// </summary>
        /// <param name="trendDirection">Mood trend direction</param>
        /// <returns>Score contribution</returns>
        private static double GetMoodTrendScore(string trendDirection)
        {
            return trendDirection switch
            {
                var trend when trend == TrendImproving => 30,
                var trend when trend == TrendStable => 0,
                var trend when trend == TrendDeclining => -30,
                _ => 0
            };
        }

        /// <summary>
        /// Generates summary statistics for the seeker
        /// </summary>
        /// <param name="seeker">Seeker entity</param>
        /// <param name="recentJournalEntries">Recent journal entries</param>
        /// <param name="recentMoodEntries">Recent mood entries</param>
        /// <returns>Summary statistics</returns>
        private static SeekerSummaryStatsDto GenerateSummaryStatistics(Seeker seeker, List<JournalEntry> recentJournalEntries, List<MoodEntry> recentMoodEntries)
        {
            // Get latest journal entry
            var latestJournal = seeker.JournalEntries?
                .OrderByDescending(j => j.EntryDate)
                .FirstOrDefault();

            // Get latest mood entry
            var latestMood = seeker.Moods?
                .OrderByDescending(m => m.EntryDate)
                .FirstOrDefault();

            // Get latest assessment scores
            var latestPhq9 = seeker.AssessmentResults?
                .Where(a => a.Type == AssessmentType.PHQ9)
                .OrderByDescending(a => a.CreationTime)
                .FirstOrDefault();

            var latestGad7 = seeker.AssessmentResults?
                .Where(a => a.Type == AssessmentType.GAD7)
                .OrderByDescending(a => a.CreationTime)
                .FirstOrDefault();

            // Calculate 7-day mood average
            var sevenDayMoodAverage = seeker.Moods?
                .Where(m => m.EntryDate >= DateTime.UtcNow.AddDays(-7))
                .Select(m => (int)m.Level)
                .DefaultIfEmpty()
                .Average() ?? 0;

            // Extract emotion string safely
            string emotionString = latestJournal?.EmotionalState.ToString();

            return new SeekerSummaryStatsDto
            {
                TotalJournalEntries = seeker.JournalEntries?.Count ?? 0,
                RecentJournalEntries = recentJournalEntries.Count,
                TotalMoodEntries = seeker.Moods?.Count ?? 0,
                RecentMoodEntries = recentMoodEntries.Count,
                TotalAssessments = seeker.AssessmentResults?.Count ?? 0,
                DaysActive = CalculateDaysActive(seeker),
                StreakDays = CalculateCurrentStreak(recentJournalEntries, recentMoodEntries),
                
                // Latest data for dashboard
                LatestJournalEntry = latestJournal != null ? new LatestJournalEntryDto
                {
                    Date = latestJournal.EntryDate,
                    Content = latestJournal.EntryText,
                    Emotion = emotionString,
                    MoodScore = latestJournal.MoodScore
                } : null,
                
                LatestMood = latestMood != null ? new LatestMoodEntryDto
                {
                    Date = latestMood.EntryDate,
                    Level = (int)latestMood.Level,
                    Notes = latestMood.Notes
                } : null,
                
                LatestAssessmentScores = new LatestAssessmentScoresDto
                {
                    LatestPHQ9Score = latestPhq9?.Score,
                    LatestPHQ9Date = latestPhq9?.CreationTime,
                    LatestGAD7Score = latestGad7?.Score,
                    LatestGAD7Date = latestGad7?.CreationTime
                },
                
                SevenDayMoodAverage = sevenDayMoodAverage,
                CurrentRiskLevel = seeker.CurrentRiskLevel.ToString()
            };
        }

        /// <summary>
        /// Calculates total days active for the seeker
        /// </summary>
        /// <param name="seeker">Seeker entity</param>
        /// <returns>Number of days active</returns>
        private static int CalculateDaysActive(Seeker seeker)
        {
            var activeDates = new HashSet<DateTime>();
            
            // Add journal entry dates
            if (seeker.JournalEntries != null)
            {
                foreach (var entry in seeker.JournalEntries)
                {
                    activeDates.Add(entry.EntryDate.Date);
                }
            }
            
            // Add mood entry dates
            if (seeker.Moods != null)
            {
                foreach (var mood in seeker.Moods)
                {
                    activeDates.Add(mood.EntryDate.Date);
                }
            }
            
            return activeDates.Count;
        }

        /// <summary>
        /// Calculates current activity streak
        /// </summary>
        /// <param name="journalEntries">Recent journal entries</param>
        /// <param name="moodEntries">Recent mood entries</param>
        /// <returns>Current streak in days</returns>
        private static int CalculateCurrentStreak(List<JournalEntry> journalEntries, List<MoodEntry> moodEntries)
        {
            var activeDates = new HashSet<DateTime>();
            
            foreach (var entry in journalEntries)
            {
                activeDates.Add(entry.EntryDate.Date);
            }
            
            foreach (var mood in moodEntries)
            {
                activeDates.Add(mood.EntryDate.Date);
            }
            
            var sortedDates = activeDates.OrderByDescending(d => d).ToList();
            
            if (!sortedDates.Any()) return 0;
            
            var streak = 0;
            var currentDate = DateTime.UtcNow.Date;
            
            foreach (var date in sortedDates)
            {
                if (date == currentDate || date == currentDate.AddDays(-streak))
                {
                    streak++;
                    currentDate = date;
                }
                else
                {
                    break;
                }
            }
            
            return streak;
        }

        #endregion

        #region Additional Helper Methods for Extended Functionality

        /// <summary>
        /// Calculates mood distribution across different levels
        /// </summary>
        /// <param name="moodEntries">Mood entries to analyze</param>
        /// <returns>Dictionary with mood level distribution</returns>
        private static Dictionary<string, int> CalculateMoodDistribution(List<MoodEntry> moodEntries)
        {
            var distribution = new Dictionary<string, int>
            {
                { MoodVeryLow, 0 }, { MoodLow, 0 }, { MoodNeutral, 0 }, { MoodGood, 0 }, { MoodVeryGood, 0 }
            };

            foreach (var entry in moodEntries)
            {
                var level = ((int)entry.Level) switch
                {
                    1 => MoodVeryLow,
                    2 => MoodVeryLow,
                    3 => MoodLow,
                    4 => MoodLow,
                    5 => MoodNeutral,
                    6 => MoodNeutral,
                    7 => MoodGood,
                    8 => MoodGood,
                    9 => MoodVeryGood,
                    10 => MoodVeryGood,
                    _ => MoodNeutral
                };
                
                distribution[level]++;
            }

            return distribution;
        }

        /// <summary>
        /// Generates weekly mood trends for detailed analysis
        /// </summary>
        /// <param name="moodEntries">Mood entries</param>
        /// <returns>List of weekly mood trend points</returns>
        private static List<WeeklyMoodDataPointDto> GenerateWeeklyMoodTrends(List<MoodEntry> moodEntries)
        {
            var weeklyData = new List<WeeklyMoodDataPointDto>();
            var startDate = DateTime.UtcNow.AddDays(-35).Date; // 5 weeks

            for (int i = 0; i < 5; i++)
            {
                var weekStart = startDate.AddDays(i * 7);
                var weekEnd = weekStart.AddDays(6);
                
                var weekMoods = moodEntries
                    .Where(m => m.EntryDate.Date >= weekStart && m.EntryDate.Date <= weekEnd)
                    .ToList();

                weeklyData.Add(new WeeklyMoodDataPointDto
                {
                    WeekStartDate = weekStart,
                    AverageMood = weekMoods.Any() ? weekMoods.Average(m => (int)m.Level) : 5,
                    EntryCount = weekMoods.Count,
                    HighestMood = weekMoods.Any() ? weekMoods.Max(m => (int)m.Level) : 5,
                    LowestMood = weekMoods.Any() ? weekMoods.Min(m => (int)m.Level) : 5
                });
            }

            return weeklyData.OrderBy(w => w.WeekStartDate).ToList();
        }

        /// <summary>
        /// Calculates mood consistency score
        /// </summary>
        /// <param name="moodEntries">Mood entries</param>
        /// <param name="expectedDays">Expected number of days</param>
        /// <returns>Consistency score (0-100)</returns>
        private static double CalculateMoodConsistencyScore(List<MoodEntry> moodEntries, int expectedDays)
        {
            if (expectedDays <= 0) return 0;
            
            var uniqueDays = moodEntries.Select(m => m.EntryDate.Date).Distinct().Count();
            return Math.Min(100, (uniqueDays / (double)expectedDays) * 100);
        }

        /// <summary>
        /// Generates mood-specific insights
        /// </summary>
        /// <param name="moodEntries">Mood entries</param>
        /// <returns>List of mood insights</returns>
        private static List<string> GenerateMoodInsights(List<MoodEntry> moodEntries)
        {
            var insights = new List<string>();
            
            if (!moodEntries.Any())
            {
                insights.Add("Start tracking your daily mood to identify patterns");
                return insights;
            }

            var averageMood = moodEntries.Average(m => (int)m.Level);
            
            if (averageMood >= 7)
            {
                insights.Add("Your average mood has been quite positive!");
            }
            else if (averageMood >= 5)
            {
                insights.Add("Your mood has been relatively stable");
            }
            else
            {
                insights.Add("Your mood has been lower recently - consider self-care strategies");
            }

            // Consistency insight
            var daysWithEntries = moodEntries.Select(m => m.EntryDate.Date).Distinct().Count();
            if (daysWithEntries >= 20)
            {
                insights.Add("Excellent mood tracking consistency!");
            }
            else if (daysWithEntries >= 10)
            {
                insights.Add("Good mood tracking frequency");
            }

            return insights;
        }

        /// <summary>
        /// Calculates mood stability score
        /// </summary>
        /// <param name="moodValues">List of mood values</param>
        /// <returns>Stability score</returns>
        private static double CalculateMoodStability(List<int> moodValues)
        {
            if (moodValues.Count < 2) return 100;
            
            var average = moodValues.Average();
            var variance = moodValues.Sum(m => Math.Pow(m - average, 2)) / moodValues.Count;
            var standardDeviation = Math.Sqrt(variance);
            
            // Convert to stability score (lower deviation = higher stability)
            return Math.Max(0, 100 - (standardDeviation * 20));
        }

        /// <summary>
        /// Finds the period with highest mood
        /// </summary>
        /// <param name="moodEntries">Mood entries</param>
        /// <returns>Highest mood period info</returns>
        private static MoodPeriodDto FindHighestMoodPeriod(List<MoodEntry> moodEntries)
        {
            if (!moodEntries.Any()) return null;
            
            var highestEntry = moodEntries.OrderByDescending(m => (int)m.Level).First();
            
            return new MoodPeriodDto
            {
                Date = highestEntry.EntryDate,
                MoodLevel = (int)highestEntry.Level,
                Notes = highestEntry.Notes
            };
        }

        /// <summary>
        /// Finds the period with lowest mood
        /// </summary>
        /// <param name="moodEntries">Mood entries</param>
        /// <returns>Lowest mood period info</returns>
        private static MoodPeriodDto FindLowestMoodPeriod(List<MoodEntry> moodEntries)
        {
            if (!moodEntries.Any()) return null;
            
            var lowestEntry = moodEntries.OrderBy(m => (int)m.Level).First();
            
            return new MoodPeriodDto
            {
                Date = lowestEntry.EntryDate,
                MoodLevel = (int)lowestEntry.Level,
                Notes = lowestEntry.Notes
            };
        }

        /// <summary>
        /// Generates emotional progression points for visualization
        /// </summary>
        /// <param name="emotionalAnalyses">List of emotional analyses</param>
        /// <returns>List of emotional progression points</returns>
        private static List<EmotionalProgressionPoint> GenerateEmotionalProgression(List<EmotionalStateAssessment> emotionalAnalyses)
        {
            return emotionalAnalyses.Select((analysis, index) => new EmotionalProgressionPoint
            {
                Sequence = index + 1,
                EmotionalState = analysis.State,
                PositiveScore = analysis.PositiveScore,
                NegativeScore = analysis.NegativeScore,
                NetScore = analysis.PositiveScore - analysis.NegativeScore
            }).ToList();
        }

        /// <summary>
        /// Generates emotional insights from analyses and entries
        /// </summary>
        /// <param name="emotionalAnalyses">Emotional analyses</param>
        /// <param name="entries">Journal entries</param>
        /// <returns>List of emotional insights</returns>
        private static List<string> GenerateEmotionalInsights(List<EmotionalStateAssessment> emotionalAnalyses, List<JournalEntry> entries)
        {
            var insights = new List<string>();
            
            if (!emotionalAnalyses.Any())
            {
                insights.Add("Start journaling to track your emotional journey");
                return insights;
            }

            // Analyze predominant emotions
            var positiveCount = emotionalAnalyses.Count(a => a.PositiveScore > a.NegativeScore);
            var negativeCount = emotionalAnalyses.Count(a => a.NegativeScore > a.PositiveScore);
            
            if (positiveCount > negativeCount)
            {
                insights.Add("Your recent journal entries show predominantly positive emotions");
            }
            else if (negativeCount > positiveCount)
            {
                insights.Add("Your recent entries reflect some challenging emotions - this is normal and journaling helps process them");
            }
            else
            {
                insights.Add("Your emotional state shows good balance between positive and challenging emotions");
            }

            // Analyze writing frequency
            if (entries.Count >= 7)
            {
                insights.Add("Your consistent journaling is providing rich emotional insights");
            }
            else if (entries.Count >= 3)
            {
                insights.Add("Regular journaling helps track emotional patterns over time");
            }

            return insights;
        }

        /// <summary>
        /// Generates weekly mood data for detailed analysis
        /// </summary>
        /// <param name="moods">Mood entries</param>
        /// <returns>List of weekly mood data points</returns>
        private static List<WeeklyMoodDataPointDto> GenerateWeeklyMoodData(List<MoodEntry> moods)
        {
            var weeklyData = new List<WeeklyMoodDataPointDto>();
            var startDate = DateTime.UtcNow.AddDays(-35).Date; // 5 weeks

            for (int i = 0; i < 5; i++)
            {
                var weekStart = startDate.AddDays(i * 7);
                var weekEnd = weekStart.AddDays(6);
                
                var weekMoods = moods
                    .Where(m => m.EntryDate.Date >= weekStart && m.EntryDate.Date <= weekEnd)
                    .ToList();

                weeklyData.Add(new WeeklyMoodDataPointDto
                {
                    WeekStartDate = weekStart,
                    AverageMood = weekMoods.Any() ? weekMoods.Average(m => (int)m.Level) : 5,
                    EntryCount = weekMoods.Count,
                    HighestMood = weekMoods.Any() ? weekMoods.Max(m => (int)m.Level) : 5,
                    LowestMood = weekMoods.Any() ? weekMoods.Min(m => (int)m.Level) : 5
                });
            }

            return weeklyData.OrderBy(w => w.WeekStartDate).ToList();
        }

        /// <summary>
        /// Additional helper methods for advanced analytics
        /// </summary>
        
        private static EmotionalState AnalyzeCurrentEmotionalState(List<JournalEntry> recentEntries)
        {
            if (!recentEntries.Any()) return EmotionalState.Neutral;
            
            // Use the new EmotionalState property from the most recent entry
            return recentEntries.OrderByDescending(x => x.CreationTime).First().EmotionalState;
        }

        private static CrisisLevel AnalyzeImmediateRisk(List<JournalEntry> recentJournalEntries, List<MoodEntry> recentMoodEntries)
        {
            // Simple immediate risk assessment using EmotionalState and MoodLevel
            var latestMood = recentMoodEntries.OrderByDescending(x => x.EntryDate).FirstOrDefault();
            var latestJournal = recentJournalEntries.OrderByDescending(x => x.CreationTime).FirstOrDefault();

            if (latestMood?.Level == MoodLevel.VerySad || 
                latestJournal?.EmotionalState == EmotionalState.VeryNegative)
                return CrisisLevel.High;
            if (latestMood?.Level == MoodLevel.Sad || 
                latestJournal?.EmotionalState == EmotionalState.Negative)
                return CrisisLevel.Medium;
            
            return CrisisLevel.Low;
        }

        private static List<string> GenerateLiveRecommendations(EmotionalState currentState, CrisisLevel immediateRiskLevel)
        {
            var recommendations = new List<string>();
            
            if (immediateRiskLevel >= CrisisLevel.High)
            {
                recommendations.Add("Consider reaching out to a mental health professional immediately");
                recommendations.Add("Use grounding techniques: 5-4-3-2-1 sensory method");
            }
            else
            {
                switch (currentState)
                {
                    case EmotionalState.Positive:
                        recommendations.Add("Great mood! Consider practicing gratitude");
                        break;
                    case EmotionalState.Negative:
                        recommendations.Add("Try a 10-minute mindfulness meditation");
                        break;
                    default:
                        recommendations.Add("Check in with yourself throughout the day");
                        break;
                }
            }
            
            return recommendations;
        }

        private static List<MoodFluctuationDto> AnalyzeMoodFluctuations(List<MoodEntry> recentMoodEntries)
        {
            var fluctuations = new List<MoodFluctuationDto>();
            
            for (int i = 0; i < recentMoodEntries.Count; i++)
            {
                var entry = recentMoodEntries[i];
                var fluctuationRate = i > 0 ? 
                    Math.Abs((int)entry.Level - (int)recentMoodEntries[i-1].Level) : 0;
                
                fluctuations.Add(new MoodFluctuationDto
                {
                    Timestamp = entry.EntryDate,
                    MoodLevel = ((int)entry.Level).ToString(),
                    FluctuationRate = fluctuationRate,
                    Context = "Recent mood entry"
                });
            }
            
            return fluctuations.OrderBy(x => x.Timestamp).ToList();
        }

        private static Dictionary<string, object> AnalyzeEmotionalPatterns(List<JournalEntry> journalEntries)
        {
            var patterns = new Dictionary<string, object>();
            
            // Use both EmotionalState enum and Emotion string for comprehensive analysis
            var emotionalStateCounts = journalEntries.GroupBy(x => x.EmotionalState)
                                                   .ToDictionary(g => g.Key.ToString(), g => g.Count());
            patterns["EmotionalStateDistribution"] = emotionalStateCounts;
            
            var emotionCounts = journalEntries.GroupBy(x => x.Emotion ?? "Unknown")
                                            .ToDictionary(g => g.Key, g => g.Count());
            patterns["SpecificEmotionDistribution"] = emotionCounts;
            
            var moodScoreCounts = journalEntries.GroupBy(x => x.MoodScore)
                                              .ToDictionary(g => g.Key.ToString(), g => g.Count());
            patterns["MoodScoreDistribution"] = moodScoreCounts;
            
            return patterns;
        }

        private static Dictionary<string, object> AnalyzeMoodPatterns(List<MoodEntry> moodEntries)
        {
            var patterns = new Dictionary<string, object>();
            
            var moodCounts = moodEntries.GroupBy(x => x.Level)
                                      .ToDictionary(g => g.Key.ToString(), g => g.Count());
            patterns["MoodDistribution"] = moodCounts;
            
            var dailyPatterns = moodEntries.GroupBy(x => x.EntryDate.DayOfWeek)
                                         .ToDictionary(g => g.Key.ToString(), g => g.Average(m => (int)m.Level));
            patterns["DailyMoodAverages"] = dailyPatterns;
            
            return patterns;
        }

        private static PersonalityProfileDto BuildPersonalityProfile(Seeker seeker, List<JournalEntry> journalEntries, List<MoodEntry> moodEntries)
        {
            return new PersonalityProfileDto
            {
                StrengthAreas = new List<string> { "Self-reflection", "Emotional awareness" },
                GrowthAreas = new List<string> { "Emotional regulation" },
                PreferredCopingStyles = new List<string> { "Journaling", "Self-reflection" },
                CommunicationPreferences = new List<string> { "Written expression" },
                MotivationalStyle = "Self-improvement oriented",
                ResilienceScore = 0.7
            };
        }

        private static List<TherapeuticGoalDto> GenerateShortTermGoals(Dictionary<string, object> emotionalPatterns, Dictionary<string, object> moodPatterns)
        {
            return new List<TherapeuticGoalDto>
            {
                new TherapeuticGoalDto
                {
                    Title = "Daily Emotional Check-ins",
                    Description = "Practice identifying and naming emotions throughout the day",
                    Category = "Emotional",
                    Priority = 5,
                    EstimatedDays = 14,
                    SuccessMetrics = new List<string> { "Daily emotion tracking", "Improved awareness" },
                    Milestones = new List<string> { "Complete 3 days", "Identify patterns" }
                }
            };
        }

        private static List<TherapeuticGoalDto> GenerateLongTermGoals(PersonalityProfileDto personalityProfile, Dictionary<string, object> emotionalPatterns)
        {
            return new List<TherapeuticGoalDto>
            {
                new TherapeuticGoalDto
                {
                    Title = "Emotional Resilience Building",
                    Description = "Develop stronger emotional resilience and coping skills",
                    Category = "Emotional",
                    Priority = 4,
                    EstimatedDays = 90,
                    SuccessMetrics = new List<string> { "Improved emotional stability", "Better stress management" },
                    Milestones = new List<string> { "Develop coping toolkit", "Practice resilience techniques" }
                }
            };
        }

        private static List<ActionPlanDto> CreateActionPlans(List<TherapeuticGoalDto> shortTermGoals, List<TherapeuticGoalDto> longTermGoals, PersonalityProfileDto personalityProfile)
        {
            return new List<ActionPlanDto>
            {
                new ActionPlanDto
                {
                    GoalTitle = shortTermGoals.FirstOrDefault()?.Title ?? "Emotional Awareness",
                    Steps = new List<string> { "Morning emotion check-in" },
                    Resources = new List<string> { "Emotion tracking app", "Journal" },
                    PotentialObstacles = new List<string> { "Forgetting to check in" },
                    CopingStrategies = new List<string> { "Set daily reminders" }
                }
            };
        }

        private static List<string> SuggestTherapeuticApproaches(Dictionary<string, object> emotionalPatterns)
        {
            return new List<string>
            {
                "Cognitive Behavioral Therapy (CBT)",
                "Mindfulness-Based Stress Reduction (MBSR)",
                "Acceptance and Commitment Therapy (ACT)"
            };
        }

        private static CrisisRiskPredictionDto PredictCrisisRisk(List<JournalEntry> historicalJournals, List<MoodEntry> historicalMoods, int predictionDays)
        {
            var riskProbability = 20.0; // Default low risk
            var riskLevel = CrisisLevel.Low;
            
            // Simple prediction based on recent patterns using EmotionalState
            var recentNegativeEntries = historicalJournals.Count(x => 
                x.EmotionalState == EmotionalState.VeryNegative || 
                x.EmotionalState == EmotionalState.Negative ||
                x.MoodScore <= 3);
                
            if (recentNegativeEntries > historicalJournals.Count * 0.6)
            {
                riskProbability = 70.0;
                riskLevel = CrisisLevel.Medium;
            }
            
            return new CrisisRiskPredictionDto
            {
                PredictedRiskLevel = riskLevel,
                RiskProbability = riskProbability,
                HighRiskPeriods = new List<DateTime>(),
                RiskFactors = new List<string> { "Recent negative emotional patterns" },
                ProtectiveFactors = new List<string> { "Active self-reflection through journaling" }
            };
        }

        private static List<TriggerPatternDto> IdentifyTriggerPatterns(List<JournalEntry> historicalJournals, List<MoodEntry> historicalMoods)
        {
            return new List<TriggerPatternDto>
            {
                new TriggerPatternDto
                {
                    TriggerType = "Time-based",
                    Description = "Evening mood drops",
                    Frequency = 3,
                    Severity = 0.6,
                    RelatedEmotions = new List<string> { "Sadness", "Anxiety" },
                    CommonContexts = new List<string> { "End of day reflection" }
                }
            };
        }

        private static List<EarlyWarningSignalDto> DetectEarlyWarningSignals(List<JournalEntry> historicalJournals, List<MoodEntry> historicalMoods)
        {
            return new List<EarlyWarningSignalDto>
            {
                new EarlyWarningSignalDto
                {
                    SignalType = "Emotional Pattern",
                    Description = "Consecutive negative emotional states",
                    DaysBeforeCrisis = 3,
                    ReliabilityScore = 0.75,
                    DetectionMethods = new List<string> { "Journal analysis", "Mood tracking" }
                }
            };
        }

        private static List<PreventionStrategyDto> GeneratePreventionStrategies(List<TriggerPatternDto> triggerPatterns, List<EarlyWarningSignalDto> earlyWarningSignals)
        {
            return new List<PreventionStrategyDto>
            {
                new PreventionStrategyDto
                {
                    StrategyName = "Mindfulness Practice",
                    Description = "Daily mindfulness meditation to improve emotional regulation",
                    TriggerEvent = "Evening mood decline",
                    ActionSteps = new List<string> { "10-minute meditation", "Deep breathing exercises" },
                    RequiredResources = new List<string> { "Meditation app", "Quiet space" },
                    EffectivenessScore = 0.8
                }
            };
        }

        private static int CalculateOptimalCheckInFrequency(CrisisRiskPredictionDto riskPrediction)
        {
            return riskPrediction.PredictedRiskLevel switch
            {
                CrisisLevel.High => 6,    // Every 6 hours
                CrisisLevel.Medium => 12, // Every 12 hours
                CrisisLevel.Low => 24,    // Daily
                _ => 48                   // Every 2 days
            };
        }

        private static List<string> GenerateSupportNetworkRecommendations(CrisisRiskPredictionDto riskPrediction)
        {
            var recommendations = new List<string>();
            
            if (riskPrediction.PredictedRiskLevel >= CrisisLevel.Medium)
            {
                recommendations.Add("Schedule regular check-ins with a trusted friend or family member");
                recommendations.Add("Consider joining a support group");
            }
            
            recommendations.Add("Build a network of 3-5 supportive contacts");
            recommendations.Add("Create a crisis contact list");
            
            return recommendations;
        }

        private static double CalculatePredictionConfidence(int journalCount, int moodCount)
        {
            var totalDataPoints = journalCount + moodCount;
            return Math.Min(0.9, totalDataPoints / 100.0); // Max 90% confidence
        }

        private static RiskPredictionDto ConvertToRiskPredictionDto(CrisisRiskPredictionDto crisisRisk)
        {
            return new RiskPredictionDto
            {
                RiskLevel = crisisRisk.PredictedRiskLevel.ToString(),
                RiskScore = crisisRisk.RiskProbability,
                RiskFactors = crisisRisk.RiskFactors,
                ProtectiveFactors = crisisRisk.ProtectiveFactors,
                PredictionDays = 7 // Default prediction days
            };
        }

        private static List<CrisisTriggerPatternDto> ConvertToCrisisTriggerPatternDtos(List<TriggerPatternDto> triggerPatterns)
        {
            return triggerPatterns.Select(tp => new CrisisTriggerPatternDto
            {
                PatternName = tp.TriggerType,
                Description = tp.Description,
                Frequency = tp.Frequency,
                Severity = tp.Severity.ToString(),
                TypicalTriggers = tp.RelatedEmotions
            }).ToList();
        }

        #endregion

        #endregion
    }
}
