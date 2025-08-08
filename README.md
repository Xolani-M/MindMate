# MindMate - Mental Health Support Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

> A comprehensive mental health support platform designed to provide personalized assistance and resources for mental wellness.

## 🌟 Overview

MindMate is a modern, full-stack mental health application that combines AI-powered chatbot support with comprehensive user management. Built with enterprise-grade architecture, it offers a secure and scalable platform for mental health resources and personalized support.

## ✨ Key Features

- **🤖 AI-Powered Chatbot**: Intelligent mental health support using Google Gemini AI
- **👤 User Profile Management**: Comprehensive seeker profiles with emergency contacts
- **🔐 Secure Authentication**: JWT-based authentication with session management
- **📱 Responsive Design**: Mobile-first design with modern UI/UX
- **🎯 Personalized Experience**: Tailored content based on user assessments and mood tracking
- **🚨 Emergency Support**: Quick access to emergency contacts and crisis resources
- **📊 Assessment Tools**: Mental health assessments and progress tracking

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
- **Database**: Entity Framework Core
- **Architecture**: Clean Architecture with Domain-Driven Design
- **API**: RESTful Web API with Swagger documentation
- **Authentication**: JWT Bearer tokens

### Infrastructure
- **Hosting**: Render (Backend), Vercel-compatible (Frontend)
- **Database**: SQL Server compatible
- **CI/CD**: GitHub Actions with automatic deployment
- **Containerization**: Docker support

## 🚀 Quick Start

### Prerequisites

- **Frontend**: Node.js 18+ and npm
- **Backend**: .NET 8.0 SDK
- **Database**: SQL Server or compatible database

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
   
   # Backend (appsettings.json)
   # Configure database connection and JWT settings
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