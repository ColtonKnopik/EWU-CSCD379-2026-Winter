using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MapAPI.Data;
using MapAPI.Models;

namespace MapAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapsController : ControllerBase
{
    private readonly MapDbContext _context;

    public MapsController(MapDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MapDto>>> GetMaps()
    {
        var maps = await _context.Maps
            .Include(m => m.TerrainCells)
            .Select(m => new MapDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                TerrainData = m.TerrainCells.Select(tc => new TerrainCellDto
                {
                    Row = tc.Row,
                    Col = tc.Col,
                    TerrainType = tc.TerrainType
                }).ToList()
            })
            .ToListAsync();

        return Ok(maps);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MapDto>> GetMap(int id)
    {
        var map = await _context.Maps
            .Include(m => m.TerrainCells)
            .Where(m => m.Id == id)
            .Select(m => new MapDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                TerrainData = m.TerrainCells.Select(tc => new TerrainCellDto
                {
                    Row = tc.Row,
                    Col = tc.Col,
                    TerrainType = tc.TerrainType
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (map == null)
        {
            return NotFound();
        }

        return Ok(map);
    }

    [HttpPost]
    public async Task<ActionResult<MapDto>> CreateMap(CreateMapDto createMapDto)
    {
        var map = new Map
        {
            Name = createMapDto.Name,
            Description = createMapDto.Description,
            CreatedAt = DateTime.UtcNow,
            TerrainCells = createMapDto.TerrainData.Select(tc => new TerrainCell
            {
                Row = tc.Row,
                Col = tc.Col,
                TerrainType = tc.TerrainType
            }).ToList()
        };

        _context.Maps.Add(map);
        await _context.SaveChangesAsync();

        var mapDto = new MapDto
        {
            Id = map.Id,
            Name = map.Name,
            Description = map.Description,
            CreatedAt = map.CreatedAt,
            UpdatedAt = map.UpdatedAt,
            TerrainData = map.TerrainCells.Select(tc => new TerrainCellDto
            {
                Row = tc.Row,
                Col = tc.Col,
                TerrainType = tc.TerrainType
            }).ToList()
        };

        return CreatedAtAction(nameof(GetMap), new { id = map.Id }, mapDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMap(int id, UpdateMapDto updateMapDto)
    {
        var map = await _context.Maps
            .Include(m => m.TerrainCells)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (map == null)
        {
            return NotFound();
        }

        map.Name = updateMapDto.Name;
        map.Description = updateMapDto.Description;
        map.UpdatedAt = DateTime.UtcNow;

        _context.TerrainCells.RemoveRange(map.TerrainCells);
        map.TerrainCells = updateMapDto.TerrainData.Select(tc => new TerrainCell
        {
            MapId = id,
            Row = tc.Row,
            Col = tc.Col,
            TerrainType = tc.TerrainType
        }).ToList();

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMap(int id)
    {
        var map = await _context.Maps.FindAsync(id);
        if (map == null)
        {
            return NotFound();
        }

        _context.Maps.Remove(map);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Returns the map terrain data in the baseMap.json format: [["row-col", "terrainType"], ...]
    /// </summary>
    [HttpGet("{id}/json")]
    public async Task<ActionResult<List<string[]>>> GetMapJson(int id)
    {
        var map = await _context.Maps
            .Include(m => m.TerrainCells)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (map == null)
        {
            return NotFound();
        }

        var jsonData = map.TerrainCells
            .OrderBy(tc => tc.Row)
            .ThenBy(tc => tc.Col)
            .Select(tc => new string[] { $"{tc.Row}-{tc.Col}", tc.TerrainType })
            .ToList();

        return Ok(jsonData);
    }
}

public class MapDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<TerrainCellDto> TerrainData { get; set; } = new();
}

public class CreateMapDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<TerrainCellDto> TerrainData { get; set; } = new();
}

public class UpdateMapDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<TerrainCellDto> TerrainData { get; set; } = new();
}

public class TerrainCellDto
{
    public int Row { get; set; }
    public int Col { get; set; }
    public string TerrainType { get; set; } = "void";
}
