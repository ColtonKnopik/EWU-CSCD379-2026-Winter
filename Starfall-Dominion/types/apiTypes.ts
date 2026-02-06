// API Response Types for Backend Integration

export interface GameDto {
  id: number
  mapId: number
  mapName: string
  player1Id: string
  player2Id: string | null
  currentPlayer: string
  turn: number
  phase: string
  winner: string | null
  createdAt: string
  updatedAt: string | null
}

export interface GameDetailDto extends GameDto {
  player1Gold: number
  player2Gold: number
  player1Income: number
  player2Income: number
  units: GameUnitDto[]
  flags: FlagStateDto[]
  recentActions: GameActionDto[]
  terrainData: TerrainCellDto[]
}

export interface GameUnitDto {
  unitId: string
  owner: string
  type: string
  row: number
  col: number
  health: number
  maxHealth: number
  attack: number
  range: number
  movement: number
  hasMoved: boolean
  hasAttacked: boolean
  isAlive: boolean
}

export interface FlagStateDto {
  row: number
  col: number
  owner: string | null
  contestedBy: string | null
}

export interface GameActionDto {
  turn: number
  player: string
  actionType: string
  details: string | null
  timestamp: string
}

export interface TerrainCellDto {
  row: number
  col: number
  terrainType: string
}

export interface MapDto {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string | null
  terrainData: TerrainCellDto[]
}
