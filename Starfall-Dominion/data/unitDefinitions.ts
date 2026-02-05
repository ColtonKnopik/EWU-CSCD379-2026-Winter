import type { UnitType } from '~~/types/gameTypes'
import type { AttackAnimationType } from '~~/composables/useAttackAnimations'

export interface UnitDefinition {
  // Basic Info
  type: UnitType
  displayName: string
  description: string
  
  // Stats
  cost: number
  maxHealth: number
  attackPower: number
  moveRange: number
  attackRange: number
  maxActions: number
  
  // Visual & Audio
  spritePath: string
  attackAnimation: AttackAnimationType
  attackAnimationDuration: number
  
  // Sound Paths
  sounds: {
    spawn: string
    attack: string
    hurt: string
    death: string
  }
  
  // Special Properties
  explodeOnDeath?: boolean
  canMove?: boolean // For captains
}

export const UNIT_DEFINITIONS: Record<UnitType, UnitDefinition> = {
  captain: {
    type: 'captain',
    displayName: 'Captain',
    description: 'Your commander. Protect at all costs!',
    cost: 0,
    maxHealth: 150,
    attackPower: 30,
    moveRange: 0,
    attackRange: 1,
    maxActions: 1,
    spritePath: 'Captain.png',
    attackAnimation: 'melee-slash',
    attackAnimationDuration: 500,
    sounds: {
      spawn: '/audio/units/captain/spawn.m4a',
      attack: '/audio/units/captain/attack.m4a',
      hurt: '/audio/units/captain/hurt.mp3',
      death: '/audio/units/captain/death.m4a'
    },
    canMove: false
  },
  
  berserker: {
    type: 'berserker',
    displayName: 'Berserker',
    description: 'High damage melee unit with brutal attacks',
    cost: 50,
    maxHealth: 100,
    attackPower: 25,
    moveRange: 2,
    attackRange: 1,
    maxActions: 2,
    spritePath: 'Berserker.png',
    attackAnimation: 'melee-slash',
    attackAnimationDuration: 500,
    sounds: {
      spawn: '/audio/units/berserker/spawn.mp3',
      attack: '/audio/units/berserker/attack.mp3',
      hurt: '/audio/units/berserker/hurt.mp3',
      death: '/audio/units/berserker/death.mp3'
    }
  },
  
  marine: {
    type: 'marine',
    displayName: 'Marine',
    description: 'Ranged unit with accurate bullet stream',
    cost: 40,
    maxHealth: 75,
    attackPower: 20,
    moveRange: 2,
    attackRange: 2,
    maxActions: 2,
    spritePath: 'Marine.png',
    attackAnimation: 'ranged-shot',
    attackAnimationDuration: 600,
    sounds: {
      spawn: '/audio/units/marine/spawn.mp3',
      attack: '/audio/units/marine/attack.mp3',
      hurt: '/audio/units/marine/hurt.mp3',
      death: '/audio/units/marine/death.mp3'
    }
  },
  
  daft: {
    type: 'daft',
    displayName: 'Daft',
    description: 'Robot with powerful charged blast attack. Explodes on death!',
    cost: 60,
    maxHealth: 80,
    attackPower: 30,
    moveRange: 2,
    attackRange: 1,
    maxActions: 2,
    spritePath: 'Daft.png',
    attackAnimation: 'charged-blast',
    attackAnimationDuration: 3000, // 2s charge + 1s blast
    sounds: {
      spawn: '/audio/units/daft/spawn.mp3',
      attack: '/audio/units/daft/attack.m4a', // Includes charge sound
      hurt: '/audio/units/daft/hurt.mp3',
      death: '/audio/units/daft/death.m4a'
    },
    explodeOnDeath: true
  },
  
  punk: {
    type: 'punk',
    displayName: 'Punk',
    description: 'Robot with powerful charged blast attack. Explodes on death!',
    cost: 60,
    maxHealth: 80,
    attackPower: 30,
    moveRange: 2,
    attackRange: 1,
    maxActions: 2,
    spritePath: 'Punk.png',
    attackAnimation: 'charged-blast',
    attackAnimationDuration: 3000, // 2s charge + 1s blast
    sounds: {
      spawn: '/audio/units/punk/spawn.mp3',
      attack: '/audio/units/punk/attack.m4a', // Includes charge sound
      hurt: '/audio/units/punk/hurt.mp3',
      death: '/audio/units/punk/death.m4a'
    },
    explodeOnDeath: true
  }
}

// Helper function to get unit definition
export function getUnitDefinition(unitType: UnitType): UnitDefinition {
  return UNIT_DEFINITIONS[unitType]
}

// Helper function to get purchasable units (excludes captain)
export function getPurchasableUnits(): UnitDefinition[] {
  return Object.values(UNIT_DEFINITIONS).filter(unit => unit.cost > 0)
}

// Helper function to create a new unit instance
export function createUnit(
  unitType: UnitType,
  player: 'player1' | 'player2',
  row: number,
  col: number,
  id: string,
  actionsRemaining: number = 0
) {
  const def = getUnitDefinition(unitType)
  
  return {
    id,
    name: `${def.displayName}`,
    unitType,
    player,
    row,
    col,
    health: def.maxHealth,
    maxHealth: def.maxHealth,
    attackPower: def.attackPower,
    moveRange: def.moveRange,
    attackRange: def.attackRange,
    actionsRemaining,
    maxActions: def.maxActions
  }
}

