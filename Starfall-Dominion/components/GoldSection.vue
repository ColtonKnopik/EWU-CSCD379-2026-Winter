<template>
  <div class="gold-section">
    <GoldDisplay 
      player="player1" 
      :gold="player1Gold" 
      :income="player1Income"
    />
    <GoldDisplay 
      player="player2" 
      :gold="player2Gold" 
      :income="player2Income"
    />
  </div>
</template>

<script setup lang="ts">
import GoldDisplay from '~~/components/GoldDisplay.vue'

defineProps<{
  player1Gold: number
  player1Income: number
  player2Gold: number
  player2Income: number
}>()
</script>

<style scoped>
.gold-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>