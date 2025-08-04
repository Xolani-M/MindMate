using Abp.Application.Services.Dto;
using MINDMATE.Domain.Enums;
using System;

namespace MINDMATE.Seekers.Dto
{
    public class SeekerDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhone { get; set; }
        public string PHQ9RiskLevel { get; set; }
        public string GAD7RiskLevel { get; set; }
        public string RiskLevel { get; set; } // Optional string or enum
    }
}
