# LocationTracker

LocationTracker is a real-time location sharing application. The Angular client provides account registration and login, friend requests, and a map for viewing shared locations. The ASP.NET Core API handles authentication and friend management, while SignalR delivers live location updates.

## Technology

- Angular 20, TypeScript, Bootstrap, and Leaflet
- ASP.NET Core 8 Web API
- SQL Server with Entity Framework Core
- SignalR for real-time updates
- JWT bearer authentication

## Prerequisites

- .NET 8 SDK
- Node.js and npm
- SQL Server

## Configuration

The API needs a SQL Server connection string and a JWT signing key. Keep these values out of source control. From the repository root, configure them with .NET User Secrets:

```bash
dotnet user-secrets init --project LocationTracker/LocationTracker.csproj
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your SQL Server connection string>" --project LocationTracker/LocationTracker.csproj
dotnet user-secrets set "Jwt:Key" "<a long random signing key>" --project LocationTracker/LocationTracker.csproj
```

`LocationTracker/appsettings.example.json` shows the expected configuration shape. The Angular development API URL is in `tracker/environment/environment.ts` and defaults to `https://localhost:7137`.

## Run locally

Apply the database migrations and start the API:

```bash
dotnet ef database update --project LocationTracker/LocationTracker.csproj
dotnet run --project LocationTracker/LocationTracker.csproj
```

In a second terminal, install the client dependencies and start Angular:

```bash
cd tracker
npm install
npm start
```

Open `http://localhost:4200`. The API's Swagger UI is available in development at `/swagger` on the API URL.

## Build

```bash
dotnet build LocationTracker.sln
cd tracker
npm run build
```

## Project layout

```text
LocationTracker/   ASP.NET Core API, SignalR hub, and EF Core migrations
tracker/           Angular client
```
