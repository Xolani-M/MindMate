# Base image for runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NuGet.Config", "."]
COPY ["src/MINDMATE.Web.Host/MINDMATE.Web.Host.csproj", "src/MINDMATE.Web.Host/"]
COPY ["src/MINDMATE.Web.Core/MINDMATE.Web.Core.csproj", "src/MINDMATE.Web.Core/"]
COPY ["src/MINDMATE.Application/MINDMATE.Application.csproj", "src/MINDMATE.Application/"]
COPY ["src/MINDMATE.Core/MINDMATE.Core.csproj", "src/MINDMATE.Core/"]
COPY ["src/MINDMATE.EntityFrameworkCore/MINDMATE.EntityFrameworkCore.csproj", "src/MINDMATE.EntityFrameworkCore/"]
RUN dotnet restore "./src/MINDMATE.Web.Host/MINDMATE.Web.Host.csproj"
COPY . .
WORKDIR "/src/src/MINDMATE.Web.Host"
RUN dotnet build "./MINDMATE.Web.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MINDMATE.Web.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MINDMATE.Web.Host.dll"]