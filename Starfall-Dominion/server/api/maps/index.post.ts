import { getDatabase } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
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
      INSERT INTO maps (name, description, terrain_data)
      VALUES (?, ?, ?)
    `)
    
    const result = stmt.run(
      name,
      description || null,
      JSON.stringify(terrain_data)
    )
    
    return {
      success: true,
      data: {
        id: result.lastInsertRowid,
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
