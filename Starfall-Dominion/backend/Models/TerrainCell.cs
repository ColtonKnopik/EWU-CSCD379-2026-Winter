namespace MapAPI.Models;

public class TerrainCell
{
    public int Id { get; set; }
    public int MapId { get; set; }
    public int Row { get; set; }
    public int Col { get; set; }
    public string TerrainType { get; set; } = "void";
    public Map Map { get; set; } = null!;
}
