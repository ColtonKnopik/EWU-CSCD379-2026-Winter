<template>
  <div class="boot-sequence" :class="{ complete: isComplete }">
    <!-- Terminal Boot Screen -->
    <div class="terminal-screen" v-if="showTerminal">
      <div class="terminal-content">
        <div class="terminal-header">
          <span class="terminal-prompt">{{ APP_NAME }} v{{ APP_VERSION }}</span>
          <span class="terminal-cursor">_</span>
        </div>
        
        <div class="boot-messages">
          <div 
            v-for="(message, index) in displayedMessages" 
            :key="index"
            class="boot-message"
            :class="{ success: message.success, error: message.error }"
          >
            <span class="message-prefix">{{ message.prefix }}</span>
            <span class="message-text">{{ message.text }}</span>
            <span v-if="message.loading" class="loading-dots">{{ loadingDots }}</span>
            <span v-else-if="message.success" class="status-ok">[OK]</span>
            <span v-else-if="message.error" class="status-error">[ERROR]</span>
          </div>
        </div>
        
        <div v-if="showInitializing" class="initializing">
          <span class="init-text">INITIALIZING BATTLE SYSTEMS</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </div>
      
      <!-- Scan lines effect -->
      <div class="terminal-scanlines"></div>
    </div>
    
    <!-- Fade overlay -->
    <div class="fade-overlay" :class="{ active: fadingOut }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { APP_VERSION, APP_NAME } from '~/config/app'

const emit = defineEmits<{
  complete: []
  showBoard: []
  showHeader: []
  showSidebars: []
  showFooter: []
}>()

interface BootMessage {
  prefix: string
  text: string
  loading?: boolean
  success?: boolean
  error?: boolean
  delay: number
}

const showTerminal = ref(true)
const displayedMessages = ref<BootMessage[]>([])
const currentMessageIndex = ref(0)
const loadingDots = ref('')
const showInitializing = ref(false)
const progress = ref(0)
const fadingOut = ref(false)
const isComplete = ref(false)

const bootMessages: BootMessage[] = [
  { prefix: '[SYSTEM]', text: 'Initializing core systems', loading: true, delay: 500 },
  { prefix: '[SYSTEM]', text: 'Initializing core systems', success: true, delay: 800 },
  { prefix: '[MEMORY]', text: 'Allocating battlefield memory', loading: true, delay: 300 },
  { prefix: '[MEMORY]', text: 'Allocating battlefield memory', success: true, delay: 600 },
  { prefix: '[TERRAIN]', text: 'Loading terrain data', loading: true, delay: 400 },
  { prefix: '[TERRAIN]', text: 'Loading terrain data', success: true, delay: 700 },
  { prefix: '[UNITS]', text: 'Compiling unit definitions', loading: true, delay: 350 },
  { prefix: '[UNITS]', text: 'Compiling unit definitions', success: true, delay: 650 },
  { prefix: '[NETWORK]', text: 'Establishing tactical link', loading: true, delay: 450 },
  { prefix: '[NETWORK]', text: 'Establishing tactical link', success: true, delay: 750 },
  { prefix: '[GRAPHICS]', text: 'Rendering holographic display', loading: true, delay: 400 },
  { prefix: '[GRAPHICS]', text: 'Rendering holographic display', success: true, delay: 700 },
  { prefix: '[AUDIO]', text: 'Calibrating sound systems', loading: true, delay: 300 },
  { prefix: '[AUDIO]', text: 'Calibrating sound systems', success: true, delay: 600 },
  { prefix: '[AI]', text: 'Loading combat protocols', loading: true, delay: 500 },
  { prefix: '[AI]', text: 'Loading combat protocols', success: true, delay: 800 },
  { prefix: '[STATUS]', text: 'All systems operational', success: true, delay: 1000 }
]

// Loading dots animation
let dotsInterval: number
function animateLoadingDots() {
  let dots = 0
  dotsInterval = setInterval(() => {
    dots = (dots + 1) % 4
    loadingDots.value = '.'.repeat(dots)
  }, 200) as unknown as number
}

// Display messages one by one
async function displayMessages() {
  animateLoadingDots()
  
  for (let i = 0; i < bootMessages.length; i++) {
    currentMessageIndex.value = i
    displayedMessages.value.push(bootMessages[i])
    
    await new Promise(resolve => setTimeout(resolve, bootMessages[i].delay))
  }
  
  clearInterval(dotsInterval)
  
  // Show initializing progress
  await new Promise(resolve => setTimeout(resolve, 500))
  showInitializing.value = true
  
  // Animate progress bar
  await animateProgress()
  
  // Start element reveal sequence
  await startRevealSequence()
}

// Animate progress bar
async function animateProgress() {
  return new Promise(resolve => {
    const duration = 2000
    const steps = 100
    const stepDuration = duration / steps
    
    let current = 0
    const interval = setInterval(() => {
      current += 1
      progress.value = current
      
      if (current >= 100) {
        clearInterval(interval)
        resolve(true)
      }
    }, stepDuration)
  })
}

// Reveal game elements in sequence
async function startRevealSequence() {
  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Fade out terminal
  fadingOut.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  showTerminal.value = false
  
  // Reveal board first
  emit('showBoard')
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Then header
  emit('showHeader')
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Then sidebars
  emit('showSidebars')
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Finally footer
  emit('showFooter')
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Sequence complete
  isComplete.value = true
  emit('complete')
}

onMounted(() => {
  displayMessages()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600;700&display=swap');

.boot-sequence {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: all;
}

.boot-sequence.complete {
  pointer-events: none;
}

/* Terminal Screen */
.terminal-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.terminal-content {
  width: 90%;
  max-width: 800px;
  font-family: 'Source Code Pro', monospace;
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.terminal-header {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00ff00;
}

.terminal-prompt {
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
}

.terminal-cursor {
  animation: blink 1s infinite;
  font-weight: 700;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* Boot Messages */
.boot-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
}

.boot-message {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: messageAppear 0.3s ease-out;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.message-prefix {
  color: #00ffff;
  font-weight: 700;
  min-width: 100px;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.message-text {
  flex: 1;
  color: #00ff00;
}

.loading-dots {
  color: #00ff00;
  min-width: 20px;
}

.status-ok {
  color: #00ff00;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
}

.status-error {
  color: #ff0000;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 0, 0, 0.8);
}

/* Initializing Progress */
.initializing {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.init-text {
  font-size: 16px;
  font-weight: 700;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  text-align: center;
  letter-spacing: 2px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 
    0 0 10px rgba(0, 255, 0, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00ffff);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.8);
  transition: width 0.1s linear;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.3) 10px,
    rgba(255, 255, 255, 0.3) 20px
  );
  animation: progressScan 1s linear infinite;
}

@keyframes progressScan {
  from {
    transform: translateX(-20px);
  }
  to {
    transform: translateX(0);
  }
}

.progress-text {
  font-size: 14px;
  color: #00ff00;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

/* Scanlines Effect */
.terminal-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  animation: scanlineMove 8s linear infinite;
}

@keyframes scanlineMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(2px);
  }
}

/* Fade Overlay */
.fade-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s ease-out;
}

.fade-overlay.active {
  opacity: 1;
}

/* CRT Screen Effect */
.terminal-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 255, 0, 0.05) 100%);
  pointer-events: none;
}

.terminal-screen::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 255, 0, 0.02) 50%,
    rgba(0, 0, 0, 0.5) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%, 100% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
