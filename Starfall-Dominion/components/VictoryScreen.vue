<template>
  <div class="victory-overlay">
    <div class="victory-panel">
      <div class="crown-animation">
        <span class="crown">👑</span>
      </div>
      
      <h1 class="victory-title">Victory!</h1>
      
      <div class="winner-display" :class="winner">
        <h2>{{ winner === 'player1' ? 'Player 1' : 'Player 2' }} Wins!</h2>
      </div>

      <div class="victory-stats">
        <div class="stat">
          <span class="stat-label">Final Turn:</span>
          <span class="stat-value">{{ finalTurn }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Units Remaining:</span>
          <span class="stat-value">{{ unitsRemaining }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Gold Collected:</span>
          <span class="stat-value">{{ goldCollected }}</span>
        </div>
      </div>

      <div class="victory-message">
        <p>The enemy Captain has fallen!</p>
      </div>

      <button @click="$emit('restart')" class="restart-btn">
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Player } from '~~/types/gameTypes'

interface Props {
  winner: Player
  finalTurn: number
  unitsRemaining: number
  goldCollected: number
}

defineProps<Props>()

defineEmits<{
  restart: []
}>()
</script>

<style scoped>
.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.victory-panel {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 20px;
  padding: 48px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8);
  border: 3px solid #ffd700;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.crown-animation {
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

.crown {
  font-size: 80px;
  display: inline-block;
  filter: drop-shadow(0 4px 16px rgba(255, 215, 0, 0.8));
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.victory-title {
  font-size: 48px;
  margin: 0 0 24px 0;
  color: #ffd700;
  text-shadow: 0 4px 16px rgba(255, 215, 0, 0.6);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 4px 16px rgba(255, 215, 0, 0.6);
  }
  50% {
    text-shadow: 0 4px 24px rgba(255, 215, 0, 0.9);
  }
}

.winner-display {
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 32px;
  border: 3px solid;
  animation: pulseWinner 1.5s ease-in-out infinite;
}

.winner-display.player1 {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.3), rgba(41, 128, 185, 0.3));
  border-color: #3498db;
}

.winner-display.player2 {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.3), rgba(192, 57, 43, 0.3));
  border-color: #e74c3c;
}

@keyframes pulseWinner {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.winner-display h2 {
  margin: 0;
  font-size: 36px;
  color: #fff;
}

.victory-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}

.stat {
  background: #2a2a2a;
  padding: 16px 24px;
  border-radius: 8px;
  border: 2px solid #3a3a3a;
  min-width: 150px;
}

.stat-label {
  display: block;
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  color: #ffd700;
  font-size: 28px;
  font-weight: bold;
}

.victory-message {
  margin-bottom: 32px;
  padding: 16px;
  background: rgba(231, 76, 60, 0.2);
  border-radius: 8px;
  border: 2px solid #e74c3c;
}

.victory-message p {
  margin: 0;
  color: #ec7063;
  font-size: 18px;
  font-weight: bold;
}

.restart-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #ffd700, #f39c12);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.restart-btn:hover {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.restart-btn:active {
  transform: translateY(0);
}
</style>