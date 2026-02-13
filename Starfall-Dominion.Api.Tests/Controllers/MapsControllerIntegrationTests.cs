using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using MapAPI;
using MapAPI.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using MapAPI.Models;
using System.Linq;
using System.Text.Json; // ← add this

namespace MapAPI.Tests.Controllers;

public class MapsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public MapsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<MapDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext<MapDbContext>(options =>
                {
                    options.UseInMemoryDatabase("IntegrationDb");
                });
            });
        });
    }

    [Fact]
    public async Task GetMaps_Returns_Ok()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/maps");
        res.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task PostAndGetMap_Works()
    {
        var client = _factory.CreateClient();
        var create = new
        {
            Name = "IntegrationMap",
            Description = "desc",
            TerrainData = new[] { new { Row = 0, Col = 0, TerrainType = "land" } }
        };

        var post = await client.PostAsJsonAsync("/api/maps", create);
        post.EnsureSuccessStatusCode();

        // ← replace dynamic with JsonElement
        var created = await post.Content.ReadFromJsonAsync<JsonElement>();
        int id = created.GetProperty("id").GetInt32();

        var get = await client.GetAsync($"/api/maps/{id}");
        get.EnsureSuccessStatusCode();
    }
}