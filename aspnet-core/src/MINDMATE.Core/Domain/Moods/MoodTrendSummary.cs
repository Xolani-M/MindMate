using Abp.Domain.Values;
using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Moods
{
    public class MoodTrendSummary : ValueObject
    {
        public MoodLevel? AverageMood { get; private set; }
        public MoodTrendDirection? MoodTrend { get; private set; }
        public int EntryCount { get; private set; }

        private MoodTrendSummary() { }

        public MoodTrendSummary(MoodLevel? averageMood, MoodTrendDirection? moodTrend, int entryCount)
        {
            AverageMood = averageMood;
            MoodTrend = moodTrend;
            EntryCount = entryCount;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return AverageMood;
            yield return MoodTrend;
            yield return EntryCount;
        }
    }
}
