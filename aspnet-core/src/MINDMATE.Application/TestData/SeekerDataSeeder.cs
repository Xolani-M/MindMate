using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Seekers;
using MINDMATE.Domain.Enums;

namespace MINDMATE.Application.TestData
{
    /// <summary>
    /// Seeds test data for seeker dashboard and analytics testing
    /// Creates realistic journal entries and mood entries for the current user
    /// </summary>
    public class SeekerDataSeeder : ITransientDependency
    {
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly IRepository<JournalEntry, Guid> _journalRepository;
        private readonly IRepository<MoodEntry, Guid> _moodRepository;
        private readonly IAbpSession _abpSession;

        public SeekerDataSeeder(
            IRepository<Seeker, Guid> seekerRepository,
            IRepository<JournalEntry, Guid> journalRepository,
            IRepository<MoodEntry, Guid> moodRepository,
            IAbpSession abpSession)
        {
            _seekerRepository = seekerRepository;
            _journalRepository = journalRepository;
            _moodRepository = moodRepository;
            _abpSession = abpSession;
        }

        /// <summary>
        /// Seeds test data for the current authenticated user
        /// </summary>
        public async Task SeedTestDataAsync()
        {
            if (!_abpSession.UserId.HasValue)
                throw new InvalidOperationException("User must be authenticated to seed test data.");

            var seeker = await _seekerRepository.FirstOrDefaultAsync(s => s.UserId == _abpSession.UserId.Value);
            if (seeker == null)
                throw new InvalidOperationException("Seeker profile not found for current user.");

            await SeedJournalEntriesAsync(seeker.Id);
            await SeedMoodEntriesAsync(seeker.Id);
        }

        private async Task SeedJournalEntriesAsync(Guid seekerId)
        {
            var journalEntries = new List<JournalEntry>
            {
                // Recent entries (last 7 days)
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Today was really challenging. I felt overwhelmed with work and couldn't focus. Had some anxiety about the upcoming presentation. Tried deep breathing but it only helped a little. Maybe I need to talk to someone about this.",
                    EntryDate = DateTime.UtcNow.AddDays(-1),
                    EmotionalState = EmotionalState.Negative,
                    Emotion = "anxious",
                    CreationTime = DateTime.UtcNow.AddDays(-1)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Had a good conversation with my friend today. We talked about my stress and they gave me some helpful advice. Feeling a bit more hopeful. Went for a walk in the evening which was refreshing.",
                    EntryDate = DateTime.UtcNow.AddDays(-2),
                    EmotionalState = EmotionalState.SlightlyPositive,
                    Emotion = "hopeful",
                    CreationTime = DateTime.UtcNow.AddDays(-2)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Woke up feeling tired and unmotivated. Everything seems difficult today. Even simple tasks feel overwhelming. I know this feeling will pass but it's hard right now. Trying to be gentle with myself.",
                    EntryDate = DateTime.UtcNow.AddDays(-3),
                    EmotionalState = EmotionalState.Negative,
                    Emotion = "sad",
                    CreationTime = DateTime.UtcNow.AddDays(-3)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Great day today! Finished the project I've been working on and my manager gave positive feedback. Feeling accomplished and proud of my work. Had dinner with family and enjoyed their company.",
                    EntryDate = DateTime.UtcNow.AddDays(-4),
                    EmotionalState = EmotionalState.Positive,
                    Emotion = "happy",
                    CreationTime = DateTime.UtcNow.AddDays(-4)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Feeling neutral today. Nothing particularly good or bad happened. Just going through the motions. Sometimes these quiet days are okay too. Practiced meditation for 10 minutes.",
                    EntryDate = DateTime.UtcNow.AddDays(-5),
                    EmotionalState = EmotionalState.Neutral,
                    Emotion = "calm",
                    CreationTime = DateTime.UtcNow.AddDays(-5)
                },

                // Older entries (1-2 weeks ago)
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Had a panic attack at work today. It was scary and embarrassing. I had to step outside to calm down. My heart was racing and I couldn't breathe properly. Need to work on coping strategies.",
                    EntryDate = DateTime.UtcNow.AddDays(-8),
                    EmotionalState = EmotionalState.VeryNegative,
                    Emotion = "panicked",
                    CreationTime = DateTime.UtcNow.AddDays(-8)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Spent the weekend hiking with friends. Nature always helps me feel better. The fresh air and exercise cleared my mind. Grateful for supportive friends who understand me.",
                    EntryDate = DateTime.UtcNow.AddDays(-10),
                    EmotionalState = EmotionalState.Positive,
                    Emotion = "grateful",
                    CreationTime = DateTime.UtcNow.AddDays(-10)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Starting to feel better after last week's difficult period. Sleep is improving and I'm eating more regularly. Small steps but they feel significant. Therapy session was helpful.",
                    EntryDate = DateTime.UtcNow.AddDays(-12),
                    EmotionalState = EmotionalState.SlightlyPositive,
                    Emotion = "improving",
                    CreationTime = DateTime.UtcNow.AddDays(-12)
                },

                // Older entries (3-4 weeks ago)
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Really struggling this week. Feel like I'm stuck in a dark place. Everything requires so much effort. Even getting out of bed is hard. Maybe I should reach out for professional help.",
                    EntryDate = DateTime.UtcNow.AddDays(-20),
                    EmotionalState = EmotionalState.VeryNegative,
                    Emotion = "depressed",
                    CreationTime = DateTime.UtcNow.AddDays(-20)
                },
                new JournalEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    EntryText = "Celebrating a small victory today - I went to the gym for the first time in weeks. It felt good to move my body and get endorphins flowing. Planning to make this a regular habit.",
                    EntryDate = DateTime.UtcNow.AddDays(-25),
                    EmotionalState = EmotionalState.Positive,
                    Emotion = "accomplished",
                    CreationTime = DateTime.UtcNow.AddDays(-25)
                }
            };

            foreach (var entry in journalEntries)
            {
                await _journalRepository.InsertAsync(entry);
            }
        }

        private async Task SeedMoodEntriesAsync(Guid seekerId)
        {
            var moodEntries = new List<MoodEntry>();
            
            // Create mood entries for the last 30 days
            for (int i = 0; i < 30; i++)
            {
                var date = DateTime.UtcNow.AddDays(-i);
                MoodLevel moodLevel;

                // Create realistic mood patterns
                if (i < 7) // Last week - mixed but generally improving
                {
                    moodLevel = i switch
                    {
                        0 => MoodLevel.Happy,        // Today
                        1 => MoodLevel.Sad,         // Yesterday  
                        2 => MoodLevel.Happy,        // 2 days ago
                        3 => MoodLevel.VerySad,     // 3 days ago
                        4 => MoodLevel.VeryHappy,    // 4 days ago
                        5 => MoodLevel.Neutral,     // 5 days ago
                        6 => MoodLevel.Sad,         // 6 days ago
                        _ => MoodLevel.Neutral
                    };
                }
                else if (i < 14) // Week 2 - gradual improvement
                {
                    moodLevel = (i % 3) switch
                    {
                        0 => MoodLevel.Sad,
                        1 => MoodLevel.Neutral,
                        2 => MoodLevel.Happy,
                        _ => MoodLevel.Neutral
                    };
                }
                else if (i < 21) // Week 3 - difficult period
                {
                    moodLevel = (i % 4) switch
                    {
                        0 => MoodLevel.VerySad,
                        1 => MoodLevel.Sad,
                        2 => MoodLevel.Sad,
                        3 => MoodLevel.Neutral,
                        _ => MoodLevel.Sad
                    };
                }
                else // Week 4 - mixed
                {
                    moodLevel = (i % 3) switch
                    {
                        0 => MoodLevel.Neutral,
                        1 => MoodLevel.Happy,
                        2 => MoodLevel.Sad,
                        _ => MoodLevel.Neutral
                    };
                }

                moodEntries.Add(new MoodEntry
                {
                    Id = Guid.NewGuid(),
                    SeekerId = seekerId,
                    Level = moodLevel,
                    EntryDate = date,
                    CreationTime = date,
                    Notes = GetMoodNotes(moodLevel)
                });
            }

            foreach (var entry in moodEntries)
            {
                await _moodRepository.InsertAsync(entry);
            }
        }

        private static string GetMoodNotes(MoodLevel level)
        {
            return level switch
            {
                MoodLevel.VerySad => "Feeling very down today",
                MoodLevel.Sad => "Not feeling great",
                MoodLevel.Neutral => "Okay day, nothing special",
                MoodLevel.Happy => "Feeling pretty good",
                MoodLevel.VeryHappy => "Great day!",
                _ => "Average mood"
            };
        }
    }
}
