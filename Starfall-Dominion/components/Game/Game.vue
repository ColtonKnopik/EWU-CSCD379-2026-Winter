<template>
<div class="game-container">
  <!-- Boot Sequence -->
  <GameBootSequence
    v-if="showBootSequence"
    @show-board="revealBoard"
    @show-header="revealHeader"
    @show-sidebars="revealSidebars"
    @show-footer="revealFooter"
    @complete="bootComplete"
  />

  <!-- Loading Screen -->
  <div v-if="gamePhase === 'loading'" class="loading-screen">
    <div class="loading-content">
      <div class="spinner"></div>
      <h2 class="loading-title">Loading Map...</h2>
      <p class="loading-text">Preparing the battlefield</p>
    </div>
  </div>

  <!-- Game Content (shown after loading) -->
  <template v-else>
    <GameHeader
      v-show="headerVisible"
      :class="{ 'element-reveal': headerRevealing }"
      :turn="gameState.turn"
      :current-player="gameState.currentPlayer"
      :player1-gold="goldState.player1.gold"
      :player1-income="goldState.player1.income"
      :player2-gold="goldState.player2.gold"
      :player2-income="goldState.player2.income"
      :doomsday-player="doomsdayState.controllingPlayer"
      :doomsday-turns="doomsdayState.turnsHeld"
      :doomsday-threshold="doomsdayState.threshold"
      @end-turn="endTurn"
    />

    <div class="game-content">
      <!-- Left Sidebar -->
      <LeftSidebar
        v-show="sidebarsVisible"
        :class="{ 'element-reveal': sidebarsRevealing }"
        :recent-actions="recentActions"
      />

      <!-- Game Board -->
      <GameBoard
        v-show="boardVisible"
        :class="{ 'element-reveal': boardRevealing }"
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

      <!-- Right Sidebar -->
      <RightSidebar
        v-show="sidebarsVisible"
        :class="{ 'element-reveal': sidebarsRevealing }"
        :sound-enabled="soundEnabled"
        :animation-speed="animationSpeed"
        :grid-enabled="gridEnabled"
        :game-mode="'LOCAL 1v1'"
        :map-name="'Default Map'"
        @forfeit="handleForfeit"
        @menu="handleReturnToMenu"
        @toggle-sound="toggleSound"
        @increase-speed="increaseAnimationSpeed"
        @decrease-speed="decreaseAnimationSpeed"
        @toggle-grid="toggleGrid"
      />
    </div>

    <!-- Unit Info Footer -->
    <UnitInfo
      v-show="footerVisible"
      :class="{ 'element-reveal': footerRevealing }"
      :unit="gameState.selectedUnit"
      :current-player="gameState.currentPlayer"
      @deselect="deselectUnit"
    />

      <UnitShop
        v-if="showShop && shopSpawnPoint"
        :row="shopSpawnPoint.row"
        :col="shopSpawnPoint.col"
        :available-gold="gameState.currentPlayer === 'player1' ? goldState.player1.gold : goldState.player2.gold"
        @close="closeShop"
        @purchase="handlePurchase"
      />

      <CaptainPlacementIndicator
        v-if="gamePhase === 'placement' && showKingPlacement"
        :player="placementPlayer"
        @dismiss="dismissPlacementModal"
      />

      <VictoryScreen
        v-if="gamePhase === 'victory' && winner"
        :winner="winner"
        :final-turn="gameState.turn"
        :units-remaining="victoryStats.unitsRemaining"
        :gold-collected="victoryStats.goldCollected"
        :victory-condition="victoryCondition"
        :player1-mvp="victoryStats.player1Mvp"
        :player2-mvp="victoryStats.player2Mvp"
        @restart="restartGame"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import GameHeader from '~~/components/UI/GameHeader.vue'
import UnitInfo from '~~/components/UI/UnitInfo.vue'
import ActionMode from '~~/components/UI/ActionMode.vue'
import GameBoard from '~~/components/Board/GameBoard.vue'
import UnitShop from '~~/components/Modals/UnitShop.vue'
import CaptainPlacementIndicator from '~~/components/Modals/CaptainPlacementIndicator.vue'
import VictoryScreen from '~~/components/Modals/VictoryScreen.vue'
import LeftSidebar from '~~/components/UI/LeftSidebar.vue'
import RightSidebar from '~~/components/UI/RightSidebar.vue'
import GameBootSequence from '~~/components/Game/GameBootSequence.vue'
import type { TerrainType } from '~~/components/Board/Cell.vue'
import baseMapData from '~~/data/baseMap.json'
import { getUnitDefinition, createUnit } from '~~/data/unitDefinitions'
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

// Props for optional map loading
interface Props {
  mapId?: number
}

const props = defineProps<Props>()

// Game phase tracking
type GamePhase = 'loading' | 'placement' | 'playing' | 'victory'
const gamePhase = ref<GamePhase>('loading')
const placementPlayer = ref<Player>('player1')
const showKingPlacement = ref(false) // Don't show until boot complete
const winner = ref<Player | null>(null)
const mapLoading = ref(true)

// Sidebar state
const soundEnabled = ref(true)
const animationSpeed = ref(1)
const gridEnabled = ref(false)
const recentActions = ref<Array<{ turn: number; text: string }>>([])

// Boot sequence state
const showBootSequence = ref(true)
const boardVisible = ref(false)
const boardRevealing = ref(false)
const headerVisible = ref(false)
const headerRevealing = ref(false)
const sidebarsVisible = ref(false)
const sidebarsRevealing = ref(false)
const footerVisible = ref(false)
const footerRevealing = ref(false)

// Terrain map
const terrainMap = new Map<string, TerrainType>()

const { getMapJson, getMaps } = useMapApi()

// Load map data
async function loadMapData() {
  mapLoading.value = true
  
  if (props.mapId) {
    // Load map from database by ID
    try {
      const data = await getMapJson(props.mapId)
      terrainMap.clear()
      data.forEach(([key, value]: [string, string]) => {
        terrainMap.set(key, value as TerrainType)
      })
      console.log('✅ Map loaded from database, id:', props.mapId)
    } catch (error) {
      console.error('❌ Failed to load map from database, using baseMap.json fallback:', error)
      loadDefaultMap()
    }
  } else {
    // Load default map (try database first, fallback to baseMap.json)
    await loadDefaultMap()
  }
  
  // Initialize flags after map is loaded
  initializeFlags()
  
  mapLoading.value = false
  gamePhase.value = 'placement' // Now transition to placement phase
}

async function loadDefaultMap() {
  // Try to load from database first
  try {
    const response = await getMaps()
    if (response.data.length > 0) {
      const firstMap = response.data[0]
      if (firstMap) {
        const data = await getMapJson(firstMap.id)
        terrainMap.clear()
        data.forEach(([key, value]: [string, string]) => {
          terrainMap.set(key, value as TerrainType)
        })
        console.log('✅ Default map loaded from database')
        return
      }
    }
  } catch (error) {
    console.warn('⚠️ Database not available, using baseMap.json:', error)
  }
  
  // Fallback to baseMap.json
  terrainMap.clear()
  baseMapData.forEach(([key, value]: [string, TerrainType]) => {
    terrainMap.set(key, value)
  })
  console.log('✅ Using baseMap.json fallback')
}

// Initialize map on mount
onMounted(async () => {
  await loadMapData()
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

// Doomsday counter - win by controlling all flags for consecutive turns
const doomsdayState = reactive({
  controllingPlayer: null as Player | null,
  turnsHeld: 0,
  threshold: 4
})

// Victory condition tracking
type VictoryCondition = 'captain-eliminated' | 'doomsday' | 'forfeit'
const victoryCondition = ref<VictoryCondition>('captain-eliminated')

// Unit damage tracking for MVP stats
interface UnitDamageRecord {
  unitType: string
  player: Player
  totalDamage: number
  kills: number
}
const unitDamageStats = reactive<Record<string, UnitDamageRecord>>({})

// Initialize flags by finding all flag terrain types
const initializeFlags = () => {
  flagState.clear()
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLS_PER_ROW; col++) {
      if (getCellTerrain(row, col) === 'flag') {
        const key = `${row}-${col}`
        flagState.set(key, { owner: null, contestedBy: null })
      }
    }
  }
}

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

function checkDoomsdayCondition(): Player | null {
  const allFlags = Array.from(flagState.values())
  if (allFlags.length === 0) return null
  
  const firstFlag = allFlags[0]!
  if (firstFlag.owner === null) return null
  
  const firstOwner = firstFlag.owner
  return allFlags.every(f => f.owner === firstOwner) ? firstOwner : null
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

// Dismiss placement modal
function dismissPlacementModal() {
  showKingPlacement.value = false
}

function onCellClick(row: number, col: number) {
  // Don't allow clicks if modal is showing
  if (gamePhase.value === 'placement' && showKingPlacement.value) {
    return
  }
  
  // Handle Captain placement phase
  if (gamePhase.value === 'placement') {
    const clickedUnit = getUnitAt(row, col)
    if (clickedUnit) return // Can't place on existing unit
    
    // Check terrain - captains can only be placed on land
    const terrain = getCellTerrain(row, col)
    if (terrain !== 'land') {
      console.log('Cannot place captain on', terrain)
      return // Only allow placement on land
    }
    
    // Check placement zones based on player
    const isValidPlacement = 
      (placementPlayer.value === 'player1' && col <= 2) || // Player 1: left 3 columns (0-2)
      (placementPlayer.value === 'player2' && col >= 5)    // Player 2: right 3 columns (5-7)
    
    if (!isValidPlacement) return // Invalid placement zone
    
    // Place the Captain using unit definition
    const captain = createUnit(
      'captain',
      placementPlayer.value,
      row,
      col,
      `${placementPlayer.value}-captain`,
      1 // Captains start with 1 action
    )
    
    gameState.units.push(captain)
    
    // Play captain spawn sound
    nextTick(() => {
      if (gameBoardRef.value) {
        gameBoardRef.value.playUnitSpawnSound(captain.id)
      }
    })
    
    // Move to next player or start game
    if (placementPlayer.value === 'player1') {
      placementPlayer.value = 'player2'
      showKingPlacement.value = true // Show modal for player 2
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
  
  // Check if clicking on a spawn point (purple cell) with no unit
  const isSpawnTerrain = terrain === 'spawn'
  const isPlayer1Side = col <= 3  // Left half of the board
  const isPlayer2Side = col >= 4  // Right half of the board
  
  if (!clickedUnit && isSpawnTerrain) {
    // Check if this spawn point belongs to the current player
    if ((gameState.currentPlayer === 'player1' && isPlayer1Side) ||
        (gameState.currentPlayer === 'player2' && isPlayer2Side)) {
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
  unitIdCounter = 3 
}

function checkWinCondition() {
  // Check if either Captain is dead
  const player1Captain = gameState.units.find(u => u.player === 'player1' && u.unitType === 'captain')
  const player2Captain = gameState.units.find(u => u.player === 'player2' && u.unitType === 'captain')
  
  if (!player1Captain) {
    victoryCondition.value = 'captain-eliminated'
    winner.value = 'player2'
    gamePhase.value = 'victory'
  } else if (!player2Captain) {
    victoryCondition.value = 'captain-eliminated'
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
  // Get unit definition for attack animation data
  const attackerDef = getUnitDefinition(attacker.unitType)
  
  // Trigger attack animation
  if (gameBoardRef.value) {
    gameBoardRef.value.triggerAttackAnimation(
      attackerDef.attackAnimation,
      attacker.row,
      attacker.col,
      defender.row,
      defender.col,
      attackerDef.attackAnimationDuration
    )
  }
  
  // Play attack sound (charged blast includes charge sound, so start at 0ms)
  const soundDelay = attackerDef.attackAnimation === 'charged-blast' ? 0 : 100
  setTimeout(() => {
    if (gameBoardRef.value) {
      gameBoardRef.value.playUnitAttackSound(attacker.id)
    }
  }, soundDelay)
  
  const damage = attacker.attackPower
  const wouldDie = defender.health - damage <= 0
  
  // Track damage stats for MVP
  const record = unitDamageStats[attacker.id]
  if (record) {
    record.totalDamage += damage
    if (wouldDie) record.kills++
  } else {
    unitDamageStats[attacker.id] = {
      unitType: attacker.unitType,
      player: attacker.player,
      totalDamage: damage,
      kills: wouldDie ? 1 : 0
    }
  }
  
  if (wouldDie) {
    // Log unit kill
    const attackerName = attacker.unitType.charAt(0).toUpperCase() + attacker.unitType.slice(1)
    const defenderName = defender.unitType.charAt(0).toUpperCase() + defender.unitType.slice(1)
    const playerName = attacker.player === 'player1' ? 'P1' : 'P2'
    addAction(`${playerName} ${attackerName} eliminated enemy ${defenderName}`)
    
    // Set health to 1 temporarily so unit still renders
    defender.health = 1
    attacker.actionsRemaining--
    
    // Play death sound immediately
    if (gameBoardRef.value) {
      gameBoardRef.value.playUnitDeathSound(defender.id)
    }
    
    // Check if unit should explode (use unit definition)
    const defenderDef = getUnitDefinition(defender.unitType)
    const shouldExplode = defenderDef.explodeOnDeath === true
    
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
    
    // Log attack damage
    const attackerName = attacker.unitType.charAt(0).toUpperCase() + attacker.unitType.slice(1)
    const defenderName = defender.unitType.charAt(0).toUpperCase() + defender.unitType.slice(1)
    const playerName = attacker.player === 'player1' ? 'P1' : 'P2'
    addAction(`${playerName} ${attackerName} dealt ${damage} damage to ${defenderName}`)
    
    // Play hurt sound for defender (delay to sync with animation impact)
    setTimeout(() => {
      if (gameBoardRef.value) {
        gameBoardRef.value.playUnitHurtSound(defender.id)
      }
    }, attackerDef.attackAnimationDuration * 0.7) // Play hurt sound near end of animation
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
          const unitName = unit.unitType.charAt(0).toUpperCase() + unit.unitType.slice(1)
          const playerName = unit.player === 'player1' ? 'P1' : 'P2'
          addAction(`${playerName} ${unitName} perished from terrain hazard`)
          
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
              const playerName = unit.player === 'player1' ? 'P1' : 'P2'
              addAction(`${playerName} captured a neutral flag (+25 income)`)
              
              if (unit.player === 'player1') {
                goldState.player1.income += 25
              } else {
                goldState.player2.income += 25
              }
            } else if (previousOwner !== unit.player) {
              // Stealing from opponent
              const playerName = unit.player === 'player1' ? 'P1' : 'P2'
              const enemyName = previousOwner === 'player1' ? 'P1' : 'P2'
              addAction(`${playerName} captured flag from ${enemyName} (+25 income)`)
              
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
            const playerName = unit.player === 'player1' ? 'P1' : 'P2'
            const unitName = unit.unitType.charAt(0).toUpperCase() + unit.unitType.slice(1)
            addAction(`${playerName} ${unitName} contesting flag at (${unit.row},${unit.col})`)
            
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
  
  // Check Doomsday condition - only after both players have acted (when player 2 ends turn)
  if (gameState.currentPlayer === 'player2') {
    const dominator = checkDoomsdayCondition()
    
    if (dominator) {
      if (doomsdayState.controllingPlayer === dominator) {
        doomsdayState.turnsHeld++
      } else {
        doomsdayState.controllingPlayer = dominator
        doomsdayState.turnsHeld = 1
      }
      
      if (doomsdayState.turnsHeld >= doomsdayState.threshold) {
        const playerName = dominator === 'player1' ? 'P1' : 'P2'
        addAction(`DOOMSDAY! ${playerName} wins by total domination!`)
        victoryCondition.value = 'doomsday'
        winner.value = dominator
        gamePhase.value = 'victory'
        return
      }
      
      const playerName = dominator === 'player1' ? 'P1' : 'P2'
      const remaining = doomsdayState.threshold - doomsdayState.turnsHeld
      addAction(`Doomsday ${doomsdayState.turnsHeld}/${doomsdayState.threshold} - ${playerName} controls all flags`)
    } else {
      if (doomsdayState.turnsHeld > 0) {
        addAction(`Doomsday averted - flag control broken`)
      }
      doomsdayState.controllingPlayer = null
      doomsdayState.turnsHeld = 0
    }
  }
  
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
  
  // Create new unit using unit definition
  const newUnit = createUnit(
    unitType,
    gameState.currentPlayer,
    shopSpawnPoint.value.row,
    shopSpawnPoint.value.col,
    `${gameState.currentPlayer}-unit${unitIdCounter++}`,
    0
  )
  
  // Give recruited units their full actions
  newUnit.actionsRemaining = newUnit.maxActions
  
  gameState.units.push(newUnit)
  
  // Log unit recruitment
  const unitName = unitType.charAt(0).toUpperCase() + unitType.slice(1)
  const playerName = gameState.currentPlayer === 'player1' ? 'P1' : 'P2'
  addAction(`${playerName} recruited ${unitName} (${cost} gold)`)
  
  // Play spawn sound
  nextTick(() => {
    if (gameBoardRef.value) {
      gameBoardRef.value.playUnitSpawnSound(newUnit.id)
    }
  })
  
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
  doomsdayState.controllingPlayer = null
  doomsdayState.turnsHeld = 0
  victoryCondition.value = 'captain-eliminated'
  Object.keys(unitDamageStats).forEach(key => delete unitDamageStats[key])
  validMoves.value = []
  validAttacks.value = []
  actionMode.value = 'none'
  showShop.value = false
  shopSpawnPoint.value = null
  unitIdCounter = 5
  recentActions.value = [] // Clear combat log on restart
}

// Computed for victory stats
const victoryStats = computed(() => {
  if (!winner.value) return { unitsRemaining: 0, goldCollected: 0, player1Mvp: null, player2Mvp: null }
  const winnerGold = winner.value === 'player1' ? goldState.player1.gold : goldState.player2.gold
  const winnerUnits = gameState.units.filter(u => u.player === winner.value).length
  
  // Calculate MVPs by total damage dealt
  let p1Best: UnitDamageRecord | null = null
  let p2Best: UnitDamageRecord | null = null
  for (const record of Object.values(unitDamageStats)) {
    if (record.player === 'player1' && (!p1Best || record.totalDamage > p1Best.totalDamage)) {
      p1Best = record
    }
    if (record.player === 'player2' && (!p2Best || record.totalDamage > p2Best.totalDamage)) {
      p2Best = record
    }
  }
  
  return {
    unitsRemaining: winnerUnits,
    goldCollected: winnerGold,
    player1Mvp: p1Best ? { ...p1Best } : null,
    player2Mvp: p2Best ? { ...p2Best } : null
  }
})

// Sidebar action handlers
function handleForfeit() {
  if (confirm('Are you sure you want to forfeit the match?')) {
    victoryCondition.value = 'forfeit'
    winner.value = gameState.currentPlayer === 'player1' ? 'player2' : 'player1'
    gamePhase.value = 'victory'
  }
}

function handleReturnToMenu() {
  if (confirm('Return to main menu? Current game will be lost.')) {
    navigateTo('/')
  }
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
}

function increaseAnimationSpeed() {
  if (animationSpeed.value < 2) {
    animationSpeed.value = Math.min(2, animationSpeed.value + 0.25)
  }
}

function decreaseAnimationSpeed() {
  if (animationSpeed.value > 0.5) {
    animationSpeed.value = Math.max(0.5, animationSpeed.value - 0.25)
  }
}

function toggleGrid() {
  gridEnabled.value = !gridEnabled.value
}

function addAction(text: string) {
  recentActions.value.unshift({
    turn: gameState.turn,
    text
  })
  // Keep all actions throughout the match (no limit)
}

// Boot sequence reveal functions
function revealBoard() {
  boardVisible.value = true
  boardRevealing.value = true
}

function revealHeader() {
  headerVisible.value = true
  headerRevealing.value = true
}

function revealSidebars() {
  sidebarsVisible.value = true
  sidebarsRevealing.value = true
}

function revealFooter() {
  footerVisible.value = true
  footerRevealing.value = true
}

function bootComplete() {
  showBootSequence.value = false
  // Show placement modal after boot sequence completes
  if (gamePhase.value === 'placement') {
    showKingPlacement.value = true
  }
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  height: 100vh;
  overflow: hidden;
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
}

.loading-content {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 30px;
  border: 4px solid #333;
  border-top-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-title {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 15px 0;
  text-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
}

.loading-text {
  font-size: 18px;
  color: #999;
  margin: 0;
}

.game-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px;
  gap: 15px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* Element Reveal Animation */
.element-reveal {
  animation: elementReveal 0.8s ease-out forwards;
}

@keyframes elementReveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* Remove old sidebar styles */
</style>