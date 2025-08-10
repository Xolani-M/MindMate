using System;
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
        private const string UserNotLoggedInMessage = "User is not logged in.";

        public SeekerAppService(
            IRepository<Seeker, Guid> repository,
            SeekerManager seekerManager,
            EmailService.IEmailSender emailSender)
            : base(repository)
        {
            _seekerManager = seekerManager ?? throw new ArgumentNullException(nameof(seekerManager));
            _emailSender = emailSender ?? throw new ArgumentNullException(nameof(emailSender));
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

            // Combine moods from MoodEntry and JournalEntry
            var moodEntries = seeker.Moods?.Select(m => new { Date = m.EntryDate, Score = (int)m.Level }) ?? Enumerable.Empty<dynamic>();
            var journalMoods = seeker.JournalEntries?.Where(j => j.MoodScore > 0)
                .Select(j => new { Date = j.EntryDate, Score = j.MoodScore }) ?? Enumerable.Empty<dynamic>();

            var allMoods = moodEntries.Concat(journalMoods).ToList();

            var latestMood = allMoods.OrderByDescending(m => m.Date).FirstOrDefault();
            var averageMoodLast7Days = allMoods
                .Where(m => m.Date >= DateTime.Now.AddDays(-7))
                .Select(m => (int)m.Score)
                .DefaultIfEmpty()
                .Average();

            return new SeekerDashboardDto
            {
                TotalJournalEntries = seeker.JournalEntries?.Count ?? 0,
                LatestMood = latestMood != null ? latestMood.Score.ToString() : null,
                AverageMoodLast7Days = averageMoodLast7Days,
                RiskLevel = seeker.CurrentRiskLevel.ToString(),
                LatestPhq9Score = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.PHQ9)
                    .OrderByDescending(a => a.DateTaken)
                    .FirstOrDefault()?.Score,
                LatestGad7Score = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.GAD7)
                    .OrderByDescending(a => a.DateTaken)
                    .FirstOrDefault()?.Score,
                Name = seeker.Name,
                DisplayName = seeker.DisplayName
            };
        }



        /// <summary>
        /// Tests the AI integration with a simple emotional analysis
        /// This is a simplified test endpoint to demonstrate Gemini AI working
        /// </summary>
        /// <param name="text">Text to analyze (optional, uses sample text if empty)</param>
        /// <returns>Simple AI analysis result</returns>
        [AbpAuthorize]
        public async Task<object> TestAIAnalysisAsync(string text = "")
        {
            try
            {
                if (string.IsNullOrWhiteSpace(text))
                {
                    text = "I've been feeling anxious lately and having trouble sleeping. Work has been really stressful.";
                }

                // Use external analytics service for testing if needed
                var result = "AI analysis feature has been moved to dedicated SeekerAnalyticsAppService. Please use /api/services/app/SeekerAnalytics/GetAIEmotionalAnalysis endpoint instead.";
                
                return new
                {
                    success = true,
                    message = "AI analysis completed successfully!",
                    inputText = text,
                    analysisResult = result,
                    timestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    success = false,
                    message = "AI analysis failed: " + ex.Message,
                    inputText = text,
                    error = ex.ToString(),
                    timestamp = DateTime.UtcNow
                };
            }
        }

        [AbpAuthorize]
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


    }
}
