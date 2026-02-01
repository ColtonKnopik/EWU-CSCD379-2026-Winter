<template>
  <div class="unit" 
       :class="[player, unitType, { selected: isSelected }]" 
       @click.stop="$emit('click')">
    <div class="unit-content">
      <slot name="icon" />
    </div>
    
    <div class="unit-ui">
      <div class="health-bar">
        <div 
          class="health-fill" 
          :style="{ width: healthPercentage + '%' }"
        ></div>
      </div>
      <div v-if="showActions" class="actions">
        <span v-for="i in actionsRemaining" :key="i" class="action-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Player, type UnitType } from '~~/types/gameTypes'

interface Props {
  unitType: UnitType
  player: Player
  health: number
  maxHealth: number
  actionsRemaining: number
  isSelected?: boolean
  currentPlayer?: Player
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  currentPlayer: 'player1'
})

defineEmits<{
  click: []
}>()

const healthPercentage = computed(() => {
  return (props.health / props.maxHealth) * 100
})

const showActions = computed(() => {
  return props.player === props.currentPlayer
})
</script>

<style scoped>
.unit {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
  transition: filter 0.2s ease, box-shadow 0.2s ease;
}

.unit.selected {
  z-index: 20;
}

.unit.selected .unit-content {
  transform: scale(1.15);
}

.unit-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
}

/* Shared icon styles */
.unit-content :deep(.unit-icon) {
  width: 85%;
  height: 85%;
  object-fit: contain;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  transition: all 0.2s ease;
}

.unit.player1 :deep(.unit-icon) {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
}

.unit.player2 :deep(.unit-icon) {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 10px rgba(239, 68, 68, 0.3));
  transform: scaleX(-1); /* Flip horizontally for player 2 */
}

.unit.selected.player1 :deep(.unit-icon) {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 15px rgba(59, 130, 246, 0.8));
}

.unit.selected.player2 :deep(.unit-icon) {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 15px rgba(239, 68, 68, 0.8));
  transform: scaleX(-1); /* Keep flipped when selected */
}

.unit.selected :deep(.unit-icon),
.unit.selected :deep(.captain-icon) {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
}

/* Captain specific styles */
.unit-content :deep(.captain-icon) {
  font-size: 60px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  animation: crownFloat 3s ease-in-out infinite;
  transition: all 0.2s ease;
}

.unit.captain.selected :deep(.captain-icon) {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px rgba(255, 215, 0, 1));
}

@keyframes crownFloat {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-3px) rotate(5deg);
  }
}

.unit-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
  padding: 0 10%;
  margin-bottom: 8px;
}

.health-bar {
  width: 100%;
  height: 5px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  transition: width 0.3s ease;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.3);
}

.unit:has(.health-fill[style*="width: 0"]) .health-fill,
.unit:has(.health-fill[style*="width: 1"]) .health-fill,
.unit:has(.health-fill[style*="width: 2"]) .health-fill {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.actions {
  display: flex;
  gap: 3px;
  justify-content: center;
}

.action-dot {
  width: 7px;
  height: 7px;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  box-shadow: 
    0 0 6px rgba(251, 191, 36, 0.9),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  animation: actionPulse 2s ease-in-out infinite;
}

.action-dot:nth-child(2) {
  animation-delay: 0.3s;
}

@keyframes actionPulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.unit:hover :deep(.unit-icon),
.unit:hover :deep(.captain-icon) {
  transform: scale(1.05);
}

.unit.player2:hover :deep(.unit-icon) {
  transform: scaleX(-1) scale(1.05);
}

.unit.captain:hover :deep(.captain-icon) {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
}
</style>