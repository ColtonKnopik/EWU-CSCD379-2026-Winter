<template>
  <div class="gold-display" :class="player">
    <div class="gold-header">
      <span class="player-label">{{ player === 'player1' ? 'Player 1' : 'Player 2' }}</span>
    </div>
    <div class="gold-amount">
      <svg class="gold-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor" font-weight="bold">G</text>
      </svg>
      <span class="amount">{{ gold }}</span>
    </div>
    <div class="gold-income" v-if="income > 0">
      <span class="income-label">+{{ income }} per turn</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Player } from '~~/types/gameTypes'

interface Props {
  player: Player
  gold: number
  income?: number
}

const props = withDefaults(defineProps<Props>(), {
  income: 0
})
</script>

<style scoped>
.gold-display {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  padding: 16px;
  border-radius: 8px;
  border: 2px solid;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.gold-display.player1 {
  border-color: #3498db;
}

.gold-display.player2 {
  border-color: #e74c3c;
}

.gold-header {
  margin-bottom: 8px;
}

.player-label {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gold-amount {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.gold-icon {
  width: 32px;
  height: 32px;
  color: #f1c40f;
  filter: drop-shadow(0 2px 4px rgba(241, 196, 15, 0.5));
}

.amount {
  font-size: 28px;
  font-weight: bold;
  color: #f1c40f;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.gold-income {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.income-label {
  font-size: 12px;
  color: #2ecc71;
  font-weight: 600;
}
</style>