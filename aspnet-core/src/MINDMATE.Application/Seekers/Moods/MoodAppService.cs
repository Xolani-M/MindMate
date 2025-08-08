using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Timing;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Seekers;
using MINDMATE.Seekers.Moods.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MINDMATE.Seekers.Moods
{
    public class MoodAppService : ApplicationService
    {
        private readonly MoodManager _moodManager;
        private readonly IRepository<MoodEntry, Guid> _moodRepository;
        private readonly IRepository<Seeker, Guid> _seekerRepository;

        public MoodAppService(MoodManager moodManager, IRepository<MoodEntry, Guid> moodRepository, IRepository<Seeker, Guid> seekerRepository)
        {
            _moodManager = moodManager;
            _moodRepository = moodRepository;
            _seekerRepository = seekerRepository;
        }

        // Helper to retrieve Seeker entity by logged-in user's UserId
        private async Task<Seeker> GetSeekerByUserIdAsync(long userId)
        {
            var seekers = await _seekerRepository.GetAllListAsync(s => s.UserId == userId);
            var seeker = seekers.FirstOrDefault();

            if (seeker == null)
            {
                throw new UserFriendlyException("Seeker not found for the current user.");
            }

            return seeker;
        }

        [AbpAuthorize]
        public async Task<MoodEntryDto> CreateAsync(CreateMoodEntryDto input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException("User is not logged in.");

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
            var entry = await _moodManager.RecordMoodAsync(seeker.Id, input.Level, input.Notes);
            return ObjectMapper.Map<MoodEntryDto>(entry);
        }

        [AbpAuthorize]
        [UnitOfWork]
        public async Task<ListResultDto<MoodEntryDto>> GetRecentAsync(int days = 30)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException("User is not logged in.");

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
            var since = Clock.Now.AddDays(-days);

            var entries = await _moodRepository
                .GetAllListAsync(e => e.SeekerId == seeker.Id && e.EntryDate >= since);
            
            var sortedEntries = entries.OrderByDescending(e => e.EntryDate).ToList();

            return new ListResultDto<MoodEntryDto>(ObjectMapper.Map<List<MoodEntryDto>>(sortedEntries));
        }

        [AbpAuthorize]
        public async Task<MoodTrendSummaryDto> GetMoodTrendAsync(int days = 7)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException("User is not logged in.");

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
            var summary = await _moodManager.AnalyzeMoodTrendAsync(seeker.Id, days);
            return ObjectMapper.Map<MoodTrendSummaryDto>(summary);
        }

    }
}
