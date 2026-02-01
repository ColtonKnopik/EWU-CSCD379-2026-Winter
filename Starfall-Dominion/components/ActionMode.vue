<template>
  <div class="action-mode">
    <p v-if="mode === 'move' && !hasAttacks" class="mode-text move">Click a cell to MOVE</p>
    <p v-if="mode === 'attack' && !hasMoves" class="mode-text attack">Click an enemy to ATTACK</p>
    <div v-if="hasMoves && hasAttacks" class="mode-both">
      <p class="mode-text move">Click a cell to MOVE</p>
      <p class="mode-text attack">Click an enemy to ATTACK</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mode: 'none' | 'move' | 'attack'
  hasMoves: boolean
  hasAttacks: boolean
}>()
</script>

<style scoped>
.action-mode {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
}

.mode-both {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-text {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
}

.mode-text.move {
  background: #27ae60;
  color: white;
}

.mode-text.attack {
  background: #e74c3c;
  color: white;
}
</style>