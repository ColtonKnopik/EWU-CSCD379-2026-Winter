import { getDatabase } from '~/server/utils/database'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(() => {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Check multiple possible locations
    const locations = [
      { path: '/home/site/starfall.db', label: '/home/site (Azure persistent)' },
      { path: '/home/data/starfall.db', label: '/home/data (Azure persistent)' },
      { path: join(process.cwd(), 'starfall.db'), label: 'Working directory' }
    ]
    
    const locationChecks = locations.map(loc => ({
      label: loc.label,
      path: loc.path,
      exists: existsSync(loc.path),
      dirExists: existsSync(loc.path.substring(0, loc.path.lastIndexOf('/')))
    }))
    
    let db = null
    let canConnect = false
    let tableInfo = null
    let testResult = null
    let actualDbPath = 'unknown'
    
    try {
      db = getDatabase()
      canConnect = true
      
      // Get actual database path that was used
      try {
        // Try to get table info
        const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'")
        tableInfo = stmt.all()
        
        // Try a test count
        const count = db.prepare('SELECT COUNT(*) as count FROM maps').get()
        testResult = { success: true, mapCount: count }
      } catch (e: any) {
        testResult = { error: e.message }
      }
      
    } catch (e: any) {
      canConnect = false
      testResult = { error: e.message, stack: e.stack }
    }
    
    return {
      success: true,
      environment: isProduction ? 'production (Azure)' : 'development (local)',
      nodeEnv: process.env.NODE_ENV,
      canConnect,
      tables: tableInfo,
      testResult,
      locationChecks,
      directories: {
        home: existsSync('/home'),
        homeSite: existsSync('/home/site'),
        homeData: existsSync('/home/data'),
        cwd: process.cwd()
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
