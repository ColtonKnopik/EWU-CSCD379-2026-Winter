import { ref, watch, onUnmounted, computed } from 'vue'
import type { Unit } from '~~/types/gameTypes'

interface AnimatingUnit {
  unitId: string
  unit: Unit
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
  startTime: number
}

const CELL_WIDTH = 86.6
const CELL_HEIGHT = 100
const ROW_OFFSET = -25
const COLUMN_OFFSET = -1
const ANIMATION_DURATION = 600 // ms

// Hexagon visual center offsets
// These account for black space and center the unit on the actual hexagon
const HEX_CENTER_X_OFFSET = 0 
const HEX_CENTER_Y_OFFSET = 0  

export function useUnitAnimation(units: Ref<Unit[]>) {
  const animatingUnits = ref<AnimatingUnit[]>([])
  const unitPositions = ref<Map<string, { row: number, col: number }>>(new Map())
  const currentTime = ref(Date.now())
  let animationFrameId: number | null = null

  // Initialize unit positions
  units.value.forEach(unit => {
    unitPositions.value.set(unit.id, { row: unit.row, col: unit.col })
  })

  // Animation loop to update currentTime and cleanup finished animations
  function animationLoop() {
    if (animatingUnits.value.length > 0) {
      currentTime.value = Date.now()
      
      // Remove finished animations
      animatingUnits.value = animatingUnits.value.filter(anim => {
        const elapsed = currentTime.value - anim.startTime
        return elapsed < ANIMATION_DURATION
      })
      
      if (animatingUnits.value.length > 0) {
        animationFrameId = requestAnimationFrame(animationLoop)
      } else {
        animationFrameId = null
      }
    } else {
      animationFrameId = null
    }
  }

  // Watch for unit position changes
  watch(units, (newUnits, oldUnits) => {
    if (!oldUnits) return
    
    newUnits.forEach(unit => {
      const oldPos = unitPositions.value.get(unit.id)
      
      // Handle new units (not in map yet)
      if (!oldPos) {
        unitPositions.value.set(unit.id, { row: unit.row, col: unit.col })
        return
      }
      
      if (oldPos.row !== unit.row || oldPos.col !== unit.col) {
        // Remove any existing animation for this unit
        animatingUnits.value = animatingUnits.value.filter(a => a.unitId !== unit.id)
        
        // Get actual DOM positions for accurate animation
        const fromPos = getCellPositionFromDOM(oldPos.row, oldPos.col)
        const toPos = getCellPositionFromDOM(unit.row, unit.col)
        
        // Unit has moved, start animation
        animatingUnits.value.push({
          unitId: unit.id,
          unit: unit,
          fromRow: oldPos.row,
          fromCol: oldPos.col,
          toRow: unit.row,
          toCol: unit.col,
          startTime: Date.now()
        })
        
        // Start animation loop if not running
        if (!animationFrameId) {
          animationLoop()
        }
      }
      
      // Update tracked position
      unitPositions.value.set(unit.id, { row: unit.row, col: unit.col })
    })
  }, { deep: true })

  // Cleanup on unmount
  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  // Check if any unit is currently animating
  const isAnyUnitAnimating = computed(() => animatingUnits.value.length > 0)

  // Check if a specific unit is animating
  function isAnimating(unitId: string): boolean {
    return animatingUnits.value.some(a => a.unitId === unitId)
  }

  // Get cell position from DOM (actual rendered position)
  function getCellPositionFromDOM(row: number, col: number): { x: number, y: number } {
    // Find the cell wrapper at this grid position
    // Query by data attributes or class structure
    const boardContainer = document.querySelector('.board-container')
    if (!boardContainer) {
      console.warn('Board container not found, falling back to calculated position')
      return getCellPosition(row, col)
    }

    // Get all cell wrappers
    const rows = boardContainer.querySelectorAll('.hex-row')
    if (row >= rows.length) {
      console.warn(`Row ${row} not found, falling back`)
      return getCellPosition(row, col)
    }

    const rowElement = rows[row]
    const cells = rowElement.querySelectorAll('.cell-wrapper')
    if (col >= cells.length) {
      console.warn(`Col ${col} not found, falling back`)
      return getCellPosition(row, col)
    }

    const cellElement = cells[col] as HTMLElement
    const boardRect = boardContainer.getBoundingClientRect()
    const cellRect = cellElement.getBoundingClientRect()

    // Return position relative to board container
    return {
      x: cellRect.left - boardRect.left,
      y: cellRect.top - boardRect.top
    }
  }

  // Get cell position in absolute coordinates (fallback calculation)
  function getCellPosition(row: number, col: number): { x: number, y: number } {
    const isOffsetRow = row % 2 === 0
    const offsetX = isOffsetRow ? 43.3 : 0
    
    // Calculate base cell position
    // First cell (col=0): no margin
    // Each subsequent cell: CELL_WIDTH + COLUMN_OFFSET (86.6 + (-1) = 85.6)
    const x = col === 0 
      ? offsetX 
      : offsetX + col * (CELL_WIDTH + COLUMN_OFFSET)
    
    const y = row * (CELL_HEIGHT + ROW_OFFSET)
    
    // Add hexagon center offset to match where units actually sit in the grid
    return { 
      x: x + HEX_CENTER_X_OFFSET, 
      y: y + HEX_CENTER_Y_OFFSET 
    }
  }

  // Get inline styles for animating unit
  function getAnimationStyle(anim: AnimatingUnit) {
    const elapsed = currentTime.value - anim.startTime
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
    
    // Smooth ease-in-out for more natural movement
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2
    
    // Use actual DOM positions for pixel-perfect alignment
    const fromPos = getCellPositionFromDOM(anim.fromRow, anim.fromCol)
    const toPos = getCellPositionFromDOM(anim.toRow, anim.toCol)
    
    // Calculate straight-line interpolation from center to center
    const x = fromPos.x + (toPos.x - fromPos.x) * eased
    const y = fromPos.y + (toPos.y - fromPos.y) * eased
    
    return {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${CELL_WIDTH}px`,
      height: `${CELL_HEIGHT}px`,
      pointerEvents: 'none'
    }
  }

  return {
    animatingUnits,
    isAnyUnitAnimating,
    isAnimating,
    getAnimationStyle
  }
}
