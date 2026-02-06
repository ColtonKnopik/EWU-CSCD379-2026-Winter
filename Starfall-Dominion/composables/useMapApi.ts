/**
 * Converts frontend terrain data (["row-col", "type"] pairs) to backend format
 */
function terrainToApi(terrainData: Array<[string, string]>): Array<{ row: number; col: number; terrainType: string }> {
  return terrainData.map(([key, terrainType]) => {
    const [row, col] = key.split('-').map(Number)
    return { row, col, terrainType }
  })
}

/**
 * Converts backend terrain data ({ row, col, terrainType } objects) to frontend format
 */
function terrainFromApi(terrainData: Array<{ row: number; col: number; terrainType: string }>): Array<[string, string]> {
  return terrainData.map(({ row, col, terrainType }) => [`${row}-${col}`, terrainType])
}

export const useMapApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase

  const getMaps = async () => {
    const maps = await $fetch<any[]>(`${baseUrl}/maps`)
    return {
      success: true,
      data: maps.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        created_at: m.createdAt,
        updated_at: m.updatedAt,
        terrain_data: m.terrainData ? terrainFromApi(m.terrainData) : undefined
      }))
    }
  }

  const getMap = async (mapId: number) => {
    const m = await $fetch<any>(`${baseUrl}/maps/${mapId}`)
    return {
      success: true,
      data: {
        id: m.id,
        name: m.name,
        description: m.description,
        created_at: m.createdAt,
        updated_at: m.updatedAt,
        terrain_data: terrainFromApi(m.terrainData)
      }
    }
  }

  const createMap = async (mapData: {
    name: string
    description?: string
    terrain_data: Array<[string, string]>
  }) => {
    const m = await $fetch<any>(`${baseUrl}/maps`, {
      method: 'POST',
      body: {
        name: mapData.name,
        description: mapData.description,
        terrainData: terrainToApi(mapData.terrain_data)
      }
    })
    return {
      success: true,
      data: {
        id: m.id,
        name: m.name,
        description: m.description
      }
    }
  }

  const updateMap = async (mapId: number, mapData: {
    name: string
    description?: string
    terrain_data: Array<[string, string]>
  }) => {
    await $fetch(`${baseUrl}/maps/${mapId}`, {
      method: 'PUT',
      body: {
        name: mapData.name,
        description: mapData.description,
        terrainData: terrainToApi(mapData.terrain_data)
      }
    })
    return {
      success: true,
      data: { id: mapId, name: mapData.name, description: mapData.description }
    }
  }

  const deleteMap = async (mapId: number) => {
    await $fetch(`${baseUrl}/maps/${mapId}`, {
      method: 'DELETE'
    })
    return { success: true, message: 'Map deleted successfully' }
  }

  /**
   * Returns map terrain in baseMap.json format: [["row-col", "terrainType"], ...]
   */
  const getMapJson = async (mapId: number): Promise<Array<[string, string]>> => {
    return await $fetch<Array<[string, string]>>(`${baseUrl}/maps/${mapId}/json`)
  }

  return {
    getMaps,
    getMap,
    createMap,
    updateMap,
    deleteMap,
    getMapJson
  }
}
