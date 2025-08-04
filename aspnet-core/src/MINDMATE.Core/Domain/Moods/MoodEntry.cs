using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Moods
{
    public class MoodEntry : FullAuditedEntity<Guid>
    {
        public Guid SeekerId { get; set; }
        public virtual Seeker Seeker { get; set; }

        public MoodLevel Level { get; set; }
        public string Notes { get; set; }
        public DateTime EntryDate { get; set; }
    }

}
