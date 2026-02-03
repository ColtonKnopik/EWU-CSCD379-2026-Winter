<template>
  <div class="map-selector-overlay space-container" @click.self="$emit('close')">
    <!-- Space Background -->
    <div class="space-background">
      <div class="stars-layer stars-1"></div>
      <div class="stars-layer stars-2"></div>
      <div class="stars-layer stars-3"></div>
      <div class="nebula"></div>
      <div class="cosmic-glow"></div>
    </div>

    <!-- Main Content -->
    <div class="map-selector glass-card">
      <!-- Header -->
      <div class="selector-header">
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <div class="scan-line"></div>
        <h2 class="orbitron-font text-blue-glow">MAP SELECTION</h2>
        <div class="status-indicator">
          <div class="status-dot"></div>
          <span class="status-text rajdhani-font">DATABASE ONLINE</span>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="spinner-container">
          <div class="spinner"></div>
          <div class="spinner-glow"></div>
        </div>
        <p class="rajdhani-font">LOADING TERRAIN DATA...</p>
      </div>
      
      <!-- Maps Grid -->
      <div v-else class="maps-grid">
        <div
          v-for="map in maps"
          :key="map.id || 'default'"
          :class="['map-card', { 'default-map': map.isDefault }]"
          @click="selectMap(map.id)"
        >
          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
          <div class="card-scan-line"></div>
          
          <div class="map-preview-container">
            <div class="preview-frame">
              <MapPreview 
                v-if="map.terrain_data" 
                :terrain-data="map.terrain_data"
                :size="180"
              />
              <div v-else class="loading-preview">
                <div class="mini-spinner"></div>
              </div>
            </div>
          </div>
          
          <div class="map-header">
            <h3 class="orbitron-font">
              {{ map.name }}
              <span v-if="map.isDefault" class="default-badge">
                <span class="badge-glow"></span>
                DEFAULT
              </span>
            </h3>
          </div>
          
          <p v-if="map.description" class="map-description rajdhani-font">
            {{ map.description }}
          </p>
          
          <div class="map-footer">
            <div class="footer-line"></div>
            <small class="rajdhani-font">
              {{ map.isDefault ? 'BUILT-IN MAP' : `UPDATED: ${formatDate(map.updated_at).toUpperCase()}` }}
            </small>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="selector-actions">
        <NuxtLink to="/MapEditor" class="btn-editor orbitron-font">
          <span class="btn-inner">
            <span class="btn-icon">⚙</span>
            MAP EDITOR
            <div class="btn-glow"></div>
          </span>
        </NuxtLink>
        <button @click="$emit('close')" class="btn-cancel orbitron-font">
          <span class="btn-inner">
            <span class="btn-icon">✕</span>
            CANCEL
            <div class="btn-glow"></div>
          </span>
        </button>
      </div>

      <!-- Footer Corners -->
      <div class="selector-footer">
        <div class="card-corner bl"></div>
        <div class="card-corner br"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MapPreview from '~~/components/MapPreview.vue'
import baseMapData from '~~/data/baseMap.json'

const emit = defineEmits<{
  close: []
  select: [mapId: number | null]
}>()

const maps = ref<any[]>([])
const loading = ref(true)

// Create default map object from baseMap.json
const defaultMap = {
  id: null,
  name: 'Default Map',
  description: 'The standard battlefield',
  terrain_data: baseMapData,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  isDefault: true
}

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
    
    // Always include the default map as the first option
    maps.value = [defaultMap, ...mapsWithTerrain]
  } catch (error) {
    console.error('Failed to fetch maps:', error)
    // On error, just show the default map
    maps.value = [defaultMap]
  } finally {
    loading.value = false
  }
}

function selectMap(mapId: number | null) {
  emit('select', mapId)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<style scoped>
@import url('~/assets/css/space-theme.css');

.map-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1;
    backdrop-filter: blur(2px);
  }
}

.map-selector {
  position: relative;
  background: rgba(10, 10, 25, 0.95);
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(20px);
  border-radius: 4px;
  padding: 0;
  max-width: 1000px;
  width: 95%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(59, 130, 246, 0.2),
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 0 60px rgba(96, 165, 250, 0.05);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.selector-header {
  position: relative;
  padding: 25px 30px;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(10, 10, 30, 0.95) 100%);
  border-bottom: 1px solid rgba(96, 165, 250, 0.3);
  overflow: hidden;
}

.selector-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 4px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.status-indicator {
  position: absolute;
  top: 25px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.status-text {
  font-size: 11px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.8);
  letter-spacing: 1px;
}

/* Loading State */
.loading {
  padding: 80px 20px;
  text-align: center;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(96, 165, 250, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: relative;
  z-index: 2;
}

.spinner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  color: rgba(147, 197, 253, 0.9);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
}

/* Maps Grid */
.maps-grid {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  max-height: calc(90vh - 250px);
  overflow-y: auto;
}

/* Custom Scrollbar */
.maps-grid::-webkit-scrollbar {
  width: 8px;
}

.maps-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.maps-grid::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 4px;
}

.maps-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.5);
}

/* Map Card */
.map-card {
  position: relative;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
}

.map-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(96, 165, 250, 0.1), 
    transparent
  );
  transition: left 0.5s ease;
  z-index: 1;
}

.map-card:hover::before {
  left: 100%;
}

.map-card.default-map {
  border-color: rgba(96, 165, 250, 0.4);
}

.map-card:hover {
  background: rgba(15, 15, 35, 0.8);
  border-color: rgba(96, 165, 250, 0.6);
  transform: translateY(-6px);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(96, 165, 250, 0.3);
}

.map-card.default-map:hover {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(59, 130, 246, 0.4);
}

.map-card .card-corner {
  width: 12px;
  height: 12px;
  border-width: 2px;
}

.card-scan-line {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.4), transparent);
  animation: scan 4s ease-in-out infinite;
  z-index: 2;
}

/* Preview Container */
.map-preview-container {
  position: relative;
  width: 100%;
  height: 200px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
  overflow: hidden;
}

.preview-frame {
  position: relative;
  padding: 10px;
  background: radial-gradient(circle at center, rgba(96, 165, 250, 0.05), transparent);
}

.loading-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(147, 197, 253, 0.6);
  font-size: 14px;
}

.mini-spinner {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(96, 165, 250, 0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Map Header */
.map-header {
  padding: 20px 20px 15px;
  position: relative;
  z-index: 2;
}

.map-header h3 {
  margin: 0;
  color: #e0f2fe;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

.default-badge {
  position: relative;
  font-size: 9px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(96, 165, 250, 0.3));
  color: #93c5fd;
  padding: 4px 10px;
  border-radius: 3px;
  border: 1px solid rgba(96, 165, 250, 0.5);
  font-weight: 900;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  overflow: hidden;
}

.badge-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: badge-shimmer 3s infinite;
}

@keyframes badge-shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}

/* Map Description */
.map-description {
  color: rgba(147, 197, 253, 0.7);
  font-size: 14px;
  margin: 0;
  padding: 0 20px 15px;
  min-height: 40px;
  line-height: 1.5;
  position: relative;
  z-index: 2;
}

/* Map Footer */
.map-footer {
  position: relative;
  padding: 12px 20px;
  margin-top: auto;
  border-top: 1px solid rgba(96, 165, 250, 0.15);
  background: rgba(0, 0, 0, 0.3);
}

.footer-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 1px;
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.6), transparent);
  transition: width 0.5s ease;
}

.map-card:hover .footer-line {
  width: 100%;
}

.map-footer small {
  color: rgba(147, 197, 253, 0.5);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Actions */
.selector-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 25px 30px;
  border-top: 1px solid rgba(96, 165, 250, 0.3);
  background: linear-gradient(180deg, rgba(10, 10, 25, 0.8) 0%, rgba(15, 15, 35, 0.9) 100%);
}

.btn-editor, .btn-cancel {
  position: relative;
  padding: 14px 32px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
  overflow: hidden;
}

.btn-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.btn-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 5px currentColor);
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
}

.btn-editor {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
  color: #60a5fa;
  text-decoration: none;
  display: inline-flex;
}

.btn-editor:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.btn-editor:hover .btn-glow {
  width: 200%;
  height: 200%;
}

.btn-cancel {
  background: rgba(100, 100, 120, 0.1);
  border-color: rgba(148, 163, 184, 0.3);
  color: rgba(203, 213, 225, 0.9);
}

.btn-cancel:hover {
  background: rgba(100, 100, 120, 0.2);
  border-color: rgba(148, 163, 184, 0.5);
  box-shadow: 0 0 15px rgba(100, 100, 120, 0.3);
  transform: translateY(-2px);
}

.btn-cancel:hover .btn-glow {
  width: 200%;
  height: 200%;
}

.btn-editor:active, .btn-cancel:active {
  transform: scale(0.98);
}

/* Footer */
.selector-footer {
  position: relative;
  height: 10px;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .maps-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .selector-header h2 {
    font-size: 22px;
    letter-spacing: 2px;
  }

  .status-indicator {
    position: static;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
