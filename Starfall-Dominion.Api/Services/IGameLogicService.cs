using MapAPI.Models;

namespace MapAPI.Services;

public interface IGameLogicService
{
    Task<Map?> GetMapAsync(int mapId);
    Task<IEnumerable<Map>> GetAllMapsAsync();
    Task<Map> CreateMapAsync(Map map);
    Task<Map?> UpdateMapAsync(int mapId, Map map);
    Task<bool> DeleteMapAsync(int mapId);
}
