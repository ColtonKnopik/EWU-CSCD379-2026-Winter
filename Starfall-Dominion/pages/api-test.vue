<template>
  <div class="api-test">
    <h1>Backend API Connection Test</h1>
    
    <div class="test-section">
      <h2>API Configuration</h2>
      <p><strong>API Base URL:</strong> {{ config.public.apiBase }}</p>
      <p><strong>Status:</strong> <span :class="connectionStatus">{{ connectionStatus }}</span></p>
    </div>

    <div class="test-section">
      <h2>Test Maps API</h2>
      <button @click="testMapsApi" :disabled="loading">Test GET /api/maps</button>
      
      <div v-if="mapsResult" class="result">
        <h3>Result:</h3>
        <pre>{{ JSON.stringify(mapsResult, null, 2) }}</pre>
      </div>
      
      <div v-if="mapsError" class="error">
        <h3>Error:</h3>
        <pre>{{ mapsError }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>Test Games API</h2>
      <button @click="testGamesApi" :disabled="loading">Test GET /api/games</button>
      
      <div v-if="gamesResult" class="result">
        <h3>Result:</h3>
        <pre>{{ JSON.stringify(gamesResult, null, 2) }}</pre>
      </div>
      
      <div v-if="gamesError" class="error">
        <h3>Error:</h3>
        <pre>{{ gamesError }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>Create Test Game</h2>
      <button @click="createTestGame" :disabled="loading">Create Game</button>
      
      <div v-if="createGameResult" class="result">
        <h3>Created Game:</h3>
        <pre>{{ JSON.stringify(createGameResult, null, 2) }}</pre>
        <button @click="navigateToGame">Play This Game</button>
      </div>
      
      <div v-if="createGameError" class="error">
        <h3>Error:</h3>
        <pre>{{ createGameError }}</pre>
      </div>
    </div>

    <button @click="$router.push('/')" class="back-button">Back to Menu</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const config = useRuntimeConfig()
const router = useRouter()
const mapApi = useMapApi()
const gameApi = useGameApi()

const loading = ref(false)
const connectionStatus = ref('Not tested')

// Maps API test
const mapsResult = ref<any>(null)
const mapsError = ref<string | null>(null)

// Games API test
const gamesResult = ref<any>(null)
const gamesError = ref<string | null>(null)

// Create game test
const createGameResult = ref<any>(null)
const createGameError = ref<string | null>(null)

async function testMapsApi() {
  loading.value = true
  mapsResult.value = null
  mapsError.value = null
  
  try {
    const response = await mapApi.getMaps()
    mapsResult.value = response
    connectionStatus.value = 'Connected ✓'
  } catch (err: any) {
    mapsError.value = err.message || 'Failed to connect'
    connectionStatus.value = 'Failed ✗'
  } finally {
    loading.value = false
  }
}

async function testGamesApi() {
  loading.value = true
  gamesResult.value = null
  gamesError.value = null
  
  try {
    const response = await gameApi.getGames()
    gamesResult.value = response
    connectionStatus.value = 'Connected ✓'
  } catch (err: any) {
    gamesError.value = err.message || 'Failed to connect'
    connectionStatus.value = 'Failed ✗'
  } finally {
    loading.value = false
  }
}

async function createTestGame() {
  loading.value = true
  createGameResult.value = null
  createGameError.value = null
  
  try {
    const response = await gameApi.createGame(1, 'test-player-1', 'test-player-2')
    createGameResult.value = response
    connectionStatus.value = 'Connected ✓'
  } catch (err: any) {
    createGameError.value = err.message || 'Failed to create game'
    connectionStatus.value = 'Failed ✗'
  } finally {
    loading.value = false
  }
}

function navigateToGame() {
  if (createGameResult.value?.id) {
    router.push(`/play?gameId=${createGameResult.value.id}`)
  }
}
</script>

<style scoped>
.api-test {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: #1a1a2e;
  min-height: 100vh;
  color: white;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #4a90e2;
}

.test-section {
  background: #16213e;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  border: 1px solid #2d3d5f;
}

h2 {
  margin-top: 0;
  color: #4a90e2;
}

button {
  padding: 10px 20px;
  margin: 10px 10px 10px 0;
  background: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #357abd;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #0d1b2a;
  border-radius: 5px;
  border: 1px solid #4a90e2;
}

.error {
  margin-top: 20px;
  padding: 15px;
  background: #2d1a1a;
  border-radius: 5px;
  border: 1px solid #e74c3c;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
}

.Connected {
  color: #7cb342;
}

.Failed {
  color: #e74c3c;
}

.back-button {
  margin-top: 30px;
  background: #2d3d5f;
}

.back-button:hover {
  background: #3d4d6f;
}
</style>
