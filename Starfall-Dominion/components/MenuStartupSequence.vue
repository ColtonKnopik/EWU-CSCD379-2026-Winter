<template>
<div class="startup-sequence" :class="{ complete: isComplete }">
  <!-- Space Background (fade in gradually) -->
  <transition name="stars-fade">
    <div v-if="showStars" class="space-background">
      <div class="stars-layer stars-1"></div>
      <div class="stars-layer stars-2"></div>
      <div class="stars-layer stars-3"></div>
      <div class="nebula"></div>
      <div class="cosmic-glow"></div>
    </div>
  </transition>

  <!-- Floating particles -->
  <transition name="particles-fade">
    <div v-if="showStars" class="particles">
      <div v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>
  </transition>

  <!-- Glitch Phase -->
  <transition name="fade">
    <div v-if="currentPhase === 'glitch'" class="glitch-phase">
      <div class="screen-glitch" :class="{ active: showGlitch }"></div>
    </div>
  </transition>

  <!-- Grid Phase -->
  <transition name="fade">
    <div v-if="currentPhase === 'grid'" class="grid-phase">
      <div class="holographic-grid" :class="{ fizzling: gridFizzling }">
        <!-- Hexagonal grid rows -->
        <div class="hex-grid">
          <div 
            v-for="row in 14" 
            :key="`row-${row}`" 
            class="hex-grid-row" 
            :class="{ offset: row % 2 === 0 }"
          >
            <div
              v-for="col in 14"
              :key="`hex-${row}-${col}`"
              class="hex-cell-grid"
              :style="getGridHexStyle(row, col)"
            >
              <svg class="hex-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <polygon
                  points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                  class="hex-shape"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Credits Phase -->
    <transition name="fade-credits">
      <div v-if="currentPhase === 'credits'" class="credits-phase">
        <div class="credit-text">
          <!-- Created By Label -->
          <transition name="slide-up-slow">
            <h2 v-if="showCreatedBy" class="credit-label">CREATED BY</h2>
          </transition>
          
          <!-- CK Interactive Name -->
          <transition name="slide-up">
            <h1 v-if="showCKInteractive" class="credit-name glitch-text" data-text="CK INTERACTIVE">CK INTERACTIVE</h1>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Title Reveal Phase -->
    <transition name="fade">
      <div v-if="currentPhase === 'title'" class="title-phase">
        <!-- STARFALL appears first -->
        <transition name="glitch">
          <h1 v-if="showStarfall" class="title-starfall">
            <span class="title-text" data-text="STARFALL">STARFALL</span>
          </h1>
        </transition>

        <!-- DOMINION appears second -->
        <transition name="glitch">
          <h2 v-if="showDominion" class="title-dominion">
            <span class="subtitle-char" v-for="(char, i) in 'DOMINION'" :key="i" :style="`animation-delay: ${i * 0.1}s`">
              {{ char }}
            </span>
          </h2>
        </transition>

        <!-- Title decoration -->
        <transition name="expand">
          <div v-if="showDecoration" class="title-decoration">
            <div class="deco-line left"></div>
            <div class="deco-center">✦</div>
            <div class="deco-line right"></div>
          </div>
        </transition>

        <!-- Energy burst effect -->
        <div class="energy-burst" :class="{ active: showEnergyBurst }"></div>
      </div>
    </transition>

    <!-- Menu Fade In Phase -->
    <transition name="fade-slow">
      <div v-if="currentPhase === 'menu'" class="menu-content">
        <slot></slot>
      </div>
    </transition>

    <!-- Skip button -->
    <button v-if="!isComplete" class="skip-button" @click="skipSequence">
      <span>SKIP</span>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Startup Music -->
    <audio 
      ref="startupMusicRef" 
      preload="auto"
      @error="handleAudioError"
    >
      <source src="/audio/The-Grid.mp4" type="audio/mp4">
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const currentPhase = ref<'stars' | 'glitch' | 'grid' | 'title' | 'menu'>('stars')
const showCreatedBy = ref(false)
const showCKInteractive = ref(false)
const showSoundBy = ref(false)
const showWarp = ref(false)
const showStarfall = ref(false)
const showDominion = ref(false)
const showDecoration = ref(false)
const showEnergyBurst = ref(false)
const isComplete = ref(false)
const showStars = ref(false)
const showGlitch = ref(false)
const showGrid = ref(false)
const gridFizzling = ref(false)

// Audio reference
const startupMusicRef = ref<HTMLAudioElement | null>(null)
const audioPlayAttempted = ref(false)

const playStartupMusic = async (): Promise<void> => {
  if (!startupMusicRef.value || audioPlayAttempted.value) return
  
  audioPlayAttempted.value = true
  startupMusicRef.value.volume = 0.7
  
  try {
    await startupMusicRef.value.play()
    console.log('Startup music (The-Grid) started')
  } catch (error) {
    console.warn('Autoplay blocked. Music will start on user interaction.', error)
    // Set up click listener to start music on first user interaction
    const startOnInteraction = async () => {
      if (startupMusicRef.value && startupMusicRef.value.paused) {
        try {
          await startupMusicRef.value.play()
          console.log('Startup music started after user interaction')
        } catch (err) {
          console.error('Failed to play audio:', err)
        }
      }
      document.removeEventListener('click', startOnInteraction)
    }
    document.addEventListener('click', startOnInteraction, { once: true })
  }
}

const stopStartupMusic = (): void => {
  if (startupMusicRef.value) {
    startupMusicRef.value.pause()
    startupMusicRef.value.currentTime = 0
    console.log('Startup music stopped')
  }
}

const handleAudioError = (event: Event): void => {
  console.error('Startup audio loading error:', event)
}

const getParticleStyle = (index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 10
  const randomDuration = 10 + Math.random() * 20
  const randomSize = 1 + Math.random() * 3
  
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    width: `${randomSize}px`,
    height: `${randomSize}px`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

const getWarpLineStyle = (index: number) => {
  const randomDelay = Math.random() * 0.5
  return {
    animationDelay: `${randomDelay}s`
  }
}

const getGridHexStyle = (row: number, col: number) => {
  const randomDelay = (row + col) * 0.05
  return {
    animationDelay: `${randomDelay}s`
  }
}

async function startSequence() {
  // Phase 0: Stars Placement (0-8s) - Start with black screen
  currentPhase.value = 'stars'
  await wait(500)
  
  // Slowly reveal the stars over 8 seconds
  showStars.value = true
  await wait(7500)
  
  // Phase 1: Glitch Effects (8-11s)
  currentPhase.value = 'glitch'
  showGlitch.value = true
  await wait(3000)
  showGlitch.value = false
  
  // Phase 2: Holographic Grid (12-19s)
  currentPhase.value = 'grid'
  await wait(1000)
  
  // Show grid (12-15s)
  showGrid.value = true
  await wait(3000)
  
  // Fizzle out grid (16-19s)
  gridFizzling.value = true
  await wait(3000)
  showGrid.value = false
  
  // Phase 3: Credits (20-25s)
  currentPhase.value = 'credits'
  await wait(1000)
  
  // Show "CREATED BY" label first (21-23s)
  showCreatedBy.value = true
  await wait(1500)
  
  // Show "CK INTERACTIVE" (23-25s)
  showCKInteractive.value = true
  await wait(2500)
  
  // Fade out both
  showCreatedBy.value = false
  showCKInteractive.value = false
  
  // Phase 4: Wait before title (29-49s)
  currentPhase.value = 'title'
  await wait(20000)
  
  // Phase 5: Title Reveal (46-52s)
  // Show STARFALL (46-48s)
  showStarfall.value = true
  await wait(2000)
  
  // Wait 2 seconds (48-50s)
  await wait(2000)
  
  // Show DOMINION (50-52s)
  showDominion.value = true
  await wait(2000)
  
  // Show decoration immediately after dominion
  showDecoration.value = true
  
  // Phase 6: Menu Fade In (52s+)
  currentPhase.value = 'menu'
  await wait(2000)
  
  // Sequence complete
  isComplete.value = true
  stopStartupMusic()
  emit('complete')
}

function skipSequence() {
  // Skip directly to menu
  currentPhase.value = 'menu'
  showStarfall.value = true
  showDominion.value = true
  showDecoration.value = true
  isComplete.value = true
  stopStartupMusic()
  emit('complete')
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

onMounted(() => {
  // Start music with slight delay
  setTimeout(() => {
    playStartupMusic()
  }, 500)
  
  // Start sequence
  startSequence()
})

onUnmounted(() => {
  // Clean up audio on unmount
  stopStartupMusic()
})
</script>

<style scoped>
@import '~/assets/css/space-theme.css';

.startup-sequence {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  z-index: 10000;
}

.startup-sequence.complete {
  position: relative;
  z-index: 1;
}

/* Glitch Phase */
.glitch-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 25;
  pointer-events: none;
}

.screen-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.screen-glitch.active {
  animation: glitch-flash 3s ease-in-out;
}

@keyframes glitch-flash {
  0%, 100% {
    opacity: 0;
  }
  10%, 30%, 50%, 70%, 90% {
    opacity: 1;
    background: linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.1) 0%,
      rgba(0, 255, 0, 0.1) 50%,
      rgba(0, 0, 255, 0.1) 100%
    );
    transform: translate(2px, 2px);
  }
  15%, 35%, 55%, 75%, 95% {
    opacity: 1;
    background: linear-gradient(
      -90deg,
      rgba(0, 255, 255, 0.1) 0%,
      rgba(255, 0, 255, 0.1) 50%,
      rgba(255, 255, 0, 0.1) 100%
    );
    transform: translate(-2px, -2px);
  }
  20%, 40%, 60%, 80% {
    opacity: 0;
    transform: translate(0, 0);
  }
}

/* Holographic Grid Phase */
.grid-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
}

.holographic-grid {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.holographic-grid.fizzling {
  animation: grid-fizzle 3s ease-out forwards;
}

@keyframes grid-appear {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes grid-fizzle {
  0% {
    opacity: 1;
    filter: brightness(1);
  }
  3% {
    opacity: 0.1;
    filter: brightness(2.5);
  }
  6% {
    opacity: 1;
    filter: brightness(0.3);
  }
  9% {
    opacity: 0.2;
    filter: brightness(2);
  }
  12% {
    opacity: 0.9;
    filter: brightness(0.5);
  }
  15% {
    opacity: 0.05;
    filter: brightness(3);
  }
  18% {
    opacity: 1;
    filter: brightness(0.2);
  }
  21% {
    opacity: 0.3;
    filter: brightness(2.2);
  }
  24% {
    opacity: 0.8;
    filter: brightness(0.4);
  }
  27% {
    opacity: 0.15;
    filter: brightness(2.8);
  }
  30% {
    opacity: 1;
    filter: brightness(0.1);
  }
  33% {
    opacity: 0.1;
    filter: brightness(2.5);
  }
  36% {
    opacity: 0.7;
    filter: brightness(0.6);
  }
  39% {
    opacity: 0.2;
    filter: brightness(2);
  }
  42% {
    opacity: 0.9;
    filter: brightness(0.3);
  }
  45% {
    opacity: 0.05;
    filter: brightness(3);
  }
  48% {
    opacity: 0.6;
    filter: brightness(0.5);
  }
  51% {
    opacity: 0.25;
    filter: brightness(2.3);
  }
  54% {
    opacity: 0.8;
    filter: brightness(0.4);
  }
  57% {
    opacity: 0.1;
    filter: brightness(2.7);
  }
  60% {
    opacity: 0.7;
    filter: brightness(0.2);
  }
  63% {
    opacity: 0.15;
    filter: brightness(2.5);
  }
  66% {
    opacity: 0.5;
    filter: brightness(0.6);
  }
  69% {
    opacity: 0.2;
    filter: brightness(2);
  }
  72% {
    opacity: 0.6;
    filter: brightness(0.3);
  }
  75% {
    opacity: 0.05;
    filter: brightness(2.8);
  }
  78% {
    opacity: 0.4;
    filter: brightness(0.4);
  }
  81% {
    opacity: 0.1;
    filter: brightness(2.2);
  }
  84% {
    opacity: 0.3;
    filter: brightness(0.5);
  }
  87% {
    opacity: 0.15;
    filter: brightness(1.8);
  }
  90% {
    opacity: 0.5;
    filter: brightness(0.3);
  }
  93% {
    opacity: 0.05;
    filter: brightness(1.5);
  }
  96% {
    opacity: 0.2;
    filter: brightness(0.2);
  }
  98% {
    opacity: 0.05;
    filter: brightness(0.5);
  }
  100% {
    opacity: 0;
    filter: brightness(0);
  }
}

/* Hexagonal Grid Layout - matches GameBoard .board structure */
.hex-grid {
  display: flex;
  flex-direction: column;
  position: relative;
  transform-origin: center;
  scale: 2.5;
  max-width: 100%;
  animation: grid-appear 1s ease-out;
}

.hex-grid-row {
  display: flex;
  height: 100px;
  margin-top: -25px;
  position: relative;
}

.hex-grid-row:first-child {
  margin-top: 0;
}

.hex-grid-row.offset {
  margin-left: 43.3px;
}

.hex-cell-grid {
  width: 86.6px;
  height: 100px;
  flex-shrink: 0;
  margin-left: -1px;
  position: relative;
  transition: transform 0.2s ease;
  animation: hex-materialize 0.5s ease-out both;
  cursor: pointer;
}

.hex-cell-grid:first-child {
  margin-left: 0;
}

.hex-cell-grid:hover {
  transform: translateY(-2px);
  z-index: 10;
}

@keyframes hex-materialize {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.hex-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.hex-shape {
  fill: rgba(96, 165, 250, 0.15);
  stroke: none;
  stroke-width: 0;
  transition: filter 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, fill 0.3s ease;
  animation: hex-glow 2s ease-in-out infinite;
}

.hex-cell-grid:hover .hex-shape {
  filter: brightness(1.2) drop-shadow(0 0 8px rgba(96, 165, 250, 0.6));
  stroke: rgba(96, 165, 250, 0.8);
  stroke-width: 1;
}

@keyframes hex-glow {
  0%, 100% {
    fill: rgba(96, 165, 250, 0.15);
    filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.3));
  }
  50% {
    fill: rgba(96, 165, 250, 0.25);
    filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  }
}

/* Holographic breakdown effect for hex cells */
.holographic-grid.fizzling .hex-shape {
  animation: hex-hologram-breakdown 3s ease-out forwards;
}

@keyframes hex-hologram-breakdown {
  0% {
    stroke: none;
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.15);
    opacity: 1;
    filter: brightness(1) blur(0px);
  }
  5% {
    stroke: rgba(96, 165, 250, 1);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.5);
    opacity: 0.2;
    filter: brightness(3) blur(0px);
  }
  10% {
    stroke: rgba(96, 165, 250, 0.3);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.1);
    opacity: 1;
    filter: brightness(0.3) blur(0px);
  }
  15% {
    stroke: rgba(96, 165, 250, 1);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.6);
    opacity: 0.1;
    filter: brightness(3.5) blur(1px);
  }
  20% {
    stroke: rgba(96, 165, 250, 0.4);
    stroke-width: 1;
    fill: rgba(96, 165, 250, 0.15);
    opacity: 0.9;
    filter: brightness(0.4) blur(0px);
  }
  25% {
    stroke: rgba(96, 165, 250, 1);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.7);
    opacity: 0.15;
    filter: brightness(3.2) blur(1px);
  }
  30% {
    stroke: rgba(96, 165, 250, 0.2);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.08);
    opacity: 0.8;
    filter: brightness(0.3) blur(0px);
  }
  35% {
    stroke: rgba(96, 165, 250, 1);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.5);
    opacity: 0.1;
    filter: brightness(3) blur(1.5px);
  }
  40% {
    stroke: rgba(96, 165, 250, 0.3);
    stroke-width: 1;
    fill: rgba(96, 165, 250, 0.12);
    opacity: 0.7;
    filter: brightness(0.5) blur(0.5px);
  }
  45% {
    stroke: rgba(96, 165, 250, 0.9);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.4);
    opacity: 0.2;
    filter: brightness(2.8) blur(1px);
  }
  50% {
    stroke: rgba(96, 165, 250, 0.25);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.1);
    opacity: 0.6;
    filter: brightness(0.4) blur(1px);
  }
  55% {
    stroke: rgba(96, 165, 250, 0.8);
    stroke-width: 2;
    fill: rgba(96, 165, 250, 0.35);
    opacity: 0.15;
    filter: brightness(2.5) blur(1.5px);
  }
  60% {
    stroke: rgba(96, 165, 250, 0.2);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.07);
    opacity: 0.5;
    filter: brightness(0.3) blur(1.5px);
  }
  65% {
    stroke: rgba(96, 165, 250, 0.7);
    stroke-width: 1;
    fill: rgba(96, 165, 250, 0.3);
    opacity: 0.2;
    filter: brightness(2.2) blur(2px);
  }
  70% {
    stroke: rgba(96, 165, 250, 0.15);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.05);
    opacity: 0.4;
    filter: brightness(0.4) blur(2px);
  }
  75% {
    stroke: rgba(96, 165, 250, 0.6);
    stroke-width: 1;
    fill: rgba(96, 165, 250, 0.2);
    opacity: 0.1;
    filter: brightness(2) blur(2.5px);
  }
  80% {
    stroke: rgba(96, 165, 250, 0.1);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.03);
    opacity: 0.3;
    filter: brightness(0.3) blur(3px);
  }
  85% {
    stroke: rgba(96, 165, 250, 0.4);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.15);
    opacity: 0.08;
    filter: brightness(1.5) blur(3px);
  }
  90% {
    stroke: rgba(96, 165, 250, 0.05);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.02);
    opacity: 0.15;
    filter: brightness(0.2) blur(3.5px);
  }
  95% {
    stroke: rgba(96, 165, 250, 0.2);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0.08);
    opacity: 0.05;
    filter: brightness(1) blur(4px);
  }
  100% {
    stroke: rgba(96, 165, 250, 0);
    stroke-width: 0;
    fill: rgba(96, 165, 250, 0);
    opacity: 0;
    filter: brightness(0) blur(5px);
  }
}

/* Hologram scan line effect on container */
.holographic-grid.fizzling::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(96, 165, 250, 0.8) 50%, 
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.6);
  animation: scan-line-sweep 3s ease-in-out forwards;
  pointer-events: none;
  z-index: 100;
}

@keyframes scan-line-sweep {
  0% {
    top: 0;
    left: 0;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    top: 50%;
    opacity: 0.8;
  }
  95% {
    opacity: 0.6;
  }
  100% {
    top: 100%;
    left: 0;
    opacity: 0;
  }
}

/* Credits Phase */
.credits-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.credit-text {
  text-align: center;
  position: absolute;
}

.credit-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.5rem;
  color: #60a5fa;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
  opacity: 0.8;
}

.credit-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 0.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  position: relative;
  filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 80px rgba(96, 165, 250, 0.4));
  animation: credit-glow 2s ease-in-out infinite;
}

.credit-name.glitch-text::before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.5;
  animation: credit-glitch-effect 3s infinite;
}

@keyframes credit-glow {
  0%, 100% {
    filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 80px rgba(96, 165, 250, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(96, 165, 250, 1)) drop-shadow(0 0 100px rgba(96, 165, 250, 0.6));
  }
}

@keyframes credit-glitch-effect {
  0%, 90%, 100% {
    transform: translate(0);
    opacity: 0;
  }
  91% {
    transform: translate(-2px, 2px);
    opacity: 0.7;
  }
  92% {
    transform: translate(2px, -2px);
    opacity: 0.7;
  }
  93% {
    transform: translate(0);
    opacity: 0;
  }
}

/* Warp Effect */
.warp-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.warp-lines.active {
  opacity: 1;
}

.warp-line {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 100px;
  background: linear-gradient(180deg, transparent, #60a5fa, transparent);
  transform-origin: center;
  animation: warp-speed 1s linear infinite;
}

@keyframes warp-speed {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(5) rotate(360deg);
    opacity: 0;
  }
}

.warp-line:nth-child(1) { transform: rotate(0deg); }
.warp-line:nth-child(2) { transform: rotate(18deg); }
.warp-line:nth-child(3) { transform: rotate(36deg); }
.warp-line:nth-child(4) { transform: rotate(54deg); }
.warp-line:nth-child(5) { transform: rotate(72deg); }
.warp-line:nth-child(6) { transform: rotate(90deg); }
.warp-line:nth-child(7) { transform: rotate(108deg); }
.warp-line:nth-child(8) { transform: rotate(126deg); }
.warp-line:nth-child(9) { transform: rotate(144deg); }
.warp-line:nth-child(10) { transform: rotate(162deg); }
.warp-line:nth-child(11) { transform: rotate(180deg); }
.warp-line:nth-child(12) { transform: rotate(198deg); }
.warp-line:nth-child(13) { transform: rotate(216deg); }
.warp-line:nth-child(14) { transform: rotate(234deg); }
.warp-line:nth-child(15) { transform: rotate(252deg); }
.warp-line:nth-child(16) { transform: rotate(270deg); }
.warp-line:nth-child(17) { transform: rotate(288deg); }
.warp-line:nth-child(18) { transform: rotate(306deg); }
.warp-line:nth-child(19) { transform: rotate(324deg); }
.warp-line:nth-child(20) { transform: rotate(342deg); }

/* Title Phase */
.title-phase {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.title-starfall {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.5rem;
  position: relative;
}

.title-text {
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.8));
  animation: title-pulse 2s ease-in-out infinite;
  position: relative;
}

.title-text::before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.5;
  animation: glitch-effect 3s infinite;
}

@keyframes title-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 60px rgba(96, 165, 250, 1));
  }
}

@keyframes glitch-effect {
  0%, 90%, 100% {
    transform: translate(0);
    opacity: 0;
  }
  91% {
    transform: translate(-2px, 2px);
    opacity: 0.7;
  }
  92% {
    transform: translate(2px, -2px);
    opacity: 0.7;
  }
  93% {
    transform: translate(0);
    opacity: 0;
  }
}

.title-dominion {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  margin: 1rem 0 0 0;
  letter-spacing: 1rem;
  color: #93c5fd;
  display: flex;
  justify-content: center;
  gap: 0.3rem;
}

.subtitle-char {
  display: inline-block;
  animation: char-appear 0.8s ease-out both;
}

@keyframes char-appear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.deco-line {
  height: 1px;
  width: 60px;
  background: linear-gradient(90deg, transparent, #60a5fa, transparent);
  animation: line-pulse 2s ease-in-out infinite;
}

.deco-line.left {
  background: linear-gradient(90deg, transparent, #60a5fa);
}

.deco-line.right {
  background: linear-gradient(90deg, #60a5fa, transparent);
}

@keyframes line-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.deco-center {
  color: #60a5fa;
  font-size: 1.5rem;
  animation: spin-slow 20s linear infinite;
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Energy Burst Effect */
.energy-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
}

.energy-burst.active {
  animation: burst 0.8s ease-out;
}

@keyframes burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(10);
  }
}

/* Menu Content */
.menu-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
}

/* Skip Button */
.skip-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #93c5fd;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  border-radius: 4px;
  z-index: 30;
}

.skip-button svg {
  width: 20px;
  height: 20px;
}

.skip-button:hover {
  background: rgba(20, 20, 45, 0.8);
  border-color: rgba(96, 165, 250, 0.6);
  color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(96, 165, 250, 0.3);
}

/* Transitions */
.stars-fade-enter-active {
  transition: opacity 8s ease-out;
}

.stars-fade-enter-from {
  opacity: 0;
}

.particles-fade-enter-active {
  transition: opacity 9s ease-out;
}

.particles-fade-enter-from {
  opacity: 0;
}

.fade-credits-enter-active,
.fade-credits-leave-active {
  transition: opacity 1s ease;
}

.fade-credits-enter-from,
.fade-credits-leave-to {
  opacity: 0;
}

.slide-up-slow-enter-active {
  transition: all 2s ease-out;
}

.slide-up-slow-leave-active {
  transition: all 1.5s ease-in;
}

.slide-up-slow-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-slow-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.slide-up-enter-active {
  transition: all 1s ease-out;
}

.slide-up-leave-active {
  transition: all 0.8s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.fade-enter-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from {
  opacity: 0;
}

.glitch-enter-active {
  animation: glitch-in 1s ease-out;
}

@keyframes glitch-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(10px);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
}

.expand-enter-active {
  animation: expand-in 1s ease-out;
}

@keyframes expand-in {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.fade-slow-enter-active {
  transition: opacity 2s ease;
}

.fade-slow-enter-from {
  opacity: 0;
}

@media (max-width: 768px) {
  .credit-label {
    font-size: 1rem;
    letter-spacing: 0.3rem;
  }

  .credit-name {
    font-size: 2rem;
  }

  .skip-button {
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
</style>
