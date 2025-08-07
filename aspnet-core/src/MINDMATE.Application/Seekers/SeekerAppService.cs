using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using MINDMATE.Seekers.Dto;
using System;
using System.Linq;
using System.Threading.Tasks;

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

        public SeekerAppService(
            IRepository<Seeker, Guid> repository,
            SeekerManager seekerManager,
            EmailService.IEmailSender emailSender
        ) : base(repository)
        {
            _seekerManager = seekerManager;
            _emailSender = emailSender;
        }

        public override async Task<SeekerDto> CreateAsync(CreateSeekerDto input)
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

            // Send welcome email
            var subject = "🎉 Welcome to MindMate! 🎉";
            var name = input.DisplayName ?? input.Name;
            var plainTextContent = $"Hey {name}! We're absolutely thrilled you chose MindMate. Get ready for an awesome journey—your mental health matters and we're here to make it fun, supportive, and inspiring. Dive in, explore, and let MindMate be your companion for a happier, healthier you! 🚀";
            var htmlContent = $"<div style='font-family:sans-serif;font-size:1.1em;'><h2>Hey {name}! 👋</h2><p>We're <strong>absolutely thrilled</strong> you chose <span style='color:#4F8A8B;'>MindMate</span>.<br><br>Get ready for an <span style='color:#F9A826;'>awesome journey</span>—your mental health matters and we're here to make it <strong>fun, supportive, and inspiring</strong>.<br><br>🚀 Dive in, explore, and let MindMate be your companion for a happier, healthier you!<br><br><em>Welcome to the MindMate family!</em></p></div>";
            await _emailSender.SendEmailAsync(input.Email, subject, plainTextContent, htmlContent);

            return MapToEntityDto(seeker);
        }

        // Additional custom method
        public async Task UpdateRiskByAssessmentAsync(Guid seekerId, AssessmentType type, int score)
        {
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, type, score);
        }

        // Additional custom method
        public async Task EvaluateAndUpdateRiskAsync(Guid seekerId, int phq9Score, int gad7Score)
        {
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, AssessmentType.PHQ9, phq9Score);
            await _seekerManager.UpdateAssessmentRiskLevelAsync(seekerId, AssessmentType.GAD7, gad7Score);
        }


        [AbpAuthorize]
        public async Task<SeekerDashboardDto> GetMyDashboardAsync()
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException("User is not logged in.");

            var seeker = await Repository
                .GetAllIncluding(s => s.Moods, s => s.AssessmentResults, s => s.JournalEntries)
                .FirstOrDefaultAsync(s => s.UserId == AbpSession.UserId.Value);

            if (seeker == null)
                throw new UserFriendlyException("Seeker not found.");

            var dashboard = new SeekerDashboardDto
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

            return dashboard;
        }

    }
}
