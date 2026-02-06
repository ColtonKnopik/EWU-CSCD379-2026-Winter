using Microsoft.EntityFrameworkCore;
using MapAPI.Data;
using MapAPI.Services;
using Azure.Identity;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure DbContext with support for both SQL Auth (dev) and Managed Identity (production)
builder.Services.AddDbContext<MapDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var useManagedIdentity = builder.Configuration.GetValue<bool>("UseManagedIdentity");

    if (useManagedIdentity && !builder.Environment.IsDevelopment())
    {
        // Production: Use Managed Identity
        var sqlConnection = new SqlConnection(connectionString);
        var credential = new DefaultAzureCredential();
        var token = credential.GetToken(new Azure.Core.TokenRequestContext(
            new[] { "https://database.windows.net/.default" }));
        sqlConnection.AccessToken = token.Token;
        
        options.UseSqlServer(sqlConnection);
    }
    else
    {
        // Development: Use SQL Authentication
        options.UseSqlServer(connectionString);
    }
});

// Register game logic service
builder.Services.AddScoped<IGameLogicService, GameLogicService>();

// Configure CORS for development and production
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "http://localhost:24678" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
