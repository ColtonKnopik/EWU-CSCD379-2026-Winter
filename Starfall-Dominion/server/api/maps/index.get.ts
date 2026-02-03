import { getDatabase } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const db = getDatabase()
  
  try {
    const maps = db.prepare(`
      SELECT id, name, description, created_at, updated_at
      FROM maps
      ORDER BY updated_at DESC
    `).all()
    
    return {
      success: true,
      data: maps
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
