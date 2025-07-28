using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace MINDMATE.Controllers
{
    public abstract class MINDMATEControllerBase: AbpController
    {
        protected MINDMATEControllerBase()
        {
            LocalizationSourceName = MINDMATEConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
