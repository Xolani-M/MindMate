using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using MINDMATE.Authorization;

namespace MINDMATE
{
    [DependsOn(
        typeof(MINDMATECoreModule), 
        typeof(AbpAutoMapperModule))]
    public class MINDMATEApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<MINDMATEAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(MINDMATEApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
