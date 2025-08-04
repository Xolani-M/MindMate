using MINDMATE.Domain.Enums;
using System;

namespace MINDMATE.Domain.Assessments
{
    public static class AssessmentSuggester
    {
        public static string[] GetSuggestions(AssessmentType type, int score)
        {
            if (type == AssessmentType.PHQ9 && score >= 10)
                return new[] { "Talk to a counselor", "Watch CBT videos", "Practice daily journaling" };

            if (type == AssessmentType.GAD7 && score >= 10)
                return new[] { "Try breathing exercises", "Use meditation apps", "Consider speaking to a mental health coach" };

            return Array.Empty<string>();
        }
    }
}
