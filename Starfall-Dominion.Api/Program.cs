using Microsoft.EntityFrameworkCore;
using MapAPI.Data;
using MapAPI.Services;
using MapAPI.Models;
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

// Seed the default base map if no maps exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MapDbContext>();
    db.Database.Migrate();

    if (!db.Maps.Any())
    {
        var baseMapCells = new (int Row, int Col, string Terrain)[]
        {
            (0,0,"land"), (0,1,"land"), (0,2,"land"), (0,3,"mountain"), (0,4,"water"), (0,5,"land"), (0,6,"land"), (0,7,"land"),
            (1,0,"land"), (1,1,"land"), (1,2,"mountain"), (1,3,"water"), (1,4,"land"), (1,5,"land"), (1,6,"land"), (1,7,"land"),
            (2,0,"spawn"), (2,1,"land"), (2,2,"land"), (2,3,"water"), (2,4,"land"), (2,5,"land"), (2,6,"land"), (2,7,"land"),
            (3,0,"land"), (3,1,"land"), (3,2,"land"), (3,3,"water"), (3,4,"flag"), (3,5,"land"), (3,6,"land"), (3,7,"land"),
            (4,0,"land"), (4,1,"land"), (4,2,"land"), (4,3,"flag"), (4,4,"water"), (4,5,"land"), (4,6,"land"), (4,7,"land"),
            (5,0,"land"), (5,1,"land"), (5,2,"land"), (5,3,"land"), (5,4,"water"), (5,5,"land"), (5,6,"land"), (5,7,"spawn"),
            (6,0,"land"), (6,1,"land"), (6,2,"land"), (6,3,"land"), (6,4,"water"), (6,5,"mountain"), (6,6,"land"), (6,7,"land"),
            (7,0,"land"), (7,1,"land"), (7,2,"land"), (7,3,"water"), (7,4,"mountain"), (7,5,"land"), (7,6,"land"), (7,7,"land"),
        };

        var defaultMap = new Map
        {
            Name = "Default Map",
            Description = "The standard battlefield",
            CreatedAt = DateTime.UtcNow,
            TerrainCells = baseMapCells.Select(c => new TerrainCell
            {
                Row = c.Row,
                Col = c.Col,
                TerrainType = c.Terrain
            }).ToList()
        };

        db.Maps.Add(defaultMap);
        db.SaveChanges();
    }
}

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
