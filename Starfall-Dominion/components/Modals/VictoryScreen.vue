<template>
  <div class="victory-overlay">
    <div class="victory-terminal">
      <!-- Scan lines effect -->
      <div class="scan-lines"></div>
      
      <!-- Header -->
      <div class="terminal-header">
        <div class="header-line"></div>
        <div class="status-indicators">
          <div class="status-dot"></div>
          <div class="status-dot"></div>
          <div class="status-dot"></div>
        </div>
        <h1 class="terminal-title">MISSION COMPLETE</h1>
        <div class="header-line"></div>
      </div>

      <!-- Winner Display -->
      <div class="winner-section" :class="winner">
        <div class="winner-badge">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="winner-icon">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="5,5">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
            </circle>
            <polygon points="50,20 60,45 85,45 65,60 70,85 50,70 30,85 35,60 15,45 40,45" fill="currentColor"/>
          </svg>
        </div>
        <div class="winner-info">
          <div class="winner-label">VICTOR</div>
          <div class="winner-name">{{ winner === 'player1' ? 'PLAYER ONE' : 'PLAYER TWO' }}</div>
          <div class="winner-subtitle">TACTICAL SUPERIORITY ACHIEVED</div>
        </div>
      </div>

      <!-- Statistics Grid -->
      <div class="stats-section">
        <div class="section-title">
          <span>MISSION STATISTICS</span>
          <div class="title-line"></div>
        </div>
        
        <div class="stats-grid">
          <!-- Combat Stats -->
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">MISSION DURATION</div>
              <div class="stat-value">{{ finalTurn }}</div>
              <div class="stat-unit">TURNS</div>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: Math.min((finalTurn / 50) * 100, 100) + '%' }"></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v6.5c0 5.51 3.84 10.67 9 12 5.16-1.33 9-6.49 9-12V7l-10-5z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">UNITS REMAINING</div>
              <div class="stat-value">{{ unitsRemaining }}</div>
              <div class="stat-unit">ACTIVE UNITS</div>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: (unitsRemaining / 8) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">RESOURCES SECURED</div>
              <div class="stat-value">{{ goldCollected }}</div>
              <div class="stat-unit">CREDITS</div>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill gold" :style="{ width: Math.min((goldCollected / 500) * 100, 100) + '%' }"></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C5.05,4.5 3.51,4.72 2.22,5.29C1.49,5.62 1,6.33 1,7.14V18.42C1,19.72 2.22,20.68 3.48,20.36C4.46,20.11 5.5,20 6.5,20C8.06,20 9.72,20.26 11.06,20.92C11.66,21.22 12.34,21.22 12.94,20.92C14.28,20.26 15.94,20 17.5,20C18.5,20 19.54,20.11 20.52,20.36C21.78,20.68 23,19.72 23,18.42V7.14C23,6.33 22.51,5.62 21.78,5.29C20.49,4.72 18.95,4.5 17.5,4.5M21,18.42C21,18.92 20.55,19.32 20.05,19.21C19.05,18.95 18.03,18.84 17.5,18.84C15.8,18.84 13.15,19.5 12,20.5V8C13.15,7 15.8,6.34 17.5,6.34C18.7,6.34 19.91,6.5 21,6.84V18.42Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">VICTORY CONDITION</div>
              <div class="stat-value victory-type">DECISIVE</div>
              <div class="stat-unit">ENEMY CAPTAIN ELIMINATED</div>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill victory" :style="{ width: '100%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Combat Report -->
      <div class="combat-report">
        <div class="report-line">
          <span class="report-label">ENGAGEMENT STATUS:</span>
          <span class="report-value success">SUCCESSFUL</span>
        </div>
        <div class="report-line">
          <span class="report-label">THREAT LEVEL:</span>
          <span class="report-value">NEUTRALIZED</span>
        </div>
        <div class="report-line">
          <span class="report-label">COMBAT EFFICIENCY:</span>
          <span class="report-value">{{ getCombatEfficiency() }}%</span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="action-section">
        <button @click="$emit('restart')" class="restart-button">
          <span class="button-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="button-text">INITIATE NEW MISSION</span>
          <div class="button-glow"></div>
        </button>
      </div>

      <!-- Terminal Footer -->
      <div class="terminal-footer">
        <div class="footer-code">SYS_STATUS: OPERATIONAL</div>
        <div class="footer-divider">|</div>
        <div class="footer-code">UPLINK: STABLE</div>
        <div class="footer-divider">|</div>
        <div class="footer-code">SEC_LEVEL: OMEGA</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Player } from '~~/types/gameTypes'

interface Props {
  winner: Player
  finalTurn: number
  unitsRemaining: number
  goldCollected: number
}

const props = defineProps<Props>()

defineEmits<{
  restart: []
}>()

// Calculate combat efficiency based on turn count and units remaining
const getCombatEfficiency = () => {
  const turnEfficiency = Math.max(0, 100 - (props.finalTurn * 2))
  const unitBonus = props.unitsRemaining * 5
  const efficiency = Math.min(100, Math.round(turnEfficiency + unitBonus))
  return efficiency
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.victory-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 15, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  animation: overlayFadeIn 0.5s ease;
  backdrop-filter: blur(10px);
}

@keyframes overlayFadeIn {
  from { 
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to { 
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

/* Terminal Container */
.victory-terminal {
  position: relative;
  background: linear-gradient(135deg, rgba(10, 15, 30, 0.98), rgba(15, 20, 40, 0.98));
  border: 2px solid rgba(96, 165, 250, 0.5);
  padding: 2.5rem;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 0 80px rgba(96, 165, 250, 0.4),
    inset 0 0 100px rgba(96, 165, 250, 0.05);
  animation: terminalBoot 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes terminalBoot {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
    filter: blur(10px);
  }
  60% {
    opacity: 0.8;
    filter: blur(0px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
}

/* Scan lines effect */
.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(96, 165, 250, 0.03) 0px,
    transparent 2px
  );
  pointer-events: none;
  animation: scanMove 8s linear infinite;
}

@keyframes scanMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

/* Terminal Header */
.terminal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.header-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #60a5fa, transparent);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

.status-indicators {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
  animation: statusBlink 2s ease-in-out infinite;
}

.status-dot:nth-child(2) {
  animation-delay: 0.3s;
}

.status-dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.terminal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: #60a5fa;
  letter-spacing: 0.3rem;
  margin: 0;
  text-shadow: 
    0 0 30px rgba(96, 165, 250, 0.8),
    0 0 60px rgba(96, 165, 250, 0.4);
  animation: titleGlow 2s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 
      0 0 30px rgba(96, 165, 250, 0.8),
      0 0 60px rgba(96, 165, 250, 0.4);
  }
  50% {
    text-shadow: 
      0 0 40px rgba(96, 165, 250, 1),
      0 0 80px rgba(96, 165, 250, 0.6);
  }
}

/* Winner Section */
.winner-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  margin-bottom: 2rem;
  background: rgba(96, 165, 250, 0.05);
  border: 2px solid rgba(96, 165, 250, 0.3);
  border-left: 4px solid;
  position: relative;
  overflow: hidden;
  animation: winnerReveal 0.8s ease 0.3s backwards;
}

@keyframes winnerReveal {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.winner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1), transparent);
  animation: winnerSweep 3s ease-in-out infinite;
}

@keyframes winnerSweep {
  0% { left: -100%; }
  100% { left: 200%; }
}

.winner-section.player1 {
  border-left-color: #60a5fa;
}

.winner-section.player2 {
  border-left-color: #ef4444;
}

.winner-badge {
  width: 100px;
  height: 100px;
  position: relative;
}

.winner-icon {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px currentColor);
  animation: badgePulse 2s ease-in-out infinite;
}

.winner-section.player1 .winner-icon {
  color: #60a5fa;
}

.winner-section.player2 .winner-icon {
  color: #ef4444;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px currentColor);
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 30px currentColor);
  }
}

.winner-info {
  flex: 1;
}

.winner-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  letter-spacing: 0.2rem;
  margin-bottom: 0.5rem;
}

.winner-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px currentColor;
}

.winner-section.player1 .winner-name {
  color: #60a5fa;
}

.winner-section.player2 .winner-name {
  color: #ef4444;
}

.winner-subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.8);
  letter-spacing: 0.1rem;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(96, 165, 250, 0.9);
  letter-spacing: 0.15rem;
}

.title-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.5), transparent);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-left: 3px solid rgba(96, 165, 250, 0.6);
  padding: 1.25rem;
  transition: all 0.3s ease;
  animation: statFadeIn 0.5s ease backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.4s; }
.stat-card:nth-child(2) { animation-delay: 0.5s; }
.stat-card:nth-child(3) { animation-delay: 0.6s; }
.stat-card:nth-child(4) { animation-delay: 0.7s; }

@keyframes statFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card:hover {
  background: rgba(96, 165, 250, 0.1);
  border-left-color: #60a5fa;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.2);
}

.stat-icon {
  width: 40px;
  height: 40px;
  color: rgba(96, 165, 250, 0.6);
  margin-bottom: 1rem;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-content {
  margin-bottom: 0.75rem;
}

.stat-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  letter-spacing: 0.1rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 900;
  color: #60a5fa;
  text-shadow: 0 0 15px rgba(96, 165, 250, 0.8);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-value.victory-type {
  font-size: 1.5rem;
}

.stat-unit {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.6);
  letter-spacing: 0.05rem;
}

.stat-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #93c5fd);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.8);
  transition: width 1s ease 0.5s;
  position: relative;
}

.stat-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: barShine 2s ease-in-out infinite;
}

@keyframes barShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.stat-bar-fill.gold {
  background: linear-gradient(90deg, #fbbf24, #fcd34d);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
}

.stat-bar-fill.victory {
  background: linear-gradient(90deg, #22c55e, #4ade80);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
}

/* Combat Report */
.combat-report {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(96, 165, 250, 0.2);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: reportReveal 0.5s ease 0.8s backwards;
}

@keyframes reportReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
}

.report-label {
  color: rgba(147, 197, 253, 0.7);
  letter-spacing: 0.05rem;
}

.report-value {
  font-family: 'Orbitron', sans-serif;
  color: #60a5fa;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
}

.report-value.success {
  color: #22c55e;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
}

/* Action Section */
.action-section {
  margin-bottom: 1.5rem;
  animation: buttonReveal 0.5s ease 1s backwards;
}

@keyframes buttonReveal {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.restart-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(59, 130, 246, 0.3));
  border: 2px solid rgba(96, 165, 250, 0.6);
  color: #60a5fa;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.button-icon {
  width: 24px;
  height: 24px;
}

.button-icon svg {
  width: 100%;
  height: 100%;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(96, 165, 250, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

.restart-button:hover {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.5), rgba(59, 130, 246, 0.5));
  border-color: #60a5fa;
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.6);
  transform: translateY(-2px);
  text-shadow: 0 0 15px rgba(96, 165, 250, 1);
}

.restart-button:hover .button-glow {
  width: 400px;
  height: 400px;
}

.restart-button:active {
  transform: translateY(0);
}

/* Terminal Footer */
.terminal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.5);
  letter-spacing: 0.05rem;
}

.footer-code {
  animation: footerBlink 3s ease-in-out infinite;
}

.footer-code:nth-child(1) { animation-delay: 0s; }
.footer-code:nth-child(3) { animation-delay: 1s; }
.footer-code:nth-child(5) { animation-delay: 2s; }

@keyframes footerBlink {
  0%, 90%, 100% { opacity: 0.5; }
  95% { opacity: 1; }
}

.footer-divider {
  color: rgba(96, 165, 250, 0.3);
}

/* Scrollbar */
.victory-terminal::-webkit-scrollbar {
  width: 8px;
}

.victory-terminal::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.victory-terminal::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.5);
  border-radius: 4px;
}

.victory-terminal::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.7);
}

/* Responsive */
@media (max-width: 768px) {
  .victory-terminal {
    padding: 1.5rem;
  }

  .terminal-title {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .winner-section {
    flex-direction: column;
    text-align: center;
  }

  .winner-name {
    font-size: 1.75rem;
  }
}
</style>