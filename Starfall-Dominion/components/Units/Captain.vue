<template>
  <Unit
    unit-type="captain"
    :player="player"
    :health="health"
    :max-health="maxHealth"
    :actions-remaining="actionsRemaining"
    :is-selected="isSelected"
    :current-player="currentPlayer"
    @click="$emit('click')"
  >
    <template #icon>
      <img :src="captainIcon" alt="Captain" class="unit-icon" />
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

const captainIcon = new URL('../../data/sprites/Captain.png', import.meta.url).href

withDefaults(defineProps<Props>(), {
  isSelected: false,
  currentPlayer: 'player1'
})

defineEmits<{
  click: []
}>()

// Setup unit-specific sounds using unit type
const sounds = useUnitSounds('captain')

// Expose sound methods to parent
defineExpose({
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>
