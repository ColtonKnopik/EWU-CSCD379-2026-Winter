<template>
  <header class="game-header">
    <div class="header-glow"></div>
    <div class="scan-line"></div>
    
    <div class="player-section player1" :class="{ active: currentPlayer === 'player1' }">
      <div class="card-corner tl"></div>
      <div class="card-corner bl"></div>
      
      <div class="player-indicator">
        <div class="status-dot"></div>
        <div class="player-name orbitron-font">PLAYER 1</div>
      </div>
      
      <div class="resources">
        <div class="resource-item">
          <span class="resource-label">CREDITS</span>
          <span class="resource-value">{{ player1Gold }}</span>
        </div>
        <div class="resource-divider"></div>
        <div class="resource-item">
          <span class="resource-label">INCOME</span>
          <span class="resource-value income">+{{ player1Income }}</span>
        </div>
      </div>
    </div>

    <div class="center-section">
      <div class="turn-counter">
        <div class="turn-label rajdhani-font">TURN</div>
        <div class="turn-number orbitron-font">{{ turn }}</div>
      </div>
      <button 
        @click="$emit('endTurn')" 
        class="end-turn-btn orbitron-font"
        :class="{ 'position-left': currentPlayer === 'player1', 'position-right': currentPlayer === 'player2' }"
      >
        <div class="btn-particles">
          <div v-for="i in 6" :key="i" class="particle" :style="`--delay: ${i * 0.1}s`"></div>
        </div>
        <span class="btn-inner">
          <span class="btn-text">END TURN</span>
          <div class="btn-glow"></div>
        </span>
        <div class="btn-trail"></div>
      </button>
    </div>

    <div class="player-section player2" :class="{ active: currentPlayer === 'player2' }">
      <div class="card-corner tr"></div>
      <div class="card-corner br"></div>
      
      <div class="resources">
        <div class="resource-item">
          <span class="resource-label">INCOME</span>
          <span class="resource-value income">+{{ player2Income }}</span>
        </div>
        <div class="resource-divider"></div>
        <div class="resource-item">
          <span class="resource-label">CREDITS</span>
          <span class="resource-value">{{ player2Gold }}</span>
        </div>
      </div>
      
      <div class="player-indicator">
        <div class="player-name orbitron-font">PLAYER 2</div>
        <div class="status-dot"></div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Player } from '~~/types/gameTypes'

defineProps<{
  turn: number
  currentPlayer: Player
  player1Gold: number
  player1Income: number
  player2Gold: number
  player2Income: number
}>()

defineEmits<{
  endTurn: []
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.game-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, rgba(15, 15, 35, 0.95) 0%, rgba(10, 10, 30, 0.98) 100%);
  padding: 12px 40px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.scan-line {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), transparent);
  animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
  0% {
    top: -100%;
  }
  100% {
    top: 200%;
  }
}

.player-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 20px;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.2);
  backdrop-filter: blur(20px);
  min-width: 360px;
  transition: all 0.3s ease;
}

.player-section.player1 {
  border-left: 2px solid rgba(96, 165, 250, 0.4);
}

.player-section.player2 {
  border-right: 2px solid rgba(168, 85, 247, 0.4);
  flex-direction: row-reverse;
}

.player-section.player1.active {
  border-color: rgba(96, 165, 250, 0.8);
  background: rgba(15, 15, 35, 0.8);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.3), inset 0 0 20px rgba(96, 165, 250, 0.1);
}

.player-section.player2.active {
  border-color: rgba(168, 85, 247, 0.8);
  background: rgba(15, 15, 35, 0.8);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.1);
}

.card-corner {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  transition: all 0.4s ease;
}

.player1 .card-corner {
  border-color: rgba(96, 165, 250, 0.5);
}

.player2 .card-corner {
  border-color: rgba(168, 85, 247, 0.5);
}

.player1.active .card-corner {
  border-color: rgba(96, 165, 250, 1);
}

.player2.active .card-corner {
  border-color: rgba(168, 85, 247, 1);
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

.player-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player2 .player-indicator {
  flex-direction: row-reverse;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.5);
  animation: status-blink 2s ease-in-out infinite;
}

.player2 .status-dot {
  background: #a855f7;
  box-shadow: 0 0 10px #a855f7, 0 0 20px rgba(168, 85, 247, 0.5);
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.player-name {
  font-size: 16px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
}

.player2 .player-name {
  color: #a855f7;
  filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5));
}

.resources {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 2px;
}

.resource-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.resource-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.resource-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
  letter-spacing: 1px;
}

.resource-value.income {
  color: #34d399;
  text-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
  font-size: 14px;
}

.resource-divider {
  width: 1px;
  height: 30px;
  background: linear-gradient(180deg, transparent, rgba(96, 165, 250, 0.5), transparent);
}

.center-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  position: relative;
  flex: 1;
}

.turn-counter {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 25px;
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.4);
  border-radius: 2px;
  overflow: hidden;
  z-index: 2;
}

.turn-counter::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent, rgba(96, 165, 250, 0.1), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

.turn-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.turn-number {
  font-size: 24px;
  font-weight: 900;
  color: #60a5fa;
  text-shadow: 0 0 15px rgba(96, 165, 250, 0.8);
  line-height: 1;
}

.end-turn-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 30px;
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.5);
  border-radius: 2px;
  color: #fbbf24;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: visible;
  transform-origin: center;
  z-index: 1;
}

/* Position animations */
.end-turn-btn.position-left {
  transform: translateX(-300%);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 
    0 0 20px rgba(59, 130, 246, 0.3),
    -5px 0 15px rgba(59, 130, 246, 0.2);
}

.end-turn-btn.position-right {
  transform: translateX(200%);
  border-color: rgba(168, 85, 247, 0.6);
  box-shadow: 
    0 0 20px rgba(168, 85, 247, 0.3),
    5px 0 15px rgba(168, 85, 247, 0.2);
}

/* Particle effects */
.btn-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.end-turn-btn.position-left .btn-particles,
.end-turn-btn.position-right .btn-particles {
  opacity: 1;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #fbbf24;
  border-radius: 50%;
  box-shadow: 0 0 6px #fbbf24;
  animation: particleFloat 2s ease-in-out infinite;
  animation-delay: var(--delay);
}

.end-turn-btn.position-left .particle {
  background: #3b82f6;
  box-shadow: 0 0 6px #3b82f6;
}

.end-turn-btn.position-right .particle {
  background: #a855f7;
  box-shadow: 0 0 6px #a855f7;
}

.particle:nth-child(1) { top: 20%; left: -10px; }
.particle:nth-child(2) { top: 50%; left: -15px; }
.particle:nth-child(3) { top: 80%; left: -10px; }
.particle:nth-child(4) { top: 20%; right: -10px; }
.particle:nth-child(5) { top: 50%; right: -15px; }
.particle:nth-child(6) { top: 80%; right: -10px; }

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px) scale(1.2);
    opacity: 1;
  }
}

/* Trail effect */
.btn-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.end-turn-btn.position-left .btn-trail {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), transparent);
  opacity: 1;
  animation: trailLeft 1s ease-out infinite;
}

.end-turn-btn.position-right .btn-trail {
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.2));
  opacity: 1;
  animation: trailRight 1s ease-out infinite;
}

@keyframes trailLeft {
  0% {
    transform: translateX(0);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-20px);
    opacity: 0;
  }
}

@keyframes trailRight {
  0% {
    transform: translateX(0);
    opacity: 0.8;
  }
  100% {
    transform: translateX(20px);
    opacity: 0;
  }
}

.btn-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.btn-text {
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
  transition: filter 0.3s ease;
}

.end-turn-btn.position-left .btn-text {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
}

.end-turn-btn.position-right .btn-text {
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.8));
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
}

.end-turn-btn:hover {
  transform: translateX(-50%) translateY(-2px) scale(1.05);
}

.end-turn-btn.position-left:hover {
  transform: translateX(-300%) translateY(-2px) scale(1.05);
  border-color: rgba(59, 130, 246, 1);
  box-shadow: 
    0 0 30px rgba(59, 130, 246, 0.5),
    -5px 0 20px rgba(59, 130, 246, 0.3);
}

.end-turn-btn.position-right:hover {
  transform: translateX(200%) translateY(-2px) scale(1.05);
  border-color: rgba(168, 85, 247, 1);
  box-shadow: 
    0 0 30px rgba(168, 85, 247, 0.5),
    5px 0 20px rgba(168, 85, 247, 0.3);
}

.end-turn-btn:hover .btn-glow {
  width: 200%;
  height: 200%;
}

.end-turn-btn:active {
  transform: translateX(-50%) translateY(0) scale(1);
}

.end-turn-btn.position-left:active {
  transform: translateX(-300%) translateY(0) scale(1);
}

.end-turn-btn.position-right:active {
  transform: translateX(200%) translateY(0) scale(1);
}

/* Utilities */
.orbitron-font {
  font-family: 'Orbitron', sans-serif;
}

.rajdhani-font {
  font-family: 'Rajdhani', sans-serif;
}

/* Responsive design */
@media (max-width: 1200px) {
  .game-header {
    padding: 12px 20px;
  }
  
  .player-section {
    min-width: 300px;
    gap: 15px;
    padding: 8px 15px;
  }
  
  .center-section {
    padding: 0 20px;
  }
  
  .end-turn-btn.position-left {
    transform: translateX(-350%);
  }
  
  .end-turn-btn.position-right {
    transform: translateX(250%);
  }
  
  .end-turn-btn.position-left:hover {
    transform: translateX(-350%) translateY(-2px) scale(1.05);
  }
  
  .end-turn-btn.position-right:hover {
    transform: translateX(250%) translateY(-2px) scale(1.05);
  }
  
  .end-turn-btn.position-left:active {
    transform: translateX(-350%) translateY(0) scale(1);
  }
  
  .end-turn-btn.position-right:active {
    transform: translateX(250%) translateY(0) scale(1);
  }
}

@media (max-width: 900px) {
  .game-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .player-section {
    width: 100%;
    max-width: 500px;
  }
  
  .center-section {
    width: 100%;
    max-width: 500px;
    justify-content: center;
  }
  
  .end-turn-btn.position-left,
  .end-turn-btn.position-right {
    transform: translateX(-50%);
  }
  
  .end-turn-btn.position-left:hover,
  .end-turn-btn.position-right:hover {
    transform: translateX(-50%) translateY(-2px) scale(1.05);
  }
  
  .end-turn-btn.position-left:active,
  .end-turn-btn.position-right:active {
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>