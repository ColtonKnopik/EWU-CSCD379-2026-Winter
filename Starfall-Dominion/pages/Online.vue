<template>
  <div class="online-placeholder">
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

    <div class="content-wrapper">
      <!-- Main content -->
      <div class="message-container">
        <!-- Icon -->
        <div class="icon-wrapper">
          <svg class="construction-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/>
            <line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" stroke-width="2"/>
            <line x1="50" y1="95" x2="50" y2="85" stroke="currentColor" stroke-width="2"/>
            <line x1="15" y1="50" x2="5" y2="50" stroke="currentColor" stroke-width="2"/>
            <line x1="95" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="2"/>
            <circle cx="50" cy="50" r="4" fill="currentColor"/>
            <path d="M 35 50 L 50 35 L 65 50 L 50 65 Z" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div class="icon-glow"></div>
        </div>

        <!-- Text content -->
        <div class="text-content">
          <h1 class="title">
            <span class="title-line">ONLINE MULTIPLAYER</span>
          </h1>
          
          <div class="status-badge">
            <span class="status-dot"></span>
            <span class="status-text">IN DEVELOPMENT</span>
          </div>

          <p class="description">
            We're building something incredible. Online battles, ranked matchmaking, 
            and cross-platform play are coming soon to Starfall: Dominion.
          </p>

          <div class="features-grid">
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="feature-text">Ranked Matches</div>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <div class="feature-text">Galaxy Conquering</div>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15l-3 6H9l1-4-3.5-2 1.5-1L12 2l3.5 12 1.5 1-3.5 2 1 4h-0.01L12 15z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="feature-text">Leaderboards</div>
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <circle cx="17" cy="17" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M13 11l4 4M5 13l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <div class="feature-text">Alliance Network</div>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="progress-section">
          <div class="progress-label">
            <span>Development Progress</span>
            <span class="progress-percent">{{ progressPercent }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="`width: ${progressPercent}%`"></div>
            <div class="progress-glow"></div>
          </div>
        </div>

        <!-- Back button -->
        <button class="back-button" @click="goBack">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>RETURN TO MENU</span>
          <div class="card-corner tl"></div>
          <div class="card-corner tr"></div>
          <div class="card-corner bl"></div>
          <div class="card-corner br"></div>
        </button>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">Stay tuned for updates</div>
        <div class="separator">|</div>
        <div class="timestamp">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progressPercent = ref<number>(67);
const currentTime = ref<string>('');

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

const goBack = () => {
  navigateTo('/');
};

let timeInterval: number;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000) as unknown as number;
  
  // Slowly increment progress (simulation)
  setInterval(() => {
    if (progressPercent.value < 95) {
      progressPercent.value += Math.random() * 0.5;
    }
  }, 2000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<style scoped>
/* Import shared space theme styles */
@import '~/assets/css/space-theme.css';

.online-placeholder {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  gap: 3rem;
}

/* Message Container */
.message-container {
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(20px);
  padding: 4rem 3rem;
  clip-path: polygon(
    0 0,
    calc(100% - 30px) 0,
    100% 30px,
    100% 100%,
    30px 100%,
    0 calc(100% - 30px)
  );
  position: relative;
}

.message-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.05), transparent);
  pointer-events: none;
}

/* Icon */
.icon-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.construction-icon {
  width: 100%;
  height: 100%;
  color: #60a5fa;
  filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.6));
  animation: icon-rotate 20s linear infinite;
}

@keyframes icon-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-glow {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
  animation: glow-pulse 3s ease-in-out infinite;
}

/* Text Content */
.text-content {
  text-align: center;
  width: 100%;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.3rem;
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.4));
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 50px;
  margin-bottom: 1.5rem;
}

.status-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  color: #60a5fa;
  text-transform: uppercase;
}

.description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #93c5fd;
  margin: 0 0 2rem 0;
  font-weight: 300;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(20, 20, 45, 0.4);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(30, 30, 60, 0.6);
  border-color: rgba(96, 165, 250, 0.5);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  stroke: #60a5fa;
  filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  stroke: #93c5fd;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.8));
  transform: scale(1.1);
}

.feature-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #93c5fd;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
}

/* Progress Section */
.progress-section {
  width: 100%;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #93c5fd;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-weight: 600;
}

.progress-percent {
  color: #60a5fa;
  font-family: 'Orbitron', sans-serif;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 8px;
  background: rgba(20, 20, 45, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.3);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progress-shine 2s ease-in-out infinite;
}

@keyframes progress-shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.4), transparent);
  animation: progress-glow 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes progress-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Back Button */
.back-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: rgba(20, 20, 45, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(30, 30, 60, 0.8);
  border-color: rgba(96, 165, 250, 0.6);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(96, 165, 250, 0.3);
}

.back-button:hover .card-corner {
  border-color: rgba(96, 165, 250, 1);
  width: 25px;
  height: 25px;
}

.back-icon {
  width: 24px;
  height: 24px;
  stroke: #60a5fa;
  transition: transform 0.3s ease;
}

.back-button:hover .back-icon {
  transform: translateX(-4px);
}

/* Footer */
.footer {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: 'Rajdhani', monospace;
  font-size: 0.875rem;
  color: rgba(147, 197, 253, 0.6);
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.footer-text {
  color: rgba(147, 197, 253, 0.5);
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
  .message-container {
    padding: 3rem 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .back-button {
    padding: 1rem 2rem;
    font-size: 0.875rem;
  }

  .footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .separator {
    display: none;
  }
}
</style>