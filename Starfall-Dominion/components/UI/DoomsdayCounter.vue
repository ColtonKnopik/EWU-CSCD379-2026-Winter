<template>
  <div 
    class="doomsday-counter"
    :class="[controllingPlayer, `urgency-${turnsHeld}`]"
  >
    <div class="doomsday-separator"></div>
    <div class="doomsday-content">
      <span class="doomsday-label orbitron-font">DOOMSDAY</span>
    </div>
    <div class="doomsday-progress">
      <div 
        v-for="i in threshold" 
        :key="i" 
        class="progress-segment"
        :class="{ filled: i <= turnsHeld }"
      ></div>
    </div>
    <div class="doomsday-countdown rajdhani-font">
      {{ threshold - turnsHeld }} TURN{{ threshold - turnsHeld !== 1 ? 'S' : '' }} REMAIN
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~~/types/gameTypes'

defineProps<{
  controllingPlayer: Player
  turnsHeld: number
  threshold: number
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.doomsday-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  width: 100%;
  animation: doomsday-fade-in 0.5s ease-out;
}

@keyframes doomsday-fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.doomsday-separator {
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
  margin-bottom: 2px;
}

.doomsday-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.doomsday-icon {
  font-size: 14px;
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8));
  animation: icon-pulse 1.5s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.doomsday-label {
  font-size: 10px;
  font-weight: 900;
  color: #ef4444;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

.doomsday-progress {
  display: flex;
  gap: 3px;
}

.progress-segment {
  width: 18px;
  height: 4px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 1px;
  transition: all 0.4s ease;
}

.progress-segment.filled {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  border-color: #ef4444;
}

.doomsday-countdown {
  font-size: 10px;
  font-weight: 700;
  color: rgba(239, 68, 68, 0.8);
  letter-spacing: 1px;
}

/* Urgency levels - increase intensity */
.urgency-2 .doomsday-icon {
  animation-duration: 1s;
}

.urgency-3 .doomsday-icon {
  animation-duration: 0.6s;
  font-size: 16px;
}

.urgency-3 .doomsday-label {
  animation: text-flash 0.6s ease-in-out infinite;
}

@keyframes text-flash {
  0%, 100% { color: #ef4444; }
  50% { color: #fca5a5; }
}

/* Player color accents */
.player1 .doomsday-separator {
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.player2 .doomsday-separator {
  background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), transparent);
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
