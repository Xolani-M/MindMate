using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    namespace MINDMATE.Domain.Assessments
    {
        public class SeekerAnswer
        {
            public int QuestionNumber { get; }
            public int SelectedOptionScore { get; }

            public SeekerAnswer(int questionNumber, int selectedOptionScore)
            {
                QuestionNumber = questionNumber;
                SelectedOptionScore = selectedOptionScore;
            }
        }
    }

}
