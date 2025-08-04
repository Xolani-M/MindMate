using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using System;
using System.Collections.Generic;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentResult : FullAuditedEntity<Guid>
    {
        public Guid SeekerId { get; set; }
        public virtual Seeker Seeker { get; set; }
        public AssessmentType Type { get; set; }
        public virtual ICollection<AssessmentAnswer> Answers { get; set; } = new List<AssessmentAnswer>();
        private int _score;
        public int Score
        {
            get => _score;
            set
            {
                ValidateScore(value, Type);
                _score = value;
            }
        }
        public DateTime DateTaken { get; set; }
        public string Notes { get; set; }

        public static void ValidateScore(int score, AssessmentType type)
        {
            if (type == AssessmentType.PHQ9 && (score < 0 || score > 27))
                throw new ArgumentOutOfRangeException(nameof(score), "PHQ-9 score must be between 0 and 27.");
            if (type == AssessmentType.GAD7 && (score < 0 || score > 21))
                throw new ArgumentOutOfRangeException(nameof(score), "GAD-7 score must be between 0 and 21.");
        }
    }

}
