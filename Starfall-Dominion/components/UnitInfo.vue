<template>
  <div v-if="displayInfo" class="info-panel">
    <div class="panel-header">
      <div class="card-corner tl"></div>
      <div class="card-corner tr"></div>
      <div class="header-glow"></div>
      <div class="scan-line"></div>
      <h3 class="panel-title orbitron-font">{{ title }}</h3>
      <div class="status-indicator" :class="statusClass"></div>
    </div>

    <div class="panel-content">
      <!-- Unit Information -->
      <div v-if="displayInfo.type === 'unit'" class="info-section">
        <div class="stat-row">
          <span class="stat-label rajdhani-font">TYPE</span>
          <span class="stat-value orbitron-font">{{ displayInfo.data.unitType.toUpperCase() }}</span>
        </div>
        
        <div class="stat-divider"></div>
        
        <div class="stat-row health-row">
          <span class="stat-label rajdhani-font">HEALTH</span>
          <div class="health-bar-container">
            <div class="health-bar" :style="{ width: healthPercentage + '%' }"></div>
            <span class="health-text orbitron-font">{{ displayInfo.data.health }}/{{ displayInfo.data.maxHealth }}</span>
          </div>
        </div>
        
        <div class="stat-divider"></div>
        
        <div class="stat-row">
          <span class="stat-label rajdhani-font">ACTIONS</span>
          <div class="actions-display">
            <div 
              v-for="i in displayInfo.data.maxActions" 
              :key="i" 
              class="action-dot"
              :class="{ active: i <= displayInfo.data.actionsRemaining }"
            ></div>
            <span class="stat-value orbitron-font">{{ displayInfo.data.actionsRemaining }}/{{ displayInfo.data.maxActions }}</span>
          </div>
        </div>
        
        <div class="stat-divider"></div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">ATTACK</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.attackPower }}</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">MOVE</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.moveRange }}</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" stroke-width="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">RANGE</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.attackRange }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button 
      v-if="displayInfo.type === 'unit' && displayInfo.data.player === currentPlayer"
      @click="$emit('deselect')" 
      class="action-btn orbitron-font"
    >
      <span class="btn-inner">
        <span class="btn-text">DESELECT</span>
        <div class="btn-glow"></div>
      </span>
    </button>

    <div class="panel-footer">
      <div class="card-corner bl"></div>
      <div class="card-corner br"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Unit, Player } from '~~/types/gameTypes'

const props = defineProps<{
  unit: Unit | null
  currentPlayer: Player
}>()

defineEmits<{
  deselect: []
}>()

const displayInfo = computed(() => {
  if (props.unit) {
    return {
      type: 'unit' as const,
      data: props.unit
    }
  }
  return null
})

const title = computed(() => {
  if (!displayInfo.value) return ''
  return displayInfo.value.data.name
})

const statusClass = computed(() => {
  if (!displayInfo.value || displayInfo.value.type !== 'unit') return ''
  const isEnemy = displayInfo.value.data.player !== props.currentPlayer
  return isEnemy ? 'enemy' : 'friendly'
})

const healthPercentage = computed(() => {
  if (!displayInfo.value || displayInfo.value.type !== 'unit') return 0
  return (displayInfo.value.data.health / displayInfo.value.data.maxHealth) * 100
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.info-panel {
  position: relative;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.panel-header {
  position: relative;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(10, 10, 30, 0.9) 100%);
  border-bottom: 1px solid rgba(96, 165, 250, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
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

.card-corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  transition: all 0.4s ease;
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

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  flex: 1;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: status-blink 2s ease-in-out infinite;
}

.status-indicator.friendly {
  background: #34d399;
  box-shadow: 0 0 10px #34d399, 0 0 20px rgba(52, 211, 153, 0.5);
}

.status-indicator.enemy {
  background: #ef4444;
  box-shadow: 0 0 10px #ef4444, 0 0 20px rgba(239, 68, 68, 0.5);
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.panel-content {
  padding: 20px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #60a5fa;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.stat-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent);
}

.health-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.health-bar-container {
  position: relative;
  width: 100%;
  height: 24px;
  background: rgba(0, 5, 15, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.4);
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 5px rgba(96, 165, 250, 0.2);
}

/* Grid pattern background */
.health-bar-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(0deg, transparent 24%, rgba(96, 165, 250, 0.05) 25%, rgba(96, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(96, 165, 250, 0.05) 75%, rgba(96, 165, 250, 0.05) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(96, 165, 250, 0.05) 25%, rgba(96, 165, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(96, 165, 250, 0.05) 75%, rgba(96, 165, 250, 0.05) 76%, transparent 77%, transparent);
  background-size: 4px 4px;
  pointer-events: none;
  z-index: 1;
}

.health-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(59, 130, 246, 0.6) 0%, 
    rgba(96, 165, 250, 0.8) 50%, 
    rgba(147, 197, 253, 0.9) 100%
  );
  box-shadow: 
    0 0 15px rgba(96, 165, 250, 0.8),
    0 0 30px rgba(96, 165, 250, 0.4),
    inset 0 0 15px rgba(147, 197, 253, 0.4);
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: hologram-flicker 3s infinite;
}

/* Hologram scan lines */
.health-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.05) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  z-index: 2;
  animation: scan-lines 0.5s linear infinite;
}

/* Moving light sweep */
.health-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.6), 
    transparent
  );
  animation: health-shimmer 3s infinite;
  z-index: 3;
}

/* Hologram flicker effect */
@keyframes hologram-flicker {
  0%, 100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.95;
    filter: brightness(1.1);
  }
  51% {
    opacity: 0.92;
    filter: brightness(0.95);
  }
  52% {
    opacity: 1;
    filter: brightness(1);
  }
  93% {
    opacity: 1;
    filter: brightness(1);
  }
  94% {
    opacity: 0.9;
    filter: brightness(1.15);
  }
  95% {
    opacity: 1;
    filter: brightness(1);
  }
}

/* Scan lines animation */
@keyframes scan-lines {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(2px);
  }
}

/* Shimmer animation */
@keyframes health-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
  color: #e0f2fe;
  text-shadow: 
    0 0 5px rgba(96, 165, 250, 0.8),
    0 0 10px rgba(96, 165, 250, 0.5),
    0 0 2px rgba(0, 0, 0, 0.9);
  z-index: 4;
  letter-spacing: 1px;
  animation: text-glitch 4s infinite;
}

@keyframes text-glitch {
  0%, 100% {
    opacity: 1;
    text-shadow: 
      0 0 5px rgba(96, 165, 250, 0.8),
      0 0 10px rgba(96, 165, 250, 0.5),
      0 0 2px rgba(0, 0, 0, 0.9);
  }
  94% {
    opacity: 1;
    text-shadow: 
      0 0 5px rgba(96, 165, 250, 0.8),
      0 0 10px rgba(96, 165, 250, 0.5),
      0 0 2px rgba(0, 0, 0, 0.9);
  }
  95% {
    opacity: 0.8;
    text-shadow: 
      -2px 0 2px rgba(255, 0, 0, 0.5),
      2px 0 2px rgba(0, 255, 255, 0.5),
      0 0 5px rgba(96, 165, 250, 0.8);
  }
  96% {
    opacity: 1;
    text-shadow: 
      0 0 5px rgba(96, 165, 250, 0.8),
      0 0 10px rgba(96, 165, 250, 0.5),
      0 0 2px rgba(0, 0, 0, 0.9);
  }
}

.actions-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(96, 165, 250, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.4);
  transition: all 0.3s ease;
}

.action-dot.active {
  background: #60a5fa;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
  border-color: #60a5fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 2px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(96, 165, 250, 0.1), 
    transparent
  );
  transition: left 0.5s ease;
}

.stat-item:hover {
  border-color: rgba(96, 165, 250, 0.6);
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.3);
}

.stat-item:hover::before {
  left: 100%;
}

.stat-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.stat-item:hover .stat-icon-wrapper {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
}

.stat-icon-svg {
  width: 18px;
  height: 18px;
  color: #60a5fa;
  filter: drop-shadow(0 0 3px rgba(96, 165, 250, 0.5));
}

.stat-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-details .stat-label {
  font-size: 9px;
}

.stat-details .stat-value {
  font-size: 16px;
}

.terrain-description {
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-left: 2px solid rgba(96, 165, 250, 0.5);
  color: rgba(147, 197, 253, 0.9);
  font-size: 13px;
  line-height: 1.5;
}

.terrain-properties {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 2px solid rgba(96, 165, 250, 0.4);
  color: rgba(147, 197, 253, 0.8);
  font-size: 12px;
}

.property-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #60a5fa;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
}

.action-btn {
  position: relative;
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.5);
  border-radius: 2px;
  color: #ef4444;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.btn-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.btn-text {
  filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5));
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
}

.action-btn:hover {
  border-color: rgba(239, 68, 68, 1);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

.action-btn:hover .btn-glow {
  width: 200%;
  height: 200%;
}

.action-btn:active {
  transform: scale(0.98);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.panel-footer {
  position: relative;
  height: 10px;
}

/* Utilities */
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