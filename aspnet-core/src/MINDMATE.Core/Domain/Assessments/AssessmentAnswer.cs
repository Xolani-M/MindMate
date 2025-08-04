using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentAnswer : Entity<Guid>
    {
        public Guid AssessmentResultId { get; set; }
        public int QuestionNumber { get; private set; }
        public int SelectedOptionScore { get; private set; }
        public string SelectedOptionText { get; private set; }
        public virtual AssessmentResult AssessmentResult { get; set; }

        protected AssessmentAnswer() { }
        public AssessmentAnswer(int questionNumber, int selectedOptionScore, string selectedOptionText)
        {
            QuestionNumber = questionNumber;
            SelectedOptionScore = selectedOptionScore;
            SelectedOptionText = selectedOptionText ?? throw new ArgumentNullException(nameof(selectedOptionText));
        }
    }
}
