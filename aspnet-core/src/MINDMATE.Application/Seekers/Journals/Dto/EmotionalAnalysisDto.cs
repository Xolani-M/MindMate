using System.Collections.Generic;

namespace MINDMATE.Application.Seekers.Journals.Dto
{
    /// <summary>
    /// DTO for emotional analysis results from journal entries
    /// </summary>
    public class EmotionalAnalysisDto
    {
        public string DetectedState { get; set; } = "";
        public double PositiveScore { get; set; }
        public double NegativeScore { get; set; }
        public double IntensityMultiplier { get; set; } = 1.0;
        public List<string> DetectedEmotions { get; set; } = new List<string>();
        public string RecommendedApproach { get; set; } = "";
    }
}
