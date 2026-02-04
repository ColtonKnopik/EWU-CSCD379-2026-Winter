<template>
<div 
  class="cell-container"
  @click.prevent="$emit('click')"
>
    <svg class="hexagon" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <polygon 
        :points="hexagonPoints"
        :class="['hexagon-shape', terrainType, { 
          'flag-player1': terrainType === 'flag' && flagOwner === 'player1',
          'flag-player2': terrainType === 'flag' && flagOwner === 'player2',
          'flag-contested': terrainType === 'flag' && flagContested
        }]"
      />
      <!-- Flag icon overlay -->
      <g v-if="terrainType === 'flag'" class="flag-icon">
        <rect x="48" y="30" width="4" height="40" :fill="flagOwner === 'player1' ? '#3498db' : flagOwner === 'player2' ? '#e74c3c' : '#fff'" />
        <polygon 
          points="52,35 52,50 70,42.5" 
          :fill="flagOwner === 'player1' ? '#3498db' : flagOwner === 'player2' ? '#e74c3c' : '#fff'"
        />
        <!-- Pulsing ring for contested flags -->
        <circle 
          v-if="flagContested" 
          cx="50" 
          cy="50" 
          r="25" 
          fill="none" 
          stroke="#fff" 
          stroke-width="2" 
          class="contested-ring"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
export type TerrainType = 'water' | 'land' | 'lava' | 'void' | 'mountain' | 'spawn' | 'flag'

interface Props {
  row: number
  col: number
  terrainType: TerrainType
  flagOwner?: 'player1' | 'player2' | null
  flagContested?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  flagOwner: null,
  flagContested: false
})

defineEmits<{
  click: []
}>()

// Hexagon points for SVG
// Points go around the hexagon clockwise starting from top point
const hexagonPoints = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
</script>

<style scoped>
.cell-container {
  cursor: pointer;
  width: 100%;
  height: 100%;
  position: relative;
}

.hexagon {
  width: 100%;
  height: 100%;
  display: block;
}

.hexagon-shape {
  stroke: none; /* Remove stroke for perfectly flush hexagons */
  stroke-width: 0;
  transition: filter 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, fill 0.3s ease;
}

.hexagon-shape:hover {
  filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
}

/* Terrain types */
.hexagon-shape.water {
  fill: #4a90e2;
}

.hexagon-shape.land {
  fill: #7cb342;
}

.hexagon-shape.lava {
  fill: #e74c3c;
}

.hexagon-shape.void {
  fill: #2c3e50;
}

.hexagon-shape.mountain {
  fill: #8b7355;
}

.hexagon-shape.spawn {
  fill: #9c27b0;
}

.hexagon-shape.flag {
  fill: #ffd700;
}

/* Flag ownership colors */
.hexagon-shape.flag-player1 {
  fill: #5dade2;
}

.hexagon-shape.flag-player2 {
  fill: #ec7063;
}

.hexagon-shape.flag-contested {
  animation: pulse 1s ease-in-out infinite;
}

.flag-icon {
  pointer-events: none;
}

.contested-ring {
  animation: pulse-ring 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.3);
  }
}

@keyframes pulse-ring {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>