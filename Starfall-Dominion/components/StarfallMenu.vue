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
          <span class="title-line">STARFALL</span>
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

      <!-- Primary Menu (Play, Map Editor, More) -->
      <div v-if="currentScreen === 'main'" class="menu-grid" key="main-menu">
        <button 
          class="game-mode-card play"
          @click="currentScreen = 'play-mode'"
          @mouseenter="activeCard = 'play'"
          @mouseleave="activeCard = null"
        >
          <div class="card-background">
            <div class="scan-line"></div>
            <div class="card-glow"></div>
          </div>
          
          <div class="card-content">
            <div class="icon-container">
              <svg class="mode-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,20 30,80 75,50" fill="currentColor"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3"/>
              </svg>
            </div>
            
            <div class="card-text">
              <h3 class="mode-title">PLAY</h3>
              <p class="mode-description">Enter the battlefield</p>
            </div>
          </div>

          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>

        <button 
          class="game-mode-card editor"
          @click="handleMapEditor"
          @mouseenter="activeCard = 'editor'"
          @mouseleave="activeCard = null"
        >
          <div class="card-background">
            <div class="scan-line"></div>
            <div class="card-glow"></div>
          </div>
          
          <div class="card-content">
            <div class="icon-container">
              <svg class="mode-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" stroke-width="3"/>
                <line x1="15" y1="35" x2="85" y2="35" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="55" x2="85" y2="55" stroke="currentColor" stroke-width="2"/>
                <line x1="35" y1="15" x2="35" y2="85" stroke="currentColor" stroke-width="2"/>
                <line x1="55" y1="15" x2="55" y2="85" stroke="currentColor" stroke-width="2"/>
                <rect x="38" y="38" width="12" height="12" fill="currentColor"/>
                <rect x="58" y="58" width="12" height="12" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="card-text">
              <h3 class="mode-title">MAP EDITOR</h3>
              <p class="mode-description">Create custom battlegrounds</p>
            </div>
          </div>

          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>

        <button 
          class="game-mode-card more"
          @click="handleMore"
          @mouseenter="activeCard = 'more'"
          @mouseleave="activeCard = null"
        >
          <div class="card-background">
            <div class="scan-line"></div>
            <div class="card-glow"></div>
          </div>
          
          <div class="card-content">
            <div class="icon-container">
              <svg class="mode-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="50" r="8" fill="currentColor"/>
                <circle cx="50" cy="50" r="8" fill="currentColor"/>
                <circle cx="70" cy="50" r="8" fill="currentColor"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3"/>
              </svg>
            </div>
            
            <div class="card-text">
              <h3 class="mode-title">MORE</h3>
              <p class="mode-description">Settings & information</p>
            </div>
          </div>

          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>
      </div>

      <!-- Play Mode Selection Screen (Online vs Local) -->
      <div v-else-if="currentScreen === 'play-mode'" class="menu-grid" key="play-mode-menu">
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

        <!-- Back Button -->
        <button 
          class="back-button"
          @click="currentScreen = 'main'"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
          <span>BACK</span>
        </button>
      </div>

      <!-- Footer -->
      <div class="menu-footer">
        <div class="version">
          <span class="version-label">VERSION</span>
          <span class="version-number">{{ APP_VERSION }}</span>
        </div>
        <div class="separator">|</div>
        <div class="timestamp">{{ currentTime }}</div>
      </div>
    </div>

    <!-- Background Music -->
    <audio 
      ref="bgMusicRef" 
      loop 
      preload="auto"
      @error="handleAudioError"
    >
      <source src="/audio/Arena.m4a" type="audio/mp4">
      Your browser does not support the audio element.
    </audio>

    <!-- Volume Control -->
    <div class="volume-control">
      <button class="volume-button" @click="toggleMute" :class="{ muted: isMuted }">
        <svg v-if="!isMuted" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/>
        </svg>
      </button>
      <input 
        type="range" 
        min="0" 
        max="100" 
        v-model="volume" 
        @input="updateVolume"
        class="volume-slider"
        :class="{ visible: showVolumeSlider }"
        @mouseenter="showVolumeSlider = true"
        @mouseleave="showVolumeSlider = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { APP_VERSION } from '~/config/app';

type ButtonType = 'play' | 'editor' | 'more' | 'online' | 'local' | null;
type ScreenType = 'main' | 'play-mode';

const currentScreen = ref<ScreenType>('main');
const activeCard = ref<ButtonType>(null);
const onlinePlayers = ref<number>(1247);
const currentTime = ref<string>('');

// Audio controls
const bgMusicRef = ref<HTMLAudioElement | null>(null);
const volume = ref<number>(70);
const isMuted = ref<boolean>(false);
const showVolumeSlider = ref<boolean>(false);
const audioPlayAttempted = ref<boolean>(false);

const emit = defineEmits<{
  onlinePlay: []
  localPlay: []
  mapEditor: []
  more: []
}>();

const handleOnlinePlay = (): void => {
  emit('onlinePlay');
};

const handleLocalPlay = (): void => {
  emit('localPlay');
};

const handleMapEditor = (): void => {
  emit('mapEditor');
};

const handleMore = (): void => {
  emit('more');
};

// Audio functions
const playBackgroundMusic = async (): Promise<void> => {
  if (!bgMusicRef.value || audioPlayAttempted.value) return;
  
  audioPlayAttempted.value = true;
  bgMusicRef.value.volume = volume.value / 100;
  
  try {
    await bgMusicRef.value.play();
    console.log('Background music started');
  } catch (error) {
    console.warn('Autoplay blocked. Music will start on user interaction.', error);
    // Set up click listener to start music on first user interaction
    const startOnInteraction = async () => {
      if (bgMusicRef.value && bgMusicRef.value.paused) {
        try {
          await bgMusicRef.value.play();
          console.log('Background music started after user interaction');
        } catch (err) {
          console.error('Failed to play audio:', err);
        }
      }
      document.removeEventListener('click', startOnInteraction);
    };
    document.addEventListener('click', startOnInteraction, { once: true });
  }
};

const toggleMute = (): void => {
  if (!bgMusicRef.value) return;
  
  isMuted.value = !isMuted.value;
  bgMusicRef.value.muted = isMuted.value;
};

const updateVolume = (): void => {
  if (!bgMusicRef.value) return;
  
  bgMusicRef.value.volume = volume.value / 100;
  if (volume.value > 0 && isMuted.value) {
    isMuted.value = false;
    bgMusicRef.value.muted = false;
  }
};

const handleAudioError = (event: Event): void => {
  console.error('Audio loading error:', event);
};

// Watch volume changes
watch(volume, () => {
  showVolumeSlider.value = true;
  setTimeout(() => {
    showVolumeSlider.value = false;
  }, 2000);
});

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
  
  // Start background music
  setTimeout(() => {
    playBackgroundMusic();
  }, 500); // Small delay to ensure DOM is ready
});

onUnmounted(() => {
  clearInterval(timeInterval);
  
  // Stop and cleanup audio
  if (bgMusicRef.value) {
    bgMusicRef.value.pause();
    bgMusicRef.value.currentTime = 0;
  }
});
</script>

<style scoped>
/* Import shared space theme styles */
@import '~/assets/css/space-theme.css';

.starfall-menu {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
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

/* Height-based scaling for laptops */
@media (max-height: 900px) {
  .menu-wrapper {
    gap: 2rem;
    padding: 1.5rem 2rem;
    justify-content: flex-start;
    padding-top: 2rem;
  }
}

@media (max-height: 800px) {
  .menu-wrapper {
    gap: 1.5rem;
    padding: 1.5rem 2rem 1rem;
  }
}

@media (max-height: 700px) {
  .menu-wrapper {
    gap: 1rem;
    padding: 1rem 1.5rem 0.75rem;
  }
}

/* Title Section */
.title-container {
  text-align: center;
  position: relative;
}

@media (max-height: 800px) {
  .title-container {
    margin-bottom: -0.5rem;
  }
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

@media (max-height: 900px) {
  .game-title {
    font-size: clamp(2.5rem, 9vw, 6rem);
    letter-spacing: 0.3rem;
  }
}

@media (max-height: 800px) {
  .game-title {
    font-size: clamp(2rem, 8vw, 5rem);
    letter-spacing: 0.25rem;
  }
}

@media (max-height: 700px) {
  .game-title {
    font-size: clamp(1.75rem, 7vw, 4rem);
    letter-spacing: 0.2rem;
  }
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

@media (max-height: 900px) {
  .game-subtitle {
    font-size: clamp(1rem, 3vw, 1.75rem);
    letter-spacing: 0.5rem;
    margin: 0.75rem 0 0 0;
  }
}

@media (max-height: 800px) {
  .game-subtitle {
    font-size: clamp(0.875rem, 2.5vw, 1.5rem);
    letter-spacing: 0.4rem;
    margin: 0.5rem 0 0 0;
  }
}

@media (max-height: 700px) {
  .game-subtitle {
    font-size: clamp(0.75rem, 2vw, 1.25rem);
    letter-spacing: 0.3rem;
    margin: 0.5rem 0 0 0;
  }
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

@media (max-height: 900px) {
  .title-decoration {
    margin-top: 1rem;
    gap: 1rem;
  }
}

@media (max-height: 800px) {
  .title-decoration {
    margin-top: 0.75rem;
    gap: 0.75rem;
  }
}

@media (max-height: 700px) {
  .title-decoration {
    margin-top: 0.5rem;
    gap: 0.5rem;
  }
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 350px));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
}

@media (max-height: 900px) {
  .menu-grid {
    gap: 1.25rem;
  }
}

@media (max-height: 800px) {
  .menu-grid {
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 300px));
  }
}

@media (max-height: 700px) {
  .menu-grid {
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 280px));
  }
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

@media (max-height: 900px) {
  .game-mode-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-height: 800px) {
  .game-mode-card {
    padding: 1.5rem 1.25rem;
    clip-path: polygon(
      0 0,
      calc(100% - 15px) 0,
      100% 15px,
      100% 100%,
      15px 100%,
      0 calc(100% - 15px)
    );
  }
}

@media (max-height: 700px) {
  .game-mode-card {
    padding: 1.25rem 1rem;
    clip-path: polygon(
      0 0,
      calc(100% - 12px) 0,
      100% 12px,
      100% 100%,
      12px 100%,
      0 calc(100% - 12px)
    );
  }
}

.game-mode-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(96, 165, 250, 0.6);
  background: rgba(20, 20, 45, 0.6);
  box-shadow: 
    0 20px 60px rgba(96, 165, 250, 0.3),
    inset 0 0 60px rgba(96, 165, 250, 0.05);
}

.game-mode-card.play:hover {
  border-color: rgba(34, 197, 94, 0.8);
  box-shadow: 
    0 20px 60px rgba(34, 197, 94, 0.4),
    inset 0 0 60px rgba(34, 197, 94, 0.1);
}

.game-mode-card.editor:hover {
  border-color: rgba(251, 191, 36, 0.8);
  box-shadow: 
    0 20px 60px rgba(251, 191, 36, 0.4),
    inset 0 0 60px rgba(251, 191, 36, 0.1);
}

.game-mode-card.more:hover {
  border-color: rgba(147, 197, 253, 0.8);
  box-shadow: 
    0 20px 60px rgba(147, 197, 253, 0.4),
    inset 0 0 60px rgba(147, 197, 253, 0.1);
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

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (max-height: 900px) {
  .card-content {
    gap: 1rem;
  }
}

@media (max-height: 800px) {
  .card-content {
    gap: 0.75rem;
  }
}

@media (max-height: 700px) {
  .card-content {
    gap: 0.5rem;
  }
}

.icon-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

@media (max-height: 900px) {
  .icon-container {
    width: 75px;
    height: 75px;
  }
}

@media (max-height: 800px) {
  .icon-container {
    width: 65px;
    height: 65px;
  }
}

@media (max-height: 700px) {
  .icon-container {
    width: 55px;
    height: 55px;
  }
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

.game-mode-card.play .mode-icon {
  color: #22c55e;
  filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.5));
}

.game-mode-card.play:hover .mode-icon {
  filter: drop-shadow(0 0 40px rgba(34, 197, 94, 0.8));
}

.game-mode-card.editor .mode-icon {
  color: #fbbf24;
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
}

.game-mode-card.editor:hover .mode-icon {
  filter: drop-shadow(0 0 40px rgba(251, 191, 36, 0.8));
}

.game-mode-card.more .mode-icon {
  color: #93c5fd;
  filter: drop-shadow(0 0 20px rgba(147, 197, 253, 0.5));
}

.game-mode-card.more:hover .mode-icon {
  filter: drop-shadow(0 0 40px rgba(147, 197, 253, 0.8));
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

@media (max-height: 900px) {
  .mode-title {
    font-size: 1.25rem;
    letter-spacing: 0.15rem;
    margin: 0 0 0.35rem 0;
  }
}

@media (max-height: 800px) {
  .mode-title {
    font-size: 1.1rem;
    letter-spacing: 0.1rem;
    margin: 0 0 0.25rem 0;
  }
}

@media (max-height: 700px) {
  .mode-title {
    font-size: 1rem;
    letter-spacing: 0.08rem;
    margin: 0 0 0.2rem 0;
  }
}

.mode-description {
  font-size: 1rem;
  color: #93c5fd;
  margin: 0 0 1rem 0;
  font-weight: 300;
  letter-spacing: 0.05rem;
}

@media (max-height: 900px) {
  .mode-description {
    font-size: 0.875rem;
    margin: 0 0 0.75rem 0;
  }
}

@media (max-height: 800px) {
  .mode-description {
    font-size: 0.8125rem;
    margin: 0 0 0.5rem 0;
  }
}

@media (max-height: 700px) {
  .mode-description {
    font-size: 0.75rem;
    margin: 0 0 0.4rem 0;
  }
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

.status-text {
  font-size: 0.875rem;
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Card corners */
.card-corner {
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid rgba(96, 165, 250, 0.4);
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
  width: 25px;
  height: 25px;
}

.game-mode-card.play:hover .card-corner {
  border-color: rgba(34, 197, 94, 1);
}

.game-mode-card.editor:hover .card-corner {
  border-color: rgba(251, 191, 36, 1);
}

.game-mode-card.more:hover .card-corner {
  border-color: rgba(147, 197, 253, 1);
}

.game-mode-card.local:hover .card-corner {
  border-color: rgba(168, 85, 247, 1);
}

.game-mode-card.online:hover .card-corner {
  border-color: rgba(59, 130, 246, 1);
}

/* Back Button */
.back-button {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba(15, 15, 35, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #93c5fd;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  max-width: 300px;
  margin: 0 auto;
  width: 100%;
}

@media (max-height: 900px) {
  .back-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    max-width: 250px;
  }
}

@media (max-height: 800px) {
  .back-button {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    max-width: 220px;
    gap: 0.5rem;
  }
}

@media (max-height: 700px) {
  .back-button {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    max-width: 200px;
    gap: 0.4rem;
  }
}

.back-button svg {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

@media (max-height: 900px) {
  .back-button svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-height: 800px) {
  .back-button svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-height: 700px) {
  .back-button svg {
    width: 16px;
    height: 16px;
  }
}

.back-button:hover {
  background: rgba(20, 20, 45, 0.6);
  border-color: rgba(96, 165, 250, 0.6);
  color: #60a5fa;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(96, 165, 250, 0.2);
}

.back-button:hover svg {
  transform: translateX(-4px);
}

/* Menu Footer */
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

@media (max-height: 900px) {
  .menu-footer {
    font-size: 0.75rem;
    gap: 1.5rem;
  }
}

@media (max-height: 800px) {
  .menu-footer {
    font-size: 0.6875rem;
    gap: 1rem;
  }
}

@media (max-height: 700px) {
  .menu-footer {
    font-size: 0.625rem;
    gap: 0.75rem;
  }
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
    max-width: 350px;
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

/* Volume Control */
.volume-control {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.volume-control:hover {
  background: rgba(20, 20, 45, 0.8);
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
}

.volume-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.volume-button svg {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.5));
  transition: all 0.3s ease;
}

.volume-button:hover svg {
  color: #93c5fd;
  filter: drop-shadow(0 0 16px rgba(96, 165, 250, 0.8));
  transform: scale(1.1);
}

.volume-button.muted svg {
  color: #ef4444;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5));
}

.volume-button.muted:hover svg {
  filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.8));
}

.volume-slider {
  width: 0;
  opacity: 0;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.3), rgba(96, 165, 250, 0.6));
  border-radius: 2px;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.volume-slider.visible {
  width: 100px;
  opacity: 1;
  margin-left: 0.5rem;
}

.volume-control:hover .volume-slider {
  width: 100px;
  opacity: 1;
  margin-left: 0.5rem;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #60a5fa;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
  transition: all 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: #93c5fd;
  box-shadow: 0 0 20px rgba(96, 165, 250, 1);
  transform: scale(1.2);
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #60a5fa;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
  transition: all 0.2s ease;
}

.volume-slider::-moz-range-thumb:hover {
  background: #93c5fd;
  box-shadow: 0 0 20px rgba(96, 165, 250, 1);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .volume-control {
    bottom: 1rem;
    right: 1rem;
  }

  .volume-slider {
    width: 80px;
  }

  .volume-slider.visible {
    width: 80px;
  }

  .volume-control:hover .volume-slider {
    width: 80px;
  }
}

</style>