<template>
  <div class="board-wrapper">
    <div class="board-container">
      <div class="board">
        <div
          v-for="row in boardSize"
          :key="row"
          class="hex-row"
          :class="{ offset: row % 2 === 0 }"
        >
          <div
            v-for="col in colsPerRow"
            :key="`${row}-${col}`"
            class="cell-wrapper"
            :class="{ 'interaction-locked': isAnyUnitAnimating }"
          >
            <Cell
              :row="row - 1"
              :col="col - 1"
              :terrain-type="getCellTerrain(row - 1, col - 1)"
              :flag-owner="getFlagOwner(row - 1, col - 1)"
              :flag-contested="isFlagContested(row - 1, col - 1)"
              @click="handleCellClick(row - 1, col - 1)"
              :class="getCellHighlight(row - 1, col - 1)"
            />
            <template v-if="getUnitAt(row - 1, col - 1) && !isAnimating(getUnitAt(row - 1, col - 1)!.id)">
              <Captain
                v-if="getUnitAt(row - 1, col - 1)!.unitType === 'captain'"
                :ref="(el: any) => setUnitRef(getUnitAt(row - 1, col - 1)?.id, el)"
                :player="getUnitAt(row - 1, col - 1)!.player"
                :health="getUnitAt(row - 1, col - 1)!.health"
                :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
                :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
                :is-selected="selectedUnitId === getUnitAt(row - 1, col - 1)!.id"
                :current-player="currentPlayer"
                @click="handleCellClick(row - 1, col - 1)"
              />
              <Berserker
                v-else-if="getUnitAt(row - 1, col - 1)!.unitType === 'berserker'"
                :ref="(el: any) => setUnitRef(getUnitAt(row - 1, col - 1)?.id, el)"
                :player="getUnitAt(row - 1, col - 1)!.player"
                :health="getUnitAt(row - 1, col - 1)!.health"
                :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
                :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
                :is-selected="selectedUnitId === getUnitAt(row - 1, col - 1)!.id"
                :current-player="currentPlayer"
                @click="handleCellClick(row - 1, col - 1)"
              />
              <Marine
                v-else-if="getUnitAt(row - 1, col - 1)!.unitType === 'marine'"
                :ref="(el: any) => setUnitRef(getUnitAt(row - 1, col - 1)?.id, el)"
                :player="getUnitAt(row - 1, col - 1)!.player"
                :health="getUnitAt(row - 1, col - 1)!.health"
                :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
                :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
                :is-selected="selectedUnitId === getUnitAt(row - 1, col - 1)!.id"
                :current-player="currentPlayer"
                @click="handleCellClick(row - 1, col - 1)"
              />
              <Daft
                v-else-if="getUnitAt(row - 1, col - 1)!.unitType === 'daft'"
                :ref="(el: any) => setUnitRef(getUnitAt(row - 1, col - 1)?.id, el)"
                :player="getUnitAt(row - 1, col - 1)!.player"
                :health="getUnitAt(row - 1, col - 1)!.health"
                :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
                :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
                :is-selected="selectedUnitId === getUnitAt(row - 1, col - 1)!.id"
                :current-player="currentPlayer"
                @click="handleCellClick(row - 1, col - 1)"
              />
              <Punk
                v-else-if="getUnitAt(row - 1, col - 1)!.unitType === 'punk'"
                :ref="(el: any) => setUnitRef(getUnitAt(row - 1, col - 1)?.id, el)"
                :player="getUnitAt(row - 1, col - 1)!.player"
                :health="getUnitAt(row - 1, col - 1)!.health"
                :max-health="getUnitAt(row - 1, col - 1)!.maxHealth"
                :actions-remaining="getUnitAt(row - 1, col - 1)!.actionsRemaining"
                :is-selected="selectedUnitId === getUnitAt(row - 1, col - 1)!.id"
                :current-player="currentPlayer"
                @click="handleCellClick(row - 1, col - 1)"
              />
            </template>
          </div>
        </div>
      </div>
      
      <!-- Animation layer for smooth unit movement -->
      <div class="animation-layer" :class="{ active: isAnyUnitAnimating }">
        <Captain
          v-for="anim in animatingUnits.filter(a => a.unit.unitType === 'captain')"
          :key="anim.unitId"
          :ref="(el: any) => setUnitRef(anim.unitId, el)"
          :player="anim.unit.player"
          :health="anim.unit.health"
          :max-health="anim.unit.maxHealth"
          :actions-remaining="anim.unit.actionsRemaining"
          :is-selected="selectedUnitId === anim.unitId"
          :current-player="currentPlayer"
          :style="getAnimationStyle(anim)"
        />
        <Berserker
          v-for="anim in animatingUnits.filter(a => a.unit.unitType === 'berserker')"
          :key="anim.unitId"
          :ref="(el: any) => setUnitRef(anim.unitId, el)"
          :player="anim.unit.player"
          :health="anim.unit.health"
          :max-health="anim.unit.maxHealth"
          :actions-remaining="anim.unit.actionsRemaining"
          :is-selected="selectedUnitId === anim.unitId"
          :current-player="currentPlayer"
          :style="getAnimationStyle(anim)"
        />
        <Marine
          v-for="anim in animatingUnits.filter(a => a.unit.unitType === 'marine')"
          :key="anim.unitId"
          :ref="(el: any) => setUnitRef(anim.unitId, el)"
          :player="anim.unit.player"
          :health="anim.unit.health"
          :max-health="anim.unit.maxHealth"
          :actions-remaining="anim.unit.actionsRemaining"
          :is-selected="selectedUnitId === anim.unitId"
          :current-player="currentPlayer"
          :style="getAnimationStyle(anim)"
        />
        <Daft
          v-for="anim in animatingUnits.filter(a => a.unit.unitType === 'daft')"
          :key="anim.unitId"
          :ref="(el: any) => setUnitRef(anim.unitId, el)"
          :player="anim.unit.player"
          :health="anim.unit.health"
          :max-health="anim.unit.maxHealth"
          :actions-remaining="anim.unit.actionsRemaining"
          :is-selected="selectedUnitId === anim.unitId"
          :current-player="currentPlayer"
          :style="getAnimationStyle(anim)"
        />
        <Punk
          v-for="anim in animatingUnits.filter(a => a.unit.unitType === 'punk')"
          :key="anim.unitId"
          :ref="(el: any) => setUnitRef(anim.unitId, el)"
          :player="anim.unit.player"
          :health="anim.unit.health"
          :max-health="anim.unit.maxHealth"
          :actions-remaining="anim.unit.actionsRemaining"
          :is-selected="selectedUnitId === anim.unitId"
          :current-player="currentPlayer"
          :style="getAnimationStyle(anim)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import Cell, { type TerrainType } from '~~/components/Cell.vue'
import Captain from '~~/components/Units/Captain.vue'
import Berserker from '~~/components/Units/Berserker.vue'
import Marine from '~~/components/Units/Marine.vue'
import Daft from '~~/components/Units/Daft.vue'
import Punk from '~~/components/Units/Punk.vue'
import { useUnitAnimation } from '~~/composables/useUnitAnimation'
import type { Unit as UnitType, Player, CellPosition } from '~~/types/gameTypes'

const props = defineProps<{
  boardSize: number
  colsPerRow: number
  units: UnitType[]
  selectedUnitId: string | null
  validMoves: CellPosition[]
  validAttacks: CellPosition[]
  placementZone: { player: Player, cols: number[] } | null
  currentPlayer: Player
  getCellTerrain: (row: number, col: number) => TerrainType
  getFlagOwner: (row: number, col: number) => Player | null
  isFlagContested: (row: number, col: number) => boolean
}>()

const emit = defineEmits<{
  cellClick: [row: number, col: number]
}>()

// Store refs to unit components so we can call their sound methods
const unitRefs = ref<Map<string, any>>(new Map())

function setUnitRef(unitId: string | undefined, el: any) {
  // Guard against null/undefined unitId or el
  if (!unitId || el === null || el === undefined) {
    return
  }
  
  unitRefs.value.set(unitId, el)
}

// Expose methods for Game.vue to trigger sounds
function playUnitAttackSound(unitId: string) {
  const unitRef = unitRefs.value.get(unitId)
  if (unitRef && unitRef.playAttackSound) {
    unitRef.playAttackSound()
  }
}

function playUnitHurtSound(unitId: string) {
  const unitRef = unitRefs.value.get(unitId)
  if (unitRef && unitRef.playHurtSound) {
    unitRef.playHurtSound()
  }
}

function playUnitDeathSound(unitId: string) {
  const unitRef = unitRefs.value.get(unitId)
  if (unitRef && unitRef.playDeathSound) {
    console.log(`Playing death sound for unit: ${unitId}`)
    unitRef.playDeathSound()
  } else {
    console.warn(`Could not find unit ref or playDeathSound for: ${unitId}`)
  }
}

defineExpose({
  playUnitAttackSound,
  playUnitHurtSound,
  playUnitDeathSound
})

// Animation system
const unitsRef = toRef(props, 'units')
const { animatingUnits, isAnyUnitAnimating, isAnimating, getAnimationStyle } = useUnitAnimation(unitsRef)

// Handle cell clicks with animation lock
function handleCellClick(row: number, col: number) {
  if (isAnyUnitAnimating.value) {
    return // Block all clicks during animations
  }
  emit('cellClick', row, col)
}

function getUnitAt(row: number, col: number): UnitType | undefined {
  return props.units.find(u => u.row === row && u.col === col)
}

function getCellHighlight(row: number, col: number): string {
  const unitOnCell = getUnitAt(row, col)
  
  if (props.placementZone && props.placementZone.cols.includes(col)) {
    return props.placementZone.player === 'player1' ? 'highlight-placement-p1' : 'highlight-placement-p2'
  }
  
  if (props.validMoves.some(pos => pos.row === row && pos.col === col)) {
    return 'highlight-move'
  }
  if (props.validAttacks.some(pos => pos.row === row && pos.col === col)) {
    return 'highlight-attack'
  }
  
  if (unitOnCell) {
    return unitOnCell.player === 'player1' ? 'highlight-unit-p1' : 'highlight-unit-p2'
  }
  
  return ''
}
</script>

<style scoped>
.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
  flex: 1;
}

.board-container {
  position: relative;
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

.cell-wrapper.interaction-locked {
  pointer-events: none;
}

.animation-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.animation-layer.active {
  pointer-events: all;
}

.animation-layer > * {
  pointer-events: none;
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

:deep(.highlight-placement-p1 .hexagon-shape) {
  stroke: #3b82f6;
  stroke-width: 3;
  filter: brightness(1.3);
  animation: placementPulse 2s ease-in-out infinite;
}

:deep(.highlight-placement-p2 .hexagon-shape) {
  stroke: #a855f7;
  stroke-width: 3;
  filter: brightness(1.3);
  animation: placementPulse 2s ease-in-out infinite;
}

:deep(.highlight-unit-p1 .hexagon-shape) {
  stroke: #3b82f6;
  stroke-width: 3;
  filter: brightness(1.1);
}

:deep(.highlight-unit-p2 .hexagon-shape) {
  stroke: #ef4444;
  stroke-width: 3;
  filter: brightness(1.1);
}

@keyframes placementPulse {
  0%, 100% {
    opacity: 0.6;
    stroke-width: 3;
  }
  50% {
    opacity: 1;
    stroke-width: 4;
  }
}
</style>