using System.Threading.Tasks;

namespace MINDMATE.Application.EmailService
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string plainTextContent, string htmlContent);
    }
}
