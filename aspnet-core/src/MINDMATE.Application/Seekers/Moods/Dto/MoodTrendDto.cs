using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Moods.Dto
{
    public class MoodTrendSummaryDto
    {
        public MoodLevel? AverageMood { get; set; }
        public MoodTrendDirection? MoodTrend { get; set; }
        public int EntryCount { get; set; }
    }

}
