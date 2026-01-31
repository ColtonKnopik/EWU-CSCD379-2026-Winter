<template>
  <div class="game-container">
    <div class="game-ui">
      <div class="turn-info">
        <h2>Turn {{ gameState.turn }}</h2>
        <p class="current-player" :class="gameState.currentPlayer">
          {{ gameState.currentPlayer === 'player1' ? 'Player 1' : 'Player 2' }}'s Turn
        </p>
        <button @click="endTurn" class="end-turn-btn">End Turn</button>
      </div>

      <div class="gold-section">
        <GoldDisplay 
          player="player1" 
          :gold="goldState.player1.gold" 
          :income="goldState.player1.income"
        />
        <GoldDisplay 
          player="player2" 
          :gold="goldState.player2.gold" 
          :income="goldState.player2.income"
        />
      </div>

      <div v-if="gameState.selectedUnit" class="unit-info">
        <h3>{{ gameState.selectedUnit.name }}</h3>
        <p>Health: {{ gameState.selectedUnit.health }}/{{ gameState.selectedUnit.maxHealth }}</p>
        <p>Actions: {{ gameState.selectedUnit.actionsRemaining }}/{{ gameState.selectedUnit.maxActions }}</p>
        <p>Attack: {{ gameState.selectedUnit.attackPower }}</p>
        <p>Move Range: {{ gameState.selectedUnit.moveRange }}</p>
        <p>Attack Range: {{ gameState.selectedUnit.attackRange }}</p>
        <button @click="deselectUnit" class="deselect-btn">Deselect</button>
      </div>

      <div class="action-mode">
        <p v-if="actionMode === 'move' && validAttacks.length === 0" class="mode-text move">Click a cell to MOVE</p>
        <p v-if="actionMode === 'attack' && validMoves.length === 0" class="mode-text attack">Click an enemy to ATTACK</p>
        <div v-if="validMoves.length > 0 && validAttacks.length > 0" class="mode-both">
          <p class="mode-text move">Click a cell to MOVE</p>
          <p class="mode-text attack">Click an enemy to ATTACK</p>
        </div>
      </div>
    </div>

    <div class="board-wrapper">
      <div class="board">
        <div
          v-for="row in BOARD_SIZE"
          :key="row"
          class="hex-row"
          :class="{ offset: row % 2 === 0 }"
        >
          <div
            v-for="col in COLS_PER_ROW"
            :key="`${row}-${col}`"
            class="cell-wrapper"
          >
            <Cell
              :row="row - 1"
              :col="col - 1"
              :terrain-type="getCellTerrain(row - 1, col - 1)"
              :flag-owner="getFlagAt(row - 1, col - 1)?.owner || null"
              :flag-contested="getFlagAt(row - 1, col - 1)?.contestedBy !== null"
              @click="onCellClick(row - 1, col - 1)"
              :class="getCellHighlight(row - 1, col - 1)"
            />
            <Unit
              v-if="getUnitAt(row - 1, col - 1)"
              :unit-type="getUnitAt(row - 1, col - 1)!.unitType"
              :player="getUnitAt(row - 1, col - 1)!.player"
              :health="getUnitAt(row - 1, col - 1)!.health"
              :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
              :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
              :is-selected="gameState.selectedUnit?.id === getUnitAt(row - 1, col - 1)!.id"
              @click="onCellClick(row - 1, col - 1)"
            />
          </div>
        </div>
      </div>
    </div>

    <UnitShop
      v-if="showShop && shopSpawnPoint"
      :row="shopSpawnPoint.row"
      :col="shopSpawnPoint.col"
      :available-gold="gameState.currentPlayer === 'player1' ? goldState.player1.gold : goldState.player2.gold"
      @close="closeShop"
      @purchase="handlePurchase"
    />

    <KingPlacement
      v-if="showKingPlacement"
      :player="placementPlayer"
      @close="closeKingPlacement"
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
import Cell, { type TerrainType } from '~~/components/Cell.vue'
import Unit from '~~/components/Unit.vue'
import GoldDisplay from '~~/components/GoldDisplay.vue'
import UnitShop from '~~/components/UnitShop.vue'
import KingPlacement from '~~/components/KingPlacement.vue'
import VictoryScreen from '~~/components/VictoryScreen.vue'
import baseMapData from '~~/data/baseMap.json'
import { 
  type GameState, 
  type Unit as UnitType, 
  type Player,
  type CellPosition,
  getHexDistance,
  getCellsInRange
} from '~~/types/gameTypes.ts'
import { 
  isTerrainWalkable, 
  canSpawnOnTerrain, 
  getTerrainDamage,
  getTerrainDamageTarget 
} from '~~/utils/terrainConfig.ts'

const BOARD_SIZE = 8
const COLS_PER_ROW = 8

// Game phase tracking
type GamePhase = 'placement' | 'playing' | 'victory'
const gamePhase = ref<GamePhase>('placement')
const placementPlayer = ref<Player>('player1')
const showKingPlacement = ref(true)
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

const actionMode = ref<'none' | 'move' | 'attack'>('none')
const validMoves = ref<CellPosition[]>([])
const validAttacks = ref<CellPosition[]>([])

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

function closeKingPlacement() {
  showKingPlacement.value = false
}

function onCellClick(row: number, col: number) {
  // Handle King placement phase
  if (gamePhase.value === 'placement') {
    const clickedUnit = getUnitAt(row, col)
    if (clickedUnit) return // Can't place on existing unit
    
    // Allow placing anywhere (removed terrain and area restrictions)
    
    // Place the King
    const king: UnitType = {
      id: `${placementPlayer.value}-king`,
      name: `${placementPlayer.value === 'player1' ? 'Player 1' : 'Player 2'} King`,
      unitType: 'king',
      player: placementPlayer.value,
      row,
      col,
      health: 150,
      maxHealth: 150,
      attackPower: 30,
      moveRange: 0,  // King cannot move
      attackRange: 1,
      actionsRemaining: 1,
      maxActions: 1
    }
    
    gameState.units.push(king)
    
    // Move to next player or start game
    if (placementPlayer.value === 'player1') {
      placementPlayer.value = 'player2'
      showKingPlacement.value = true
    } else {
      gamePhase.value = 'playing'
      showKingPlacement.value = false
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
    // If it's our unit, select it (but not if it's a King - they can't move)
    if (clickedUnit.player === gameState.currentPlayer && 
        clickedUnit.actionsRemaining > 0 && 
        clickedUnit.unitType !== 'king') {
      selectUnit(clickedUnit)
      return
    }
    // Allow selecting King for attack display
    if (clickedUnit.player === gameState.currentPlayer && 
        clickedUnit.unitType === 'king') {
      selectUnit(clickedUnit)
      return
    }
    // If it's an enemy and we have a unit selected, try to attack
    else if (gameState.selectedUnit && clickedUnit.player !== gameState.currentPlayer) {
      // Check if this enemy is in attack range
      if (validAttacks.value.some(pos => pos.row === row && pos.col === col)) {
        attackUnit(gameState.selectedUnit, clickedUnit)
      }
      return
    }
    return
  }
  
  // If we clicked an empty cell and have a unit selected, try to move
  if (gameState.selectedUnit) {
    if (validMoves.value.some(pos => pos.row === row && pos.col === col)) {
      moveUnit(gameState.selectedUnit, row, col)
    }
  }
}

function selectUnit(unit: UnitType) {
  gameState.selectedUnit = unit
  validMoves.value = []
  validAttacks.value = []
  
  // Calculate valid moves and attacks
  if (unit.actionsRemaining > 0) {
    // Kings can't move but can attack
    if (unit.unitType !== 'king') {
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
    }
    
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
  // Check if either King is dead
  const player1King = gameState.units.find(u => u.player === 'player1' && u.unitType === 'king')
  const player2King = gameState.units.find(u => u.player === 'player2' && u.unitType === 'king')
  
  if (!player1King) {
    winner.value = 'player2'
    gamePhase.value = 'victory'
  } else if (!player2King) {
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
  defender.health -= attacker.attackPower
  attacker.actionsRemaining--
  
  if (defender.health <= 0) {
    // Remove dead unit
    const index = gameState.units.findIndex(u => u.id === defender.id)
    if (index !== -1) {
      gameState.units.splice(index, 1)
    }
    
    // Check win condition
    checkWinCondition()
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

function getCellHighlight(row: number, col: number): string {
  if (validMoves.value.some(pos => pos.row === row && pos.col === col)) {
    return 'highlight-move'
  }
  if (validAttacks.value.some(pos => pos.row === row && pos.col === col)) {
    return 'highlight-attack'
  }
  return ''
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
  showKingPlacement.value = true
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
  gap: 20px;
  padding: 20px;
  background: #0a0a0a;
  min-height: 100vh;
}

.game-ui {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 250px;
}

.turn-info,
.unit-info {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}

.gold-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.turn-info h2 {
  margin: 0 0 10px 0;
}

.current-player {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.current-player.player1 {
  background: #3498db;
}

.current-player.player2 {
  background: #e74c3c;
}

.end-turn-btn,
.deselect-btn {
  width: 100%;
  padding: 12px;
  background: #555;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.end-turn-btn:hover,
.deselect-btn:hover {
  background: #666;
}

.unit-info h3 {
  margin: 0 0 10px 0;
}

.unit-info p {
  margin: 5px 0;
}

.action-mode {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
}

.mode-both {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-text {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
}

.mode-text.move {
  background: #27ae60;
  color: white;
}

.mode-text.attack {
  background: #e74c3c;
  color: white;
}

.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
  flex: 1;
}

.board {
  display: flex;
  flex-direction: column;
}

.hex-row {
  display: flex;
  height: 100px;
  margin-top: -25px;
}

.hex-row:first-child {
  margin-top: 0;
}

.hex-row.offset {
  margin-left: 43.3px;
}

.cell-wrapper {
  width: 86.6px;
  height: 100px;
  flex-shrink: 0;
  margin-left: -1px;
  position: relative;
}

.cell-wrapper:first-child {
  margin-left: 0;
}

:deep(.highlight-move .hexagon-shape) {
  stroke: #27ae60;
  stroke-width: 4;
  filter: brightness(1.2);
}

:deep(.highlight-attack .hexagon-shape) {
  stroke: #e74c3c;
  stroke-width: 4;
  filter: brightness(1.2);
}
</style>