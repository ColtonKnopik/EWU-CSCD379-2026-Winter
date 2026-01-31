import { type Player } from '~~/types/gameTypes'

export interface TerrainProperties {
    name: string
    walkable: boolean
    damagePerTurn?: number
    damageToPlayer?: 'enemy' | 'all' | 'none'
    canSpawnUnits?: boolean
    description: string
}

export const TERRAIN_CONFIG: Record<string, TerrainProperties> = {
    water: {
        name: 'Water',
        walkable: false,
        description: 'Cannot be crossed by units'
    },
    land: {
        name: 'Land',
        walkable: true,
        description: 'Standard terrain'
    },
    lava: {
        name: 'Lava',
        walkable: true,
        damagePerTurn: 15,
        damageToPlayer: 'enemy',
        description: 'Deals 15 damage to enemy units at end of turn'
    },
    void: {
        name: 'Void',
        walkable: false,
        description: 'Empty space - cannot be entered'
    },
    mountain: {
        name: 'Mountain',
        walkable: false,
        description: 'Blocks movement'
    },
    spawn: {
        name: 'Spawn Point',
        walkable: true,
        canSpawnUnits: true,
        description: 'Click to purchase and spawn units'
    },
    flag: {
        name: 'Control Point',
        walkable: true,
        description: 'Capture for +25 gold income per turn'
    }
}

// Helper function to check if terrain is walkable
export function isTerrainWalkable(terrainType: string): boolean {
    return TERRAIN_CONFIG[terrainType]?.walkable ?? false
}

// Helper function to check if terrain can spawn units
export function canSpawnOnTerrain(terrainType: string): boolean {
    return TERRAIN_CONFIG[terrainType]?.canSpawnUnits ?? false
}

// Helper function to get terrain damage
export function getTerrainDamage(terrainType: string): number {
    return TERRAIN_CONFIG[terrainType]?.damagePerTurn ?? 0
}

// Helper function to check who takes damage from terrain
export function getTerrainDamageTarget(terrainType: string): 'enemy' | 'all' | 'none' {
    return TERRAIN_CONFIG[terrainType]?.damageToPlayer ?? 'none'
}