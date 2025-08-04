using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MINDMATE.Domain.Enums
{
    public enum RiskLevel
    {
        [Display(Name = "Low - No immediate concern")]
        Low,

        [Display(Name = "Medium - Moderate concern")]
        Medium,

        [Display(Name = "High - Needs professional attention")]
        High,

        [Display(Name = "Crisis - Urgent support needed")]
        Crisis
    }

}
