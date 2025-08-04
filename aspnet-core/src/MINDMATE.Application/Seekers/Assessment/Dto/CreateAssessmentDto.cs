using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Enums;
using MINDMATE.Seekers.Assessment.Dto;

namespace MINDMATE.Application.Seekers.Assessment.Dto
{
    public class CreateAssessmentDto
    {
        [Required]
        public Guid SeekerId { get; set; }

        [Required]
        public AssessmentType Type { get; set; }

        public List<AssessmentAnswerDto> Answers { get; set; }
        [Range(0, 27)] // PHQ9 max
        public int Score { get; set; }

        public string Notes { get; set; }
    }
}
