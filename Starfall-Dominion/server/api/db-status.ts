import { getDatabase } from '~/server/utils/database'
import { existsSync } from 'fs'

export default defineEventHandler(() => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const dbPath = isProduction 
      ? '/home/data/starfall.db'
      : './starfall.db'
    
    const dbExists = existsSync(dbPath)
    
    let db = null
    let canConnect = false
    let tableInfo = null
    let testInsert = null
    
    try {
      db = getDatabase()
      canConnect = true
      
      // Try to get table info
      try {
        const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
        tableInfo = stmt.all()
      } catch (e: any) {
        tableInfo = { error: e.message }
      }
      
      // Try a test operation
      try {
        const count = db.prepare('SELECT COUNT(*) as count FROM maps').get()
        testInsert = { success: true, mapCount: count }
      } catch (e: any) {
        testInsert = { error: e.message }
      }
      
    } catch (e: any) {
      canConnect = false
      testInsert = { error: e.message }
    }
    
    return {
      success: true,
      environment: isProduction ? 'production' : 'development',
      nodeEnv: process.env.NODE_ENV,
      dbPath,
      dbExists,
      canConnect,
      tables: tableInfo,
      test: testInsert,
      homeDir: existsSync('/home') ? 'exists' : 'not found',
      homeDataDir: existsSync('/home/data') ? 'exists' : 'not found'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
