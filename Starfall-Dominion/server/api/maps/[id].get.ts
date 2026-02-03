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
    const map = db.prepare(`
      SELECT id, name, description, terrain_data, created_at, updated_at
      FROM maps
      WHERE id = ?
    `).get(Number(id))
    
    if (!map) {
      throw createError({
        statusCode: 404,
        message: 'Map not found'
      })
    }
    
    // Parse terrain_data JSON
    const mapData = {
      ...map,
      terrain_data: JSON.parse((map as any).terrain_data)
    }
    
    return {
      success: true,
      data: mapData
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
