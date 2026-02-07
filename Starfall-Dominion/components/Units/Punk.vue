<template>
  <Unit
    unit-type="punk"
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
        class="punk-sprite" 
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
const sounds = useUnitSounds('punk')

// Expose sound methods to parent
defineExpose({
  playSpawnSound: sounds.playSpawnSound,
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>

<style scoped>
.punk-sprite {
  width: 95%;
  height: 95%;
  background-image: url('~~/data/sprites/Punk.png');
  background-size: 200% 200%; /* 2x2 grid: 2 columns, 2 rows */
  background-repeat: no-repeat;
  background-position: 0% 0%;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  transition: filter 0.2s ease;
  animation: punk-breathe 2.5s steps(2) infinite;
}

.punk-sprite.player1 {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
}

.punk-sprite.player2 {
  transform: scaleX(-1);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(220, 38, 38, 0.3));
}

/* Attack animation state - show top-right frame */
.punk-sprite.attacking {
  background-position: 100% 0%;
  animation: none;
}

@keyframes punk-breathe {
  0% { background-position: 0% 0%; }    /* Top-left: Idle frame 1 */
  100% { background-position: 0% 200%; } /* Bottom-left: Idle frame 2 */
}
</style>
