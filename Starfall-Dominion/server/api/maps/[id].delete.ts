import { getDatabase } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid map ID'
    })
  }
  
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      DELETE FROM maps
      WHERE id = ?
    `)
    
    const result = stmt.run(Number(id))
    
    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Map not found'
      })
    }
    
    return {
      success: true,
      message: 'Map deleted successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
