import type { UnitType } from '~/types/gameTypes'

export interface UnitDefinition {
  type: UnitType
  name: string
  cost: number
  health: number
  maxHealth: number
  attackPower: number
  moveRange: number
  attackRange: number
  maxActions: number
  spritePath: string
  description: string
}

// Centralized unit definitions - single source of truth
export const UNIT_DEFINITIONS: Record<UnitType, UnitDefinition> = {
  captain: {
    type: 'captain',
    name: 'Captain',
    cost: 0, // Cannot be purchased
    health: 150,
    maxHealth: 150,
    attackPower: 15,
    moveRange: 2,
    attackRange: 2,
    maxActions: 2,
    spritePath: 'Captain.png',
    description: 'Your commander. If eliminated, you lose! Can recruit units and lead the charge.'
  },
  berserker: {
    type: 'berserker',
    name: 'Berserker',
    cost: 50,
    health: 100,
    maxHealth: 100,
    attackPower: 25,
    moveRange: 2,
    attackRange: 1,
    maxActions: 2,
    spritePath: 'Berserker.png',
    description: 'High damage melee fighter. Devastating in close combat.'
  },
  marine: {
    type: 'marine',
    name: 'Marine',
    cost: 75,
    health: 75,
    maxHealth: 75,
    attackPower: 20,
    moveRange: 2,
    attackRange: 2,
    maxActions: 2,
    spritePath: 'Marine.png',
    description: 'Balanced ranged unit. Versatile and reliable.'
  },
  daft: {
    type: 'daft',
    name: 'Daft',
    cost: 100,
    health: 90,
    maxHealth: 90,
    attackPower: 22,
    moveRange: 3,
    attackRange: 2,
    maxActions: 2,
    spritePath: 'Daft.png',
    description: 'Swift tactical unit. High mobility with solid firepower.'
  },
  punk: {
    type: 'punk',
    name: 'Punk',
    cost: 60,
    health: 85,
    maxHealth: 85,
    attackPower: 18,
    moveRange: 2,
    attackRange: 1,
    maxActions: 2,
    spritePath: 'Punk.png',
    description: 'Aggressive close-range fighter. Quick and unpredictable.'
  }
}

// Get units that can be purchased (excludes captain)
export function getPurchasableUnits(): UnitDefinition[] {
  return Object.values(UNIT_DEFINITIONS).filter(unit => unit.cost > 0)
}

// Get unit definition by type
export function getUnitDefinition(type: UnitType): UnitDefinition {
  return UNIT_DEFINITIONS[type]
}

// Create a new unit instance from definition
export function createUnitFromDefinition(
  definition: UnitDefinition,
  id: string,
  player: 'player1' | 'player2',
  row: number,
  col: number
) {
  return {
    id,
    name: definition.name,
    unitType: definition.type,
    player,
    row,
    col,
    health: definition.health,
    maxHealth: definition.maxHealth,
    attackPower: definition.attackPower,
    moveRange: definition.moveRange,
    attackRange: definition.attackRange,
    actionsRemaining: definition.maxActions,
    maxActions: definition.maxActions
  }
}
