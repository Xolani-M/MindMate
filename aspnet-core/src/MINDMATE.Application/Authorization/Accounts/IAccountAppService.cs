﻿using System.Threading.Tasks;
using Abp.Application.Services;
using MINDMATE.Authorization.Accounts.Dto;

namespace MINDMATE.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
