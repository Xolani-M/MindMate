using Abp.Domain.Entities.Auditing;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Enums;
using System;

namespace MINDMATE.Domain.Journals
{
    public class JournalEntry : FullAuditedEntity<Guid>
    {
        public Guid SeekerId { get; set; }
        public virtual Seeker Seeker { get; set; }
        public DateTime EntryDate { get; set; }
        public string EntryText { get; set; }
        public int MoodScore { get; set; }  // e.g., 1–10
        public string Emotion { get; set; } // e.g., "Anxious", "Happy"
        public EmotionalState EmotionalState { get; set; } = EmotionalState.Neutral; // Auto-populated based on Emotion

        /// <summary>
        /// Auto-populates EmotionalState based on the Emotion string and MoodScore
        /// Call this method after setting Emotion or MoodScore
        /// </summary>
        public void DeriveEmotionalState()
        {
            if (string.IsNullOrEmpty(Emotion))
            {
                EmotionalState = MoodScore switch
                {
                    <= 2 => EmotionalState.VeryNegative,
                    <= 4 => EmotionalState.Negative,
                    5 => EmotionalState.Neutral,
                    <= 7 => EmotionalState.Positive,
                    _ => EmotionalState.VeryPositive
                };
                return;
            }

            var emotion = Emotion.ToLower().Trim();
            
            // Map emotion strings to emotional states
            EmotionalState = emotion switch
            {
                // Very Negative emotions
                var e when e.Contains("suicidal") || e.Contains("hopeless") || e.Contains("devastated") 
                        || e.Contains("despair") || e.Contains("worthless") => EmotionalState.VeryNegative,
                
                // Negative emotions
                var e when e.Contains("sad") || e.Contains("depressed") || e.Contains("anxious") 
                        || e.Contains("angry") || e.Contains("frustrated") || e.Contains("stressed")
                        || e.Contains("worried") || e.Contains("upset") || e.Contains("overwhelmed") => EmotionalState.Negative,
                
                // Slightly Negative emotions
                var e when e.Contains("tired") || e.Contains("bored") || e.Contains("irritated")
                        || e.Contains("uneasy") || e.Contains("confused") || e.Contains("disappointed") => EmotionalState.SlightlyNegative,
                
                // Positive emotions
                var e when e.Contains("happy") || e.Contains("joy") || e.Contains("excited")
                        || e.Contains("pleased") || e.Contains("satisfied") || e.Contains("good")
                        || e.Contains("content") || e.Contains("cheerful") => EmotionalState.Positive,
                
                // Very Positive emotions
                var e when e.Contains("ecstatic") || e.Contains("thrilled") || e.Contains("elated")
                        || e.Contains("amazing") || e.Contains("fantastic") || e.Contains("euphoric") => EmotionalState.VeryPositive,
                
                // Slightly Positive emotions
                var e when e.Contains("okay") || e.Contains("fine") || e.Contains("calm")
                        || e.Contains("peaceful") || e.Contains("hopeful") => EmotionalState.SlightlyPositive,
                
                // Default to neutral
                _ => EmotionalState.Neutral
            };

            // Adjust based on mood score if it conflicts significantly
            if (MoodScore <= 3 && (EmotionalState == EmotionalState.Positive || EmotionalState == EmotionalState.VeryPositive))
            {
                EmotionalState = EmotionalState.Negative;
            }
            else if (MoodScore >= 8 && (EmotionalState == EmotionalState.Negative || EmotionalState == EmotionalState.VeryNegative))
            {
                EmotionalState = EmotionalState.Positive;
            }
        }
    }
}