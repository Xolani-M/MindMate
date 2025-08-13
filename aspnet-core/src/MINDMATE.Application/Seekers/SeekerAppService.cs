using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;

using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Assessments;
using MINDMATE.Seekers.Dto;

namespace MINDMATE.Application.Seekers
{
    public class SeekerAppService : AsyncCrudAppService<
        Seeker,
        SeekerDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateSeekerDto,
        SeekerDto>,
        Abp.Dependency.ITransientDependency
    {
        private readonly SeekerManager _seekerManager;
        private readonly EmailService.IEmailSender _emailSender;
        private readonly IRepository<JournalEntry, Guid> _journalEntryRepository;
        private readonly IRepository<MoodEntry, Guid> _moodEntryRepository;
        private readonly IRepository<AssessmentResult, Guid> _assessmentResultRepository;
        private const string UserNotLoggedInMessage = "User is not logged in.";

        public SeekerAppService(
            IRepository<Seeker, Guid> repository,
            SeekerManager seekerManager,
            EmailService.IEmailSender emailSender,
            IRepository<JournalEntry, Guid> journalEntryRepository,
            IRepository<MoodEntry, Guid> moodEntryRepository,
            IRepository<AssessmentResult, Guid> assessmentResultRepository)
            : base(repository)
        {
            _seekerManager = seekerManager ?? throw new ArgumentNullException(nameof(seekerManager));
            _emailSender = emailSender ?? throw new ArgumentNullException(nameof(emailSender));
            _journalEntryRepository = journalEntryRepository ?? throw new ArgumentNullException(nameof(journalEntryRepository));
            _moodEntryRepository = moodEntryRepository ?? throw new ArgumentNullException(nameof(moodEntryRepository));
            _assessmentResultRepository = assessmentResultRepository ?? throw new ArgumentNullException(nameof(assessmentResultRepository));
        }

        public override async Task<SeekerDto> CreateAsync(CreateSeekerDto input)
        {
            try
            {
                var seeker = await _seekerManager.CreateSeekerAsync(
                    input.Name,
                    input.Surname,
                    input.Email,
                    input.Password,
                    input.DisplayName,
                    input.EmergencyContactName,
                    input.EmergencyContactPhone
                );

                // Prepare email content using templates
                var name = input.DisplayName ?? input.Name;
                var subject = EmailService.EmailTemplates.Welcome.Subject;
                var plainTextContent = EmailService.EmailTemplates.Welcome.GetPlainTextContent(name);
                var htmlContent = EmailService.EmailTemplates.Welcome.GetHtmlContent(name);

                // Send welcome email asynchronously
                await _emailSender.SendEmailAsync(input.Email, subject, plainTextContent, htmlContent);

                return MapToEntityDto(seeker);
            }
            catch (Exception ex)
            {
                // Return a friendly error message, useful for debugging (SendAllExceptionsToClients=true in config)
                throw new UserFriendlyException("Failed to create seeker: " + ex.Message, ex);
            }
        }

        // Updates risk level based on one assessment type and score
        public async Task UpdateRiskByAssessmentAsync(Guid seekerId, AssessmentType type, int score)
        {
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, type, score);
        }

        // Updates risk level based on both PHQ9 and GAD7 scores
        public async Task EvaluateAndUpdateRiskAsync(Guid seekerId, int phq9Score, int gad7Score)
        {
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, AssessmentType.PHQ9, phq9Score);
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, AssessmentType.GAD7, gad7Score);
        }

        // Helper to retrieve Seeker entity by logged-in user's UserId
        private async Task<Seeker> GetSeekerByUserIdAsync(long userId)
        {
            var seeker = await (await Repository.GetAllIncludingAsync(
                s => s.Moods,
                s => s.AssessmentResults,
                s => s.JournalEntries))
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (seeker == null)
            {
                throw new UserFriendlyException("Seeker not found for the current user.");
            }

            return seeker;
        }

        [AbpAuthorize]
        public async Task<SeekerDashboardDto> GetMyDashboardAsync()
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);

            // Get mood entries and convert to strongly typed list
            var moodEntries = (seeker.Moods ?? Enumerable.Empty<Domain.Moods.MoodEntry>())
                .Select(m => new { Date = m.EntryDate, Score = (int)m.Level })
                .ToList();

            // Get journal mood scores (include all, even 0/null)
            var journalMoods = (seeker.JournalEntries ?? Enumerable.Empty<Domain.Journals.JournalEntry>())
                .Select(j => new { Date = j.EntryDate, Score = j.MoodScore })
                .ToList();

            // Combine all mood data
            var allMoods = moodEntries.Concat(journalMoods).OrderByDescending(m => m.Date).ToList();

            // Calculate metrics
            var latestMood = allMoods.FirstOrDefault();
            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);
            var recentMoods = allMoods.Where(m => m.Date >= sevenDaysAgo).ToList();
            string averageMoodLast7Days = recentMoods.Any() ? Math.Round(recentMoods.Average(m => m.Score), 1).ToString("F1") : null;

            // Get latest assessment scores
            var assessmentResults = seeker.AssessmentResults ?? Enumerable.Empty<Domain.Assessments.AssessmentResult>();
            var latestPhq9 = assessmentResults
                .Where(a => a.Type == AssessmentType.PHQ9)
                .OrderByDescending(a => a.DateTaken)
                .FirstOrDefault();
            var latestGad7 = assessmentResults
                .Where(a => a.Type == AssessmentType.GAD7)
                .OrderByDescending(a => a.DateTaken)
                .FirstOrDefault();

            return new SeekerDashboardDto
            {
                TotalJournalEntries = seeker.JournalEntries?.Count ?? 0,
                LatestMood = latestMood != null ? latestMood.Score.ToString() : null,
                AverageMoodLast7Days = averageMoodLast7Days,
                RiskLevel = seeker.CurrentRiskLevel.ToString(),
                LatestPhq9Score = latestPhq9?.Score,
                LatestGad7Score = latestGad7?.Score,
                Name = seeker.Name,
                DisplayName = seeker.DisplayName
            };
        }

        /// <summary>
        /// Test method to seed demo data and check dashboard
        /// </summary>
        [AbpAuthorize]
        public async Task<string> TestDashboardDataAsync()
        {
            try
            {
                // Get current dashboard data before seeding
                var dashboardBefore = await GetMyDashboardAsync();
                
                return $"Dashboard data - Journals: {dashboardBefore.TotalJournalEntries}, Latest Mood: {dashboardBefore.LatestMood}, 7-Day Avg: {dashboardBefore.AverageMoodLast7Days}, Risk: {dashboardBefore.RiskLevel}, PHQ9: {dashboardBefore.LatestPhq9Score}, GAD7: {dashboardBefore.LatestGad7Score}";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }

        /// <summary>
        /// Get seeker profile for the current user
        /// </summary>
        public async Task<SeekerDto> GetMyProfileAsync()
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
            return MapToEntityDto(seeker);
        }

        [AbpAuthorize]
        public async Task<SeekerDto> UpdateMyProfileAsync(SeekerDto input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
            
            // Update the seeker properties
            seeker.Name = input.Name;
            seeker.Surname = input.Surname;
            seeker.Email = input.Email;
            seeker.DisplayName = input.DisplayName;
            seeker.EmergencyContactName = input.EmergencyContactName;
            seeker.EmergencyContactPhone = input.EmergencyContactPhone;

            await Repository.UpdateAsync(seeker);
            return MapToEntityDto(seeker);
        }

        /// <summary>
        /// DIAGNOSTIC METHOD FOR POSTMAN TESTING - NO AUTH REQUIRED
        /// Test method accessible without authentication to debug data availability
        /// Returns count of all data in database for debugging
        /// </summary>
        /// <returns>Database diagnostic information</returns>
        public async Task<Dictionary<string, object>> DiagnoseDatabaseAsync()
        {
            var result = new Dictionary<string, object>();

            try
            {
                // Count all seekers
                var totalSeekers = await Repository.CountAsync();
                result["TotalSeekers"] = totalSeekers;

                // Count all journal entries
                var totalJournalEntries = await _journalEntryRepository.CountAsync();
                result["TotalJournalEntries"] = totalJournalEntries;

                // Count all mood entries  
                var totalMoodEntries = await _moodEntryRepository.CountAsync();
                result["TotalMoodEntries"] = totalMoodEntries;

                // Count all assessment results
                var totalAssessmentResults = await _assessmentResultRepository.CountAsync();
                result["TotalAssessmentResults"] = totalAssessmentResults;

                // Show some sample data
                var sampleSeekers = await Repository.GetAllListAsync();
                result["SampleSeekers"] = sampleSeekers.Take(3).Select(s => new { s.Id, s.Name, s.Email, s.DisplayName }).ToList();

                var sampleJournalEntries = (await _journalEntryRepository.GetAllListAsync())
                    .OrderByDescending(j => j.EntryDate)
                    .Take(3)
                    .Select(j => new { j.SeekerId, j.EntryText, j.EntryDate, j.MoodScore })
                    .ToList();
                result["SampleJournalEntries"] = sampleJournalEntries;

                var sampleMoodEntries = (await _moodEntryRepository.GetAllListAsync())
                    .OrderByDescending(m => m.EntryDate)
                    .Take(3)
                    .Select(m => new { m.SeekerId, m.Level, m.EntryDate, m.Notes })
                    .ToList();
                result["SampleMoodEntries"] = sampleMoodEntries;

                var sampleAssessments = (await _assessmentResultRepository.GetAllListAsync())
                    .OrderByDescending(a => a.CreationTime)
                    .Take(3)
                    .Select(a => new { a.SeekerId, a.Type, Score = a.Score, a.CreationTime })
                    .ToList();
                result["SampleAssessments"] = sampleAssessments;

                result["Success"] = true;
                result["Timestamp"] = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                result["Error"] = ex.Message;
                result["StackTrace"] = ex.StackTrace;
            }

            return result;
        }


    }
}
