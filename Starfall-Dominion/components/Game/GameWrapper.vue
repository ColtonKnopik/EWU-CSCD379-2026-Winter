<template>
  <div class="game-wrapper">
    <div v-if="loading" class="loading-screen">
      <div class="loading-content">
        <div class="spinner"></div>
        <h2>Connecting to game server...</h2>
      </div>
    </div>

    <div v-else-if="error" class="error-screen">
      <h2>Connection Error</h2>
      <p>{{ error }}</p>
      <button @click="retry">Retry</button>
      <button @click="$router.push('/')">Back to Menu</button>
    </div>

    <GameBackendConnected
      v-else
      :game-id="gameId"
      :game-state="gameState"
      @refresh="loadGameState"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  gameId: number
}

const props = defineProps<Props>()
const emit = defineEmits(['game-ended'])

const gameApi = useGameApi()
const loading = ref(true)
const error = ref<string | null>(null)
const gameState = ref<any>(null)

let pollInterval: NodeJS.Timeout | null = null

async function loadGameState() {
  try {
    error.value = null
    const response: any = await gameApi.getGame(props.gameId)
    gameState.value = response
    
    // Check if game has ended
    if (response.phase === 'victory') {
      emit('game-ended')
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  } catch (err: any) {
    console.error('Failed to load game state:', err)
    error.value = err.message || 'Failed to connect to server'
  }
}

async function retry() {
  loading.value = true
  await loadGameState()
  loading.value = false
}

onMounted(async () => {
  await loadGameState()
  loading.value = false
  
  // Poll for updates every 2 seconds (for multiplayer)
  pollInterval = setInterval(loadGameState, 2000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})
</script>

<style scoped>
.game-wrapper {
  width: 100%;
  height: 100vh;
}

.loading-screen,
.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-screen button {
  margin: 10px;
  padding: 10px 20px;
  background: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.error-screen button:hover {
  background: #357abd;
}
</style>
