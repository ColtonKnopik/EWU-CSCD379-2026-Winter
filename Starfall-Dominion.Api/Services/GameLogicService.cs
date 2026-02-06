using Microsoft.EntityFrameworkCore;
using MapAPI.Data;
using MapAPI.Models;

namespace MapAPI.Services;

public class GameLogicService : IGameLogicService
{
    private readonly MapDbContext _context;

    public GameLogicService(MapDbContext context)
    {
        _context = context;
    }

    public async Task<Map?> GetMapAsync(int mapId)
    {
        return await _context.Maps
            .Include(m => m.TerrainCells)
            .FirstOrDefaultAsync(m => m.Id == mapId);
    }

    public async Task<IEnumerable<Map>> GetAllMapsAsync()
    {
        return await _context.Maps
            .Include(m => m.TerrainCells)
            .ToListAsync();
    }

    public async Task<Map> CreateMapAsync(Map map)
    {
        map.CreatedAt = DateTime.UtcNow;
        _context.Maps.Add(map);
        await _context.SaveChangesAsync();
        return map;
    }

    public async Task<Map?> UpdateMapAsync(int mapId, Map updatedMap)
    {
        var map = await _context.Maps
            .Include(m => m.TerrainCells)
            .FirstOrDefaultAsync(m => m.Id == mapId);

        if (map == null)
            return null;

        map.Name = updatedMap.Name;
        map.Description = updatedMap.Description;
        map.UpdatedAt = DateTime.UtcNow;

        _context.TerrainCells.RemoveRange(map.TerrainCells);
        map.TerrainCells = updatedMap.TerrainCells.Select(tc => new TerrainCell
        {
            MapId = mapId,
            Row = tc.Row,
            Col = tc.Col,
            TerrainType = tc.TerrainType
        }).ToList();

        await _context.SaveChangesAsync();
        return map;
    }

    public async Task<bool> DeleteMapAsync(int mapId)
    {
        var map = await _context.Maps.FindAsync(mapId);
        if (map == null)
            return false;

        _context.Maps.Remove(map);
        await _context.SaveChangesAsync();
        return true;
    }
}
