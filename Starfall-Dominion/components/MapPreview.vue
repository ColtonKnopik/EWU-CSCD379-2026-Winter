<template>
  <div class="map-preview">
    <canvas 
      ref="canvasRef" 
      :width="canvasWidth" 
      :height="canvasHeight"
      class="preview-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { TerrainType } from '~~/components/Cell.vue'

interface Props {
  terrainData: Array<[string, TerrainType]>
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const BOARD_SIZE = 8
const COLS_PER_ROW = 8

// Match the exact CSS layout from GameBoard.vue
const CELL_WIDTH = 86.6 // CSS: width: 86.6px
const CELL_HEIGHT = 100 // CSS: height: 100px
const ROW_OVERLAP = 25 // CSS: margin-top: -25px
const COL_OVERLAP = 1 // CSS: margin-left: -1px
const ROW_OFFSET_X = 43.3 // CSS: margin-left: 43.3px for even rows

// Calculate the actual board dimensions
const boardWidth = computed(() => {
  // First cell + (remaining cells with overlap)
  return CELL_WIDTH + (COLS_PER_ROW - 1) * (CELL_WIDTH - COL_OVERLAP) + ROW_OFFSET_X
})

const boardHeight = computed(() => {
  // First row + (remaining rows with overlap)
  return CELL_HEIGHT + (BOARD_SIZE - 1) * (CELL_HEIGHT - ROW_OVERLAP)
})

// Scale to fit the preview size
const scaleFactor = computed(() => {
  const maxDim = Math.max(boardWidth.value, boardHeight.value)
  return (props.size * 0.9) / maxDim // 0.9 to add some padding
})

const canvasWidth = computed(() => Math.floor(props.size))
const canvasHeight = computed(() => Math.floor(props.size * 0.85))

// Terrain colors matching the game
const terrainColors: Record<TerrainType, string> = {
  water: '#4a90e2',
  land: '#7cb342',
  lava: '#e74c3c',
  void: '#2c3e50',
  mountain: '#8b7355',
  spawn: '#9c27b0',
  flag: '#ffd700'
}

function drawHexagon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  color: string
) {
  const w = width / 2
  const h = height / 2
  const h4 = height / 4

  ctx.beginPath()
  ctx.moveTo(centerX, centerY - h)
  ctx.lineTo(centerX + w, centerY - h4)
  ctx.lineTo(centerX + w, centerY + h4)
  ctx.lineTo(centerX, centerY + h)
  ctx.lineTo(centerX - w, centerY + h4)
  ctx.lineTo(centerX - w, centerY - h4)
  ctx.closePath()

  ctx.fillStyle = color
  ctx.fill()
  
  // Add border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = Math.max(0.5, scaleFactor.value * 0.5)
  ctx.stroke()
}

function getCellScreenPosition(row: number, col: number) {
  // Mimic the exact CSS flexbox layout
  const isOffsetRow = row % 2 === 1
  
  // X position: row offset + column position with overlap
  let x = isOffsetRow ? ROW_OFFSET_X : 0
  if (col > 0) {
    x += col * (CELL_WIDTH - COL_OVERLAP)
  }
  
  // Y position: row position with overlap
  let y = 0
  if (row > 0) {
    y = row * (CELL_HEIGHT - ROW_OVERLAP)
  }
  
  return { x, y }
}

function renderMapPreview() {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Create terrain map from data
  const terrainMap = new Map<string, TerrainType>()
  props.terrainData.forEach(([key, value]) => {
    terrainMap.set(key, value)
  })

  const scale = scaleFactor.value
  const scaledWidth = CELL_WIDTH * scale
  const scaledHeight = CELL_HEIGHT * scale

  // Calculate offset to center the scaled board in the canvas
  const scaledBoardWidth = boardWidth.value * scale
  const scaledBoardHeight = boardHeight.value * scale
  const offsetX = (canvas.width - scaledBoardWidth) / 2
  const offsetY = (canvas.height - scaledBoardHeight) / 2

  // Draw hexagons using the same positioning as GameBoard
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < COLS_PER_ROW; col++) {
      const pos = getCellScreenPosition(row, col)
      
      // Scale and center the position
      const x = pos.x * scale + offsetX + scaledWidth / 2
      const y = pos.y * scale + offsetY + scaledHeight / 2

      const key = `${row}-${col}`
      const terrain = terrainMap.get(key) || 'void'
      const color = terrainColors[terrain]

      drawHexagon(ctx, x, y, scaledWidth, scaledHeight, color)
    }
  }
}

onMounted(() => {
  renderMapPreview()
})

watch(() => props.terrainData, () => {
  renderMapPreview()
}, { deep: true })

watch(() => props.size, () => {
  renderMapPreview()
})
</script>

<style scoped>
.map-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.preview-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  image-rendering: crisp-edges;
}
</style>
