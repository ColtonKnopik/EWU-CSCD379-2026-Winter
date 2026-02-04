<template>
  <!-- Footer is always present, just hidden when no unit selected -->
  <div class="info-footer">
    <div class="footer-container" :class="{ active: displayInfo }">
      <template v-if="displayInfo">
        <!-- Corner decorations -->
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <div class="card-corner bl"></div>
        <div class="card-corner br"></div>
        
        <!-- Header with unit name -->
        <div class="footer-header">
          <h3 class="unit-name orbitron-font">{{ title }}</h3>
          <div class="status-indicator" :class="statusClass"></div>
        </div>

        <!-- Horizontal stats layout -->
        <div class="footer-content">
          <!-- Type -->
          <div class="stat-block">
            <span class="stat-label rajdhani-font">TYPE</span>
            <span class="stat-value orbitron-font">{{ displayInfo.data.unitType.toUpperCase() }}</span>
          </div>

          <div class="vertical-divider"></div>

          <!-- Health Bar -->
          <div class="stat-block health-block">
            <span class="stat-label rajdhani-font">HP</span>
            <div class="health-bar-container">
              <div class="health-bar" :style="{ width: healthPercentage + '%' }"></div>
              <span class="health-text orbitron-font">{{ displayInfo.data.health }}/{{ displayInfo.data.maxHealth }}</span>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <!-- Actions -->
          <div class="stat-block">
            <span class="stat-label rajdhani-font">ACT</span>
            <div class="actions-display">
              <div 
                v-for="i in displayInfo.data.maxActions" 
                :key="i" 
                class="action-dot"
                :class="{ active: i <= displayInfo.data.actionsRemaining }"
              ></div>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <!-- Attack -->
          <div class="stat-block">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">ATK</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.attackPower }}</span>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <!-- Move -->
          <div class="stat-block">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">MOV</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.moveRange }}</span>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <!-- Range -->
          <div class="stat-block">
            <div class="stat-icon-wrapper">
              <svg class="stat-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <circle cx="12" cy="12" r="6" stroke-width="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-details">
              <span class="stat-label rajdhani-font">RNG</span>
              <span class="stat-value orbitron-font">{{ displayInfo.data.attackRange }}</span>
            </div>
          </div>

          <!-- Deselect Button -->
          <button 
            v-if="displayInfo.data.player === currentPlayer"
            @click="$emit('deselect')" 
            class="deselect-btn orbitron-font"
          >
            <span class="btn-text">✕ DESELECT</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Unit, Player } from '~~/types/gameTypes'

const props = defineProps<{
  unit: Unit | null
  currentPlayer: Player
}>()

defineEmits<{
  deselect: []
}>()

const displayInfo = computed(() => {
  if (props.unit) {
    return {
      type: 'unit' as const,
      data: props.unit
    }
  }
  return null
})

const title = computed(() => {
  if (!displayInfo.value) return ''
  return displayInfo.value.data.name
})

const statusClass = computed(() => {
  if (!displayInfo.value || displayInfo.value.type !== 'unit') return ''
  const isEnemy = displayInfo.value.data.player !== props.currentPlayer
  return isEnemy ? 'enemy' : 'friendly'
})

const healthPercentage = computed(() => {
  if (!displayInfo.value || displayInfo.value.type !== 'unit') return 0
  return (displayInfo.value.data.health / displayInfo.value.data.maxHealth) * 100
})
</script>

<style scoped>
@import '~/assets/css/unitinfo.css';
</style>