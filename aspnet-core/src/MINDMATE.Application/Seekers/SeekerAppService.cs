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

            return new SeekerDashboardDto
            {
                TotalJournalEntries = seeker.JournalEntries?.Count ?? 0,
                LatestMood = seeker.Moods?
                    .OrderByDescending(m => m.EntryDate)
                    .FirstOrDefault()?.Level.ToString(),
                AverageMoodLast7Days = seeker.Moods?
                    .Where(m => m.EntryDate >= DateTime.Now.AddDays(-7))
                    .Select(m => (int)m.Level)
                    .DefaultIfEmpty()
                    .Average() ?? 0,
                RiskLevel = seeker.CurrentRiskLevel.ToString(),
                LatestPhq9Score = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.PHQ9)
                    .OrderByDescending(a => a.CreationTime)
                    .FirstOrDefault()?.Score,
                LatestGad7Score = seeker.AssessmentResults?
                    .Where(a => a.Type == AssessmentType.GAD7)
                    .OrderByDescending(a => a.CreationTime)
                    .FirstOrDefault()?.Score,
                Name = seeker.Name,
                DisplayName = seeker.DisplayName
            };
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
