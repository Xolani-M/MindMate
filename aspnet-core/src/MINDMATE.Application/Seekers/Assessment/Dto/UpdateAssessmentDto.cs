using Abp.Application.Services.Dto;
using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Assessment.Dto
{
    public class UpdateAssessmentDto : IEntityDto<Guid>
    {
        public Guid Id { get; set; }

        [Required]
        public Guid SeekerId { get; set; }

        [Required]
        public AssessmentType Type { get; set; }

        [Required]
        public List<AssessmentAnswerDto> Answers { get; set; }

        public string Notes { get; set; }
    }
}
