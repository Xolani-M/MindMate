using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Timing;
using MINDMATE.Domain.Assessments.MINDMATE.Domain.Assessments;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Seekers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Assessments
{
    public class AssessmentManager : DomainService
    {
        private readonly IRepository<AssessmentResult, Guid> _assessmentRepository;
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        // Removed unused private field _seekerManager
        private readonly IAssessmentDefinitionProvider _assessmentDefinitionProvider;

        public AssessmentManager(
            IRepository<AssessmentResult, Guid> assessmentRepository,
            IRepository<Seeker, Guid> seekerRepository,
            SeekerManager seekerManager,
            IAssessmentDefinitionProvider assessmentDefinitionProvider)
        {
            _assessmentRepository = assessmentRepository;
            _seekerRepository = seekerRepository;
            // _seekerManager assignment removed
            _assessmentDefinitionProvider = assessmentDefinitionProvider;
        }

        // Overload for answers
        public async Task<AssessmentResult> RecordAssessmentAsync(Guid seekerId, AssessmentType type, List<SeekerAnswer> answers, string notes = null)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);
            var assessmentTemplate = _assessmentDefinitionProvider.GetAssessmentTemplate(type);
            if (answers.Count != assessmentTemplate.Count)
                throw new ArgumentException("Number of answers does not match number of questions.");

            int totalScore = 0;
            var assessmentAnswers = new List<AssessmentAnswer>();
            foreach (var seekerAnswer in answers)
            {
                var question = assessmentTemplate.FirstOrDefault(q => q.Number == seekerAnswer.QuestionNumber);
                if (question == null)
                    throw new ArgumentException($"Invalid question number: {seekerAnswer.QuestionNumber}");
                var selectedOption = question.AnswerOptions.FirstOrDefault(opt => opt.Score == seekerAnswer.SelectedOptionScore);
                if (selectedOption == null)
                    throw new ArgumentException($"Invalid answer score {seekerAnswer.SelectedOptionScore} for question {seekerAnswer.QuestionNumber}");
                totalScore += selectedOption.Score;
                assessmentAnswers.Add(new AssessmentAnswer(seekerAnswer.QuestionNumber, selectedOption.Score, selectedOption.Text));
            }
            AssessmentResult.ValidateScore(totalScore, type);
            var result = new AssessmentResult
            {
                SeekerId = seekerId,
                Type = type,
                Score = totalScore,
                DateTaken = Clock.Now,
                Notes = notes,
                Answers = assessmentAnswers
            };
            // Update seeker risk levels based on total score
            switch (type)
            {
                case AssessmentType.PHQ9:
                    seeker.SetLastPHQ9Score(totalScore);
                    var newRiskPHQ9 = SeekerManager.EvaluateRiskFromAssessment(totalScore, seeker.LastGAD7Score);
                    seeker.UpdatePHQ9RiskLevel(newRiskPHQ9);
                    break;
                case AssessmentType.GAD7:
                    seeker.SetLastGAD7Score(totalScore);
                    var newRiskGAD7 = SeekerManager.EvaluateRiskFromAssessment(seeker.LastPHQ9Score, totalScore);
                    seeker.UpdateGAD7RiskLevel(newRiskGAD7);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(type), "Unknown assessment type");
            }
            await _assessmentRepository.InsertAsync(result);
            await _seekerRepository.UpdateAsync(seeker);
            return result;
        }


        public async Task<AssessmentResult> RecordAssessmentAsync(Guid seekerId, AssessmentType type, int score, string notes = null)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);
            AssessmentResult.ValidateScore(score, type);
            var result = new AssessmentResult
            {
                SeekerId = seekerId,
                Type = type,
                Score = score,
                DateTaken = Clock.Now,
                Notes = notes
            };
            await _assessmentRepository.InsertAsync(result);
            return result;
        }

        public string[] GetSuggestionsBasedOnAssessment(AssessmentType type, int score)
        {
            if (type == AssessmentType.PHQ9 && score >= 10)
                return new[] { "Talk to a counselor", "Watch CBT videos", "Practice daily journaling" };
            if (type == AssessmentType.GAD7 && score >= 10)
                return new[] { "Try breathing exercises", "Use meditation apps", "Consider speaking to a mental health coach" };
            return Array.Empty<string>();
        }

    }

}
