<template>
  <div class="placement-indicator">
    <div class="indicator-content">
      <div class="card-corner tl"></div>
      <div class="card-corner tr"></div>
      <div class="card-corner bl"></div>
      <div class="card-corner br"></div>
      
      <div class="glow-effect"></div>
      
      <div class="placement-header">
        <div class="status-dot" :class="player"></div>
        <h3 class="orbitron-font">{{ player === 'player1' ? 'PLAYER 1' : 'PLAYER 2' }}</h3>
      </div>
      
      <div class="placement-instruction rajdhani-font">
        PLACE YOUR CAPTAIN
      </div>
      
      <div class="zone-info" :class="player">
        <div class="zone-label rajdhani-font">DEPLOYMENT ZONE</div>
        <div class="zone-description rajdhani-font">
          {{ player === 'player1' ? 'Left 3 columns' : 'Right 3 columns' }}
        </div>
      </div>
      
      <div class="captain-stats">
        <div class="stat-item">
          <span class="stat-label rajdhani-font">HEALTH</span>
          <span class="stat-value orbitron-font">150</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label rajdhani-font">ATTACK</span>
          <span class="stat-value orbitron-font">30</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label rajdhani-font">MOVE</span>
          <span class="stat-value orbitron-font">1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~~/types/gameTypes'

defineProps<{
  player: Player
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.placement-indicator {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 1000;
  pointer-events: none;
}

.indicator-content {
  position: relative;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(96, 165, 250, 0.4);
  backdrop-filter: blur(20px);
  padding: 20px;
  min-width: 280px;
  overflow: hidden;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.card-corner {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(96, 165, 250, 0.6);
  transition: all 0.4s ease;
  animation: cornerPulse 2s ease-in-out infinite;
}

@keyframes cornerPulse {
  0%, 100% {
    border-color: rgba(96, 165, 250, 0.6);
  }
  50% {
    border-color: rgba(96, 165, 250, 1);
  }
}

.card-corner.tl {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.card-corner.tr {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.card-corner.bl {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.card-corner.br {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.placement-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.status-dot.player1 {
  background: #3b82f6;
  box-shadow: 0 0 15px #3b82f6, 0 0 30px rgba(59, 130, 246, 0.5);
}

.status-dot.player2 {
  background: #a855f7;
  box-shadow: 0 0 15px #a855f7, 0 0 30px rgba(168, 85, 247, 0.5);
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.placement-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
}

.placement-instruction {
  font-size: 14px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.8);
  text-align: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.zone-info {
  padding: 12px;
  border-left: 3px solid rgba(96, 165, 250, 0.6);
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 12px;
}

.zone-info.player1 {
  border-left-color: #3b82f6;
}

.zone-info.player2 {
  border-left-color: #a855f7;
}

.zone-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.zone-description {
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.captain-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 9px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, transparent, rgba(96, 165, 250, 0.5), transparent);
}

.orbitron-font {
  font-family: 'Orbitron', sans-serif;
}

.rajdhani-font {
  font-family: 'Rajdhani', sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>