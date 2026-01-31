<template>
  <div class="unit-shop-overlay" @click.self="$emit('close')">
    <div class="unit-shop">
      <div class="shop-header">
        <h2>Unit Shop</h2>
        <p class="spawn-location">Spawn Point: Row {{ row }}, Col {{ col }}</p>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>

      <div class="gold-display">
        <span class="gold-icon">💰</span>
        <span class="gold-amount">{{ availableGold }} Gold</span>
      </div>

      <div class="units-grid">
        <div 
          v-for="unit in availableUnits" 
          :key="unit.type"
          class="unit-card"
          :class="{ disabled: availableGold < unit.cost }"
          @click="purchaseUnit(unit)"
        >
          <div class="unit-image">
            <img :src="unit.image" :alt="unit.name" />
          </div>
          <div class="unit-details">
            <h3>{{ unit.name }}</h3>
            <div class="unit-stats">
              <div class="stat">
                <span class="stat-label">HP:</span>
                <span class="stat-value">{{ unit.health }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">ATK:</span>
                <span class="stat-value">{{ unit.attack }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Move:</span>
                <span class="stat-value">{{ unit.moveRange }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Range:</span>
                <span class="stat-value">{{ unit.attackRange }}</span>
              </div>
            </div>
            <div class="unit-cost">
              <span class="cost-icon">💰</span>
              <span class="cost-amount">{{ unit.cost }}</span>
            </div>
            <button 
              class="buy-btn"
              :disabled="availableGold < unit.cost"
            >
              {{ availableGold < unit.cost ? 'Not Enough Gold' : 'Purchase' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type UnitType } from '~~/types/gameTypes'

interface UnitTemplate {
  type: UnitType
  name: string
  cost: number
  health: number
  attack: number
  moveRange: number
  attackRange: number
  image: string
}

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

const availableUnits: UnitTemplate[] = [
  {
    type: 'berserker',
    name: 'Berserker',
    cost: 50,
    health: 100,
    attack: 25,
    moveRange: 2,
    attackRange: 1,
    image: new URL('../data/sprites/Berserker.png', import.meta.url).href
  },
  {
    type: 'marine',
    name: 'Marine',
    cost: 75,
    health: 75,
    attack: 20,
    moveRange: 2,
    attackRange: 2,
    image: new URL('../data/sprites/Marine.png', import.meta.url).href
  }
]

function purchaseUnit(unit: UnitTemplate) {
  if (props.availableGold >= unit.cost) {
    emit('purchase', unit.type, unit.cost)
  }
}
</script>

<style scoped>
.unit-shop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.unit-shop {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 12px;
  padding: 24px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.shop-header h2 {
  margin: 0;
  color: #fff;
  font-size: 24px;
}

.spawn-location {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #999;
  font-size: 14px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

.gold-display {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.gold-icon {
  font-size: 24px;
}

.gold-amount {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.unit-card {
  background: #2a2a2a;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.unit-card:hover:not(.disabled) {
  border-color: #4a9eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
}

.unit-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unit-image {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.unit-image img {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.unit-details h3 {
  margin: 0;
  color: #fff;
  font-size: 18px;
}

.unit-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: #1a1a1a;
  border-radius: 4px;
}

.stat-label {
  color: #999;
  font-size: 13px;
}

.stat-value {
  color: #fff;
  font-weight: bold;
  font-size: 13px;
}

.unit-cost {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  border-radius: 6px;
  justify-content: center;
}

.cost-icon {
  font-size: 18px;
}

.cost-amount {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.buy-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #27ae60, #229954);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
}

.buy-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #229954, #1e8449);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.4);
}

.buy-btn:disabled {
  background: #555;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>