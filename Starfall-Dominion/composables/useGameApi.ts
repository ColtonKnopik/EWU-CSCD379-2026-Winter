export const useGameApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBase

  // Game Management
  const createGame = async (mapId: number, player1Id: string, player2Id?: string) => {
    return await $fetch(`${baseUrl}/games`, {
      method: 'POST',
      body: {
        mapId,
        player1Id,
        player2Id
      }
    })
  }

  const getGame = async (gameId: number) => {
    return await $fetch(`${baseUrl}/games/${gameId}`)
  }

  const getGames = async (playerId?: string) => {
    const query = playerId ? `?playerId=${playerId}` : ''
    return await $fetch(`${baseUrl}/games${query}`)
  }

  // Unit Management
  const placeUnit = async (gameId: number, unitData: {
    unitId?: string
    owner: string
    unitType: string
    row: number
    col: number
  }) => {
    return await $fetch(`${baseUrl}/games/${gameId}/units`, {
      method: 'POST',
      body: unitData
    })
  }

  // Movement
  const moveUnit = async (gameId: number, unitId: string, toRow: number, toCol: number) => {
    return await $fetch(`${baseUrl}/games/${gameId}/move`, {
      method: 'POST',
      body: {
        unitId,
        toRow,
        toCol
      }
    })
  }

  // Attack
  const attackUnit = async (gameId: number, attackerUnitId: string, targetUnitId: string) => {
    return await $fetch(`${baseUrl}/games/${gameId}/attack`, {
      method: 'POST',
      body: {
        attackerUnitId,
        targetUnitId
      }
    })
  }

  // Turn Management
  const endTurn = async (gameId: number) => {
    return await $fetch(`${baseUrl}/games/${gameId}/end-turn`, {
      method: 'POST'
    })
  }

  // Valid Moves/Attacks
  const getValidMoves = async (gameId: number, unitId: string) => {
    return await $fetch(`${baseUrl}/games/${gameId}/valid-moves/${unitId}`)
  }

  const getValidAttacks = async (gameId: number, unitId: string) => {
    return await $fetch(`${baseUrl}/games/${gameId}/valid-attacks/${unitId}`)
  }

  // Forfeit
  const deleteGame = async (gameId: number) => {
    return await $fetch(`${baseUrl}/games/${gameId}`, {
      method: 'DELETE'
    })
  }

  return {
    createGame,
    getGame,
    getGames,
    placeUnit,
    moveUnit,
    attackUnit,
    endTurn,
    getValidMoves,
    getValidAttacks,
    deleteGame
  }
}
