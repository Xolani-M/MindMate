using Abp.Application.Services;
using System.Threading.Tasks;

namespace MINDMATE.Application.EmailService
{
    public class EmailAppService : ApplicationService
    {
        private readonly IEmailSender _emailSender;

        public EmailAppService(IEmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendEmail(string toEmail, string subject, string plainTextContent, string htmlContent)
        {
            await _emailSender.SendEmailAsync(toEmail, subject, plainTextContent, htmlContent);
        }
    }
}
