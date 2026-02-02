import { ref } from 'vue'

export type AttackAnimationType = 'melee-slash' | 'ranged-shot' | 'explosive-attack'

export interface AttackAnimationData {
  id: string
  animationType: AttackAnimationType
  attackerRow: number
  attackerCol: number
  defenderRow: number
  defenderCol: number
  startTime: number
  duration: number
}

export function useAttackAnimations() {
  const activeAnimations = ref<AttackAnimationData[]>([])

  function triggerAttackAnimation(
    animationType: AttackAnimationType,
    attackerRow: number,
    attackerCol: number,
    defenderRow: number,
    defenderCol: number,
    duration: number = 600 // ms
  ) {
    const animationId = `attack-${Date.now()}-${Math.random()}`
    
    activeAnimations.value.push({
      id: animationId,
      animationType,
      attackerRow,
      attackerCol,
      defenderRow,
      defenderCol,
      startTime: Date.now(),
      duration
    })

    // Auto-remove after animation completes
    setTimeout(() => {
      const index = activeAnimations.value.findIndex(a => a.id === animationId)
      if (index !== -1) {
        activeAnimations.value.splice(index, 1)
      }
    }, duration)
  }

  function getAnimationsAt(row: number, col: number) {
    return activeAnimations.value.filter(
      a => a.defenderRow === row && a.defenderCol === col
    )
  }

  function calculateAnimationDirection(anim: AttackAnimationData) {
    // Calculate direction from attacker to defender
    const dx = anim.defenderCol - anim.attackerCol
    const dy = anim.defenderRow - anim.attackerRow
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      angle,
      transform: `rotate(${angle}deg)`
    }
  }

  return {
    activeAnimations,
    triggerAttackAnimation,
    getAnimationsAt,
    calculateAnimationDirection
  }
}
