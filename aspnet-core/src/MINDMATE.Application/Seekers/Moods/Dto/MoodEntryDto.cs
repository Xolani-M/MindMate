using Abp.Application.Services.Dto;
using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Moods.Dto
{
    public class MoodEntryDto : EntityDto<Guid>
    {
        public Guid SeekerId { get; set; }
        public MoodLevel Level { get; set; }
        public string Notes { get; set; }
        public DateTime EntryDate { get; set; }
    }
}
