using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Seekers.Dto
{
    public class SeekerDashboardDto
    {
        public int TotalJournalEntries { get; set; }
        public string LatestMood { get; set; }
        public double AverageMoodLast7Days { get; set; }
        public string RiskLevel { get; set; }
        public int? LatestPhq9Score { get; set; }
        public int? LatestGad7Score { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
    }
}
