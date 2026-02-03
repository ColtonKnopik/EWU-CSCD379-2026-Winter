import Database from 'better-sqlite3'
import { readFileSync } from 'fs'
import { join } from 'path'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    // Create database in project root (or use env variable for production)
    const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'game.db')
    db = new Database(dbPath)
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    
    // Initialize schema if needed
    initializeSchema(db)
    
    console.log('✅ Database connected:', dbPath)
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
  }
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
