<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <div class="header-section">
        <h2>Map Editor</h2>
        <NuxtLink to="/" class="back-button">← Back to Game</NuxtLink>
      </div>

      <!-- Map Info Section -->
      <div class="map-info-section">
        <div class="input-group">
          <label>Map Name *</label>
          <input
            v-model="mapName"
            type="text"
            placeholder="My Awesome Map"
            class="text-input"
          />
        </div>
        <div class="input-group">
          <label>Description (optional)</label>
          <textarea
            v-model="mapDescription"
            placeholder="A challenging map with lava rivers..."
            class="text-input"
            rows="2"
          ></textarea>
        </div>
      </div>
      
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
        <button @click="saveMapToDatabase" class="action-button save">Save to Database</button>
        <button @click="showLoadModal = true" class="action-button load">Load Map</button>
        <button @click="clearMap" class="action-button clear">Clear Map</button>
        <button @click="exportMap" class="action-button export">Export JSON</button>
      </div>

      <!-- Status message -->
      <div v-if="statusMessage" :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>
    </div>

    <div class="board-wrapper">
      <div class="editor-columns">
        <!-- Main Board -->
        <div class="board-container">
          <h3 class="section-title">Map Editor</h3>
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

        <!-- Live Preview -->
        <div class="preview-container">
          <h3 class="section-title">Live Preview</h3>
          <div class="preview-box">
            <MapPreview 
              :terrain-data="Array.from(terrainMap.entries())"
              :size="280"
            />
          </div>
          <p class="preview-hint">This is how your map will appear in the map selector</p>
        </div>
      </div>
    </div>

    <div class="info">
      <p>Click cells to paint with selected terrain type</p>
      <p>Current tool: <strong>{{ selectedTerrain }}</strong></p>
      <p v-if="currentMapId" class="current-map">Editing: <strong>{{ mapName }}</strong></p>
    </div>

    <!-- Load Map Modal -->
    <div v-if="showLoadModal" class="modal-overlay" @click.self="showLoadModal = false">
      <div class="modal">
        <h3>Load Map</h3>
        <div v-if="loading" class="loading">Loading maps...</div>
        <div v-else-if="savedMaps.length === 0" class="no-maps">
          No saved maps found. Create your first map!
        </div>
        <div v-else class="maps-list">
          <div
            v-for="map in savedMaps"
            :key="map.id"
            class="map-item"
          >
            <div class="map-details">
              <h4>{{ map.name }}</h4>
              <p v-if="map.description">{{ map.description }}</p>
              <small>Last updated: {{ formatDate(map.updated_at) }}</small>
            </div>
            <div class="map-actions">
              <button @click="loadMapFromDatabase(map.id)" class="btn-load">Load</button>
              <button @click="deleteMap(map.id)" class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
        <button @click="showLoadModal = false" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Cell, { type TerrainType } from '~~/components/Board/Cell.vue'
import MapPreview from '~~/components/MapPreview.vue'

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
const mapName = ref('')
const mapDescription = ref('')
const currentMapId = ref<number | null>(null)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const showLoadModal = ref(false)
const savedMaps = ref<any[]>([])
const loading = ref(false)

// Initialize with land
for (let row = 0; row < BOARD_SIZE; row++) {
  for (let col = 0; col < COLS_PER_ROW; col++) {
    const key = `${row}-${col}`
    terrainMap.set(key, 'land')
  }
}

onMounted(() => {
  fetchMaps()
})

function getCellTerrain(row: number, col: number): TerrainType {
  const key = `${row}-${col}`
  return terrainMap.get(key) || 'void'
}

function onCellClick(row: number, col: number) {
  const key = `${row}-${col}`
  terrainMap.set(key, selectedTerrain.value)
}

async function saveMapToDatabase() {
  if (!mapName.value.trim()) {
    showStatus('Please enter a map name', 'error')
    return
  }

  const terrainData = Array.from(terrainMap.entries())
  
  try {
    if (currentMapId.value) {
      // Update existing map
      await $fetch(`/api/maps/${currentMapId.value}`, {
        method: 'PUT',
        body: {
          name: mapName.value,
          description: mapDescription.value,
          terrain_data: terrainData
        }
      })
      showStatus('Map updated successfully!', 'success')
    } else {
      // Create new map
      const response: any = await $fetch('/api/maps', {
        method: 'POST',
        body: {
          name: mapName.value,
          description: mapDescription.value,
          terrain_data: terrainData
        }
      })
      currentMapId.value = response.data.id
      showStatus('Map saved successfully!', 'success')
    }
    await fetchMaps()
  } catch (error: any) {
    showStatus(error.data?.message || 'Failed to save map', 'error')
  }
}

async function fetchMaps() {
  try {
    const response: any = await $fetch('/api/maps')
    savedMaps.value = response.data
  } catch (error) {
    console.error('Failed to fetch maps:', error)
  }
}

async function loadMapFromDatabase(mapId: number) {
  try {
    loading.value = true
    const response: any = await $fetch(`/api/maps/${mapId}`)
    const mapData = response.data
    
    // Load terrain data
    terrainMap.clear()
    mapData.terrain_data.forEach(([key, value]: [string, TerrainType]) => {
      terrainMap.set(key, value)
    })
    
    // Load map info
    mapName.value = mapData.name
    mapDescription.value = mapData.description || ''
    currentMapId.value = mapData.id
    
    showLoadModal.value = false
    showStatus('Map loaded successfully!', 'success')
  } catch (error: any) {
    showStatus(error.data?.message || 'Failed to load map', 'error')
  } finally {
    loading.value = false
  }
}

async function deleteMap(mapId: number) {
  if (!confirm('Are you sure you want to delete this map?')) return
  
  try {
    await $fetch(`/api/maps/${mapId}`, {
      method: 'DELETE'
    })
    
    if (currentMapId.value === mapId) {
      clearMap()
      currentMapId.value = null
      mapName.value = ''
      mapDescription.value = ''
    }
    
    await fetchMaps()
    showStatus('Map deleted successfully!', 'success')
  } catch (error: any) {
    showStatus(error.data?.message || 'Failed to delete map', 'error')
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
    mapName.value = ''
    mapDescription.value = ''
    currentMapId.value = null
  }
}

function exportMap() {
  const terrainData = Array.from(terrainMap.entries())
  const mapData = {
    name: mapName.value || 'Untitled Map',
    description: mapDescription.value,
    terrain_data: terrainData
  }
  
  const json = JSON.stringify(mapData, null, 2)
  
  // Create download link
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${mapName.value || 'map'}-data.json`
  a.click()
  URL.revokeObjectURL(url)
  
  showStatus('Map exported!', 'success')
}

function showStatus(message: string, type: 'success' | 'error') {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar h2 {
  margin: 0;
  color: #fff;
}

.back-button {
  padding: 8px 16px;
  background: #333;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-button:hover {
  background: #444;
}

.map-info-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  color: #aaa;
  font-size: 14px;
  font-weight: bold;
}

.text-input {
  padding: 10px;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.text-input:focus {
  outline: none;
  border-color: #666;
}

.text-input::placeholder {
  color: #666;
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

.terrain-button.water { background: #4a90e2; }
.terrain-button.land { background: #7cb342; }
.terrain-button.lava { background: #e74c3c; }
.terrain-button.void { background: #2c3e50; }
.terrain-button.mountain { background: #8b7355; }
.terrain-button.spawn { background: #9c27b0; }
.terrain-button.flag { background: #ffd700; color: #333; }

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  font-size: 14px;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.action-button.save { background: #4caf50; }
.action-button.load { background: #2196f3; }
.action-button.clear { background: #f44336; }
.action-button.export { background: #ff9800; }

.status-message {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: bold;
  animation: slideIn 0.3s ease-out;
}

.status-message.success {
  background: #4caf50;
  color: white;
}

.status-message.error {
  background: #f44336;
  color: white;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
}

.editor-columns {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  max-width: 1400px;
  width: 100%;
}

.board-container {
  flex: 1;
}

.section-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 15px 0;
  text-align: center;
}

.board {
  display: flex;
  flex-direction: column;
}

.preview-container {
  width: 320px;
  background: #0f0f0f;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #333;
  position: sticky;
  top: 20px;
}

.preview-box {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  border: 1px solid #444;
}

.preview-hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin: 15px 0 0 0;
  line-height: 1.4;
}

@media (max-width: 1200px) {
  .editor-columns {
    flex-direction: column;
    align-items: center;
  }

  .preview-container {
    position: relative;
    width: 100%;
    max-width: 400px;
  }
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

.hex-row > * {
  width: 86.6px;
  flex-shrink: 0;
  margin-left: -1px;
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

.current-map {
  color: #4caf50 !important;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal h3 {
  margin: 0 0 20px 0;
  color: #fff;
  font-size: 24px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
}

.no-maps {
  text-align: center;
  padding: 40px;
  color: #999;
}

.maps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.map-item {
  background: #2a2a2a;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  transition: background 0.2s;
}

.map-item:hover {
  background: #333;
}

.map-details {
  flex: 1;
}

.map-details h4 {
  margin: 0 0 5px 0;
  color: #fff;
  font-size: 18px;
}

.map-details p {
  margin: 0 0 5px 0;
  color: #aaa;
  font-size: 14px;
}

.map-details small {
  color: #666;
  font-size: 12px;
}

.map-actions {
  display: flex;
  gap: 10px;
}

.btn-load, .btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-load {
  background: #4caf50;
  color: white;
}

.btn-load:hover {
  background: #45a049;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #da190b;
}

.btn-close {
  width: 100%;
  padding: 12px;
  background: #555;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: background 0.2s;
}

.btn-close:hover {
  background: #666;
}
</style>