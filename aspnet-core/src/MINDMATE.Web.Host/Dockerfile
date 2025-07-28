# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
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

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MINDMATE.Web.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MINDMATE.Web.Host.dll"]