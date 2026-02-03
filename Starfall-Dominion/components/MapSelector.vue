<template>
  <div class="map-selector-overlay" @click.self="$emit('close')">
    <div class="map-selector">
      <h2>Select a Map</h2>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading maps...</p>
      </div>
      
      <div v-else-if="maps.length === 0" class="no-maps">
        <p>No maps available!</p>
        <NuxtLink to="/MapEditor" class="create-map-btn">
          Create Your First Map
        </NuxtLink>
      </div>
      
      <div v-else class="maps-grid">
        <div
          v-for="map in maps"
          :key="map.id"
          class="map-card"
          @click="selectMap(map.id)"
        >
          <div class="map-preview-container">
            <MapPreview 
              v-if="map.terrain_data" 
              :terrain-data="map.terrain_data"
              :size="180"
            />
            <div v-else class="loading-preview">Loading...</div>
          </div>
          <div class="map-header">
            <h3>{{ map.name }}</h3>
          </div>
          <p v-if="map.description" class="map-description">
            {{ map.description }}
          </p>
          <div class="map-footer">
            <small>Updated: {{ formatDate(map.updated_at) }}</small>
          </div>
        </div>
      </div>
      
      <div class="selector-actions">
        <NuxtLink to="/MapEditor" class="btn-editor">
          Map Editor
        </NuxtLink>
        <button @click="$emit('close')" class="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MapPreview from '~~/components/MapPreview.vue'

const emit = defineEmits<{
  close: []
  select: [mapId: number]
}>()

const maps = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  await fetchMaps()
})

async function fetchMaps() {
  try {
    loading.value = true
    const response: any = await $fetch('/api/maps')
    
    // Fetch full data including terrain for each map
    const mapsWithTerrain = await Promise.all(
      response.data.map(async (map: any) => {
        try {
          const fullMap: any = await $fetch(`/api/maps/${map.id}`)
          return fullMap.data
        } catch (error) {
          console.error(`Failed to load terrain for map ${map.id}:`, error)
          return map
        }
      })
    )
    
    maps.value = mapsWithTerrain
  } catch (error) {
    console.error('Failed to fetch maps:', error)
  } finally {
    loading.value = false
  }
}

function selectMap(mapId: number) {
  emit('select', mapId)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<style scoped>
.map-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.map-selector {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 40px;
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.map-selector h2 {
  margin: 0 0 30px 0;
  color: #fff;
  font-size: 32px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #333;
  border-top-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: #999;
  font-size: 18px;
}

.no-maps {
  text-align: center;
  padding: 60px 20px;
}

.no-maps p {
  color: #999;
  font-size: 18px;
  margin-bottom: 20px;
}

.create-map-btn {
  display: inline-block;
  padding: 15px 30px;
  background: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.2s;
}

.create-map-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.map-card {
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid transparent;
  display: flex;
  flex-direction: column;
}

.map-card:hover {
  background: #333;
  border-color: #4caf50;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.map-preview-container {
  width: 100%;
  height: 180px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid #444;
}

.loading-preview {
  color: #999;
  font-size: 14px;
}

.map-header {
  padding: 15px 15px 10px;
}

.map-header h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.map-description {
  color: #aaa;
  font-size: 13px;
  margin: 0;
  padding: 0 15px 10px;
  min-height: 36px;
  line-height: 1.4;
}

.map-footer {
  border-top: 1px solid #444;
  padding: 10px 15px;
  margin-top: auto;
}

.map-footer small {
  color: #666;
  font-size: 11px;
}

.selector-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.btn-editor, .btn-cancel {
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-editor {
  background: #2196f3;
  color: white;
  border: none;
}

.btn-editor:hover {
  background: #1976d2;
}

.btn-cancel {
  background: #666;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: #777;
}
</style>
