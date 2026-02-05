<template>
  <div class="turn-info">
    <h2>Turn {{ turn }}</h2>
    <p class="current-player" :class="currentPlayer">
      {{ currentPlayer === 'player1' ? 'Player 1' : 'Player 2' }}'s Turn
    </p>
    <button @click="handleEndTurn" class="end-turn-btn">End Turn</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Player } from '~~/types/gameTypes'

defineProps<{
  turn: number
  currentPlayer: Player
}>()

const emit = defineEmits<{
  endTurn: []
}>()

// End turn sound
const endTurnAudio = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  // Preload the end turn sound
  try {
    endTurnAudio.value = new Audio('/audio/ui/end-turn.m4a')
    endTurnAudio.value.volume = 0.5
      endTurnAudio.value.preload = 'auto'

    
    // Handle missing audio file gracefully
    endTurnAudio.value.addEventListener('error', () => {
      console.warn('End turn sound not found: /audio/ui/end-turn.m4a')
    })
  } catch (error) {
    console.warn('Failed to load end turn sound:', error)
  }
})

onUnmounted(() => {
  if (endTurnAudio.value) {
    endTurnAudio.value.pause()
    endTurnAudio.value.src = ''
  }
})

function handleEndTurn() {
  // Play sound effect
  if (endTurnAudio.value) {
    endTurnAudio.value.currentTime = 0
    endTurnAudio.value.play().catch(error => {
      console.warn('Could not play end turn sound:', error)
    })
  }
  
  // Emit the event
  emit('endTurn')
}
</script>

<style scoped>
.turn-info {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}

.turn-info h2 {
  margin: 0 0 10px 0;
}

.current-player {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.current-player.player1 {
  background: #3498db;
}

.current-player.player2 {
  background: #e74c3c;
}

.end-turn-btn {
  width: 100%;
  padding: 12px;
  background: #555;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.end-turn-btn:hover {
  background: #666;
}
</style>