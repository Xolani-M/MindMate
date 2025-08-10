using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Timing;
using MINDMATE.Domain.Seekers;
using System;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Journals
{
    public class JournalManager : DomainService
    {
        private readonly IRepository<JournalEntry, Guid> _journalRepository;
        private readonly IRepository<Seeker, Guid> _seekerRepository;

        public JournalManager(
            IRepository<JournalEntry, Guid> journalRepository,
            IRepository<Seeker, Guid> seekerRepository)
        {
            _journalRepository = journalRepository;
            _seekerRepository = seekerRepository;
        }

        public async Task<JournalEntry> CreateEntryAsync(Guid seekerId, string text, int moodScore, string emotion)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);

            var entry = new JournalEntry
            {
                SeekerId = seekerId,
                EntryText = text,
                MoodScore = moodScore,
                Emotion = emotion,
                EntryDate = Clock.Now
            };

            // Auto-derive emotional state based on emotion string and mood score
            entry.DeriveEmotionalState();

            await _journalRepository.InsertAsync(entry);
            return entry;
        }
        public async Task<JournalEntry> UpdateEntryAsync(Guid entryId, string newText, int newMoodScore, string newEmotion)
        {
            var entry = await _journalRepository.GetAsync(entryId);
            entry.EntryText = newText;
            entry.MoodScore = newMoodScore;
            entry.Emotion = newEmotion;
            entry.LastModificationTime = Clock.Now;
            
            // Auto-derive emotional state based on updated emotion string and mood score
            entry.DeriveEmotionalState();
            
            await _journalRepository.UpdateAsync(entry);
            return entry;
        }

        public async Task DeleteEntryAsync(Guid entryId)
        {
            var entry = await _journalRepository.GetAsync(entryId);
            await _journalRepository.DeleteAsync(entry);
        }
    }
}
