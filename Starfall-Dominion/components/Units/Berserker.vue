<template>
  <Unit
    unit-type="berserker"
    :player="player"
    :health="health"
    :max-health="maxHealth"
    :actions-remaining="actionsRemaining"
    :is-selected="isSelected"
    :current-player="currentPlayer"
    @click="$emit('click')"
  >
    <template #icon>
      <div class="berserker-sprite" :class="player"></div>
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
}

withDefaults(defineProps<Props>(), {
  isSelected: false,
  currentPlayer: 'player1'
})

defineEmits<{
  click: []
}>()

// Setup unit-specific sounds using unit type
const sounds = useUnitSounds('berserker')

// Expose sound methods to parent
defineExpose({
  playSpawnSound: sounds.playSpawnSound,
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>

<style scoped>
.berserker-sprite {
  width: 95%;
  height: 95%;
  background-image: url('../../data/sprites/Berserker.png');
  background-size: 100% 200%; /* 2 frames vertically = 200% height */
  background-repeat: no-repeat;
  background-position: 0 0%;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
  transition: filter 0.2s ease;
  animation: berserker-breathe 2.5s steps(2) infinite;
}

.berserker-sprite.player1 {
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(59, 130, 246, 0.3));
}

.berserker-sprite.player2 {
  transform: scaleX(-1);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4)) 
          drop-shadow(0 0 10px rgba(220, 38, 38, 0.3));
}

@keyframes berserker-breathe {
  0% { background-position: 0 0%; }
  100% { background-position: 0 200%; }
}
</style>
