<template>
  <div class="placement-modal-overlay" @click="handleOverlayClick">
    <div class="placement-modal" @click.stop>
      <div class="modal-content">
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
        
        <div class="placement-note rajdhani-font">
          ⚠ Must be placed on LAND terrain
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
            <span class="stat-value orbitron-font">0</span>
          </div>
        </div>
        
        <button class="dismiss-btn orbitron-font" @click="handleDismiss">
          <span class="btn-text">UNDERSTOOD</span>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~~/types/gameTypes'

defineProps<{
  player: Player
}>()

const emit = defineEmits<{
  dismiss: []
}>()

function handleDismiss() {
  emit('dismiss')
}

function handleOverlayClick() {
  emit('dismiss')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

/* Modal Overlay */
.placement-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: overlayFadeIn 0.3s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

/* Modal Container */
.placement-modal {
  animation: modalSlideIn 0.5s ease-out;
  max-width: 90vw;
  max-height: 90vh;
}

@keyframes modalSlideIn {
  from {
    transform: scale(0.8) translateY(-50px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  position: relative;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.98) 0%, rgba(10, 10, 30, 0.95) 100%);
  border: 2px solid rgba(96, 165, 250, 0.5);
  backdrop-filter: blur(20px);
  padding: 30px;
  min-width: 400px;
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(59, 130, 246, 0.4),
    0 0 80px rgba(96, 165, 250, 0.2),
    inset 0 0 60px rgba(96, 165, 250, 0.05);
  border-radius: 4px;
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
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
  width: 20px;
  height: 20px;
  border: 3px solid rgba(96, 165, 250, 0.8);
  transition: all 0.4s ease;
  animation: cornerPulse 2s ease-in-out infinite;
}

@keyframes cornerPulse {
  0%, 100% {
    border-color: rgba(96, 165, 250, 0.6);
    width: 20px;
    height: 20px;
  }
  50% {
    border-color: rgba(96, 165, 250, 1);
    width: 25px;
    height: 25px;
  }
}

.card-corner.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.card-corner.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.card-corner.bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.card-corner.br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.placement-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.status-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

.status-dot.player1 {
  background: #3b82f6;
  box-shadow: 0 0 20px #3b82f6, 0 0 40px rgba(59, 130, 246, 0.5);
}

.status-dot.player2 {
  background: #a855f7;
  box-shadow: 0 0 20px #a855f7, 0 0 40px rgba(168, 85, 247, 0.5);
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
}

.placement-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 3px;
  filter: drop-shadow(0 0 15px rgba(96, 165, 250, 0.6));
}

.placement-instruction {
  font-size: 18px;
  font-weight: 700;
  color: #e0f2fe;
  text-align: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(96, 165, 250, 0.3);
  margin-bottom: 15px;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.placement-note {
  font-size: 14px;
  font-weight: 600;
  color: #fbbf24;
  text-align: center;
  padding: 12px 15px;
  background: rgba(251, 191, 36, 0.15);
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 4px;
  margin-bottom: 20px;
  letter-spacing: 1.5px;
  animation: warningPulse 2s ease-in-out infinite;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

@keyframes warningPulse {
  0%, 100% {
    opacity: 0.9;
    box-shadow: 0 0 0 rgba(251, 191, 36, 0.3);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  }
}

.zone-info {
  padding: 15px;
  border-left: 4px solid rgba(96, 165, 250, 0.6);
  background: rgba(0, 0, 0, 0.4);
  margin-bottom: 20px;
}

.zone-info.player1 {
  border-left-color: #3b82f6;
}

.zone-info.player2 {
  border-left-color: #a855f7;
}

.zone-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}

.zone-description {
  font-size: 16px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.captain-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(96, 165, 250, 0.3);
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(96, 165, 250, 0.5), transparent);
}

/* Dismiss Button */
.dismiss-btn {
  width: 100%;
  padding: 15px;
  background: rgba(96, 165, 250, 0.1);
  border: 2px solid rgba(96, 165, 250, 0.5);
  border-radius: 4px;
  color: #60a5fa;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dismiss-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 1);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
  transform: translateY(-2px);
}

.dismiss-btn:active {
  transform: translateY(0);
}

.btn-text {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.6));
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.4), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.5s ease;
}

.dismiss-btn:hover .btn-glow {
  width: 300%;
  height: 300%;
}

.orbitron-font {
  font-family: 'Orbitron', sans-serif;
}

.rajdhani-font {
  font-family: 'Rajdhani', sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    min-width: 320px;
    padding: 20px;
  }
  
  .placement-header h3 {
    font-size: 20px;
  }
  
  .placement-instruction {
    font-size: 16px;
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