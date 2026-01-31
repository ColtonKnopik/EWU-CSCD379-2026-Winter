<template>
  <div class="unit" :class="[player, { selected: isSelected, king: isKing }]" @click.stop="$emit('click')">
    <div v-if="isKing" class="king-icon">{{ unitIcon }}</div>
    <img v-else :src="unitIcon" :alt="unitType" class="unit-icon" />
    <div class="health-bar">
      <div 
        class="health-fill" 
        :style="{ width: healthPercentage + '%' }"
      ></div>
    </div>
    <div class="actions">
      <span v-for="i in actionsRemaining" :key="i" class="action-dot"></span>
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
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false
})

defineEmits<{
  click: []
}>()

const unitIcon = computed(() => {
  // Adjust path based on your project structure
  // This assumes sprites folder is in src/assets/sprites/
  if (props.unitType === 'king') {
    return '👑' // Use emoji for king
  }
  return props.unitType === 'berserker' 
    ? new URL('../data/sprites/Berserker.png', import.meta.url).href
    : new URL('../data/sprites/Marine.png', import.meta.url).href
})

const isKing = computed(() => props.unitType === 'king')

const healthPercentage = computed(() => {
  return (props.health / props.maxHealth) * 100
})
</script>

<style scoped>
.unit {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid #fff;
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s;
}

.unit.king {
  border: 4px solid #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  animation: kingGlow 2s ease-in-out infinite;
}

@keyframes kingGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
  }
}

.unit.selected {
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  border-width: 4px;
}

.unit.king.selected {
  box-shadow: 0 0 30px rgba(255, 215, 0, 1);
}

.unit.player1 {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.unit.player2 {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.unit-icon {
  width: 50%;
  height: 50%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.king-icon {
  font-size: 40px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  animation: crownFloat 3s ease-in-out infinite;
}

@keyframes crownFloat {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-3px) rotate(5deg);
  }
}

.health-bar {
  width: 80%;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: #2ecc71;
  transition: width 0.3s;
}

.actions {
  display: flex;
  gap: 2px;
  margin-top: 2px;
}

.action-dot {
  width: 6px;
  height: 6px;
  background: #f1c40f;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(241, 196, 15, 0.8);
}
</style>