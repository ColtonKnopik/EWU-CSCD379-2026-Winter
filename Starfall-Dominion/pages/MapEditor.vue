<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <div class="header-section">
        <h2>Map Editor</h2>
        <NuxtLink to="/" class="back-button">? Back to Game</NuxtLink>
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

      <!-- Tool Selection -->
      <div class="tool-section">
        <div class="tool-group">
          <span class="tool-group-label">Terrain</span>
          <div class="terrain-selector">
            <button
              v-for="terrain in terrains"
              :key="terrain.type"
              :class="['terrain-button', terrain.type, { active: selectedTool === 'terrain' && selectedTerrain === terrain.type }]"
              @click="selectTerrain(terrain.type)"
            >
              {{ terrain.label }}
            </button>
          </div>
        </div>

        <div class="tool-group">
          <span class="tool-group-label">Spawn Points</span>
          <div class="spawn-selector">
            <button
              :class="['spawn-button', 'p1', { active: selectedTool === 'p1-spawn', placed: p1Spawn }]"
              @click="selectedTool = 'p1-spawn'"
            >
              P1 Spawn {{ p1Spawn ? '?' : '' }}
            </button>
            <button
              :class="['spawn-button', 'p2', { active: selectedTool === 'p2-spawn', placed: p2Spawn }]"
              @click="selectedTool = 'p2-spawn'"
            >
              P2 Spawn {{ p2Spawn ? '?' : '' }}
            </button>
          </div>
          <div class="spawn-hint">P1: Left 3 columns · P2: Right 3 columns</div>
        </div>
      </div>

      <div class="actions">
        <button @click="saveMapToDatabase" class="action-button save" :disabled="!canSave">
          {{ saveButtonLabel }}
        </button>
        <button @click="openLoadModal" class="action-button load">Load Map</button>
        <button @click="clearMap" class="action-button clear">Clear Map</button>
      </div>

      <!-- Spawn Status -->
      <div class="spawn-status">
        <div :class="['spawn-indicator', { placed: p1Spawn }]">
          P1 Spawn: {{ p1Spawn ? 'Placed' : 'Not placed' }}
        </div>
        <div :class="['spawn-indicator', { placed: p2Spawn }]">
          P2 Spawn: {{ p2Spawn ? 'Placed' : 'Not placed' }}
        </div>
      </div>

      <div v-if="statusMessage" :class="['status-message', statusType]">
        {{ statusMessage }}
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
            class="cell-slot"
            :class="getCellHighlight(row - 1, col - 1)"
          >
            <Cell
              :row="row - 1"
              :col="col - 1"
              :terrain-type="getCellTerrain(row - 1, col - 1)"
              @click="onCellClick(row - 1, col - 1)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="info">
      <p>Current tool: <strong>{{ currentToolLabel }}</strong></p>
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
              <button @click="deleteMapById(map.id)" class="btn-delete">Delete</button>
            </div>
          </div>
        </div>
        <button @click="showLoadModal = false" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Cell, { type TerrainType } from '~~/components/Board/Cell.vue'

const { getMaps, getMap, createMap, updateMap, deleteMap: deleteMapApi } = useMapApi()

const BOARD_SIZE = 8
const COLS_PER_ROW = 8

const terrains = [
  { type: 'water' as TerrainType, label: 'Water' },
  { type: 'land' as TerrainType, label: 'Land' },
  { type: 'lava' as TerrainType, label: 'Lava' },
  { type: 'void' as TerrainType, label: 'Void' },
  { type: 'mountain' as TerrainType, label: 'Mountain' },
  { type: 'flag' as TerrainType, label: 'Flag' },
]

type ToolMode = 'terrain' | 'p1-spawn' | 'p2-spawn'

const selectedTool = ref<ToolMode>('terrain')
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

// Spawn tracking
const p1Spawn = ref<{ row: number; col: number } | null>(null)
const p2Spawn = ref<{ row: number; col: number } | null>(null)

// Can only save when both spawns are placed and map has a name
const canSave = computed(() => {
  return mapName.value.trim() !== '' && p1Spawn.value !== null && p2Spawn.value !== null
})

const currentToolLabel = computed(() => {
  if (selectedTool.value === 'p1-spawn') return 'Place P1 Spawn (left 3 columns)'
  if (selectedTool.value === 'p2-spawn') return 'Place P2 Spawn (right 3 columns)'
  return selectedTerrain.value
})

const saveButtonLabel = computed(() => {
  if (!p1Spawn.value || !p2Spawn.value) return 'Place Both Spawns to Save'
  if (!mapName.value.trim()) return 'Map Name Required'
  return 'Save to Database'
})

// Initialize with land
for (let row = 0; row < BOARD_SIZE; row++) {
  for (let col = 0; col < COLS_PER_ROW; col++) {
    terrainMap.set(`${row}-${col}`, 'land')
  }
}

onMounted(() => {
  fetchMaps()
})

function selectTerrain(type: TerrainType) {
  selectedTool.value = 'terrain'
  selectedTerrain.value = type
}

function getCellTerrain(row: number, col: number): TerrainType {
  return terrainMap.get(`${row}-${col}`) || 'void'
}

function getCellHighlight(row: number, col: number): string {
  if (selectedTool.value === 'p1-spawn' && col <= 2) return 'spawn-zone-p1'
  if (selectedTool.value === 'p2-spawn' && col >= 5) return 'spawn-zone-p2'
  return ''
}

function onCellClick(row: number, col: number) {
  const key = `${row}-${col}`

  if (selectedTool.value === 'p1-spawn') {
    if (col > 2) {
      showStatus('P1 spawn must be in the first 3 columns (left side)', 'error')
      return
    }
    // Remove old P1 spawn
    if (p1Spawn.value) {
      terrainMap.set(`${p1Spawn.value.row}-${p1Spawn.value.col}`, 'land')
    }
    p1Spawn.value = { row, col }
    terrainMap.set(key, 'spawn')
    return
  }

  if (selectedTool.value === 'p2-spawn') {
    if (col < 5) {
      showStatus('P2 spawn must be in the last 3 columns (right side)', 'error')
      return
    }
    // Remove old P2 spawn
    if (p2Spawn.value) {
      terrainMap.set(`${p2Spawn.value.row}-${p2Spawn.value.col}`, 'land')
    }
    p2Spawn.value = { row, col }
    terrainMap.set(key, 'spawn')
    return
  }

  // Normal terrain painting — if painting over a spawn, remove spawn tracking
  if (p1Spawn.value && p1Spawn.value.row === row && p1Spawn.value.col === col) {
    p1Spawn.value = null
  }
  if (p2Spawn.value && p2Spawn.value.row === row && p2Spawn.value.col === col) {
    p2Spawn.value = null
  }
  terrainMap.set(key, selectedTerrain.value)
}

// Detect spawn positions from loaded terrain data
function detectSpawns() {
  p1Spawn.value = null
  p2Spawn.value = null

  terrainMap.forEach((terrain, key) => {
    if (terrain === 'spawn') {
      const [row, col] = key.split('-').map(Number)
      if (col <= 2 && !p1Spawn.value) {
        p1Spawn.value = { row, col }
      } else if (col >= 5 && !p2Spawn.value) {
        p2Spawn.value = { row, col }
      }
    }
  })
}

async function saveMapToDatabase() {
  if (!mapName.value.trim()) {
    showStatus('Please enter a map name', 'error')
    return
  }

  if (!p1Spawn.value || !p2Spawn.value) {
    showStatus('Both spawn points must be placed before saving', 'error')
    return
  }

  const terrainData = Array.from(terrainMap.entries())

  try {
    if (currentMapId.value) {
      await updateMap(currentMapId.value, {
        name: mapName.value,
        description: mapDescription.value,
        terrain_data: terrainData
      })
      showStatus('Map updated successfully!', 'success')
    } else {
      const response = await createMap({
        name: mapName.value,
        description: mapDescription.value,
        terrain_data: terrainData
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
    const response = await getMaps()
    savedMaps.value = response.data
  } catch (error) {
    console.error('Failed to fetch maps:', error)
  }
}

async function openLoadModal() {
  showLoadModal.value = true
  await fetchMaps()
}

async function loadMapFromDatabase(mapId: number) {
  try {
    loading.value = true
    const response = await getMap(mapId)
    const mapData = response.data

    terrainMap.clear()
    mapData.terrain_data.forEach(([key, value]: [string, TerrainType]) => {
      terrainMap.set(key, value)
    })

    mapName.value = mapData.name
    mapDescription.value = mapData.description || ''
    currentMapId.value = mapData.id

    detectSpawns()

    showLoadModal.value = false
    showStatus('Map loaded successfully!', 'success')
  } catch (error: any) {
    showStatus(error.data?.message || 'Failed to load map', 'error')
  } finally {
    loading.value = false
  }
}

async function deleteMapById(mapId: number) {
  if (!confirm('Are you sure you want to delete this map?')) return

  try {
    await deleteMapApi(mapId)

    if (currentMapId.value === mapId) {
      currentMapId.value = null
      mapName.value = ''
      mapDescription.value = ''
      p1Spawn.value = null
      p2Spawn.value = null
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < COLS_PER_ROW; col++) {
          terrainMap.set(`${row}-${col}`, 'land')
        }
      }
    }

    await fetchMaps()
    showStatus('Map deleted successfully!', 'success')
  } catch (error: any) {
    showStatus(error.data?.message || 'Failed to delete map', 'error')
  }
}

function clearMap() {
  if (!confirm('Clear the entire map? This will reset all terrain to land and remove both spawns.')) return
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLS_PER_ROW; col++) {
      terrainMap.set(`${row}-${col}`, 'land')
    }
  }
  
  p1Spawn.value = null
  p2Spawn.value = null
  mapName.value = ''
  mapDescription.value = ''
  currentMapId.value = null
  
  showStatus('Map cleared', 'success')
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

/* Tool Section */
.tool-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tool-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-group-label {
  color: #aaa;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
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
.terrain-button.flag { background: #ffd700; color: #333; }

/* Spawn Selector */
.spawn-selector {
  display: flex;
  gap: 10px;
}

.spawn-button {
  padding: 12px 24px;
  border: 3px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  color: white;
  transition: all 0.2s;
}

.spawn-button:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.spawn-button.p1 {
  background: #3b82f6;
}

.spawn-button.p2 {
  background: #a855f7;
}

.spawn-button.active {
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.spawn-button.placed {
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.spawn-hint {
  color: #666;
  font-size: 12px;
}

/* Spawn Status */
.spawn-status {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.spawn-indicator {
  padding: 8px 14px;
  background: #2a2a2a;
  border: 2px solid #f44336;
  border-radius: 4px;
  color: #f44336;
  font-size: 13px;
  font-weight: bold;
}

.spawn-indicator.placed {
  border-color: #4caf50;
  color: #4caf50;
}

/* Actions */
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

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.save { background: #4caf50; }
.action-button.load { background: #2196f3; }
.action-button.clear { background: #f44336; }

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

/* Board */
.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
  height: 100px;
  margin-top: -25px;
}

.hex-row:first-child {
  margin-top: 0;
}

.hex-row.offset {
  margin-left: 43.3px;
}

.cell-slot {
  width: 86.6px;
  flex-shrink: 0;
  margin-left: -1px;
  position: relative;
}

.cell-slot:first-child {
  margin-left: 0;
}

/* Spawn zone highlights - hex shaped */
.cell-slot.spawn-zone-p1::after,
.cell-slot.spawn-zone-p2::after {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  pointer-events: none;
  z-index: 5;
  animation: zonePulse 1.5s ease-in-out infinite;
}

.cell-slot.spawn-zone-p1::after {
  background: rgba(59, 130, 246, 0.2);
}

.cell-slot.spawn-zone-p2::after {
  background: rgba(168, 85, 247, 0.2);
}

@keyframes zonePulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
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