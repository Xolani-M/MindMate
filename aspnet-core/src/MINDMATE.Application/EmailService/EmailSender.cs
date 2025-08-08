using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MINDMATE.Application.EmailService
{
public class EmailSender : IEmailSender
    {
        private readonly string _apiKey;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger = null)
        {
            _logger = logger;
            
            // Try multiple sources for the API key
            _apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey") ?? 
                     Environment.GetEnvironmentVariable("SENDGRID_API_KEY") ?? 
                     configuration?["SendGrid:ApiKey"];
            
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger?.LogWarning("SendGrid API key is not configured. Email sending will be disabled.");
            }
        }


        public async Task SendEmailAsync(string toEmail, string subject, string plainTextContent, string htmlContent)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_apiKey))
                {
                    _logger?.LogWarning("Email sending skipped - SendGrid API key not configured");
                    return; // Don't fail signup if email is not configured
                }

                var client = new SendGridClient(_apiKey);
                var from = new EmailAddress("royalkidtoaking@gmail.com", "MindMate");
                var to = new EmailAddress(toEmail);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger?.LogError("SendGrid failed with status code: {StatusCode}", response.StatusCode);
                    // Don't throw exception - just log the error
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to send email, but continuing with user registration");
                // Don't throw - allow signup to succeed even if email fails
            }
        }
    }
}
