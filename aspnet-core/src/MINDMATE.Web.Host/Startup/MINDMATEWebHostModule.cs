using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using MINDMATE.Configuration;

namespace MINDMATE.Web.Host.Startup
{
    [DependsOn(
       typeof(MINDMATEWebCoreModule))]
    public class MINDMATEWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public MINDMATEWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MINDMATEWebHostModule).GetAssembly());
        }
    }
}
