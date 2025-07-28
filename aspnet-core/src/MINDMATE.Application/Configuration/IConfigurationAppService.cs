using System.Threading.Tasks;
using MINDMATE.Configuration.Dto;

namespace MINDMATE.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
