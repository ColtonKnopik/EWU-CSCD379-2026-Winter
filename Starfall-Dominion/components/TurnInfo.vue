<template>
  <div class="turn-info">
    <h2>Turn {{ turn }}</h2>
    <p class="current-player" :class="currentPlayer">
      {{ currentPlayer === 'player1' ? 'Player 1' : 'Player 2' }}'s Turn
    </p>
    <button @click="$emit('endTurn')" class="end-turn-btn">End Turn</button>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~~/types/gameTypes'

defineProps<{
  turn: number
  currentPlayer: Player
}>()

defineEmits<{
  endTurn: []
}>()
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