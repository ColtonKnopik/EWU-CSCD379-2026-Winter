using Microsoft.EntityFrameworkCore;
using MapAPI.Models;

namespace MapAPI.Data;

public class MapDbContext : DbContext
{
    public MapDbContext(DbContextOptions<MapDbContext> options) : base(options)
    {
    }

    public DbSet<Map> Maps { get; set; }
    public DbSet<TerrainCell> TerrainCells { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Map>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasMany(e => e.TerrainCells)
                  .WithOne(e => e.Map)
                  .HasForeignKey(e => e.MapId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TerrainCell>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TerrainType).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => new { e.MapId, e.Row, e.Col }).IsUnique();
        });
    }
}
