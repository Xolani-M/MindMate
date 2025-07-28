using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using MINDMATE.EntityFrameworkCore;
using MINDMATE.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace MINDMATE.Web.Tests
{
    [DependsOn(
        typeof(MINDMATEWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class MINDMATEWebTestModule : AbpModule
    {
        public MINDMATEWebTestModule(MINDMATEEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MINDMATEWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(MINDMATEWebMvcModule).Assembly);
        }
    }
}