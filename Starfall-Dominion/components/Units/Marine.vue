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
      <img :src="marineIcon" alt="Marine" class="unit-icon" />
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

const marineIcon = new URL('../../data/sprites/Marine.png', import.meta.url).href

// Setup unit-specific sounds
const sounds = useUnitSounds({
  attack: '/audio/units/marine/attack.mp3',
  hurt: '/audio/units/marine/hurt.mp3',
  death: '/audio/units/marine/death.mp3'
})

// Expose sound methods to parent
defineExpose({
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>
