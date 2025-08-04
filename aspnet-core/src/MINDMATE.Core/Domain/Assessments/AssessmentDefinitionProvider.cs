using Abp.Dependency;
using MINDMATE.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentDefinitionProvider : IAssessmentDefinitionProvider, ITransientDependency
    {
        public IReadOnlyList<AssessmentQuestion> GetAssessmentTemplate(AssessmentType type)
        {
            return type switch
            {
                AssessmentType.PHQ9 => GetPHQ9Questions(),
                AssessmentType.GAD7 => GetGAD7Questions(),
                _ => throw new ArgumentOutOfRangeException(nameof(type), "Unsupported assessment type")
            };
        }

        private List<AssessmentQuestion> GetPHQ9Questions()
        {
            var answerOptions = new List<AssessmentAnswerOption>
            {
                new AssessmentAnswerOption(0, "Not at all"),
                new AssessmentAnswerOption(1, "Several days"),
                new AssessmentAnswerOption(2, "More than half the days"),
                new AssessmentAnswerOption(3, "Nearly every day")
            };

            return new List<AssessmentQuestion>
            {
                new AssessmentQuestion(1, "Little interest or pleasure in doing things", answerOptions),
                new AssessmentQuestion(2, "Feeling down, depressed, or hopeless", answerOptions),
                new AssessmentQuestion(3, "Trouble falling or staying asleep, or sleeping too much", answerOptions),
                new AssessmentQuestion(4, "Feeling tired or having little energy", answerOptions),
                new AssessmentQuestion(5, "Poor appetite or overeating", answerOptions),
                new AssessmentQuestion(6, "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", answerOptions),
                new AssessmentQuestion(7, "Trouble concentrating on things, such as reading the newspaper or watching television", answerOptions),
                new AssessmentQuestion(8, "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual", answerOptions),
                new AssessmentQuestion(9, "Thoughts that you would be better off dead or of hurting yourself in some way", answerOptions)
            };
        }

        private List<AssessmentQuestion> GetGAD7Questions()
        {
            var answerOptions = new List<AssessmentAnswerOption>
            {
                new AssessmentAnswerOption(0, "Not at all"),
                new AssessmentAnswerOption(1, "Several days"),
                new AssessmentAnswerOption(2, "More than half the days"),
                new AssessmentAnswerOption(3, "Nearly every day")
            };

            return new List<AssessmentQuestion>
            {
                new AssessmentQuestion(1, "Feeling nervous, anxious or on edge", answerOptions),
                new AssessmentQuestion(2, "Not being able to stop or control worrying", answerOptions),
                new AssessmentQuestion(3, "Worrying too much about different things", answerOptions),
                new AssessmentQuestion(4, "Trouble relaxing", answerOptions),
                new AssessmentQuestion(5, "Being so restless that it is hard to sit still", answerOptions),
                new AssessmentQuestion(6, "Becoming easily annoyed or irritable", answerOptions),
                new AssessmentQuestion(7, "Feeling afraid as if something awful might happen", answerOptions)
            };
        }
    }
}
