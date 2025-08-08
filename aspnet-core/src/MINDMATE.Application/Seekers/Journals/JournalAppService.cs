using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Application.Seekers.Journals.Dto;
using MINDMATE.Domain.Journals;
using MINDMATE.Domain.Seekers;
using MINDMATE.Seekers.Journals.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MINDMATE.Application.Seekers.Journals
{
    /// <summary>
    /// Application service for managing journal entries for seekers.
    /// </summary>
    [AbpAuthorize]
    public class JournalAppService : ApplicationService
    {
        private readonly JournalManager _journalManager;
        private readonly IRepository<JournalEntry, Guid> _journalRepository;
        private readonly IRepository<Seeker, Guid> _seekerRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="JournalAppService"/> class.
        /// </summary>
        public JournalAppService(
            JournalManager journalManager,
            IRepository<JournalEntry, Guid> journalRepository,
            IRepository<Seeker, Guid> seekerRepository)
        {
            _journalManager = journalManager;
            _journalRepository = journalRepository;
            _seekerRepository = seekerRepository;
        }

        /// <summary>
        /// Gets the current user's seeker ID from session.
        /// </summary>
        private async Task<Guid> GetCurrentSeekerIdAsync()
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException("User is not logged in.");

            var seeker = await _seekerRepository
                .FirstOrDefaultAsync(s => s.UserId == AbpSession.UserId.Value);

            if (seeker == null)
                throw new UserFriendlyException("Seeker not found for the current user.");

            return seeker.Id;
        }

        /// <summary>
        /// Creates a new journal entry for the current user.
        /// </summary>
        public async Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto input)
        {
            var seekerId = await GetCurrentSeekerIdAsync();
            
            var entry = await _journalManager.CreateEntryAsync(
                seekerId,
                input.EntryText,
                input.MoodScore,
                input.Emotion
            );

            return ObjectMapper.Map<JournalEntryDto>(entry);
        }
        /// <summary>
        /// Gets paged journal entries for the current user, with optional search and date filters.
        /// </summary>
        public async Task<PagedResultDto<JournalEntryDto>> GetEntriesAsync(GetJournalEntriesInput input)
        {
            var seekerId = await GetCurrentSeekerIdAsync();
            
            var query = _journalRepository.GetAll()
                .Where(e => e.SeekerId == seekerId);

            if (!string.IsNullOrWhiteSpace(input.SearchText))
            {
                query = query.Where(e =>
                    e.EntryText.Contains(input.SearchText) ||
                    e.Emotion.Contains(input.SearchText));
            }

            if (input.FromDate.HasValue)
                query = query.Where(e => e.EntryDate >= input.FromDate.Value);

            if (input.ToDate.HasValue)
                query = query.Where(e => e.EntryDate <= input.ToDate.Value);

            var totalCount = await query.CountAsync();

            var entries = await query
                .OrderByDescending(e => e.EntryDate)
                .PageBy(input)
                .ToListAsync();

            var dtos = ObjectMapper.Map<List<JournalEntryDto>>(entries);

            return new PagedResultDto<JournalEntryDto>(totalCount, dtos);
        }

        /// <summary>
        /// Updates an existing journal entry.
        /// </summary>
        public async Task<JournalEntryDto> UpdateAsync(UpdateJournalEntryDto input)
        {
            var entry = await _journalManager.UpdateEntryAsync(
                input.Id,
                input.EntryText,
                input.MoodScore,
                input.Emotion
            );

            return ObjectMapper.Map<JournalEntryDto>(entry);
        }

        /// <summary>
        /// Deletes a journal entry by its ID.
        /// </summary>
        public async Task DeleteAsync(Guid entryId)
        {
            await _journalManager.DeleteEntryAsync(entryId);
        }
    }
}
