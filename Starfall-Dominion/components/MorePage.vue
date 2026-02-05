<template>
  <div class="more-page">
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
      <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
    </div>

    <div class="content-wrapper">
      <!-- Header -->
      <div class="page-header">
        <button class="back-button" @click="$emit('back')">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
          <span>BACK</span>
        </button>
        
        <h1 class="page-title">
          <span class="title-glow">MORE INFO</span>
        </h1>
      </div>

      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'about' }"
          @click="activeTab = 'about'"
        >
          <span>ABOUT</span>
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'howto' }"
          @click="activeTab = 'howto'"
        >
          <span>HOW TO PLAY</span>
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'feedback' }"
          @click="activeTab = 'feedback'"
        >
          <span>FEEDBACK</span>
        </button>
      </div>

      <!-- Content Sections -->
      <div class="content-container">
        <!-- About Section -->
        <div v-if="activeTab === 'about'" class="content-section" key="about">
          <div class="info-card">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-corner bl"></div>
            <div class="card-corner br"></div>
            
            <h2 class="section-title">ABOUT STARFALL DOMINION</h2>
            <div class="section-content">
              <p>
                <strong>Starfall Dominion</strong> is a tactical hex-based strategy game set in a futuristic sci-fi universe. 
                Command your forces across alien battlefields, control strategic objectives, and outmaneuver your opponents 
                in intense turn-based combat.
              </p>
              
              <h3>Game Features</h3>
              <ul class="feature-list">
                <li>
                  <div>
                    <strong>Tactical Hex Grid Combat</strong>
                    <p>Navigate terrain and position your units strategically on a hexagonal battlefield</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Multiple Unit Types</strong>
                    <p>Command captains, berserkers, marines, and more - each with unique abilities</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Control Point System</strong>
                    <p>Capture and hold flags to gain resources and dominate the battlefield</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Resource Management</strong>
                    <p>Earn gold through objectives and use it to recruit powerful units</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Local & Online Multiplayer</strong>
                    <p>Battle friends locally or challenge players from around the world</p>
                  </div>
                </li>
              </ul>

              <h3>Development</h3>
              <p>
                Created as part of a web development course, Starfall Dominion showcases modern web technologies 
                including Vue 3, Nuxt 3, and TypeScript. The game features responsive design, smooth animations, 
                and an immersive space-themed interface.
              </p>

              <div class="version-info">
                <span class="version-label">CURRENT VERSION</span>
                <span class="version-number">{{ APP_VERSION }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- How to Play Section -->
        <div v-else-if="activeTab === 'howto'" class="content-section" key="howto">
          <div class="info-card">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-corner bl"></div>
            <div class="card-corner br"></div>
            
            <h2 class="section-title">HOW TO PLAY</h2>
            <div class="section-content">
              <div class="instruction-group">
                <h3>
                  <span class="step-number">1</span>
                  Game Setup
                </h3>
                <p>
                  At the start of the game, you'll enter the <strong>placement phase</strong>. Each player takes turns 
                  placing their units in their designated deployment zone (blue for Player 1, purple for Player 2). 
                  Your captain must be placed first!
                </p>
              </div>

              <div class="instruction-group">
                <h3>
                  <span class="step-number">2</span>
                  Your Turn
                </h3>
                <p>
                  Each unit has <strong>2 action points</strong> per turn. You can use these to:
                </p>
                <ul>
                  <li><strong>Move:</strong> Click a unit, then click a highlighted hex to move</li>
                  <li><strong>Attack:</strong> After selecting a unit, click an enemy within attack range</li>
                  <li><strong>Buy Units:</strong> Click your spawn point to open the shop and recruit new units</li>
                </ul>
              </div>

              <div class="instruction-group">
                <h3>
                  <span class="step-number">3</span>
                  Unit Types
                </h3>
                <div class="unit-info-grid">
                  <div class="unit-info-item">
                    <div class="unit-badge captain">C</div>
                    <div>
                      <strong>Captain</strong>
                      <p>Your leader. If eliminated, you lose! </p>
                      <small>Health: 150 | Attack: 15 | Range: 1 | Move: 0</small>
                    </div>
                  </div>
                  <div class="unit-info-item">
                    <div class="unit-badge berserker">B</div>
                    <div>
                      <strong>Berserker</strong>
                      <p>High damage melee fighter. Strong in close combat.</p>
                      <small>Health: 100 | Attack: 25 | Range: 1 | Move: 2</small>
                    </div>
                  </div>
                  <div class="unit-info-item">
                    <div class="unit-badge marine">M</div>
                    <div>
                      <strong>Marine</strong>
                      <p>Balanced ranged unit. Good for flexible strategies.</p>
                      <small>Health: 75 | Attack: 20 | Range: 2 | Move: 2</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="instruction-group">
                <h3>
                  <span class="step-number">4</span>
                  Objectives & Economy
                </h3>
                <p>
                  <strong>Control flags</strong> marked on the battlefield to earn <strong>+25 gold per turn</strong>. 
                  Use gold to recruit more units from your spawns's shop.
                </p>
                <p>
                  Flags are captured by moving a unit onto them. If both players have units adjacent to a flag, 
                  it becomes <strong>contested</strong> and neither player gains income from it.
                </p>
              </div>

              <div class="instruction-group">
                <h3>
                  <span class="step-number">5</span>
                  Victory Conditions
                </h3>
                <p>Win the game by achieving one of these objectives:</p>
                <ul>
                  <li><strong>Eliminate the enemy captain</strong> - Most direct path to victory</li>
                  <li><strong>Control all flags</strong> - Dominate the battlefield economically</li>
                  <li><strong>Outlast your opponent</strong> - Destroy all their units</li>
                </ul>
              </div>

              <div class="tip-box">
                <h4>💡 Pro Tips</h4>
                <ul>
                  <li>Keep your captain protected - losing them means instant defeat!</li>
                  <li>Control multiple flags early for economic advantage</li>
                  <li>Use terrain strategically - position units to control choke points</li>
                  <li>Mix unit types for a balanced army composition</li>
                  <li>Plan ahead - save action points for critical moments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Section -->
        <div v-else-if="activeTab === 'feedback'" class="content-section" key="feedback">
          <div class="info-card">
            <div class="card-corner tl"></div>
            <div class="card-corner tr"></div>
            <div class="card-corner bl"></div>
            <div class="card-corner br"></div>
            
            <h2 class="section-title">FEEDBACK & SUPPORT</h2>
            <div class="section-content">
              <p>
                Your feedback helps us improve Starfall Dominion! Share your thoughts, report bugs, 
                or suggest new features.
              </p>

              <form @submit.prevent="handleSubmitFeedback" class="feedback-form">
                <div class="form-group">
                  <label for="feedback-name">Name</label>
                  <input 
                    id="feedback-name"
                    v-model="feedbackForm.name" 
                    type="text" 
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="feedback-email">Email</label>
                  <input 
                    id="feedback-email"
                    v-model="feedbackForm.email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="feedback-type">Feedback Type</label>
                  <select id="feedback-type" v-model="feedbackForm.type">
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="general">General Feedback</option>
                    <option value="balance">Balance Suggestion</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="feedback-message">Message</label>
                  <textarea 
                    id="feedback-message"
                    v-model="feedbackForm.message" 
                    placeholder="Tell us what you think..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" class="submit-button" :disabled="isSubmitting">
                  <span v-if="!isSubmitting">SUBMIT FEEDBACK</span>
                  <span v-else>SENDING...</span>
                  <svg v-if="!isSubmitting" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                  </svg>
                </button>

                <div v-if="feedbackStatus === 'success'" class="feedback-message success">
                  ✓ Thank you! Your feedback has been received.
                </div>
                <div v-if="feedbackStatus === 'error'" class="feedback-message error">
                  ✗ Failed to send feedback. Please try again.
                </div>
              </form>

              <div class="contact-info">
                <h3>Other Ways to Reach Us</h3>
                <div class="contact-methods">
                  <a href="https://github.com/ColtonKnopik/EWU-CSCD379-2026-Winter" target="_blank" class="contact-link">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
                    </svg>
                    <span>GitHub Repository</span>
                  </a>
                  <a href="mailto:feedback@starfalldominion.game" class="contact-link">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
                    </svg>
                    <span>Email Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { APP_VERSION } from '~/config/app';

const emit = defineEmits<{
  back: []
}>()

const activeTab = ref<'about' | 'howto' | 'feedback'>('about')

// Feedback form state
const feedbackForm = ref({
  name: '',
  email: '',
  type: 'general',
  message: ''
})

const isSubmitting = ref(false)
const feedbackStatus = ref<'success' | 'error' | null>(null)

const handleSubmitFeedback = async () => {
  isSubmitting.value = true
  feedbackStatus.value = null

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, you'd send this to your backend
    console.log('Feedback submitted:', feedbackForm.value)
    
    feedbackStatus.value = 'success'
    
    // Reset form
    setTimeout(() => {
      feedbackForm.value = {
        name: '',
        email: '',
        type: 'general',
        message: ''
      }
      feedbackStatus.value = null
    }, 3000)
  } catch (error) {
    feedbackStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const getParticleStyle = (index: number) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDelay = Math.random() * 10
  const randomDuration = 10 + Math.random() * 20
  
  return {
    left: `${randomX}%`,
    top: `${randomY}%`,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}
</script>

<style scoped>
@import '~/assets/css/space-theme.css';

.more-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000000;
  overflow: auto;
  font-family: 'Rajdhani', sans-serif;
  color: #ffffff;
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
.more-page::-webkit-scrollbar {
  width: 12px;
}

.more-page::-webkit-scrollbar-track {
  background: rgba(15, 15, 35, 0.6);
  border-left: 1px solid rgba(96, 165, 250, 0.2);
}

.more-page::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #60a5fa, #a78bfa);
  border-radius: 6px;
  border: 2px solid rgba(15, 15, 35, 0.6);
}

.more-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #93c5fd, #c4b5fd);
}

.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-height: 800px) {
  .content-wrapper {
    padding: 1.5rem 2rem;
  }
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-height: 800px) {
  .page-header {
    margin-bottom: 1.5rem;
  }
}

.back-button {
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
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
}

.back-button svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.back-button:hover {
  background: rgba(20, 20, 45, 0.8);
  border-color: rgba(96, 165, 250, 0.6);
  color: #60a5fa;
  transform: translateX(-4px);
}

.back-button:hover svg {
  transform: translateX(-4px);
}

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.3rem;
  flex: 1;
}

.title-glow {
  background: linear-gradient(135deg, #ffffff 0%, #60a5fa 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.5));
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
}

@media (max-height: 800px) {
  .tab-navigation {
    margin-bottom: 1.5rem;
  }
}

.tab-button {
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(147, 197, 253, 0.6);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  transition: width 0.3s ease;
}

.tab-button:hover {
  color: #93c5fd;
}

.tab-button.active {
  color: #60a5fa;
}

.tab-button.active::after {
  width: 100%;
}

/* Content Container */
.content-container {
  flex: 1;
  margin-bottom: 2rem;
}

.content-section {
  animation: fade-in 0.4s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-card {
  position: relative;
  padding: 2.5rem;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(20px);
}

@media (max-height: 800px) {
  .info-card {
    padding: 2rem;
  }
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
  margin: 0 0 1.5rem 0;
  color: #60a5fa;
  text-align: center;
}

@media (max-height: 800px) {
  .section-title {
    font-size: 1.5rem;
    margin: 0 0 1.25rem 0;
  }
}

.section-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #e0e7ff;
}

.section-content p {
  margin: 0 0 1.25rem 0;
}

.section-content h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #93c5fd;
  margin: 2rem 0 1rem 0;
  letter-spacing: 0.1rem;
}

.section-content strong {
  color: #60a5fa;
}

/* Feature List */
.feature-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.feature-list li {
  display: block;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(96, 165, 250, 0.05);
  border-left: 3px solid #60a5fa;
}

.feature-list li strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #93c5fd;
}

.feature-list li p {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.9375rem;
}

/* Version Info */
.version-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  font-family: 'Orbitron', sans-serif;
}

.version-label {
  color: rgba(147, 197, 253, 0.7);
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
}

.version-number {
  color: #60a5fa;
  font-size: 1.25rem;
  font-weight: 700;
}

/* Instruction Groups */
.instruction-group {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(96, 165, 250, 0.03);
  border: 1px solid rgba(96, 165, 250, 0.15);
}

.instruction-group h3 {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1rem 0 !important;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
}

.instruction-group ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.instruction-group li {
  margin-bottom: 0.5rem;
  color: #cbd5e1;
}

/* Unit Info Grid */
.unit-info-grid {
  display: grid;
  gap: 1rem;
  margin: 1rem 0;
}

.unit-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.2);
}

.unit-badge {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  background: rgba(96, 165, 250, 0.1);
  border: 2px solid #60a5fa;
  border-radius: 8px;
  flex-shrink: 0;
  color: #60a5fa;
}

.unit-badge.captain {
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.unit-badge.berserker {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.unit-badge.marine {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.unit-info-item strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.unit-info-item p {
  margin: 0 0 0.5rem 0;
  font-size: 0.9375rem;
}

.unit-info-item small {
  color: rgba(147, 197, 253, 0.7);
  font-size: 0.8125rem;
}

/* Tip Box */
.tip-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
  border: 2px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
}

.tip-box h4 {
  font-family: 'Orbitron', sans-serif;
  color: #fbbf24;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
}

.tip-box ul {
  margin: 0;
  padding-left: 1.5rem;
}

.tip-box li {
  margin-bottom: 0.75rem;
  color: #e0e7ff;
}

/* Feedback Form */
.feedback-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  color: #93c5fd;
  text-transform: uppercase;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(15, 15, 35, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  border: none;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(96, 165, 250, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button svg {
  width: 20px;
  height: 20px;
}

.feedback-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
}

.feedback-message.success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid #22c55e;
  color: #86efac;
}

.feedback-message.error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #fca5a5;
}

/* Contact Info */
.contact-info {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(96, 165, 250, 0.2);
}

.contact-methods {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(96, 165, 250, 0.05);
  border: 1px solid rgba(96, 165, 250, 0.2);
  color: #93c5fd;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-link:hover {
  background: rgba(96, 165, 250, 0.1);
  border-color: #60a5fa;
  color: #60a5fa;
  transform: translateX(4px);
}

.contact-link svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .tab-navigation {
    flex-direction: column;
    gap: 0;
  }

  .tab-button {
    padding: 0.75rem 1rem;
    text-align: left;
  }

  .info-card {
    padding: 1.5rem;
  }
}
</style>
