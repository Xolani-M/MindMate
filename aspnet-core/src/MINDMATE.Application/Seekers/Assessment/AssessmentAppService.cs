using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using MINDMATE.Application.Seekers.Assessment.Dto;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Assessments.MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Seekers;
using MINDMATE.Seekers.Assessment.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MINDMATE.Application.Seekers.Assessments
{
    public class AssessmentAppService :
        AsyncCrudAppService<
            AssessmentResult,
            AssessmentResultDto,         
            Guid,                      
            PagedAndSortedResultRequestDto,
            CreateAssessmentDto,          
            UpdateAssessmentDto           
        >
    {
        private readonly AssessmentManager _assessmentManager;
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private const string UserNotLoggedInMessage = "User is not logged in.";

        public AssessmentAppService(
            IRepository<AssessmentResult, Guid> repository,
            AssessmentManager assessmentManager,
            IRepository<Seeker, Guid> seekerRepository)
            : base(repository)
        {
            _assessmentManager = assessmentManager;
            _seekerRepository = seekerRepository;
        }

        // Helper to retrieve Seeker entity by logged-in user's UserId
        private async Task<Seeker> GetSeekerByUserIdAsync(long userId)
        {
            var seekers = await _seekerRepository.GetAllListAsync(s => s.UserId == userId);
            var seeker = seekers.FirstOrDefault();

            if (seeker == null)
            {
                throw new UserFriendlyException("Seeker not found for the current user.");
            }

            return seeker;
        }

        [AbpAuthorize]
        public override async Task<AssessmentResultDto> CreateAsync(CreateAssessmentDto input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            try
            {
                var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);
                
                var seekerAnswers = input.Answers
                    .Select(a => new SeekerAnswer(a.QuestionNumber, a.SelectedOptionScore))
                    .ToList();

                var result = await _assessmentManager.RecordAssessmentAsync(
                    seeker.Id,
                    input.Type,
                    seekerAnswers,
                    input.Notes
                );

                var dto = ObjectMapper.Map<AssessmentResultDto>(result);
                dto.Suggestions = AssessmentSuggester.GetSuggestions(result.Type, result.Score);

                return dto;
            }
            catch (Exception ex)
            {
                // Log ex.Message or return a custom error response if you have a wrapper
                throw new UserFriendlyException("Failed to create assessment: " + ex.Message);
            }
        }

        [AbpAuthorize]
        public override async Task<PagedResultDto<AssessmentResultDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);

            var query = Repository.GetAll()
                .Include(a => a.Answers)
                .Where(a => a.SeekerId == seeker.Id);

            var totalCount = await query.CountAsync();

            var assessments = await query
                .OrderByDescending(a => a.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            var dtos = assessments.Select(a =>
            {
                var dto = ObjectMapper.Map<AssessmentResultDto>(a);
                dto.Suggestions = AssessmentSuggester.GetSuggestions(a.Type, a.Score);
                return dto;
            }).ToList();

            return new PagedResultDto<AssessmentResultDto>(totalCount, dtos);
        }

        [AbpAuthorize]
        public override async Task<AssessmentResultDto> GetAsync(EntityDto<Guid> input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);

            var assessment = await Repository.GetAll()
                .Include(a => a.Answers)
                .FirstOrDefaultAsync(a => a.Id == input.Id && a.SeekerId == seeker.Id);

            if (assessment == null)
                throw new UserFriendlyException("Assessment not found or you don't have permission to access it.");

            var dto = ObjectMapper.Map<AssessmentResultDto>(assessment);
            dto.Suggestions = AssessmentSuggester.GetSuggestions(assessment.Type, assessment.Score);

            return dto;
        }

        [AbpAuthorize]
        public override async Task<AssessmentResultDto> UpdateAsync(UpdateAssessmentDto input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);

            var assessment = await Repository.GetAll()
                .Include(a => a.Answers)
                .FirstOrDefaultAsync(a => a.Id == input.Id && a.SeekerId == seeker.Id);

            if (assessment == null)
                throw new UserFriendlyException("Assessment not found or you don't have permission to update it.");

            // Update only notes as scores should not be changed after submission
            assessment.Notes = input.Notes;

            await Repository.UpdateAsync(assessment);

            var dto = ObjectMapper.Map<AssessmentResultDto>(assessment);
            dto.Suggestions = AssessmentSuggester.GetSuggestions(assessment.Type, assessment.Score);

            return dto;
        }

        [AbpAuthorize]
        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            if (!AbpSession.UserId.HasValue)
                throw new UserFriendlyException(UserNotLoggedInMessage);

            var seeker = await GetSeekerByUserIdAsync(AbpSession.UserId.Value);

            var assessment = await Repository.FirstOrDefaultAsync(a => a.Id == input.Id && a.SeekerId == seeker.Id);

            if (assessment == null)
                throw new UserFriendlyException("Assessment not found or you don't have permission to delete it.");

            await Repository.DeleteAsync(assessment);
        }

    }
}
