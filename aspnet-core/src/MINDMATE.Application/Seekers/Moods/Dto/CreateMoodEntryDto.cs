using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Moods.Dto
{
    public class CreateMoodEntryDto
    {
        public MoodLevel Level { get; set; }
        public string Notes { get; set; }
    }
}
