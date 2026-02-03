import Database from 'better-sqlite3'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
if (!db) {
  // Use Azure persistent storage in production, local path in development
  const isProduction = process.env.NODE_ENV === 'production'
    
  // Try multiple locations on Azure
  let dbPath: string
  if (isProduction) {
    // Try /home/site first, fallback to local
    if (existsSync('/home/site')) {
      dbPath = '/home/site/starfall.db'
    } else if (existsSync('/home/data')) {
      dbPath = '/home/data/starfall.db'
    } else {
      // Fallback to working directory (not persistent but works)
      dbPath = join(process.cwd(), 'starfall.db')
      console.warn('⚠️ Using non-persistent database location:', dbPath)
    }
  } else {
    dbPath = join(process.cwd(), 'starfall.db')
  }
    
    // Create directory if it doesn't exist (needed for Azure)
    const dbDir = dirname(dbPath)
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true })
      console.log('✅ Created database directory:', dbDir)
    }
    
    db = new Database(dbPath)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    
    // Initialize schema if needed
    initializeSchema(db)
    
    console.log('✅ Database connected:', dbPath)
    console.log('✅ Environment:', isProduction ? 'production (Azure)' : 'development (local)')
  }
  
  return db
}

function initializeSchema(database: Database.Database) {
  try {
    const schemaPath = join(process.cwd(), 'server/database/schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    database.exec(schema)
    console.log('✅ Database schema initialized')
  } catch (error) {
    console.error('❌ Failed to initialize schema:', error)
    // If schema file doesn't exist, create tables manually
    console.log('⚠️ Creating fallback schema...')
    createFallbackSchema(database)
  }
}

function createFallbackSchema(database: Database.Database) {
  // Fallback schema creation if schema.sql file doesn't exist
  database.exec(`
    CREATE TABLE IF NOT EXISTS maps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      terrain_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      map_id INTEGER,
      winner TEXT,
      final_turn INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (map_id) REFERENCES maps(id)
    );
  `)
  console.log('✅ Fallback schema created')
}

// Types for our database models
export interface MapRecord {
  id: number
  name: string
  description: string | null
  terrain_data: string // JSON string
  created_at: string
  updated_at: string
}

export interface GameRecord {
  id: number
  map_id: number
  winner: string | null
  final_turn: number | null
  played_at: string
}
