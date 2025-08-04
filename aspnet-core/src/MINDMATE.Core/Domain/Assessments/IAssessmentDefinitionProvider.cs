using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public interface IAssessmentDefinitionProvider
    {
        IReadOnlyList<AssessmentQuestion> GetAssessmentTemplate(AssessmentType type);
    }
}
