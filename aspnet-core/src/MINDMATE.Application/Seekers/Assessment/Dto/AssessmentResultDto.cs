using Abp.Application.Services.Dto;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Enums;
using System;

namespace MINDMATE.Application.Seekers.Assessment.Dto
{
    public class AssessmentResultDto : IEntityDto<Guid>
    {
        public Guid Id { get; set; }
        public AssessmentType Type { get; set; }
        public string[] Suggestions { get; set; }
        public int Score { get; set; }
        public DateTime DateTaken { get; set; }
        public string Notes { get; set; }
    }
}
