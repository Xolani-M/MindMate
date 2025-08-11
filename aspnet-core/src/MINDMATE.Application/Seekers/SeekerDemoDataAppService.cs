using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.Seekers
{
    /// <summary>
    /// Demo data seeding service for seeker analytics testing
    /// Creates sample data for dashboard and analytics demonstration
    /// </summary>
    [AbpAuthorize]
    public class SeekerDemoDataAppService : ApplicationService, Abp.Dependency.ITransientDependency
    {
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly IRepository<JournalEntry, Guid> _journalRepository;
        private readonly IRepository<MoodEntry, Guid> _moodRepository;
        private readonly IAbpSession _abpSession;

        public SeekerDemoDataAppService(
            IRepository<Seeker, Guid> seekerRepository,
            IRepository<JournalEntry, Guid> journalRepository,
            IRepository<MoodEntry, Guid> moodRepository,
            IAbpSession abpSession)
        {
            _seekerRepository = seekerRepository ?? throw new ArgumentNullException(nameof(seekerRepository));
            _journalRepository = journalRepository ?? throw new ArgumentNullException(nameof(journalRepository));
            _moodRepository = moodRepository ?? throw new ArgumentNullException(nameof(moodRepository));
            _abpSession = abpSession ?? throw new ArgumentNullException(nameof(abpSession));
        }

        /// <summary>
        /// Seeds demo data for the current authenticated user
        /// Creates sample journal entries and mood entries for analytics testing
        /// </summary>
        /// <returns>Success message</returns>
        public async Task<string> SeedDemoDataForCurrentUserAsync()
        {
            if (!_abpSession.UserId.HasValue)
            {
                throw new InvalidOperationException("User must be authenticated to seed demo data");
            }

            var seeker = await _seekerRepository.FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);
            if (seeker == null)
            {
                throw new InvalidOperationException("Seeker profile not found for current user");
            }

            // Clear existing demo data first
            await ClearExistingDemoDataAsync(seeker.Id);

            // Create sample journal entries (past 14 days)
            await CreateSampleJournalEntriesAsync(seeker.Id);
            
            // Create sample mood entries (past 30 days)
            await CreateSampleMoodEntriesAsync(seeker.Id);

            return "Demo data seeded successfully! Your analytics dashboard should now display sample data for testing purposes.";
        }

        /// <summary>
        /// Clears all demo data for the current user
        /// </summary>
        /// <returns>Success message</returns>
        public async Task<string> ClearDemoDataForCurrentUserAsync()
        {
            if (!_abpSession.UserId.HasValue)
            {
                throw new InvalidOperationException("User must be authenticated to clear demo data");
            }

            var seeker = await _seekerRepository.FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);
            if (seeker == null)
            {
                throw new InvalidOperationException("Seeker profile not found for current user");
            }

            await ClearExistingDemoDataAsync(seeker.Id);
            return "Demo data cleared successfully! Your analytics will now show actual data only.";
        }

        /// <summary>
        /// Checks demo data status for the current user
        /// </summary>
        /// <returns>Status message</returns>
        public async Task<string> GetDemoDataStatusAsync()
        {
            if (!_abpSession.UserId.HasValue)
            {
                return "User not authenticated";
            }

            var seeker = await _seekerRepository.FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);
            if (seeker == null)
            {
                return "Seeker profile not found";
            }

            var journalCount = await _journalRepository.CountAsync(j => j.SeekerId == seeker.Id);
            var moodCount = await _moodRepository.CountAsync(m => m.SeekerId == seeker.Id);

            return $"Demo data status: {journalCount} journal entries, {moodCount} mood entries. Use SeedDemoDataForCurrentUser to create sample data for analytics testing.";
        }

        #region Private Methods

        private async Task ClearExistingDemoDataAsync(Guid seekerId)
        {
            // Remove existing journal entries
            var existingJournals = await _journalRepository.GetAllListAsync(j => j.SeekerId == seekerId);
            foreach (var journal in existingJournals)
            {
                await _journalRepository.DeleteAsync(journal);
            }

            // Remove existing mood entries
            var existingMoods = await _moodRepository.GetAllListAsync(m => m.SeekerId == seekerId);
            foreach (var mood in existingMoods)
            {
                await _moodRepository.DeleteAsync(mood);
            }
        }

        private async Task CreateSampleJournalEntriesAsync(Guid seekerId)
        {
            var sampleEntries = new[]
            {
                new { Days = 1, EntryText = "Today was a great day! I felt motivated and accomplished several tasks. My mood was upbeat and I had good energy throughout the day. I'm grateful for the positive interactions I had.", Emotion = "happy", MoodScore = 8 },
                new { Days = 2, EntryText = "Experienced some anxiety about upcoming work presentations. The feeling started in the morning and lingered. I tried some breathing exercises which helped a little.", Emotion = "anxious", MoodScore = 4 },
                new { Days = 3, EntryText = "Had a balanced day overall. Some ups and downs but nothing too extreme. Managed to complete my daily routine and felt reasonably content.", Emotion = "content", MoodScore = 6 },
                new { Days = 5, EntryText = "Feeling overwhelmed with multiple deadlines approaching. My stress levels were high and I found it difficult to focus. Need to work on better time management.", Emotion = "overwhelmed", MoodScore = 3 },
                new { Days = 7, EntryText = "Had a particularly peaceful evening. Spent time reading and listening to music. Felt calm and centered. These quiet moments are becoming more important to me.", Emotion = "peaceful", MoodScore = 7 },
                new { Days = 9, EntryText = "Spent quality time with friends today. It reminded me how important social connections are for my wellbeing. I felt supported and understood.", Emotion = "happy", MoodScore = 8 },
                new { Days = 11, EntryText = "Today was challenging. Dealt with some difficult emotions and situations. I'm trying to practice self-compassion and remember that difficult days are part of life.", Emotion = "sad", MoodScore = 4 },
                new { Days = 14, EntryText = "Taking time to reflect on my personal growth journey. I can see progress in how I handle stress and emotions compared to a few months ago. Feeling hopeful about the future.", Emotion = "hopeful", MoodScore = 7 }
            };

            foreach (var entry in sampleEntries)
            {
                var journalEntry = new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = entry.EntryText,
                    Emotion = entry.Emotion,
                    MoodScore = entry.MoodScore,
                    EntryDate = DateTime.UtcNow.AddDays(-entry.Days),
                    CreationTime = DateTime.UtcNow.AddDays(-entry.Days),
                    IsDeleted = false
                };

                // Set the emotional state based on the emotion and mood score
                journalEntry.DeriveEmotionalState();

                await _journalRepository.InsertAsync(journalEntry);
            }
        }

        private async Task CreateSampleMoodEntriesAsync(Guid seekerId)
        {
            var random = new Random();
            
            // Create mood entries for the past 30 days
            for (int i = 1; i <= 30; i++)
            {
                // Generate realistic mood patterns
                MoodLevel moodLevel;
                var dayOfWeek = DateTime.UtcNow.AddDays(-i).DayOfWeek;
                
                // Weekends tend to be slightly better mood
                if (dayOfWeek == DayOfWeek.Saturday || dayOfWeek == DayOfWeek.Sunday)
                {
                    var weekendMood = random.Next(3, 6); // 3-5 range (better mood)
                    moodLevel = weekendMood switch
                    {
                        3 => MoodLevel.Neutral,
                        4 => MoodLevel.Happy,
                        _ => MoodLevel.VeryHappy
                    };
                }
                else
                {
                    var weekdayMood = random.Next(1, 5); // 1-4 range (varied weekday mood)
                    moodLevel = weekdayMood switch
                    {
                        1 => MoodLevel.VerySad,
                        2 => MoodLevel.Sad,
                        3 => MoodLevel.Neutral,
                        _ => MoodLevel.Happy
                    };
                }

                var moodEntry = new MoodEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    Level = moodLevel,
                    Notes = GenerateMoodNotes(moodLevel),
                    EntryDate = DateTime.UtcNow.AddDays(-i),
                    CreationTime = DateTime.UtcNow.AddDays(-i),
                    IsDeleted = false
                };

                await _moodRepository.InsertAsync(moodEntry);
            }
        }

        private static string GenerateMoodNotes(MoodLevel level)
        {
            return level switch
            {
                MoodLevel.VerySad => "Feeling quite down today, low energy",
                MoodLevel.Sad => "Below average mood, some difficulty with motivation",
                MoodLevel.Neutral => "Okay day, manageable mood",
                MoodLevel.Happy => "Good mood, feeling positive",
                MoodLevel.VeryHappy => "Great day, very upbeat and energetic",
                _ => "Average mood, nothing particularly notable"
            };
        }

        #endregion
    }
}
