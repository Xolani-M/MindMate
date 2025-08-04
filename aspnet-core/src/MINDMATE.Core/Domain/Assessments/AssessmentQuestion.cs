using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentQuestion
    {
        public int Number { get; private set; }  // Question number or order
        public string Text { get; private set; }
        public IReadOnlyList<AssessmentAnswerOption> AnswerOptions { get; private set; }

        public AssessmentQuestion(int number, string text, List<AssessmentAnswerOption> answerOptions)
        {
            Number = number;
            Text = text ?? throw new ArgumentNullException(nameof(text));
            AnswerOptions = answerOptions ?? throw new ArgumentNullException(nameof(answerOptions));
        }
    }

}
