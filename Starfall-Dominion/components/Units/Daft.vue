<template>
  <Unit
    unit-type="daft"
    :player="player"
    :health="health"
    :max-health="maxHealth"
    :actions-remaining="actionsRemaining"
    :is-selected="isSelected"
    :current-player="currentPlayer"
    @click="$emit('click')"
  >
    <template #icon>
      <img :src="daftIcon" alt="Daft" class="unit-icon" />
    </template>
  </Unit>
</template>

<script setup lang="ts">
import Unit from '~~/components/Unit.vue'
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

const daftIcon = new URL('../../data/sprites/Daft.png', import.meta.url).href

// Setup unit-specific sounds using unit type
const sounds = useUnitSounds('daft')

// Expose sound methods to parent
defineExpose({
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>
