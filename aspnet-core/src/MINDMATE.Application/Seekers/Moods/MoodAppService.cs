using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Timing;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Domain.Moods;
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

        public MoodAppService(MoodManager moodManager, IRepository<MoodEntry, Guid> moodRepository)
        {
            _moodManager = moodManager;
            _moodRepository = moodRepository;
        }

        public async Task<MoodEntryDto> CreateAsync(CreateMoodEntryDto input)
        {
            var entry = await _moodManager.RecordMoodAsync(input.SeekerId, input.Level, input.Notes);
            return ObjectMapper.Map<MoodEntryDto>(entry);
        }

        [UnitOfWork]
        public async Task<ListResultDto<MoodEntryDto>> GetRecentAsync(Guid seekerId, int days = 30)
        {
            var since = Clock.Now.AddDays(-days);

            var entries = await _moodRepository
                .GetAll()
                .Where(e => e.SeekerId == seekerId && e.EntryDate >= since)
                .OrderByDescending(e => e.EntryDate)
                .ToListAsync();

            return new ListResultDto<MoodEntryDto>(ObjectMapper.Map<List<MoodEntryDto>>(entries));
        }

        public async Task<MoodTrendSummaryDto> GetMoodTrendAsync(Guid seekerId, int days = 7)
        {
            var summary = await _moodManager.AnalyzeMoodTrendAsync(seekerId, days);
            return ObjectMapper.Map<MoodTrendSummaryDto>(summary);
        }

    }
}
