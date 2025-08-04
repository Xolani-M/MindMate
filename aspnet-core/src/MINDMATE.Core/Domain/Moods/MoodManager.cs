using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.Timing;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Moods
{
    public class MoodManager : DomainService
    {
        private readonly IRepository<MoodEntry, Guid> _moodRepository;
        private readonly SeekerManager _seekerManager;

        public MoodManager(IRepository<MoodEntry, Guid> moodRepository, SeekerManager seekerManager)
        {
            _moodRepository = moodRepository;
            _seekerManager = seekerManager;
        }

        [UnitOfWork]
        public async Task<MoodEntry> RecordMoodAsync(Guid seekerId, MoodLevel level, string notes = null)
        {
            var entry = new MoodEntry
            {
                SeekerId = seekerId,
                Level = level,
                Notes = notes,
                EntryDate = Clock.Now
            };

            await _moodRepository.InsertAsync(entry);

            //Analyze trend and update seeker risk
            var summary = await AnalyzeMoodTrendAsync(seekerId);
            await _seekerManager.UpdateMoodTrendAsync(seekerId, summary);

            return entry;
        }


        public async Task<MoodTrendSummary> AnalyzeMoodTrendAsync(Guid seekerId, int days = 7)
        {
            var since = Clock.Now.AddDays(-days);

            var entries = await _moodRepository
                .GetAll()
                .Where(x => x.SeekerId == seekerId && x.EntryDate >= since)
                .OrderBy(x => x.EntryDate)
                .ToListAsync();

            if (entries.Count < 2)
            {
                return new MoodTrendSummary(null, null, entries.Count);
            }

            var moodScores = entries.Select(x => (int)x.Level).ToList();

            int avg = (int)moodScores.Average();
            MoodLevel averageMood = (MoodLevel)avg;

            int trend = moodScores[^1] - moodScores[0];

            MoodTrendDirection direction;
            if (Math.Abs(trend) <= 1)
                direction = MoodTrendDirection.Stable;
            else if (trend > 1)
                direction = MoodTrendDirection.Improving;
            else
                direction = MoodTrendDirection.Declining;

            return new MoodTrendSummary(
                averageMood,
                direction,
                entries.Count
            );
        }

    }
}
