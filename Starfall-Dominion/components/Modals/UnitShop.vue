<template>
  <div class="unit-shop-overlay" @click.self="$emit('close')">
    <div class="shop-terminal">
      <!-- Header Bar -->
      <div class="terminal-header">
        <div class="header-left">
          <div class="status-indicator"></div>
          <span class="terminal-title">UNIT DEPLOYMENT TERMINAL</span>
        </div>
        <div class="header-right">
          <div class="resource-display">
            <span class="resource-label">CREDITS</span>
            <span class="resource-value">{{ availableGold }}</span>
          </div>
          <button @click="$emit('close')" class="close-terminal">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="terminal-body">
        <!-- Left Panel - Unit List -->
        <div class="unit-list-panel">
          <div class="panel-header">
            <span>AVAILABLE UNITS</span>
            <div class="scan-line"></div>
          </div>
          
          <div class="unit-list">
            <div 
              v-for="unit in availableUnits"
              :key="unit.type"
              class="unit-list-item"
              :class="{ 
                selected: selectedUnit?.type === unit.type,
                disabled: availableGold < unit.cost
              }"
              @click="selectUnit(unit)"
            >
              <div class="item-border"></div>
              <div class="item-content">
                <div class="item-icon">
                  <img :src="unit.image" :alt="unit.name" />
                </div>
                <div class="item-info">
                  <div class="item-name">{{ unit.name }}</div>
                  <div class="item-cost">
                    <span class="cost-value">{{ unit.cost }}</span>
                    <span class="cost-label">CR</span>
                  </div>
                </div>
                <div class="item-status">
                  <svg v-if="availableGold >= unit.cost" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Unit Details -->
        <div class="unit-detail-panel">
          <div v-if="!selectedUnit" class="no-selection">
            <div class="hologram-icon">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5,5">
                  <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3">
                  <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="50" r="5" fill="currentColor"/>
              </svg>
            </div>
            <p class="select-prompt">SELECT A UNIT TO VIEW SPECIFICATIONS</p>
          </div>

          <div v-else class="unit-details-panel">
            <!-- Unit Header -->
            <div class="detail-header">
              <div class="unit-title-section">
                <h2 class="unit-title">{{ selectedUnit.name }}</h2>
                <div class="unit-type-badge">{{ selectedUnit.type.toUpperCase() }}</div>
              </div>
              <div class="unit-cost-badge">
                <span class="badge-value">{{ selectedUnit.cost }}</span>
                <span class="badge-label">CREDITS</span>
              </div>
            </div>

            <!-- Unit Image -->
            <div class="detail-image-section">
              <div class="image-container">
                <div class="hologram-grid"></div>
                <img :src="selectedUnit.image" :alt="selectedUnit.name" />
                <div class="image-scanlines"></div>
              </div>
            </div>

            <!-- Unit Description -->
            <div class="detail-section">
              <div class="section-label">DESCRIPTION</div>
              <p class="unit-description-text">{{ selectedUnit.description }}</p>
            </div>

            <!-- Combat Statistics -->
            <div class="detail-section">
              <div class="section-label">COMBAT SPECIFICATIONS</div>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7v6.5c0 5.51 3.84 10.67 9 12 5.16-1.33 9-6.49 9-12V7l-10-5z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">HEALTH POINTS</div>
                    <div class="stat-value">{{ selectedUnit.maxHealth }}</div>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill" :style="{ width: (selectedUnit.maxHealth / 150 * 100) + '%' }"></div>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">ATTACK POWER</div>
                    <div class="stat-value">{{ selectedUnit.attackPower }}</div>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill attack" :style="{ width: (selectedUnit.attackPower / 30 * 100) + '%' }"></div>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">MOVEMENT RANGE</div>
                    <div class="stat-value">{{ selectedUnit.moveRange }}</div>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill move" :style="{ width: (selectedUnit.moveRange / 5 * 100) + '%' }"></div>
                  </div>
                </div>

                <div class="stat-card">
                  <div class="stat-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">ATTACK RANGE</div>
                    <div class="stat-value">{{ selectedUnit.attackRange }}</div>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-bar-fill range" :style="{ width: (selectedUnit.attackRange / 3 * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deploy Button -->
            <div class="deploy-section">
              <button 
                class="deploy-button"
                :class="{ disabled: availableGold < selectedUnit.cost }"
                :disabled="availableGold < selectedUnit.cost"
                @click="purchaseUnit(selectedUnit)"
              >
                <span class="button-text">
                  {{ availableGold < selectedUnit.cost ? 'INSUFFICIENT CREDITS' : 'DEPLOY UNIT' }}
                </span>
                <div class="button-glow"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="terminal-footer">
        <div class="footer-item">
          <span class="footer-label">DEPLOYMENT ZONE</span>
          <span class="footer-value">[{{ row }}, {{ col }}]</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-item">
          <span class="footer-label">SYSTEM STATUS</span>
          <span class="footer-value status-online">ONLINE</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type UnitType } from '~~/types/gameTypes'
import { getPurchasableUnits, type UnitDefinition } from '~~/data/unitDefinitions'

interface Props {
  row: number
  col: number
  availableGold: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  purchase: [unitType: UnitType, cost: number]
}>()

const selectedUnit = ref<(UnitDefinition & { image: string }) | null>(null)

// Get purchasable units from centralized definitions
const availableUnits = computed(() => {
  return getPurchasableUnits().map(unit => ({
    ...unit,
    image: new URL(`../../data/sprites/${unit.spritePath}`, import.meta.url).href
  }))
})

function selectUnit(unit: UnitDefinition & { image: string }) {
  selectedUnit.value = unit
}

function purchaseUnit(unit: UnitDefinition & { image: string }) {
  if (props.availableGold >= unit.cost) {
    emit('purchase', unit.type, unit.cost)
  }
}
</script>

<style scoped>
@import '~/assets/css/unit-shop.css';
</style>