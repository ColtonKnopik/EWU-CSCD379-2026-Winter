<template>
  <Unit
    unit-type="marine"
    :player="player"
    :health="health"
    :max-health="maxHealth"
    :actions-remaining="actionsRemaining"
    :is-selected="isSelected"
    :current-player="currentPlayer"
    @click="$emit('click')"
  >
    <template #icon>
      <div 
        class="marine-sprite" 
        :class="[player, { attacking: isAttacking }]"
      ></div>
    </template>
  </Unit>
</template>

<script setup lang="ts">
import Unit from '~~/components/Units/Unit.vue'
import { useUnitSounds } from '~~/composables/useUnitSounds'
import { type Player } from '~~/types/gameTypes'

interface Props {
  player: Player
  health: number
  maxHealth: number
  actionsRemaining: number
  isSelected?: boolean
  currentPlayer?: Player
  isAttacking?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  currentPlayer: 'player1',
  isAttacking: false
})

defineEmits<{
  click: []
}>()

// Setup unit-specific sounds using unit type
const sounds = useUnitSounds('marine')

// Expose sound methods to parent
defineExpose({
  playSpawnSound: sounds.playSpawnSound,
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>

<style scoped>
.marine-sprite {
  width: 95%;
  height: 95%;
  background-image: url('../../data/sprites/Marine.png');
  background-size: 200% 200%; /* 2x2 grid: 2 columns, 2 rows */
  background-repeat: no-repeat;
  background-position: 0% 0%;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  transition: filter 0.2s ease;
  animation: marine-breathe 3s steps(2) infinite;
}

.marine-sprite.player1 {
  transform: scaleX(-1);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
}

.marine-sprite.player2 {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(220, 38, 38, 0.3));
}

/* Attack animation state - show bottom-left frame */
.marine-sprite.attacking {
  background-position: 0% 100%; /* Bottom-left: Attack frame */
  animation: none; /* Override idle animation */
}

@keyframes marine-breathe {
  0% { background-position: 0% 0%; }    /* Top-left: Idle frame 1 */
  100% { background-position: 200% 0%; } /* Top-right: Idle frame 2 */
}
</style>
