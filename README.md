# MindMate - Mental Health Support Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

> A comprehensive mental health support platform designed to provide personalized assistance and resources for mental wellness.

## 🌟 Overview

MindMate is a modern, full-stack mental health application that combines AI-powered chatbot support with comprehensive user management. Built with enterprise-grade architecture, it offers a secure and scalable platform for mental health resources and personalized support.

## ✨ Key Features

- **🤖 AI-Powered Chatbot with Adaptive Humor**: Intelligent mental health support using Google Gemini AI with personalized humor adaptation
- **🧠 Smart Conversation Memory**: Advanced context retention with intelligent truncation for natural, continuous conversations
- **👤 User Profile Management**: Comprehensive seeker profiles with emergency contacts
- **🔐 Secure Authentication**: JWT-based authentication with session management
- **� Welcome Email System**: Automated welcome emails via SendGrid for new user onboarding
- **�📱 Responsive Design**: Mobile-first design with modern UI/UX
- **🎯 Personalized Experience**: Tailored content based on user assessments and mood tracking
- **🚨 Emergency Support**: Quick access to emergency contacts and crisis resources
- **📊 Assessment Tools**: Mental health assessments and progress tracking
- **💾 Persistent Chat History**: User-specific chat persistence across sessions with automatic cleanup

## 🤖 AI Chatbot Features

### Adaptive Humor Intelligence

MindMate's chatbot features a revolutionary **Adaptive Humor Intelligence** system that personalizes communication style based on individual user preferences:

#### 🎭 Personality Adaptation
- **Conservative Start**: Begins with minimal humor to gauge user comfort level
- **Real-time Learning**: Analyzes conversation patterns to understand humor preferences
- **Dynamic Adjustment**: Adapts communication style based on user responses

#### 🎯 Humor Classification System
The AI categorizes users into three preference types:

1. **Professional Preference**
   - Formal, supportive tone with minimal humor
   - Clinical approach when preferred
   - Example: *"I understand how challenging anxiety can be. Let's work together on some effective coping strategies..."*

2. **Humor Appreciators** 
   - Light, engaging conversations with appropriate jokes
   - Self-deprecating AI humor and gentle observations
   - Example: *"Ah, the classic Monday blues! As an AI, I don't technically experience Mondays, but I've heard they have quite the reputation! 😄"*

3. **Mixed Signals**
   - Moderate humor with careful observation
   - Adapts based on ongoing interaction patterns
   - Example: *"That sounds really tough. Want to talk about what made today particularly challenging? I'm here to listen. 💙"*

#### 🔍 Signal Detection
The system analyzes conversation patterns for:

**Positive Humor Signals:**
- Emoji usage (😂, 😄, 😅)
- Text indicators ("lol", "haha", "funny")
- Engagement responses ("thanks for making me smile")

**Professional Preference Signals:**
- Formal language patterns
- Lengthy responses without emotional indicators
- Direct requests for serious tone

#### 🛡️ Safety & Boundaries
- **Never jokes about** mental health struggles directly
- **Always prioritizes** emotional support over entertainment
- **Immediately adapts** if user shows discomfort
- **Maintains professionalism** for crisis situations

### Smart Conversation Memory

#### 🧠 Advanced Context Management
- **50-Message History**: Sends up to 50 recent messages for context
- **Smart Truncation**: Intelligently limits conversation history to ~40,000 characters (~10,000 tokens)
- **Context Preservation**: Maintains conversation flow without reintroduction
- **Character-Based Optimization**: Maximizes context while respecting API limits

#### 💾 Persistent Chat System
- **User-Specific Storage**: Each user's chat history is stored separately
- **Session Continuity**: Conversations persist across logout/login cycles
- **Automatic Cleanup**: Chat history clears automatically on user logout
- **Cross-Device Sync**: Access your conversations from any device

#### 🎯 Personalization Engine
The chatbot leverages comprehensive user data for personalized responses:
- **Mood Tracking**: Recent mood levels and 7-day averages
- **Assessment Scores**: PHQ-9 and GAD-7 results integration
- **Risk Level Awareness**: Tailored responses based on current risk assessment
- **Journey Context**: References user's mental health progress over time

## 📧 Email Communication System

### Welcome Email Automation

MindMate features an automated email system that enhances user onboarding and engagement:

#### 🎉 Welcome Email Features
- **Instant Delivery**: Automated welcome emails sent immediately upon user registration
- **Personalized Content**: Uses user's display name or first name for personalization
- **Professional Design**: HTML-formatted emails with MindMate branding
- **Fallback Support**: Plain text version included for all email clients
- **Graceful Failure**: User registration succeeds even if email delivery fails

#### 📬 Email Content
The welcome email includes:
- **Warm Personal Greeting**: "Hey [Name]! 👋"
- **Brand Introduction**: Introduction to MindMate's mission
- **Journey Motivation**: Encouraging message about mental health journey
- **Call to Action**: Invitation to explore the platform
- **Professional Styling**: Branded colors (#4F8A8B, #F9A826) and typography

#### 🛠️ Technical Implementation
```csharp
// Welcome email with personalized content
var subject = "🎉 Welcome to MindMate! 🎉";
var htmlContent = $"<div style='font-family:sans-serif;font-size:1.1em;'>" +
                  $"<h2>Hey {name}! 👋</h2>" +
                  $"<p>We're <strong>absolutely thrilled</strong> you chose " +
                  $"<span style='color:#4F8A8B;'>MindMate</span>...</p></div>";

await _emailSender.SendEmailAsync(input.Email, subject, plainTextContent, htmlContent);
```

#### 🔧 SendGrid Integration
- **Reliable Delivery**: Enterprise-grade email delivery via SendGrid
- **Multiple API Key Sources**: Environment variables and configuration support
- **Error Handling**: Comprehensive logging without blocking user registration
- **Status Monitoring**: HTTP response validation and error reporting

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.4.4 with React 18.2.0
- **Language**: TypeScript 5.0
- **Styling**: Ant Design 5.26.7 with custom components
- **State Management**: Redux with Redux Actions
- **HTTP Client**: Axios for API communication
- **Authentication**: JWT with jwt-decode

### Backend
- **Framework**: ASP.NET Core with ABP Framework
- **Language**: C# .NET
- **Database**: Entity Framework Core with PostgreSQL (Supabase)
- **Email Service**: SendGrid for transactional emails
- **Architecture**: Clean Architecture with Domain-Driven Design
- **API**: RESTful Web API with Swagger documentation
- **Authentication**: JWT Bearer tokens

### Infrastructure
- **Hosting**: Render (Backend), Vercel-compatible (Frontend)
- **Database**: Supabase PostgreSQL
- **CI/CD**: GitHub Actions with automatic deployment
- **Containerization**: Docker support

## 🚀 Quick Start

### Prerequisites

- **Frontend**: Node.js 18+ and npm
- **Backend**: .NET 8.0 SDK
- **Database**: Supabase PostgreSQL account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Xolani-M/MindMate.git
   cd MindMate
   ```

2. **Setup Frontend**
   ```bash
   cd mindmatch-frontend
   npm install
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   cd aspnet-core
   dotnet restore
   dotnet build
   dotnet run --project src/MINDMATE.Web.Host
   ```

4. **Environment Configuration**
   ```bash
   # Frontend (.env)
   NEXT_PUBLIC_API=https://your-api-endpoint.com
   
   # Backend (appsettings.json or environment variables)
   # Configure Supabase PostgreSQL connection, JWT settings, and email service
   ```

## 📖 API Documentation

The API documentation is available via Swagger UI when running the backend:
- **Local**: `http://localhost:21021/swagger`
- **Production**: `https://mindmate-k682.onrender.com/swagger`

### Core Endpoints

- **Authentication**: `/api/TokenAuth`
- **User Management**: `/api/services/app/User`
- **Seeker Profiles**: `/api/services/app/Seeker`
- **Chatbot**: `/api/services/app/Chat`
- **Email Service**: `/api/services/app/Email`
- **Session**: `/api/services/app/Session`

## 🏗️ Project Structure

```
MindMate/
├── mindmatch-frontend/          # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   ├── components/          # Reusable components
│   │   ├── providers/           # Context providers
│   │   └── utils/              # Utility functions
│   └── public/                 # Static assets
├── aspnet-core/                # ASP.NET Core Backend
│   ├── src/
│   │   ├── MINDMATE.Core/      # Domain layer
│   │   ├── MINDMATE.Application/ # Application layer
│   │   ├── MINDMATE.Web.Core/  # Web core
│   │   └── MINDMATE.Web.Host/  # Web API host
│   └── test/                   # Unit tests
└── _screenshots/               # UI screenshots
```

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run start        # Start production server
```

### Backend Development
```bash
dotnet run           # Start development server
dotnet build         # Build solution
dotnet test          # Run tests
```

## 🤖 AI Implementation Details

### Adaptive Humor Intelligence Technical Overview

The Adaptive Humor Intelligence system is implemented across both frontend and backend:

#### Backend Implementation (`ChatbotService.cs`)

**Humor Analysis Algorithm:**
```csharp
private static string AnalyzeHumorPreferences(List<ChatHistoryItem> conversationHistory)
{
    // Analyzes user messages for humor engagement vs formality signals
    // Returns personalized communication guidelines for the AI
}

private static int CountHumorSignals(string message)
{
    // Detects positive humor indicators: emojis, "lol", "haha", etc.
    // Scores engagement level from 0-5+
}

private static int CountFormalitySignals(string message)
{
    // Identifies formal communication preferences
    // Weighted scoring for professional tone indicators
}
```

**Smart Conversation Truncation:**
```csharp
// Token optimization for Google Gemini API
const int maxHistoryChars = 40000; // ~10,000 tokens
// Intelligent message selection maintaining minimum 5 messages
// Preserves chronological order while maximizing context
```

#### Frontend Implementation (`chat/index.tsx`)

**User-Specific Persistence:**
```typescript
// Generates unique storage keys per user
const chatStorageKey = `mindmate_chat_${userHash}`;

// Sends conversation history with each request
const conversationHistory = chatHistory.slice(-50); // Last 50 messages

// Automatic cleanup on logout
useEffect(() => {
  if (!token) {
    localStorage.removeItem(chatStorageKey);
  }
}, [token]);
```

### Configuration Requirements

#### Environment Variables
```bash
# Backend
Gemini__ApiKey=your-google-gemini-api-key
Gemini__ApiEndpoint=https://generativelanguage.googleapis.com/
ConnectionStrings__Default=your-supabase-postgresql-connection-string

# SendGrid Email Configuration
SendGrid__ApiKey=your-sendgrid-api-key
SendGrid__FromEmail=noreply@yourdomain.com
SendGrid__FromName=MindMate

# Frontend  
NEXT_PUBLIC_API=your-backend-api-url
```

#### API Integration
- **Model**: Google Gemini 2.0-flash
- **Token Limit**: ~30,000 tokens total
- **History Allocation**: ~10,000 tokens for conversation context
- **Response Limit**: ~20,000 tokens for AI response

### Humor Adaptation Guidelines

For developers extending the humor system:

1. **Always prioritize mental health support** over entertainment
2. **Never make light of** serious mental health issues
3. **Use conversation history** to understand user preferences
4. **Implement graceful fallbacks** when humor detection fails
5. **Monitor user engagement** to refine algorithms

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript/C# coding standards
- Write unit tests for new features
- Update documentation for API changes
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- **ASP.NET Boilerplate** - Backend framework foundation
- **Ant Design** - UI component library
- **Google Gemini AI** - AI chatbot capabilities
- **Community Contributors** - Thank you for your support

## 📞 Support

For support and questions:

- **Issues**: [GitHub Issues](https://github.com/Xolani-M/MindMate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Xolani-M/MindMate/discussions)
- **Documentation**: Check the `/docs` folder (coming soon)

---

**Made with ❤️ for mental health awareness and support**