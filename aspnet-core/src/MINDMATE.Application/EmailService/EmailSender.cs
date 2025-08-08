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
            _apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey");
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                throw new Exception("SendGrid API key (SendGrid__ApiKey) is missing from environment variables.");
            }
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
