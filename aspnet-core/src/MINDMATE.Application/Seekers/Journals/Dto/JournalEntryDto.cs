using Abp.Application.Services.Dto;
using MINDMATE.Domain.Enums;
using System;

namespace MINDMATE.Application.Seekers.Journals.Dto
{
    public class JournalEntryDto : EntityDto<Guid>
    {
        public Guid SeekerId { get; set; }
        public string EntryText { get; set; }
        public int MoodScore { get; set; }
        public string Emotion { get; set; }
        public EmotionalState EmotionalState { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime? LastModificationTime { get; set; }
        
        /// <summary>
        /// Emotional analysis results for this journal entry
        /// </summary>
        public EmotionalAnalysisDto EmotionalStateAnalysis { get; set; }
    }
}