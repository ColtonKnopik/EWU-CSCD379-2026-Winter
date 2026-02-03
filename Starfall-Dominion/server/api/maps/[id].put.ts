import { getDatabase } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid map ID'
    })
  }
  
  const { name, description, terrain_data } = body
  
  if (!name || !terrain_data) {
    throw createError({
      statusCode: 400,
      message: 'Name and terrain_data are required'
    })
  }
  
  const db = getDatabase()
  
  try {
    const stmt = db.prepare(`
      UPDATE maps
      SET name = ?, description = ?, terrain_data = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    const result = stmt.run(
      name,
      description || null,
      JSON.stringify(terrain_data),
      Number(id)
    )
    
    if (result.changes === 0) {
      throw createError({
        statusCode: 404,
        message: 'Map not found'
      })
    }
    
    return {
      success: true,
      data: {
        id: Number(id),
        name,
        description
      }
    }
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 409,
        message: 'A map with this name already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})
