<template>
  <div class="game-container">
    <GameHeader
      :turn="gameState.turn"
      :current-player="gameState.currentPlayer"
      :player1-gold="goldState.player1.gold"
      :player1-income="goldState.player1.income"
      :player2-gold="goldState.player2.gold"
      :player2-income="goldState.player2.income"
      @end-turn="endTurn"
    />

    <div class="game-content">
      <div class="game-sidebar">
        <UnitInfo
          :unit="gameState.selectedUnit"
          :current-player="gameState.currentPlayer"
          @deselect="deselectUnit"
        />

        <ActionMode
          :mode="actionMode"
          :has-moves="validMoves.length > 0"
          :has-attacks="validAttacks.length > 0"
        />
      </div>

      <GameBoard
        ref="gameBoardRef"
        :board-size="BOARD_SIZE"
        :cols-per-row="COLS_PER_ROW"
        :units="gameState.units"
        :selected-unit-id="gameState.selectedUnit?.id || null"
        :valid-moves="validMoves"
        :valid-attacks="validAttacks"
        :placement-zone="gamePhase === 'placement' ? { player: placementPlayer, cols: placementPlayer === 'player1' ? [0, 1, 2] : [5, 6, 7] } : null"
        :current-player="gameState.currentPlayer"
        :get-cell-terrain="getCellTerrain"
        :get-flag-owner="getFlagOwner"
        :is-flag-contested="isFlagContested"
        :explosions="explosions"
        @cell-click="onCellClick"
      />
    </div>

    <UnitShop
      v-if="showShop && shopSpawnPoint"
      :row="shopSpawnPoint.row"
      :col="shopSpawnPoint.col"
      :available-gold="gameState.currentPlayer === 'player1' ? goldState.player1.gold : goldState.player2.gold"
      @close="closeShop"
      @purchase="handlePurchase"
    />

    <CaptainPlacementIndicator
      v-if="gamePhase === 'placement'"
      :player="placementPlayer"
    />

    <VictoryScreen
      v-if="gamePhase === 'victory' && winner"
      :winner="winner"
      :final-turn="gameState.turn"
      :units-remaining="victoryStats.unitsRemaining"
      :gold-collected="victoryStats.goldCollected"
      @restart="restartGame"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import GameHeader from '~~/components/GameHeader.vue'
import UnitInfo from '~~/components/UnitInfo.vue'
import ActionMode from '~~/components/ActionMode.vue'
import GameBoard from '~~/components/GameBoard.vue'
import UnitShop from '~~/components/UnitShop.vue'
import CaptainPlacementIndicator from '~~/components/CaptainPlacementIndicator.vue'
import VictoryScreen from '~~/components/VictoryScreen.vue'
import type { TerrainType } from '~~/components/Cell.vue'
import baseMapData from '~~/data/baseMap.json'
import { 
  type GameState, 
  type Unit as UnitType, 
  type Player,
  type CellPosition,
  getCellsInRange
} from '~~/types/gameTypes.ts'
import { 
  isTerrainWalkable, 
  canSpawnOnTerrain, 
  getTerrainDamage,
  getTerrainDamageTarget 
} from '~~/utils/Terrainconfig.ts'

const BOARD_SIZE = 8
const COLS_PER_ROW = 8

// Game phase tracking
type GamePhase = 'placement' | 'playing' | 'victory'
const gamePhase = ref<GamePhase>('placement')
const placementPlayer = ref<Player>('player1')
const showKingPlacement = ref(false) // Changed to false, no modal
const winner = ref<Player | null>(null)

// Terrain map
const terrainMap = new Map<string, TerrainType>()
baseMapData.forEach(([key, value]: [string, TerrainType]) => {
  terrainMap.set(key, value)
})

// Game state
const gameState = reactive<GameState>({
  units: [],  // Start empty, will add kings during placement phase
  selectedUnit: null,
  currentPlayer: 'player1',
  turn: 1
})

// Gold tracking
const goldState = reactive({
  player1: {
    gold: 100,
    income: 10
  },
  player2: {
    gold: 100,
    income: 10
  }
})

// Flag tracking - maps "row-col" to { owner: Player | null, contestedBy: Player | null }
const flagState = reactive<Map<string, { owner: Player | null, contestedBy: Player | null }>>(new Map())

// Initialize flags by finding all flag terrain types
const initializeFlags = () => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLS_PER_ROW; col++) {
      if (getCellTerrain(row, col) === 'flag') {
        const key = `${row}-${col}`
        flagState.set(key, { owner: null, contestedBy: null })
      }
    }
  }
}

// Call initialization
initializeFlags()

// Helper to get flag state at a position
function getFlagAt(row: number, col: number) {
  const key = `${row}-${col}`
  return flagState.get(key)
}

// Helper functions for GameBoard component
function getFlagOwner(row: number, col: number): Player | null {
  const flag = getFlagAt(row, col)
  return flag?.owner || null
}

function isFlagContested(row: number, col: number): boolean {
  const flag = getFlagAt(row, col)
  return flag?.contestedBy !== null
}

const actionMode = ref<'none' | 'move' | 'attack'>('none')
const validMoves = ref<CellPosition[]>([])
const validAttacks = ref<CellPosition[]>([])

// Explosion tracking
interface ExplosionData {
  id: string
  row: number
  col: number
}
const explosions = ref<ExplosionData[]>([])

// GameBoard ref for triggering sounds
const gameBoardRef = ref<any>(null)

// Shop state
const showShop = ref(false)
const shopSpawnPoint = ref<{ row: number, col: number } | null>(null)
let unitIdCounter = 5 // Start after initial 4 units

function getCellTerrain(row: number, col: number): TerrainType {
  const key = `${row}-${col}`
  return terrainMap.get(key) || 'void'
}

function getUnitAt(row: number, col: number): UnitType | undefined {
  return gameState.units.find(u => u.row === row && u.col === col)
}

function onCellClick(row: number, col: number) {
  // Handle Captain placement phase
  if (gamePhase.value === 'placement') {
    const clickedUnit = getUnitAt(row, col)
    if (clickedUnit) return // Can't place on existing unit
    
    // Check placement zones based on player
    const isValidPlacement = 
      (placementPlayer.value === 'player1' && col <= 2) || // Player 1: left 3 columns (0-2)
      (placementPlayer.value === 'player2' && col >= 5)    // Player 2: right 3 columns (5-7)
    
    if (!isValidPlacement) return // Invalid placement zone
    
    // Place the Captain
    const captain: UnitType = {
      id: `${placementPlayer.value}-captain`,
      name: `${placementPlayer.value === 'player1' ? 'Player 1' : 'Player 2'} Captain`,
      unitType: 'captain', 
      player: placementPlayer.value,
      row,
      col,
      health: 150,
      maxHealth: 150,
      attackPower: 30,
      moveRange: 0,  
      attackRange: 1,
      actionsRemaining: 1,
      maxActions: 1
    }
    
    gameState.units.push(captain)
    
    // Move to next player or start game
    if (placementPlayer.value === 'player1') {
      placementPlayer.value = 'player2'
    } else {
      gamePhase.value = 'playing'
      // Add starting units for both players
      addStartingUnits()
    }
    return
  }
  
  // Normal game phase
  const clickedUnit = getUnitAt(row, col)
  const terrain = getCellTerrain(row, col)
  
  // Check if clicking on spawn point with no unit
  if (!clickedUnit && canSpawnOnTerrain(terrain)) {
    // Check if this is the current player's spawn
    const isPlayer1Spawn = row <= 2 && col <= 2
    const isPlayer2Spawn = row >= 5 && col >= 5
    
    if ((gameState.currentPlayer === 'player1' && isPlayer1Spawn) ||
        (gameState.currentPlayer === 'player2' && isPlayer2Spawn)) {
      shopSpawnPoint.value = { row, col }
      showShop.value = true
      return
    }
  }
  
  // If we clicked a unit
  if (clickedUnit) {
    // If it's our unit, select it
    if (clickedUnit.player === gameState.currentPlayer && 
        clickedUnit.actionsRemaining > 0) {
      selectUnit(clickedUnit)
      return
    }
    // If it's an enemy and we have a unit selected, try to attack
    else if (gameState.selectedUnit && clickedUnit.player !== gameState.currentPlayer) {
      // Check if this enemy is in attack range
      if (validAttacks.value.some(pos => pos.row === row && pos.col === col)) {
        attackUnit(gameState.selectedUnit, clickedUnit)
        return
      }
    }
    // If it's an enemy and we don't have a unit selected, show enemy info
    else if (clickedUnit.player !== gameState.currentPlayer) {
      gameState.selectedUnit = clickedUnit
      validMoves.value = []
      validAttacks.value = []
      actionMode.value = 'none'
      return
    }
    return
  }
  
  // If we clicked an empty cell and have a unit selected, try to move
  if (gameState.selectedUnit) {
    if (validMoves.value.some(pos => pos.row === row && pos.col === col)) {
      moveUnit(gameState.selectedUnit, row, col)
      return
    }
  }
  
  // Deselect if clicking empty cell
  deselectUnit()
}

function selectUnit(unit: UnitType) {
gameState.selectedUnit = unit
validMoves.value = []
validAttacks.value = []
  
// Calculate valid moves and attacks
if (unit.actionsRemaining > 0) {
    // All units can move (including Captains)
    const moveableCells = getCellsInRange(
      { row: unit.row, col: unit.col },
      unit.moveRange,
      BOARD_SIZE,
      COLS_PER_ROW
    ).filter(pos => {
      const terrain = getCellTerrain(pos.row, pos.col)
      const hasUnit = getUnitAt(pos.row, pos.col)
      return !hasUnit && isTerrainWalkable(terrain)
    })
    
    validMoves.value = moveableCells
    
    const attackableCells = getCellsInRange(
      { row: unit.row, col: unit.col },
      unit.attackRange,
      BOARD_SIZE,
      COLS_PER_ROW
    ).filter(pos => {
      const targetUnit = getUnitAt(pos.row, pos.col)
      return targetUnit && targetUnit.player !== unit.player
    })
    
    validAttacks.value = attackableCells
    
    // Set mode based on what's available
    if (validAttacks.value.length > 0) {
      actionMode.value = 'attack'
    } else if (validMoves.value.length > 0) {
      actionMode.value = 'move'
    } else {
      actionMode.value = 'none'
    }
  }
}

function addStartingUnits() {
  // Add starting units for Player 1
  gameState.units.push(
    {
      id: 'p1-unit1',
      name: 'Berserker 1',
      unitType: 'berserker',
      player: 'player1',
      row: 2,
      col: 0,
      health: 100,
      maxHealth: 100,
      attackPower: 25,
      moveRange: 2,
      attackRange: 1,
      actionsRemaining: 2,
      maxActions: 2
    },
    {
      id: 'p1-unit2',
      name: 'Marine 1',
      unitType: 'marine',
      player: 'player1',
      row: 1,
      col: 0,
      health: 75,
      maxHealth: 75,
      attackPower: 20,
      moveRange: 2,
      attackRange: 2,
      actionsRemaining: 2,
      maxActions: 2
    }
  )
  
  // Add starting units for Player 2
  gameState.units.push(
    {
      id: 'p2-unit1',
      name: 'Berserker 2',
      unitType: 'berserker',
      player: 'player2',
      row: 5,
      col: 7,
      health: 100,
      maxHealth: 100,
      attackPower: 25,
      moveRange: 2,
      attackRange: 1,
      actionsRemaining: 2,
      maxActions: 2
    },
    {
      id: 'p2-unit2',
      name: 'Marine 2',
      unitType: 'marine',
      player: 'player2',
      row: 6,
      col: 7,
      health: 75,
      maxHealth: 75,
      attackPower: 20,
      moveRange: 2,
      attackRange: 2,
      actionsRemaining: 2,
      maxActions: 2
    }
  )
  
  unitIdCounter = 5 // Reset counter after adding initial units
}

function checkWinCondition() {
  // Check if either Captain is dead
  const player1Captain = gameState.units.find(u => u.player === 'player1' && u.unitType === 'captain')
  const player2Captain = gameState.units.find(u => u.player === 'player2' && u.unitType === 'captain')
  
  if (!player1Captain) {
    winner.value = 'player2'
    gamePhase.value = 'victory'
  } else if (!player2Captain) {
    winner.value = 'player1'
    gamePhase.value = 'victory'
  }
}

function deselectUnit() {
  gameState.selectedUnit = null
  actionMode.value = 'none'
  validMoves.value = []
  validAttacks.value = []
}

function moveUnit(unit: UnitType, row: number, col: number) {
  unit.row = row
  unit.col = col
  unit.actionsRemaining--
  
  if (unit.actionsRemaining > 0) {
    // Recalculate valid moves/attacks from new position
    selectUnit(unit)
  } else {
    deselectUnit()
  }
}

function attackUnit(attacker: UnitType, defender: UnitType) {
  // Play attack sound for attacker
  if (gameBoardRef.value) {
    gameBoardRef.value.playUnitAttackSound(attacker.id)
  }
  
  const damage = attacker.attackPower
  const wouldDie = defender.health - damage <= 0
  
  if (wouldDie) {
    // Set health to 1 temporarily so unit still renders
    defender.health = 1
    attacker.actionsRemaining--
    
    // Play death sound immediately
    if (gameBoardRef.value) {
      gameBoardRef.value.playUnitDeathSound(defender.id)
    }
    
    // Check if unit should explode (Daft or Punk)
    const shouldExplode = defender.unitType === 'daft' || defender.unitType === 'punk'
    
    if (shouldExplode) {
      // Make unit invisible and trigger explosion after 3 seconds
      setTimeout(() => {
        // Mark unit as invisible (set opacity to 0 via health = 0)
        defender.health = 0
        
        // Trigger explosion
        const explosionId = `explosion-${Date.now()}-${Math.random()}`
        explosions.value.push({
          id: explosionId,
          row: defender.row,
          col: defender.col
        })
        
        // Remove explosion after animation completes (1.2 seconds)
        setTimeout(() => {
          const expIndex = explosions.value.findIndex(e => e.id === explosionId)
          if (expIndex !== -1) {
            explosions.value.splice(expIndex, 1)
          }
        }, 1200)
      }, 3000) // 3 seconds - make unit invisible, show explosion
      
      // Actually remove unit after death sound finishes
      setTimeout(() => {
        const index = gameState.units.findIndex(u => u.id === defender.id)
        if (index !== -1) {
          gameState.units.splice(index, 1)
        }
        
        // Check win condition
        checkWinCondition()
      }, 5500) // 5.5 seconds - remove unit component (stops audio)
    } else {
      // Non-exploding units: remove after full death sound
      setTimeout(() => {
        const index = gameState.units.findIndex(u => u.id === defender.id)
        if (index !== -1) {
          gameState.units.splice(index, 1)
        }
        
        // Check win condition
        checkWinCondition()
      }, 5500) // 5.5 seconds for normal death
    }
  } else {
    // Normal damage
    defender.health -= damage
    attacker.actionsRemaining--
    
    // Play hurt sound for defender
    if (gameBoardRef.value) {
      gameBoardRef.value.playUnitHurtSound(defender.id)
    }
  }
  
  if (attacker.actionsRemaining > 0) {
    selectUnit(attacker)
  } else {
    deselectUnit()
  }
}

function endTurn() {
  // Apply terrain damage (lava) to units
  gameState.units.forEach(unit => {
    const terrain = getCellTerrain(unit.row, unit.col)
    const damage = getTerrainDamage(terrain)
    const damageTarget = getTerrainDamageTarget(terrain)
    
    if (damage > 0) {
      // Check if this unit should take damage
      const shouldTakeDamage = 
        damageTarget === 'all' ||
        (damageTarget === 'enemy' && unit.player !== gameState.currentPlayer)
      
      if (shouldTakeDamage) {
        unit.health -= damage
        
        // Remove dead unit
        if (unit.health <= 0) {
          const index = gameState.units.findIndex(u => u.id === unit.id)
          if (index !== -1) {
            gameState.units.splice(index, 1)
          }
        }
      }
    }
  })
  
  // Process flag captures for the current player
  gameState.units.forEach(unit => {
    if (unit.player === gameState.currentPlayer) {
      const terrain = getCellTerrain(unit.row, unit.col)
      if (terrain === 'flag') {
        const flagKey = `${unit.row}-${unit.col}`
        const flag = flagState.get(flagKey)
        
        if (flag) {
          // If flag was being contested last turn and unit is still there, capture it
          if (flag.contestedBy === unit.player) {
            const previousOwner = flag.owner
            flag.owner = unit.player
            flag.contestedBy = null
            
            // Update income
            if (previousOwner === null) {
              // Capturing neutral flag
              if (unit.player === 'player1') {
                goldState.player1.income += 25
              } else {
                goldState.player2.income += 25
              }
            } else if (previousOwner !== unit.player) {
              // Stealing from opponent
              if (unit.player === 'player1') {
                goldState.player1.income += 25
                goldState.player2.income -= 25
              } else {
                goldState.player2.income += 25
                goldState.player1.income -= 25
              }
            }
          } else if (flag.owner !== unit.player) {
            // Start contesting the flag
            flag.contestedBy = unit.player
          }
        }
      }
    }
  })
  
  // Reset contestedBy for flags that no longer have units on them
  flagState.forEach((flag, key) => {
    const [row, col] = key.split('-').map(Number)
    const unitOnFlag = gameState.units.find(u => u.row === row && u.col === col)
    
    if (!unitOnFlag || unitOnFlag.player !== flag.contestedBy) {
      flag.contestedBy = null
    }
  })
  
  // Reset all units' actions for the current player
  gameState.units.forEach(unit => {
    if (unit.player === gameState.currentPlayer) {
      unit.actionsRemaining = unit.maxActions
    }
  })
  
  // Add gold income for the current player
  if (gameState.currentPlayer === 'player1') {
    goldState.player1.gold += goldState.player1.income
  } else {
    goldState.player2.gold += goldState.player2.income
  }
  
  // Switch player
  gameState.currentPlayer = gameState.currentPlayer === 'player1' ? 'player2' : 'player1'
  
  // Increment turn if player 2 just finished
  if (gameState.currentPlayer === 'player1') {
    gameState.turn++
  }
  
  deselectUnit()
}

function handlePurchase(unitType: UnitType, cost: number) {
  if (!shopSpawnPoint.value) return
  
  const currentGold = gameState.currentPlayer === 'player1' 
    ? goldState.player1.gold 
    : goldState.player2.gold
  
  if (currentGold < cost) return
  
  // Deduct gold
  if (gameState.currentPlayer === 'player1') {
    goldState.player1.gold -= cost
  } else {
    goldState.player2.gold -= cost
  }
  
  // Create unit stats based on type
  const unitStats = unitType === 'berserker' 
    ? { health: 100, maxHealth: 100, attackPower: 25, moveRange: 2, attackRange: 1, maxActions: 2 }
    : { health: 75, maxHealth: 75, attackPower: 20, moveRange: 2, attackRange: 2, maxActions: 2 }
  
  // Add new unit
  const newUnit: UnitType = {
    id: `${gameState.currentPlayer}-unit${unitIdCounter++}`,
    name: `${unitType === 'berserker' ? 'Berserker' : 'Marine'} ${unitIdCounter - 1}`,
    unitType,
    player: gameState.currentPlayer,
    row: shopSpawnPoint.value.row,
    col: shopSpawnPoint.value.col,
    ...unitStats,
    actionsRemaining: 0  // Can't act on spawn turn
  }
  
  gameState.units.push(newUnit)
  
  // Close shop
  showShop.value = false
  shopSpawnPoint.value = null
}

function closeShop() {
  showShop.value = false
  shopSpawnPoint.value = null
}

function restartGame() {
  // Reset all state
  gamePhase.value = 'placement'
  placementPlayer.value = 'player1'
  showKingPlacement.value = false
  winner.value = null
  gameState.units = []
  gameState.selectedUnit = null
  gameState.currentPlayer = 'player1'
  gameState.turn = 1
  goldState.player1 = { gold: 100, income: 10 }
  goldState.player2 = { gold: 100, income: 10 }
  flagState.clear()
  initializeFlags()
  validMoves.value = []
  validAttacks.value = []
  actionMode.value = 'none'
  showShop.value = false
  shopSpawnPoint.value = null
  unitIdCounter = 5
}

// Computed for victory stats
const victoryStats = computed(() => {
  if (!winner.value) return { unitsRemaining: 0, goldCollected: 0 }
  const winnerGold = winner.value === 'player1' ? goldState.player1.gold : goldState.player2.gold
  const winnerUnits = gameState.units.filter(u => u.player === winner.value).length
  return {
    unitsRemaining: winnerUnits,
    goldCollected: winnerGold
  }
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  min-height: 100vh;
}

.game-content {
  display: flex;
  gap: 20px;
  padding: 20px;
  flex: 1;
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 250px;
}
</style>