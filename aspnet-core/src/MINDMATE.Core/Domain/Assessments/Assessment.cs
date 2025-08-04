using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class Assessment : Entity<Guid>
    {
        public string Title { get; set; } // e.g., "PHQ-9"
        public string Description { get; set; }
        public AssessmentType Type { get; set; }

        public virtual ICollection<AssessmentQuestion> Questions { get; set; } = new List<AssessmentQuestion>();
    }

}
