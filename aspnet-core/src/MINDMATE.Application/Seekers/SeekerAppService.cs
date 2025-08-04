using Abp.Application.Services;
using Abp.Application.Services.Dto;
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

        public SeekerAppService(
            IRepository<Seeker, Guid> repository,
            SeekerManager seekerManager
        ) : base(repository)
        {
            _seekerManager = seekerManager;
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


        public async Task<SeekerDashboardDto> GetDashboardAsync(Guid seekerId)
        {
            var seeker = await Repository
                .GetAllIncluding(s => s.Moods, s => s.AssessmentResults, s => s.JournalEntries)
                .FirstOrDefaultAsync(s => s.Id == seekerId);

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
