<template>
  <div class="left-sidebar">
    <!-- Turn History / Combat Log -->
    <div class="sidebar-panel">
      <div class="panel-header">
        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <h3 class="panel-title orbitron-font">COMBAT LOG</h3>
      </div>
      
      <div class="panel-content">
        <div class="history-list">
          <div 
            v-for="(action, index) in recentActions" 
            :key="index"
            class="history-item"
            :class="{
              'action-kill': action.text.includes('eliminated'),
              'action-capture': action.text.includes('captured'),
              'action-contest': action.text.includes('contesting'),
              'action-damage': action.text.includes('dealt') && action.text.includes('damage'),
              'action-recruit': action.text.includes('recruited'),
              'action-death': action.text.includes('perished')
            }"
          >
            <span class="history-turn rajdhani-font">T{{ action.turn }}</span>
            <span class="history-text rajdhani-font">{{ action.text }}</span>
          </div>
          
          <div v-if="recentActions.length === 0" class="no-history">
            <span class="rajdhani-font">No actions yet...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  recentActions: Array<{
    turn: number
    text: string
  }>
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 280px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 10px;
}

/* Scrollbar */
.left-sidebar::-webkit-scrollbar {
  width: 6px;
}

.left-sidebar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.left-sidebar::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 3px;
}

.left-sidebar::-webkit-scrollbar-thumb:hover {
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

/* Stats */
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #60a5fa;
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

.stat-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent);
  margin: 8px 0;
}

/* Objectives */
.objective-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.objective-icon {
  font-size: 24px;
  filter: grayscale(0.3) drop-shadow(0 0 5px rgba(96, 165, 250, 0.3));
}

.objective-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.objective-label {
  font-size: 10px;
  font-weight: 600;
  color: rgba(147, 197, 253, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 12px;
  background: rgba(0, 5, 15, 0.8);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 2px;
  overflow: hidden;
  display: flex;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.p1 {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.6), rgba(96, 165, 250, 0.8));
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
}

.progress-fill.p2 {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(248, 113, 113, 0.8));
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
}

.unit-counts {
  display: flex;
  gap: 15px;
  font-size: 12px;
  font-weight: 700;
}

.count.p1 {
  color: #60a5fa;
  text-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
}

.count.p2 {
  color: #ef4444;
  text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

/* History */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 2px;
}

.history-item {
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(0, 5, 15, 0.6);
  border-left: 2px solid rgba(96, 165, 250, 0.4);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(0, 5, 15, 0.8);
  border-left-color: rgba(96, 165, 250, 0.8);
}

/* Action type specific styling */
.history-item.action-kill {
  border-left-color: rgba(239, 68, 68, 0.6);
}

.history-item.action-kill:hover {
  border-left-color: rgba(239, 68, 68, 0.9);
  background: rgba(239, 68, 68, 0.05);
}

.history-item.action-capture {
  border-left-color: rgba(34, 197, 94, 0.6);
}

.history-item.action-capture:hover {
  border-left-color: rgba(34, 197, 94, 0.9);
  background: rgba(34, 197, 94, 0.05);
}

.history-item.action-contest {
  border-left-color: rgba(251, 191, 36, 0.6);
}

.history-item.action-contest:hover {
  border-left-color: rgba(251, 191, 36, 0.9);
  background: rgba(251, 191, 36, 0.05);
}

.history-item.action-damage {
  border-left-color: rgba(249, 115, 22, 0.6);
}

.history-item.action-damage:hover {
  border-left-color: rgba(249, 115, 22, 0.9);
  background: rgba(249, 115, 22, 0.05);
}

.history-item.action-recruit {
  border-left-color: rgba(96, 165, 250, 0.6);
}

.history-item.action-recruit:hover {
  border-left-color: rgba(96, 165, 250, 0.9);
  background: rgba(96, 165, 250, 0.05);
}

.history-item.action-death {
  border-left-color: rgba(156, 163, 175, 0.6);
}

.history-item.action-death:hover {
  border-left-color: rgba(156, 163, 175, 0.9);
  background: rgba(156, 163, 175, 0.05);
}

.history-turn {
  font-size: 10px;
  font-weight: 700;
  color: #60a5fa;
  min-width: 25px;
}

.history-text {
  font-size: 11px;
  color: rgba(147, 197, 253, 0.8);
  line-height: 1.4;
}

.no-history {
  padding: 20px;
  text-align: center;
  color: rgba(147, 197, 253, 0.5);
  font-size: 11px;
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
