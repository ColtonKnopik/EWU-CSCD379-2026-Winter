<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <h2>Map Editor</h2>
      <div class="terrain-selector">
        <button
          v-for="terrain in terrains"
          :key="terrain.type"
          :class="['terrain-button', terrain.type, { active: selectedTerrain === terrain.type }]"
          @click="selectedTerrain = terrain.type"
        >
          {{ terrain.label }}
        </button>
      </div>
      <div class="actions">
        <button @click="saveMap" class="action-button">Save Map</button>
        <button @click="loadMap" class="action-button">Load Map</button>
        <button @click="clearMap" class="action-button">Clear Map</button>
        <button @click="exportMap" class="action-button">Export JSON</button>
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

    <div class="info">
      <p>Click cells to paint with selected terrain type</p>
      <p>Current tool: <strong>{{ selectedTerrain }}</strong></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Cell, { type TerrainType } from '~~/components/Cell.vue'

const BOARD_SIZE = 8
const COLS_PER_ROW = 8

const terrains = [
  { type: 'water' as TerrainType, label: 'Water' },
  { type: 'land' as TerrainType, label: 'Land' },
  { type: 'lava' as TerrainType, label: 'Lava' },
  { type: 'void' as TerrainType, label: 'Void' },
  { type: 'mountain' as TerrainType, label: 'Mountain' },
  { type: 'spawn' as TerrainType, label: 'Spawn' },
  { type: 'flag' as TerrainType, label: 'Flag' },
]

const selectedTerrain = ref<TerrainType>('land')
const terrainMap = reactive(new Map<string, TerrainType>())

// Initialize with land
for (let row = 0; row < BOARD_SIZE; row++) {
  for (let col = 0; col < COLS_PER_ROW; col++) {
    const key = `${row}-${col}`
    terrainMap.set(key, 'land')
  }
}

function getCellTerrain(row: number, col: number): TerrainType {
  const key = `${row}-${col}`
  return terrainMap.get(key) || 'void'
}

function onCellClick(row: number, col: number) {
  const key = `${row}-${col}`
  terrainMap.set(key, selectedTerrain.value)
  console.log(`Painted cell (${row}, ${col}) as ${selectedTerrain.value}`)
}

function saveMap() {
  const mapData = Array.from(terrainMap.entries())
  localStorage.setItem('customMap', JSON.stringify(mapData))
  alert('Map saved!')
}

function loadMap() {
  const saved = localStorage.getItem('customMap')
  if (saved) {
    const mapData = JSON.parse(saved)
    terrainMap.clear()
    mapData.forEach(([key, value]: [string, TerrainType]) => {
      terrainMap.set(key, value)
    })
    alert('Map loaded!')
  } else {
    alert('No saved map found!')
  }
}

function clearMap() {
  if (confirm('Clear the entire map?')) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < COLS_PER_ROW; col++) {
        const key = `${row}-${col}`
        terrainMap.set(key, 'land')
      }
    }
  }
}

function exportMap() {
  const mapData = Array.from(terrainMap.entries())
  const json = JSON.stringify(mapData, null, 2)
  
  // Create download link
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'map-data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #0a0a0a;
  min-height: 100vh;
}

.toolbar {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.toolbar h2 {
  margin: 0;
  color: #fff;
}

.terrain-selector {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.terrain-button {
  padding: 12px 24px;
  border: 3px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  color: white;
  transition: all 0.2s;
}

.terrain-button:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.terrain-button.active {
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.terrain-button.water {
  background: #4a90e2;
}

.terrain-button.land {
  background: #7cb342;
}

.terrain-button.lava {
  background: #e74c3c;
}

.terrain-button.void {
  background: #2c3e50;
}

.terrain-button.mountain {
  background: #8b7355;
}

.terrain-button.spawn {
  background: #9c27b0;
}

.terrain-button.flag {
  background: #ffd700;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  padding: 10px 20px;
  background: #555;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.action-button:hover {
  background: #666;
}

.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
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
  margin-left: 43.3px;
}

.hex-row > * {
  width: 86.6px;
  flex-shrink: 0;
  margin-left: -1px; /* Tiny overlap to eliminate gaps */
}

.hex-row > *:first-child {
  margin-left: 0;
}

.info {
  text-align: center;
  color: #999;
}

.info p {
  margin: 5px 0;
}

.info strong {
  color: #fff;
  text-transform: capitalize;
}
</style>