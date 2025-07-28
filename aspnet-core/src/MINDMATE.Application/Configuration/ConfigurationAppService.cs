using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using MINDMATE.Configuration.Dto;

namespace MINDMATE.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : MINDMATEAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
