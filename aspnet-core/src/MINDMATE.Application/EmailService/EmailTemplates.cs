using System;

namespace MINDMATE.Application.EmailService
{
    public static class EmailTemplates
    {
        public static class Welcome
        {
            public const string Subject = "🎉 Welcome to MindMate! 🎉";

            public static string GetPlainTextContent(string name)
            {
                return $@"Hey {name}! 

We're absolutely thrilled you chose MindMate.

Get ready for an awesome journey—your mental health matters and we're here to make it fun, supportive, and inspiring.

🚀 Dive in, explore, and let MindMate be your companion for a happier, healthier you!

Welcome to the MindMate family!

Best regards,
The MindMate Team

---
If you have any questions, feel free to reach out to us.
This email was sent because you recently created a MindMate account.";
            }

            public static string GetHtmlContent(string name)
            {
                return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Welcome to MindMate</title>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: linear-gradient(135deg, #4F8A8B 0%, #F9A826 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 28px; font-weight: 700;'>
            Welcome to MindMate! 🎉
        </h1>
    </div>
    
    <div style='background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>
        <h2 style='color: #4F8A8B; margin-top: 0; font-size: 24px;'>
            Hey {name}! 👋
        </h2>
        
        <p style='font-size: 18px; line-height: 1.8; margin-bottom: 20px;'>
            We're <strong>absolutely thrilled</strong> you chose 
            <span style='color: #4F8A8B; font-weight: 600;'>MindMate</span>.
        </p>
        
        <p style='font-size: 16px; line-height: 1.8; margin-bottom: 20px;'>
            Get ready for an <span style='color: #F9A826; font-weight: 600;'>awesome journey</span>—your mental health matters and we're here to make it <strong>fun, supportive, and inspiring</strong>.
        </p>
        
        <div style='background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #4F8A8B;'>
            <p style='margin: 0; font-size: 16px;'>
                🚀 <strong>Ready to start?</strong> Dive in, explore, and let MindMate be your companion for a happier, healthier you!
            </p>
        </div>
        
        <p style='font-style: italic; color: #666; font-size: 16px; text-align: center; margin-top: 30px;'>
            Welcome to the MindMate family! 💙
        </p>
        
        <hr style='border: none; border-top: 1px solid #e9ecef; margin: 30px 0;'>
        
        <div style='font-size: 14px; color: #6c757d; text-align: center;'>
            <p style='margin: 5px 0;'>
                <strong>The MindMate Team</strong>
            </p>
            <p style='margin: 5px 0;'>
                This email was sent because you recently created a MindMate account.
            </p>
            <p style='margin: 5px 0;'>
                If you have any questions, feel free to reach out to us.
            </p>
        </div>
    </div>
</body>
</html>";
            }
        }

        public static class PasswordReset
        {
            public const string Subject = "🔒 Reset Your MindMate Password";

            public static string GetPlainTextContent(string name, string resetLink)
            {
                return $@"Hi {name},

We received a request to reset your MindMate password.

Click the link below to reset your password:
{resetLink}

This link will expire in 24 hours for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The MindMate Team";
            }

            public static string GetHtmlContent(string name, string resetLink)
            {
                return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Reset Your Password</title>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
    <div style='background: #4F8A8B; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 24px; font-weight: 600;'>
            🔒 Reset Your Password
        </h1>
    </div>
    
    <div style='background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>
        <h2 style='color: #4F8A8B; margin-top: 0;'>Hi {name},</h2>
        
        <p style='font-size: 16px; line-height: 1.6;'>
            We received a request to reset your MindMate password.
        </p>
        
        <div style='text-align: center; margin: 30px 0;'>
            <a href='{resetLink}' style='background: #4F8A8B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; display: inline-block;'>
                Reset Password
            </a>
        </div>
        
        <p style='font-size: 14px; color: #666;'>
            This link will expire in 24 hours for security reasons.
        </p>
        
        <p style='font-size: 14px; color: #666;'>
            If you didn't request this password reset, please ignore this email.
        </p>
        
        <hr style='border: none; border-top: 1px solid #e9ecef; margin: 30px 0;'>
        
        <div style='font-size: 14px; color: #6c757d; text-align: center;'>
            <p style='margin: 5px 0;'><strong>The MindMate Team</strong></p>
        </div>
    </div>
</body>
</html>";
            }
        }
    }
}
