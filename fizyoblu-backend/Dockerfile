# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["fizyoblu-backend.csproj", "./"]
RUN dotnet restore "fizyoblu-backend.csproj"

COPY . .
RUN dotnet publish "fizyoblu-backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
RUN mkdir -p /app/wwwroot/uploads

ENTRYPOINT ["dotnet", "fizyoblu-backend.dll"]
