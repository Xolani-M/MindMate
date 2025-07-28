using Abp.Application.Services;
using MINDMATE.MultiTenancy.Dto;

namespace MINDMATE.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

