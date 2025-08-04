using Abp.AspNetCore.Dependency;
using Abp.Dependency;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using DotNetEnv;

namespace MINDMATE.Web.Host.Startup
{
    public class Program
    {
        
        public static void Main(string[] args)
        {
            Env.Load();
            CreateHostBuilder(args).Build().Run();
        }

        internal static IHostBuilder CreateHostBuilder(string[] args) =>
            Microsoft.Extensions.Hosting.Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
                    webBuilder
                        .UseStartup<Startup>()
                        .UseUrls($"http://*:{port}");
                })
                .UseCastleWindsor(IocManager.Instance.IocContainer);
    }
}
