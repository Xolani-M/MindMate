using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace MINDMATE.Application.EmailService
{
public class EmailSender : IEmailSender
    {
        private readonly string _apiKey;

        public EmailSender()
        {
            _apiKey = Environment.GetEnvironmentVariable("mindmate_api");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string plainTextContent, string htmlContent)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress("royalkidtoaking@gmail.com", "MindMate");
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"SendGrid failed: {response.StatusCode}");
            }
        }
    }
}
