<template>
  <div class="charged-blast">
    <!-- Screen dimming overlay -->
    <div class="screen-dim"></div>
    
    <!-- Charging phase at attacker position -->
    <div class="charging-phase" :style="chargingPhaseStyle">
      <!-- Energy core building up -->
      <div class="energy-core"></div>
      
      <!-- Orbiting particles -->
      <div class="charge-particles">
        <div 
          class="charge-particle" 
          v-for="i in 12" 
          :key="`charge-${i}`" 
          :style="`--orbit-angle: ${i * 30}deg; --orbit-delay: ${i * 0.1}s`"
        ></div>
      </div>
      
      <!-- Electric arcs -->
      <div class="electric-arcs">
        <div class="arc" v-for="i in 6" :key="`arc-${i}`" :style="`--arc-delay: ${i * 0.3}s; --arc-angle: ${i * 60}deg`"></div>
      </div>
      
      <!-- Charging rings -->
      <div class="charge-ring ring-1"></div>
      <div class="charge-ring ring-2"></div>
      <div class="charge-ring ring-3"></div>
    </div>
    
    <!-- Release phase (beam from attacker to defender) -->
    <div class="blast-phase">
      <!-- Initial blast flash at attacker -->
      <div class="blast-flash" :style="attackerPositionStyle"></div>
      
      <!-- Shockwave beam traveling from attacker to defender -->
      <div class="shockwave-beam" :style="beamStyle"></div>
      
      <!-- Beam particles -->
      <div class="beam-particles" :style="beamStyle">
        <div 
          class="beam-particle" 
          v-for="i in 20" 
          :key="`beam-${i}`" 
          :style="`--beam-delay: ${i * 0.02}s`"
        ></div>
      </div>
      
      <!-- Impact effects at defender -->
      <div class="impact-zone" :style="defenderPositionStyle">
        <div class="impact-core"></div>
        <div class="impact-wave"></div>
        <div class="impact-sparks">
          <div 
            class="impact-spark" 
            v-for="i in 8" 
            :key="`spark-${i}`" 
            :style="`--spark-angle: ${i * 45}deg; --spark-delay: ${i * 0.05}s`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  attackerRow: number
  attackerCol: number
  defenderRow: number
  defenderCol: number
}

const props = defineProps<Props>()

// Cell dimensions (same as unit animation)
const CELL_WIDTH = 86.6
const CELL_HEIGHT = 100
const ROW_OFFSET = -25
const COLUMN_OFFSET = -1

// Calculate cell position (absolute positions on the board)
function getCellPosition(row: number, col: number): { x: number, y: number } {
  const isOffsetRow = row % 2 === 0
  const offsetX = isOffsetRow ? 43.3 : 0
  
  const x = col === 0 
    ? offsetX 
    : offsetX + col * (CELL_WIDTH + COLUMN_OFFSET)
  
  const y = row * (CELL_HEIGHT + ROW_OFFSET)
  
  return { x, y }
}

// Use absolute positions directly (no container offset needed)
const attackerPos = computed(() => getCellPosition(props.attackerRow, props.attackerCol))
const defenderPos = computed(() => getCellPosition(props.defenderRow, props.defenderCol))

// Calculate angle between attacker and defender
const beamAngle = computed(() => {
  const dx = defenderPos.value.x - attackerPos.value.x
  const dy = defenderPos.value.y - attackerPos.value.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
})

// Calculate distance between attacker and defender
const beamDistance = computed(() => {
  const dx = defenderPos.value.x - attackerPos.value.x
  const dy = defenderPos.value.y - attackerPos.value.y
  return Math.sqrt(dx * dx + dy * dy)
})

// Charging phase positioned at attacker (using cell center point)
const chargingPhaseStyle = computed(() => ({
  left: `${attackerPos.value.x + CELL_WIDTH / 2}px`,
  top: `${attackerPos.value.y + CELL_HEIGHT / 2 + 20}px`,
}))

// Attacker position for blast flash
const attackerPositionStyle = computed(() => ({
  left: `${attackerPos.value.x + CELL_WIDTH / 2}px`,
  top: `${attackerPos.value.y + CELL_HEIGHT / 2 + 20}px`,
}))

// Defender position for impact
const defenderPositionStyle = computed(() => ({
  left: `${defenderPos.value.x + CELL_WIDTH / 2}px`,
  top: `${defenderPos.value.y + CELL_HEIGHT / 2 + 20}px`,
}))

// Beam positioned and rotated from attacker to defender
const beamStyle = computed(() => ({
  left: `${attackerPos.value.x + CELL_WIDTH / 2}px`,
  top: `${attackerPos.value.y + CELL_HEIGHT / 2 + 20}px`,
  width: `${beamDistance.value}px`,
  transform: `rotate(${beamAngle.value}deg)`,
  transformOrigin: 'left center',
}))
</script>

<style scoped>
.charged-blast {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: visible;
}

/* Screen dimming overlay */
.screen-dim {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  animation: dimScreen 3s ease-in-out forwards;
  z-index: 1;
}

@keyframes dimScreen {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* CHARGING PHASE */
.charging-phase {
  position: absolute;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  z-index: 2;
}

/* Energy core */
.energy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: radial-gradient(
    circle,
    #fff 0%,
    #60a5fa 20%,
    #3b82f6 40%,
    #2563eb 60%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 20px #60a5fa,
    0 0 40px #3b82f6,
    0 0 60px #2563eb;
  animation: coreCharge 2s ease-in forwards;
}

@keyframes coreCharge {
  0% {
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 1;
    box-shadow: 
      0 0 40px #60a5fa,
      0 0 80px #3b82f6,
      0 0 120px #2563eb;
  }
}

/* Orbiting charge particles */
.charge-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.charge-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fff, #60a5fa);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 10px #60a5fa;
  animation: orbit 1s linear var(--orbit-delay) infinite;
}

@keyframes orbit {
  0% {
    transform: translate(-50%, -50%) rotate(var(--orbit-angle)) translateX(40px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--orbit-angle)) translateX(40px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) + 360deg)) translateX(60px) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(calc(var(--orbit-angle) + 360deg)) translateX(60px) scale(0);
    opacity: 0;
  }
}

/* Electric arcs */
.electric-arcs {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.arc {
  position: absolute;
  width: 2px;
  height: 60px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    #60a5fa 20%,
    #fff 50%,
    #60a5fa 80%,
    transparent 100%
  );
  top: 50%;
  left: 50%;
  transform-origin: center bottom;
  filter: blur(1px);
  animation: arcPulse 0.6s ease-in-out var(--arc-delay) infinite;
}

@keyframes arcPulse {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(var(--arc-angle)) translateY(-30px) scaleY(0);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) rotate(var(--arc-angle)) translateY(-30px) scaleY(1);
    opacity: 1;
  }
}

/* Charging rings */
.charge-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid rgba(96, 165, 250, 0.6);
  transform: translate(-50%, -50%);
  animation: ringPulse 0.8s ease-out infinite;
}

.ring-1 {
  width: 60px;
  height: 60px;
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  animation-delay: 0.2s;
}

.ring-3 {
  width: 100px;
  height: 100px;
  animation-delay: 0.4s;
}

@keyframes ringPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* BLAST PHASE */
.blast-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  animation: blastReveal 0.1s ease-out 2s forwards;
  opacity: 0;
}

@keyframes blastReveal {
  to { opacity: 1; }
}

/* Blast flash at attacker position */
.blast-flash {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    #fff 0%,
    #60a5fa 10%,
    #3b82f6 30%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 100px #60a5fa;
  animation: blastFlashAnim 0.3s ease-out forwards;
}

@keyframes blastFlashAnim {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Shockwave beam (rotated and sized dynamically) */
.shockwave-beam {
  position: absolute;
  height: 60px;
  background: linear-gradient(
    90deg,
    rgba(96, 165, 250, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 10%,
    rgba(96, 165, 250, 0.9) 20%,
    rgba(59, 130, 246, 0.6) 40%,
    transparent 100%
  );
  box-shadow: 
    0 0 30px #60a5fa,
    0 0 60px #3b82f6;
  filter: blur(3px);
  animation: beamExpand 0.5s ease-out forwards;
}

@keyframes beamExpand {
  0% {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 0.8;
  }
}

/* Beam particles */
.beam-particles {
  position: absolute;
  height: 60px;
}

.beam-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 0%;
  box-shadow: 0 0 8px #60a5fa;
  animation: beamParticleTravel 0.4s linear var(--beam-delay) forwards;
}

@keyframes beamParticleTravel {
  0% {
    left: 0%;
    opacity: 0;
    transform: translateY(-50%) scale(0);
  }
  10% {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
    transform: translateY(-50%) scale(0);
  }
}

/* Impact zone at defender position */
.impact-zone {
  position: absolute;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  animation: impactReveal 0.1s ease-out 2.3s forwards;
  opacity: 0;
}

@keyframes impactReveal {
  to { opacity: 1; }
}

.impact-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  background: radial-gradient(
    circle,
    #fff 0%,
    #60a5fa 20%,
    #3b82f6 40%,
    transparent 100%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 40px #60a5fa,
    0 0 80px #3b82f6;
  animation: impactPulse 0.4s ease-out forwards;
}

@keyframes impactPulse {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

.impact-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 3px solid #60a5fa;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: impactWaveExpand 0.6s ease-out forwards;
}

@keyframes impactWaveExpand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
    border-width: 4px;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
    border-width: 1px;
  }
}

.impact-sparks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
}

.impact-spark {
  position: absolute;
  width: 3px;
  height: 15px;
  background: linear-gradient(180deg, #fff, #60a5fa, transparent);
  top: 50%;
  left: 50%;
  animation: sparkExplode 0.5s ease-out var(--spark-delay) forwards;
}

@keyframes sparkExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(-60px) scale(0.3);
    opacity: 0;
  }
}
</style>
