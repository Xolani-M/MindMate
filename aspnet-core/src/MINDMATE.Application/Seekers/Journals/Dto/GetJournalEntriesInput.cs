using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Journals.Dto
{
    public class GetJournalEntriesInput : PagedAndSortedResultRequestDto
    {
        [Required]
        public Guid SeekerId { get; set; }

        public string SearchText { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

}
