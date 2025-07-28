using System.Threading.Tasks;
using Abp.Application.Services;
using MINDMATE.Sessions.Dto;

namespace MINDMATE.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
