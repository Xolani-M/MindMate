using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Journals.Dto
{
    public class UpdateJournalEntryDto : EntityDto<Guid>
    {
        [Required]
        [StringLength(2000)]
        public string EntryText { get; set; }

        [Range(1, 10)]
        public int MoodScore { get; set; }

        [StringLength(100)]
        public string Emotion { get; set; }
    }

}
