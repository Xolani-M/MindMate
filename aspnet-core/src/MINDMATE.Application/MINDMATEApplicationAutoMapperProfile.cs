using MINDMATE.Domain.Journals;
using AutoMapper;
using MINDMATE.Application.Seekers.Assessment.Dto;
using MINDMATE.Application.Seekers.Journals.Dto;
using MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Moods;
using MINDMATE.Domain.Seekers;
using MINDMATE.Seekers.Assessment.Dto;
using MINDMATE.Seekers.Dto;
using MINDMATE.Seekers.Moods.Dto;

namespace MINDMATE
{
    public class MINDMATEApplicationAutoMapperProfile : Profile
    {
        public MINDMATEApplicationAutoMapperProfile()
        {
            CreateMap<Seeker, SeekerDto>();
            CreateMap<JournalEntry, JournalEntryDto>();
            CreateMap<AssessmentResult, AssessmentResultDto>();
            CreateMap<Seeker, SeekerDto>().ReverseMap(); // includes enum mapping
            CreateMap<MoodEntry, MoodEntryDto>();
            CreateMap<CreateMoodEntryDto, MoodEntry>();
            CreateMap<MoodTrendSummary, MoodTrendSummaryDto>();
            CreateMap<UpdateAssessmentDto, AssessmentResult>();
            CreateMap<AssessmentAnswerDto, AssessmentAnswer>();
        }
    }
}
