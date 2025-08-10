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
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger = null)
        {
            _logger = logger;
            
            // Try multiple sources for the API key
            _apiKey = Environment.GetEnvironmentVariable("SendGrid__ApiKey") ?? 
                     Environment.GetEnvironmentVariable("SENDGRID_API_KEY") ?? 
                     configuration?["SendGrid:ApiKey"];
            
            // Configure sender details with fallbacks
            _fromEmail = Environment.GetEnvironmentVariable("SendGrid__FromEmail") ?? 
                        configuration?["SendGrid:FromEmail"] ?? 
                        "noreply@mindmate.app";
            
            _fromName = Environment.GetEnvironmentVariable("SendGrid__FromName") ?? 
                       configuration?["SendGrid:FromName"] ?? 
                       "MindMate";
            
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger?.LogWarning("SendGrid API key is not configured. Email sending will be disabled.");
            }
            
            _logger?.LogInformation("EmailSender initialized with from: {FromName} <{FromEmail}>", _fromName, _fromEmail);
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

                if (string.IsNullOrWhiteSpace(toEmail))
                {
                    _logger?.LogWarning("Email sending skipped - recipient email is empty");
                    return;
                }

                var client = new SendGridClient(_apiKey);
                var from = new EmailAddress(_fromEmail, _fromName);
                var to = new EmailAddress(toEmail);
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                
                _logger?.LogInformation("Sending email to {ToEmail} with subject: {Subject}", toEmail, subject);
                
                var response = await client.SendEmailAsync(msg);
                
                if (response.IsSuccessStatusCode)
                {
                    _logger?.LogInformation("Email sent successfully to {ToEmail}", toEmail);
                }
                else
                {
                    _logger?.LogError("SendGrid failed with status code: {StatusCode} for email to {ToEmail}", 
                        response.StatusCode, toEmail);
                    // Don't throw exception - just log the error
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Failed to send email to {ToEmail}, but continuing with user registration", toEmail);
                // Don't throw - allow signup to succeed even if email fails
            }
        }
    }
}
