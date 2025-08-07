FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080


#Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy NuGet config and project files
COPY ["NuGet.Config", "."]
COPY ["src/MINDMATE.Web.Host/MINDMATE.Web.Host.csproj", "src/MINDMATE.Web.Host/"]
COPY ["src/MINDMATE.Web.Core/MINDMATE.Web.Core.csproj", "src/MINDMATE.Web.Core/"]
COPY ["src/MINDMATE.Application/MINDMATE.Application.csproj", "src/MINDMATE.Application/"]
COPY ["src/MINDMATE.Core/MINDMATE.Core.csproj", "src/MINDMATE.Core/"]
COPY ["src/MINDMATE.EntityFrameworkCore/MINDMATE.EntityFrameworkCore.csproj", "src/MINDMATE.EntityFrameworkCore/"]

# Restore dependencies
RUN dotnet restore "src/MINDMATE.Web.Host/MINDMATE.Web.Host.csproj"

# Copy all project files
COPY . .

# Set working directory to the Web.Host
WORKDIR "/src/src/MINDMATE.Web.Host"

# Build project
RUN dotnet build "MINDMATE.Web.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build


# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MINDMATE.Web.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


# Final runtime image
FROM base AS final
WORKDIR /app

# Copy published app files
COPY --from=publish /app/publish .

# Copy additional config files needed at runtime
COPY --from=build /src/src/MINDMATE.Web.Host/appsettings.json ./appsettings.json
COPY --from=build /src/src/MINDMATE.Web.Host/log4net.config ./log4net.config
COPY --from=build /src/src/MINDMATE.Web.Host/log4net.Production.config ./log4net.Production.config

# Entry point
ENTRYPOINT ["dotnet", "MINDMATE.Web.Host.dll"]
