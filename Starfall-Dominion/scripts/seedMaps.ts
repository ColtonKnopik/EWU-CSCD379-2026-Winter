import { getDatabase } from './server/utils/database'

// Seed example maps into the database
function seedExampleMaps() {
  const db = getDatabase()
  
  // Example Map 1: Classic Battlefield
  const classicBattlefield = [
    // Rows 0-7, Cols 0-7 (64 cells total)
    ['0-0', 'spawn'], ['0-1', 'land'], ['0-2', 'land'], ['0-3', 'mountain'], ['0-4', 'mountain'], ['0-5', 'land'], ['0-6', 'land'], ['0-7', 'spawn'],
    ['1-0', 'land'], ['1-1', 'land'], ['1-2', 'land'], ['1-3', 'land'], ['1-4', 'land'], ['1-5', 'land'], ['1-6', 'land'], ['1-7', 'land'],
    ['2-0', 'spawn'], ['2-1', 'land'], ['2-2', 'land'], ['2-3', 'flag'], ['2-4', 'flag'], ['2-5', 'land'], ['2-6', 'land'], ['2-7', 'spawn'],
    ['3-0', 'land'], ['3-1', 'land'], ['3-2', 'land'], ['3-3', 'land'], ['3-4', 'land'], ['3-5', 'land'], ['3-6', 'land'], ['3-7', 'land'],
    ['4-0', 'land'], ['4-1', 'land'], ['4-2', 'land'], ['4-3', 'land'], ['4-4', 'land'], ['4-5', 'land'], ['4-6', 'land'], ['4-7', 'land'],
    ['5-0', 'spawn'], ['5-1', 'land'], ['5-2', 'land'], ['5-3', 'flag'], ['5-4', 'flag'], ['5-5', 'land'], ['5-6', 'land'], ['5-7', 'spawn'],
    ['6-0', 'land'], ['6-1', 'land'], ['6-2', 'land'], ['6-3', 'land'], ['6-4', 'land'], ['6-5', 'land'], ['6-6', 'land'], ['6-7', 'land'],
    ['7-0', 'spawn'], ['7-1', 'land'], ['7-2', 'land'], ['7-3', 'mountain'], ['7-4', 'mountain'], ['7-5', 'land'], ['7-6', 'land'], ['7-7', 'spawn']
  ]
  
  // Example Map 2: Lava Fortress
  const lavaFortress = [
    ['0-0', 'spawn'], ['0-1', 'land'], ['0-2', 'land'], ['0-3', 'lava'], ['0-4', 'lava'], ['0-5', 'land'], ['0-6', 'land'], ['0-7', 'spawn'],
    ['1-0', 'land'], ['1-1', 'land'], ['1-2', 'lava'], ['1-3', 'lava'], ['1-4', 'lava'], ['1-5', 'lava'], ['1-6', 'land'], ['1-7', 'land'],
    ['2-0', 'spawn'], ['2-1', 'land'], ['2-2', 'lava'], ['2-3', 'mountain'], ['2-4', 'mountain'], ['2-5', 'lava'], ['2-6', 'land'], ['2-7', 'spawn'],
    ['3-0', 'land'], ['3-1', 'lava'], ['3-2', 'lava'], ['3-3', 'flag'], ['3-4', 'flag'], ['3-5', 'lava'], ['3-6', 'lava'], ['3-7', 'land'],
    ['4-0', 'land'], ['4-1', 'lava'], ['4-2', 'lava'], ['4-3', 'flag'], ['4-4', 'flag'], ['4-5', 'lava'], ['4-6', 'lava'], ['4-7', 'land'],
    ['5-0', 'spawn'], ['5-1', 'land'], ['5-2', 'lava'], ['5-3', 'mountain'], ['5-4', 'mountain'], ['5-5', 'lava'], ['5-6', 'land'], ['5-7', 'spawn'],
    ['6-0', 'land'], ['6-1', 'land'], ['6-2', 'lava'], ['6-3', 'lava'], ['6-4', 'lava'], ['6-5', 'lava'], ['6-6', 'land'], ['6-7', 'land'],
    ['7-0', 'spawn'], ['7-1', 'land'], ['7-2', 'land'], ['7-3', 'lava'], ['7-4', 'lava'], ['7-5', 'land'], ['7-6', 'land'], ['7-7', 'spawn']
  ]
  
  // Example Map 3: Water World
  const waterWorld = [
    ['0-0', 'spawn'], ['0-1', 'land'], ['0-2', 'water'], ['0-3', 'water'], ['0-4', 'water'], ['0-5', 'water'], ['0-6', 'land'], ['0-7', 'spawn'],
    ['1-0', 'land'], ['1-1', 'land'], ['1-2', 'water'], ['1-3', 'water'], ['1-4', 'water'], ['1-5', 'water'], ['1-6', 'land'], ['1-7', 'land'],
    ['2-0', 'spawn'], ['2-1', 'water'], ['2-2', 'land'], ['2-3', 'land'], ['2-4', 'land'], ['2-5', 'land'], ['2-6', 'water'], ['2-7', 'spawn'],
    ['3-0', 'water'], ['3-1', 'water'], ['3-2', 'land'], ['3-3', 'flag'], ['3-4', 'flag'], ['3-5', 'land'], ['3-6', 'water'], ['3-7', 'water'],
    ['4-0', 'water'], ['4-1', 'water'], ['4-2', 'land'], ['4-3', 'flag'], ['4-4', 'flag'], ['4-5', 'land'], ['4-6', 'water'], ['4-7', 'water'],
    ['5-0', 'spawn'], ['5-1', 'water'], ['5-2', 'land'], ['5-3', 'land'], ['5-4', 'land'], ['5-5', 'land'], ['5-6', 'water'], ['5-7', 'spawn'],
    ['6-0', 'land'], ['6-1', 'land'], ['6-2', 'water'], ['6-3', 'water'], ['6-4', 'water'], ['6-5', 'water'], ['6-6', 'land'], ['6-7', 'land'],
    ['7-0', 'spawn'], ['7-1', 'land'], ['7-2', 'water'], ['7-3', 'water'], ['7-4', 'water'], ['7-5', 'water'], ['7-6', 'land'], ['7-7', 'spawn']
  ]
  
  const maps = [
    {
      name: 'Classic Battlefield',
      description: 'A balanced map with mountain barriers and strategic flag positions. Perfect for beginners!',
      terrain_data: classicBattlefield
    },
    {
      name: 'Lava Fortress',
      description: 'Navigate rivers of lava to capture the mountain fortress. High risk, high reward!',
      terrain_data: lavaFortress
    },
    {
      name: 'Water World',
      description: 'Island warfare! Control the central land mass while avoiding the surrounding water.',
      terrain_data: waterWorld
    }
  ]
  
  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO maps (name, description, terrain_data)
      VALUES (?, ?, ?)
    `)
    
    maps.forEach(map => {
      stmt.run(map.name, map.description, JSON.stringify(map.terrain_data))
      console.log(`✅ Seeded map: ${map.name}`)
    })
    
    console.log('🎉 Example maps seeded successfully!')
  } catch (error) {
    console.error('❌ Failed to seed maps:', error)
  }
}

// Run if executed directly
if (require.main === module) {
  seedExampleMaps()
  process.exit(0)
}

export { seedExampleMaps }
