using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
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
    public class JournalAppService : ApplicationService
    {
        private readonly JournalManager _journalManager;
        private readonly IRepository<JournalEntry, Guid> _journalRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="JournalAppService"/> class.
        /// </summary>
        public JournalAppService(
            JournalManager journalManager,
            IRepository<JournalEntry, Guid> journalRepository)
        {
            _journalManager = journalManager;
            _journalRepository = journalRepository;
        }

        /// <summary>
        /// Creates a new journal entry for a seeker.
        /// </summary>
        public async Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto input)
        {
            var entry = await _journalManager.CreateEntryAsync(
                input.SeekerId,
                input.EntryText,
                input.MoodScore,
                input.Emotion
            );

            return ObjectMapper.Map<JournalEntryDto>(entry);
        }
        /// <summary>
        /// Gets paged journal entries for a seeker, with optional search and date filters.
        /// </summary>
        public async Task<PagedResultDto<JournalEntryDto>> GetEntriesAsync(GetJournalEntriesInput input)
        {
            var query = _journalRepository.GetAll()
                .Where(e => e.SeekerId == input.SeekerId);

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
