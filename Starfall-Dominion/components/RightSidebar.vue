<template>
  <div class="right-sidebar">
    <!-- Game Controls -->
    <div class="sidebar-panel">
      <div class="panel-header">
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <h3 class="panel-title orbitron-font">GAME CONTROLS</h3>
      </div>
      
      <div class="panel-content">
        <button class="control-btn forfeit-btn orbitron-font" @click="$emit('forfeit')">
          <span class="btn-inner">
            <span class="btn-text">FORFEIT MATCH</span>
          </span>
        </button>
        
        <button class="control-btn menu-btn orbitron-font" @click="$emit('menu')">
          <span class="btn-inner">
            <span class="btn-text">RETURN TO MENU</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <div class="sidebar-panel">
      <div class="panel-header">
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <h3 class="panel-title orbitron-font">SETTINGS</h3>
      </div>
      
      <div class="panel-content">
        <!-- Sound Toggle -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label rajdhani-font">SOUND EFFECTS</span>
            <span class="setting-desc rajdhani-font">Battle audio feedback</span>
          </div>
          <button 
            class="toggle-btn" 
            :class="{ active: soundEnabled }"
            @click="$emit('toggleSound')"
          >
            <div class="toggle-slider"></div>
          </button>
        </div>
        
        <div class="stat-divider"></div>
        
        <!-- Animation Speed -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label rajdhani-font">ANIMATION SPEED</span>
            <span class="setting-desc rajdhani-font">{{ animationSpeed }}x speed</span>
          </div>
          <div class="speed-controls">
            <button 
              class="speed-btn orbitron-font" 
              @click="$emit('decreaseSpeed')"
              :disabled="animationSpeed <= 0.5"
            >
              −
            </button>
            <button 
              class="speed-btn orbitron-font" 
              @click="$emit('increaseSpeed')"
              :disabled="animationSpeed >= 2"
            >
              +
            </button>
          </div>
        </div>
        
        <div class="stat-divider"></div>
        
        <!-- Grid Display -->
        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label rajdhani-font">GRID OVERLAY</span>
            <span class="setting-desc rajdhani-font">Show hex coordinates</span>
          </div>
          <button 
            class="toggle-btn" 
            :class="{ active: gridEnabled }"
            @click="$emit('toggleGrid')"
          >
            <div class="toggle-slider"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Match Info -->
    <div class="sidebar-panel">
      <div class="panel-header">
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <h3 class="panel-title orbitron-font">MATCH INFO</h3>
      </div>
      
      <div class="panel-content">
        <div class="info-row">
          <span class="info-label rajdhani-font">MODE</span>
          <span class="info-value orbitron-font">{{ gameMode }}</span>
        </div>
        
        <div class="stat-divider"></div>
        
        <div class="info-row">
          <span class="info-label rajdhani-font">MAP</span>
          <span class="info-value orbitron-font">{{ mapName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  soundEnabled: boolean
  animationSpeed: number
  gridEnabled: boolean
  gameMode: string
  mapName: string
}>()

defineEmits<{
  forfeit: []
  menu: []
  toggleSound: []
  increaseSpeed: []
  decreaseSpeed: []
  toggleGrid: []
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 280px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 10px;
}

/* Scrollbar */
.right-sidebar::-webkit-scrollbar {
  width: 6px;
}

.right-sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.right-sidebar::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 3px;
}

.right-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(96, 165, 250, 0.5);
}

/* Panel Styles */
.sidebar-panel {
  position: relative;
  background: rgba(15, 15, 35, 0.95);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 4px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.panel-header {
  position: relative;
  padding: 12px 15px;
  background: linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(10, 10, 30, 0.9) 100%);
  border-bottom: 1px solid rgba(96, 165, 250, 0.3);
  overflow: hidden;
}

.panel-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.5));
}

.card-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(96, 165, 250, 0.5);
  transition: all 0.4s ease;
}

.card-corner.tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.card-corner.tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.panel-content {
  padding: 15px;
}

/* Control Buttons */
.control-btn {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid;
  border-radius: 4px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.control-btn:last-child {
  margin-bottom: 0;
}

.btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  font-size: 16px;
}

.forfeit-btn {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

.forfeit-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 1);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

.menu-btn {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.5);
  color: #60a5fa;
}

.menu-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 1);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.4);
}

.control-btn:active {
  transform: scale(0.98);
}

/* Settings */
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.setting-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.setting-desc {
  font-size: 10px;
  color: rgba(147, 197, 253, 0.6);
}

.stat-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent);
  margin: 8px 0;
}

/* Toggle Button */
.toggle-btn {
  position: relative;
  width: 48px;
  height: 24px;
  background: rgba(100, 100, 120, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.6);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #94a3b8;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.toggle-btn.active .toggle-slider {
  left: 26px;
  background: #60a5fa;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
}

/* Speed Controls */
.speed-controls {
  display: flex;
  gap: 6px;
}

.speed-btn {
  width: 28px;
  height: 28px;
  background: rgba(0, 5, 15, 0.6);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 4px;
  color: #60a5fa;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speed-btn:hover:not(:disabled) {
  background: rgba(0, 5, 15, 0.8);
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

.speed-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.speed-btn:active:not(:disabled) {
  transform: scale(0.95);
}

/* Help Guide */
.help-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(0, 5, 15, 0.6);
  border-left: 2px solid rgba(96, 165, 250, 0.4);
  border-radius: 2px;
}

.help-icon {
  font-size: 18px;
  filter: grayscale(0.3);
}

.help-text {
  font-size: 11px;
  color: rgba(147, 197, 253, 0.8);
}

/* Match Info */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-value {
  font-size: 12px;
  font-weight: 700;
  color: #60a5fa;
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

/* Utilities */
.orbitron-font {
  font-family: 'Orbitron', sans-serif;
}

.rajdhani-font {
  font-family: 'Rajdhani', sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
