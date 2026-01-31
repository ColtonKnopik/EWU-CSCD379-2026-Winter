<template>
  <div class="king-placement-overlay">
    <div class="placement-panel">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="panel-header">
        <h2>{{ player === 'player1' ? 'Player 1' : 'Player 2' }}: Place Your King</h2>
        <p class="instructions">Click anywhere on the board to place your King. The King cannot move once placed!</p>
      </div>

      <div class="king-preview">
        <div class="king-image" :class="player">
          <span class="king-icon">👑</span>
        </div>
        <div class="king-stats">
          <h3>King</h3>
          <div class="stat-row">
            <span class="label">Health:</span>
            <span class="value">150</span>
          </div>
          <div class="stat-row">
            <span class="label">Attack:</span>
            <span class="value">30</span>
          </div>
          <div class="stat-row">
            <span class="label">Range:</span>
            <span class="value">1</span>
          </div>
          <div class="stat-row special">
            <span class="label">Special:</span>
            <span class="value">Cannot Move</span>
          </div>
        </div>
      </div>

      <div class="placement-hint" :class="player">
        <p>{{ player === 'player1' ? 'Place your King in the top-left spawn area (green tiles)' : 'Place your King in the bottom-right spawn area (green tiles)' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Player } from '~~/types/gameTypes'

interface Props {
  player: Player
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.king-placement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  z-index: 2000;
  pointer-events: none;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.placement-panel {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 3px solid #ffd700;
  animation: slideRight 0.4s ease;
  pointer-events: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ffd700;
  color: #ffd700;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.close-btn:hover {
  background: #ffd700;
  color: #1a1a1a;
  transform: scale(1.1);
}

@keyframes slideRight {
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-header h2 {
  margin: 0 0 8px 0;
  color: #ffd700;
  font-size: 22px;
  text-align: center;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
}

.instructions {
  color: #ccc;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.4;
  font-size: 14px;
}

.king-preview {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #2a2a2a;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 2px solid #3a3a3a;
}

.king-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffd700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
  flex-shrink: 0;
}

.king-image.player1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.king-image.player2 {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.king-icon {
  font-size: 50px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.king-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.king-stats h3 {
  margin: 0 0 6px 0;
  color: #ffd700;
  font-size: 18px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background: #1a1a1a;
  border-radius: 6px;
}

.stat-row.special {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  font-weight: bold;
}

.stat-row .label {
  color: #999;
  font-size: 13px;
}

.stat-row.special .label {
  color: #fff;
}

.stat-row .value {
  color: #fff;
  font-weight: bold;
  font-size: 13px;
}

.placement-hint {
  padding: 14px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
}

.placement-hint.player1 {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2));
  border: 2px solid #3498db;
  color: #5dade2;
}

.placement-hint.player2 {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(192, 57, 43, 0.2));
  border: 2px solid #e74c3c;
  color: #ec7063;
}

.placement-hint p {
  margin: 0;
  font-size: 14px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}
</style>