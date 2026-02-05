import { type TerrainType } from '~~/components/board/Cell.vue'

export type Player = 'player1' | 'player2'
export type UnitType = 'captain' | 'berserker' | 'marine' | 'daft' | 'punk'

export interface Unit {
  id: string
  name: string
  unitType: UnitType
  player: Player
  row: number
  col: number
  health: number
  maxHealth: number
  attackPower: number
  moveRange: number
  attackRange: number
  actionsRemaining: number
  maxActions: number
}

export interface GameState {
  units: Unit[]
  selectedUnit: Unit | null
  currentPlayer: Player
  turn: number
}

export interface CellPosition {
  row: number
  col: number
}

// Helper function to calculate hex distance
export function getHexDistance(pos1: CellPosition, pos2: CellPosition): number {
  // Convert to cube coordinates for hex distance calculation
  const x1 = pos1.col - (pos1.row - (pos1.row & 1)) / 2
  const z1 = pos1.row
  const y1 = -x1 - z1

  const x2 = pos2.col - (pos2.row - (pos2.row & 1)) / 2
  const z2 = pos2.row
  const y2 = -x2 - z2

  return (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2
}

// Get neighboring cells
export function getNeighbors(pos: CellPosition): CellPosition[] {
  const { row, col } = pos
  const isEvenRow = row % 2 === 0
  
  if (isEvenRow) {
    return [
      { row: row - 1, col: col - 1 },
      { row: row - 1, col: col },
      { row: row, col: col + 1 },
      { row: row + 1, col: col },
      { row: row + 1, col: col - 1 },
      { row: row, col: col - 1 },
    ]
  } else {
    return [
      { row: row - 1, col: col },
      { row: row - 1, col: col + 1 },
      { row: row, col: col + 1 },
      { row: row + 1, col: col + 1 },
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
    ]
  }
}

// Get all cells within range
export function getCellsInRange(center: CellPosition, range: number, maxRow: number, maxCol: number): CellPosition[] {
  const cells: CellPosition[] = []
  
  for (let row = 0; row < maxRow; row++) {
    for (let col = 0; col < maxCol; col++) {
      const pos = { row, col }
      const distance = getHexDistance(center, pos)
      if (distance <= range && distance > 0) {
        cells.push(pos)
      }
    }
  }
  
  return cells
}