using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Domain.Uow;
using Abp.UI;
using MINDMATE.Authorization.Users;
using MINDMATE.Domain.Enums;
using MINDMATE.Domain.Moods;

namespace MINDMATE.Domain.Seekers
{
    public class SeekerManager : DomainService
    {
        private readonly IRepository<Seeker, Guid> _seekerRepository;
        private readonly UserManager _userManager;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public SeekerManager(
            IRepository<Seeker, Guid> seekerRepository,
            UserManager userManager,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _seekerRepository = seekerRepository;
            _userManager = userManager;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task<Seeker> CreateSeekerAsync(
            string name,
            string surname,
            string email,
            string password,
            string displayName,
            string emergencyContactName,
            string emergencyContactPhone)
        {
            using (var uow = _unitOfWorkManager.Begin())
            {
                // Create ABP Identity User
                var user = new User
                {
                    Name = name,
                    Surname = surname,
                    UserName = email,
                    EmailAddress = email
                };

                var result = await _userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                    throw new UserFriendlyException("User creation failed: " + string.Join(", ", result.Errors));

                await _userManager.AddToRoleAsync(user, "Seeker");

                // Create Seeker Domain Entity
                var seeker = new Seeker
                {
                    Name = name,
                    Surname = surname,
                    Email = email,
                    UserId = user.Id,
                    DisplayName = displayName,
                    EmergencyContactName = emergencyContactName,
                    EmergencyContactPhone = emergencyContactPhone,
                    UserAccount = user
                };

                await _seekerRepository.InsertAsync(seeker);

                await uow.CompleteAsync();

                return seeker;
            }
        }

        public async Task UpdateAssessmentRiskLevelAsync(Guid seekerId, AssessmentType type, int score)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);

            switch (type)
            {
                case AssessmentType.PHQ9:
                    seeker.SetLastPHQ9Score(score);
                    var phqRisk = EvaluatePHQ9Risk(score);
                    seeker.UpdatePHQ9RiskLevel(phqRisk);
                    break;

                case AssessmentType.GAD7:
                    seeker.SetLastGAD7Score(score);
                    var gadRisk = EvaluateGAD7Risk(score);
                    seeker.UpdateGAD7RiskLevel(gadRisk);
                    break;

                default:
                    throw new ArgumentOutOfRangeException(nameof(type), "Unknown assessment type");
            }

            await _seekerRepository.UpdateAsync(seeker);
        }

        public static RiskLevel EvaluateRiskFromAssessment(int phq9Score, int gad7Score)
        {
            var depressionRisk = phq9Score switch
            {
                >= 20 => RiskLevel.Crisis,
                >= 15 => RiskLevel.High,
                >= 10 => RiskLevel.Medium,
                _ => RiskLevel.Low
            };

            var anxietyRisk = gad7Score switch
            {
                >= 15 => RiskLevel.High,
                >= 10 => RiskLevel.Medium,
                _ => RiskLevel.Low
            };

            // Return the higher risk level between depression and anxiety
            return (RiskLevel)Math.Max((int)depressionRisk, (int)anxietyRisk);
        }

        private static RiskLevel EvaluatePHQ9Risk(int score)
        {
            return score switch
            {
                >= 20 => RiskLevel.Crisis,
                >= 15 => RiskLevel.High,
                >= 10 => RiskLevel.Medium,
                _ => RiskLevel.Low
            };
        }

        private static RiskLevel EvaluateGAD7Risk(int score)
        {
            return score switch
            {
                >= 15 => RiskLevel.High,
                >= 10 => RiskLevel.Medium,
                _ => RiskLevel.Low
            };
        }

        public async Task UpdateMoodTrendAsync(Guid seekerId, MoodTrendSummary moodTrendSummary)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);

            seeker.UpdateMoodTrend(moodTrendSummary);

            await _seekerRepository.UpdateAsync(seeker);
        }

        // Removed unused private method MapMoodTrendToRiskLevel

        public async Task UpdateRiskLevelAsync(Guid seekerId, RiskLevel newLevel)
        {
            var seeker = await _seekerRepository.GetAsync(seekerId);
            seeker.UpdateRiskLevel(newLevel);
            await _seekerRepository.UpdateAsync(seeker);
        }
    }
}