<template>
  <div class="board-wrapper">
    <div class="board">
      <div
        v-for="row in BOARD_SIZE"
        :key="row"
        class="hex-row"
        :class="{ offset: row % 2 === 0 }"
      >
        <Cell
          v-for="col in COLS_PER_ROW"
          :key="`${row}-${col}`"
          :row="row - 1"
          :col="col - 1"
          :terrain-type="getCellTerrain(row - 1, col - 1)"
          @click="onCellClick(row - 1, col - 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cell, { type TerrainType } from './Cell.vue'

interface Props {
  customMapData?: Array<[string, TerrainType]>
}

const props = defineProps<Props>()

const BOARD_SIZE = 8
const COLS_PER_ROW = 8

// Store terrain data
const terrainMap = new Map<string, TerrainType>()

// Helper function to randomly assign terrain types
function getRandomTerrain(): TerrainType {
  const terrains: TerrainType[] = ['water', 'land', 'lava', 'void', 'mountain', 'spawn', 'flag']
  return terrains[Math.floor(Math.random() * terrains.length)]
}

// Initialize terrain for all cells
if (props.customMapData) {
  // Load custom map data
  props.customMapData.forEach(([key, value]) => {
    terrainMap.set(key, value)
  })
} else {
  // Generate random terrain
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLS_PER_ROW; col++) {
      const key = `${row}-${col}`
      terrainMap.set(key, getRandomTerrain())
    }
  }
}

function getCellTerrain(row: number, col: number): TerrainType {
  const key = `${row}-${col}`
  return terrainMap.get(key) || 'void'
}

function onCellClick(row: number, col: number) {
  const terrain = getCellTerrain(row, col)
  console.log(`Clicked cell (${row}, ${col}) - Terrain: ${terrain}`)
}
</script>

<style scoped>
.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
}

.board {
  display: flex;
  flex-direction: column;
}

.hex-row {
  display: flex;
  height: 100px; /* Full hexagon height */
  margin-top: -25px; /* Overlap by 1/4 height for perfect fit */
}

.hex-row:first-child {
  margin-top: 0; /* No overlap for first row */
}

.hex-row.offset {
  margin-left: 43.3px; /* Half hexagon width */
}

.hex-row > * {
  width: 86.6px; /* sqrt(3)/2 * 100 for perfect horizontal fit */
  flex-shrink: 0;
  margin-left: -1px; /* Tiny overlap to eliminate gaps */
}

.hex-row > *:first-child {
  margin-left: 0;
}
</style>