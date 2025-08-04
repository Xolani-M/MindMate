using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using MINDMATE.Application.Seekers.Assessment.Dto;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Assessments.MINDMATE.Domain.Assessments;
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

        public AssessmentAppService(
            IRepository<AssessmentResult, Guid> repository,
            AssessmentManager assessmentManager)
            : base(repository)
        {
            _assessmentManager = assessmentManager;
        }

        public override async Task<AssessmentResultDto> CreateAsync(CreateAssessmentDto input)
        {
            try
            {
                var seekerAnswers = input.Answers
                    .Select(a => new SeekerAnswer(a.QuestionNumber, a.SelectedOptionScore))
                    .ToList();

                var result = await _assessmentManager.RecordAssessmentAsync(
                    input.SeekerId,
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

    }
}
