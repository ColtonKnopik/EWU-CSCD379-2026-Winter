<template>
  <div class="play-container">
    <div v-if="loading" class="loading">
      <h2>Loading game...</h2>
    </div>
    
    <div v-else-if="error" class="error">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button @click="router.push('/')">Back to Menu</button>
    </div>
    
    <Game v-else :game-id="gameId" @game-ended="handleGameEnded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const gameApi = useGameApi()

const loading = ref(true)
const error = ref<string | null>(null)
const gameId = ref<number | null>(null)

onMounted(async () => {
  try {
    // Check if we have a game ID in the route
    const routeGameId = route.query.gameId as string
    
    if (routeGameId) {
      // Load existing game
      gameId.value = parseInt(routeGameId)
      await gameApi.getGame(gameId.value)
    } else {
      // Create new game with default map (ID 1) and AI player
      const response: any = await gameApi.createGame(
        1, // Default map ID
        'player1', // Player 1 ID (you can customize this)
        'ai' // Player 2 (AI or second player)
      )
      
      gameId.value = response.id
      
      // Update URL with game ID
      router.replace({ query: { gameId: gameId.value } })
    }
  } catch (err: any) {
    console.error('Failed to initialize game:', err)
    error.value = err.message || 'Failed to load game'
  } finally {
    loading.value = false
  }
})

function handleGameEnded() {
  // Navigate back to menu after game ends
  setTimeout(() => {
    router.push('/')
  }, 5000)
}
</script>

<style scoped>
.play-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
  text-align: center;
}

.error button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #4a90e2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.error button:hover {
  background: #357abd;
}
</style>
