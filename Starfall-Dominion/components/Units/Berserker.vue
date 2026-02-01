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
      <img :src="berserkerIcon" alt="Berserker" class="unit-icon" />
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

const berserkerIcon = new URL('../../data/sprites/Berserker.png', import.meta.url).href

// Setup unit-specific sounds
const sounds = useUnitSounds({
  attack: '/audio/units/berserker/attack.mp3',
  hurt: '/audio/units/berserker/hurt.mp3',
  death: '/audio/units/berserker/death.mp3'
})

// Expose sound methods to parent
defineExpose({
  playAttackSound: sounds.playAttackSound,
  playHurtSound: sounds.playHurtSound,
  playDeathSound: sounds.playDeathSound
})
</script>
