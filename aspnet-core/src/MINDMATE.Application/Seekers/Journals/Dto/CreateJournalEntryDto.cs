using System;
using System.ComponentModel.DataAnnotations;

namespace MINDMATE.Application.Seekers.Journals.Dto
{
    public class CreateJournalEntryDto
    {
        [Required]
        public Guid SeekerId { get; set; }

        [Required]
        public string EntryText { get; set; }

        [Range(1, 10)]
        public int MoodScore { get; set; }

        public string Emotion { get; set; }
    }
}
