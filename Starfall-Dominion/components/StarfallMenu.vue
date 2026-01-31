<template>
  <div class="starfall-menu">
    <!-- Animated starfield background -->
    <div class="space-background">
      <div class="stars-layer stars-1"></div>
      <div class="stars-layer stars-2"></div>
      <div class="stars-layer stars-3"></div>
      <div class="nebula"></div>
      <div class="cosmic-glow"></div>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <div class="menu-wrapper">
      <!-- Title with glitch effect -->
      <div class="title-container">
        <h1 class="game-title" data-text="STARFALL">
          <span class="title-line">STARFALL:</span>
        </h1>
        <h2 class="game-subtitle">
          <span class="subtitle-char" v-for="(char, i) in 'DOMINION'" :key="i" :style="`animation-delay: ${i * 0.1}s`">
            {{ char }}
          </span>
        </h2>
        <div class="title-decoration">
          <div class="deco-line left"></div>
          <div class="deco-center">✦</div>
          <div class="deco-line right"></div>
        </div>
      </div>

      <!-- Menu buttons with advanced hover states -->
      <div class="menu-grid">
        <button 
          class="game-mode-card online"
          @click="handleOnlinePlay"
          @mouseenter="activeCard = 'online'"
          @mouseleave="activeCard = null"
        >
          <div class="card-background">
            <div class="scan-line"></div>
            <div class="card-glow"></div>
          </div>
          
          <div class="card-content">
            <div class="icon-container">
              <svg class="mode-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="3"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" stroke-width="2"/>
                <line x1="50" y1="95" x2="50" y2="85" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="50" x2="5" y2="50" stroke="currentColor" stroke-width="2"/>
                <line x1="95" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="2"/>
                <circle cx="50" cy="50" r="4" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="card-text">
              <h3 class="mode-title">ONLINE PLAY</h3>
              <p class="mode-description">Battle players worldwide</p>
              <div class="mode-status">
                <span class="status-dot"></span>
                <span class="status-text">{{ onlinePlayers }} players online</span>
              </div>
            </div>
          </div>

          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>

        <button 
          class="game-mode-card local"
          @click="handleLocalPlay"
          @mouseenter="activeCard = 'local'"
          @mouseleave="activeCard = null"
        >
          <div class="card-background">
            <div class="scan-line"></div>
            <div class="card-glow"></div>
          </div>
          
          <div class="card-content">
            <div class="icon-container">
              <svg class="mode-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="35" width="60" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="3"/>
                <circle cx="38" cy="55" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="62" cy="55" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="50" y1="45" x2="50" y2="65" stroke="currentColor" stroke-width="2"/>
                <line x1="40" y1="55" x2="60" y2="55" stroke="currentColor" stroke-width="2"/>
                <rect x="35" y="20" width="8" height="15" fill="currentColor"/>
                <rect x="57" y="20" width="8" height="15" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="card-text">
              <h3 class="mode-title">LOCAL PLAY</h3>
              <p class="mode-description">Challenge friends nearby</p>
              <div class="mode-status">
                <span class="status-dot local-dot"></span>
                <span class="status-text">Pass & play</span>
              </div>
            </div>
          </div>

          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>
      </div>

      <!-- Footer -->
      <div class="menu-footer">
        <div class="version">
          <span class="version-label">VERSION</span>
          <span class="version-number">1.0.0</span>
        </div>
        <div class="separator">|</div>
        <div class="timestamp">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type ButtonType = 'online' | 'local' | null;

const activeCard = ref<ButtonType>(null);
const onlinePlayers = ref<number>(1247);
const currentTime = ref<string>('');

const emit = defineEmits<{
  onlinePlay: []
  localPlay: []
}>();

const handleOnlinePlay = (): void => {
  emit('onlinePlay');
};

const handleLocalPlay = (): void => {
  emit('localPlay');
};

const getParticleStyle = (index: number) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const randomDelay = Math.random() * 10;
  const randomDuration = 10 + Math.random() * 20;
  
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  };
};

const updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;
};

let timeInterval: number;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000) as unknown as number;
  
  // Simulate fluctuating online player count
  setInterval(() => {
    onlinePlayers.value = 1200 + Math.floor(Math.random() * 100);
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.starfall-menu {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
}

/* Space Background */
.space-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.stars-1 {
  background-image: 
    radial-gradient(2px 2px at 10% 20%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(2px 2px at 80% 80%, rgba(255, 255, 255, 0.9), transparent),
    radial-gradient(1px 1px at 40% 60%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 60% 30%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(2px 2px at 30% 80%, rgba(255, 255, 255, 0.9), transparent);
  background-size: 200% 200%;
  animation: stars-float 60s linear infinite;
}

.stars-2 {
  background-image: 
    radial-gradient(1px 1px at 90% 10%, rgba(147, 197, 253, 0.6), transparent),
    radial-gradient(1px 1px at 20% 90%, rgba(147, 197, 253, 0.6), transparent),
    radial-gradient(1px 1px at 50% 40%, rgba(147, 197, 253, 0.6), transparent);
  background-size: 250% 250%;
  animation: stars-float 80s linear infinite reverse;
}

.stars-3 {
  background-image: 
    radial-gradient(3px 3px at 70% 50%, rgba(167, 139, 250, 0.4), transparent),
    radial-gradient(2px 2px at 15% 70%, rgba(167, 139, 250, 0.4), transparent);
  background-size: 300% 300%;
  animation: stars-float 100s linear infinite;
}

@keyframes stars-float {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.nebula {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  animation: nebula-pulse 15s ease-in-out infinite;
}

@keyframes nebula-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.cosmic-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
  animation: cosmic-rotate 60s linear infinite;
}

@keyframes cosmic-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

/* Menu Wrapper */
.menu-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 4rem;
}

/* Title Section */
.title-container {
  text-align: center;
  position: relative;
}

.game-title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.5rem;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.5));
  animation: title-glow 3s ease-in-out infinite;
}

@keyframes title-glow {
  0%, 100% {
    filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 50px rgba(96, 165, 250, 0.8));
  }
}

.game-subtitle {
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
  animation: char-fade-in 0.8s ease-out both;
}

@keyframes char-fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  opacity: 0;
  animation: decoration-fade-in 1s ease-out 1s both;
}

@keyframes decoration-fade-in {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
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

/* Menu Grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
  gap: 2rem;
  width: 100%;
  max-width: 900px;
}

.game-mode-card {
  position: relative;
  padding: 3rem 2rem;
  background: rgba(15, 15, 35, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  overflow: hidden;
  clip-path: polygon(
    0 0,
    calc(100% - 20px) 0,
    100% 20px,
    100% 100%,
    20px 100%,
    0 calc(100% - 20px)
  );
}

.game-mode-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(96, 165, 250, 0.6);
  background: rgba(20, 20, 45, 0.6);
  box-shadow: 
    0 20px 60px rgba(96, 165, 250, 0.3),
    inset 0 0 60px rgba(96, 165, 250, 0.05);
}

.game-mode-card.online:hover {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 
    0 20px 60px rgba(59, 130, 246, 0.4),
    inset 0 0 60px rgba(59, 130, 246, 0.1);
}

.game-mode-card.local:hover {
  border-color: rgba(168, 85, 247, 0.8);
  box-shadow: 
    0 20px 60px rgba(168, 85, 247, 0.4),
    inset 0 0 60px rgba(168, 85, 247, 0.1);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.game-mode-card:hover .card-background {
  opacity: 1;
}

.scan-line {
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(96, 165, 250, 0.8), 
    transparent
  );
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0% {
    top: -100%;
  }
  100% {
    top: 200%;
  }
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.mode-icon {
  width: 100%;
  height: 100%;
  color: #60a5fa;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.5));
  transition: all 0.4s ease;
}

.game-mode-card:hover .mode-icon {
  transform: scale(1.1) rotateY(180deg);
  filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.8));
}

.game-mode-card.local .mode-icon {
  color: #a855f7;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
}

.game-mode-card.local:hover .mode-icon {
  filter: drop-shadow(0 0 40px rgba(168, 85, 247, 0.8));
}

.card-text {
  text-align: center;
  width: 100%;
}

.mode-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  text-transform: uppercase;
}

.mode-description {
  font-size: 1rem;
  color: #93c5fd;
  margin: 0 0 1rem 0;
  font-weight: 300;
  letter-spacing: 0.05rem;
}

.mode-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #60a5fa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
  animation: status-blink 2s ease-in-out infinite;
}

.status-dot.local-dot {
  background: #a855f7;
  box-shadow: 0 0 10px #a855f7;
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.status-text {
  font-size: 0.875rem;
}

/* Card Corners */
.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  transition: all 0.4s ease;
}

.card-corner.tl {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.card-corner.tr {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.card-corner.bl {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.card-corner.br {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.game-mode-card:hover .card-corner {
  border-color: rgba(96, 165, 250, 1);
  width: 30px;
  height: 30px;
}

.game-mode-card.local:hover .card-corner {
  border-color: rgba(168, 85, 247, 1);
}

/* Footer */
.menu-footer {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: 'Rajdhani', monospace;
  font-size: 0.875rem;
  color: rgba(147, 197, 253, 0.6);
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.version {
  display: flex;
  gap: 0.5rem;
}

.version-label {
  color: rgba(147, 197, 253, 0.4);
}

.version-number {
  color: #60a5fa;
  font-weight: 600;
}

.separator {
  color: rgba(147, 197, 253, 0.3);
}

.timestamp {
  font-variant-numeric: tabular-nums;
  color: #60a5fa;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-wrapper {
    gap: 3rem;
    padding: 1rem;
  }

  .game-title {
    letter-spacing: 0.3rem;
  }

  .game-subtitle {
    letter-spacing: 0.5rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .game-mode-card {
    padding: 2rem 1.5rem;
  }

  .menu-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .separator {
    display: none;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>