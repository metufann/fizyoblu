using System.Text;
using FizyoBlu.Backend.Data;
using FizyoBlu.Backend.Middleware;
using FizyoBlu.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration (PostgreSQL / SQLite auto-detection)
var rawConn = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=fizyoblu_db;Username=postgres;Password=postgres";

// Parse Render / Heroku postgres URL if present: postgres://user:pass@host:port/db
string npgsqlConn = rawConn;
if (rawConn.StartsWith("postgres://") || rawConn.StartsWith("postgresql://"))
{
    var uri = new Uri(rawConn);
    var userInfo = uri.UserInfo.Split(':');
    var user = userInfo[0];
    var pass = userInfo.Length > 1 ? userInfo[1] : "";
    var port = uri.Port > 0 ? uri.Port : 5432;
    var db = uri.AbsolutePath.TrimStart('/');
    npgsqlConn = $"Host={uri.Host};Port={port};Database={db};Username={user};Password={pass};SSL Mode=Require;Trust Server Certificate=true";
}

var dbProvider = builder.Configuration["DatabaseProvider"] ?? "Auto";

// In local environment without running Postgres, use SQLite smoothly. In production, use PostgreSQL.
bool usePostgres = dbProvider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase) || 
                   (!builder.Environment.IsDevelopment() && !dbProvider.Equals("SQLite", StringComparison.OrdinalIgnoreCase));

if (builder.Environment.IsDevelopment() && dbProvider.Equals("Auto", StringComparison.OrdinalIgnoreCase))
{
    // Check if Postgres host is localhost and can be connected, otherwise default to SQLite for zero-config dev
    try
    {
        using var testSocket = new System.Net.Sockets.Socket(System.Net.Sockets.AddressFamily.InterNetwork, System.Net.Sockets.SocketType.Stream, System.Net.Sockets.ProtocolType.Tcp);
        var result = testSocket.BeginConnect("127.0.0.1", 5432, null, null);
        var success = result.AsyncWaitHandle.WaitOne(500, true);
        if (success && testSocket.Connected)
        {
            usePostgres = true;
            testSocket.EndConnect(result);
        }
        else
        {
            usePostgres = false;
        }
    }
    catch
    {
        usePostgres = false;
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (usePostgres)
    {
        options.UseNpgsql(npgsqlConn);
    }
    else
    {
        options.UseSqlite("Data Source=fizyoblu.db");
    }
});

// 2. Services Registration
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();

// 3. JWT Authentication & HttpOnly Cookie Support
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "FizyoBluSuperSecretKey2024SecureJwtTokenKeyForPilatesStudio_MustBeLongEnough!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "FizyoBluApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "FizyoBluFrontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Extract token from either Authorization header or HttpOnly Cookie "fizyoblu_token"
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrEmpty(context.Token))
            {
                if (context.Request.Cookies.TryGetValue("fizyoblu_token", out var cookieToken))
                {
                    context.Token = cookieToken;
                }
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

// 4. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FizyoBluCors", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://fizyoblu.com",
                "https://www.fizyoblu.com"
            )
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                try
                {
                    var uri = new Uri(origin);
                    return uri.Host == "localhost" || uri.Host.EndsWith(".vercel.app");
                }
                catch
                {
                    return false;
                }
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// 5. Middleware Pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors("FizyoBluCors");

// Serve uploaded files statically
var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
if (!Directory.Exists(webRoot)) Directory.CreateDirectory(webRoot);
var uploadsPath = Path.Combine(webRoot, "uploads");
if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow, service = "FizyoBlu Backend API", database = usePostgres ? "PostgreSQL" : "SQLite" }));

// 6. Database Migration & Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<AppDbContext>();

    try
    {
        logger.LogInformation("Veritabanı kontrol ediliyor ({Provider})...", usePostgres ? "PostgreSQL" : "SQLite");
        context.Database.EnsureCreated();
        await DbInitializer.SeedAsync(context, app.Configuration);
        logger.LogInformation("Veritabanı hazır ve seed verileri tamamlandı.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Veritabanı başlatma hatası.");
    }
}

app.Run();
