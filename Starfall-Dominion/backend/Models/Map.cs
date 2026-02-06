namespace MapAPI.Models;

public class Map
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<TerrainCell> TerrainCells { get; set; } = new List<TerrainCell>();
}
