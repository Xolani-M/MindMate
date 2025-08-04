using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentAnswerOption
    {
        public int Score { get; private set; } // Score value for this answer option
        public string Text { get; private set; } // Text shown to user

        public AssessmentAnswerOption(int score, string text)
        {
            Score = score;
            Text = text ?? throw new ArgumentNullException(nameof(text));
        }
    }

}
