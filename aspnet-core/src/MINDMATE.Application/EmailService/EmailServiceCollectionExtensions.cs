using Microsoft.Extensions.DependencyInjection;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace MINDMATE.Application.EmailService
{
    public static class EmailServiceCollectionExtensions
    {
        public static IServiceCollection AddEmailSender(this IServiceCollection services)
        {
            services.AddTransient<IEmailSender, EmailSender>();
            return services;
        }
    }
}
