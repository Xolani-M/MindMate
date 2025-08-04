using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Seekers;
using System;

namespace MINDMATE.Domain.Journals
{
    public class JournalEntry : FullAuditedEntity<Guid>
    {
        public Guid SeekerId { get; set; }
        public virtual Seeker Seeker { get; set; }
        public DateTime EntryDate { get; set; }
        public string EntryText { get; set; }
        public int MoodScore { get; set; }  // e.g., 1–10
        public string Emotion { get; set; } // e.g., “Anxious”, “Happy”
    }
}
