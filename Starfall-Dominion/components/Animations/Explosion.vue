<template>
  <div class="explosion-container">
    <!-- Core explosion -->
    <div class="explosion-core"></div>
    
    <!-- Shockwave rings -->
    <div class="shockwave shockwave-1"></div>
    <div class="shockwave shockwave-2"></div>
    <div class="shockwave shockwave-3"></div>
    
    <!-- Particles -->
    <div class="particle particle-1"></div>
    <div class="particle particle-2"></div>
    <div class="particle particle-3"></div>
    <div class="particle particle-4"></div>
    <div class="particle particle-5"></div>
    <div class="particle particle-6"></div>
    <div class="particle particle-7"></div>
    <div class="particle particle-8"></div>
    
    <!-- Flash effect -->
    <div class="flash"></div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.explosion-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  pointer-events: none;
  z-index: 100;
}

/* Core explosion */
.explosion-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  background: radial-gradient(circle, #fff 0%, #ff6600 30%, #ff0000 60%, transparent 100%);
  border-radius: 50%;
  animation: explodeCore 0.8s ease-out forwards;
}

@keyframes explodeCore {
  0% {
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    opacity: 1;
  }
  50% {
    width: 150px;
    height: 150px;
    margin: -75px 0 0 -75px;
    opacity: 0.9;
  }
  100% {
    width: 200px;
    height: 200px;
    margin: -100px 0 0 -100px;
    opacity: 0;
  }
}

/* Shockwave rings */
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 3px solid rgba(255, 200, 0, 0.8);
  border-radius: 50%;
  animation: shockwaveExpand 1s ease-out forwards;
}

.shockwave-2 {
  animation-delay: 0.1s;
  border-color: rgba(255, 100, 0, 0.6);
}

.shockwave-3 {
  animation-delay: 0.2s;
  border-color: rgba(255, 50, 0, 0.4);
}

@keyframes shockwaveExpand {
  0% {
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
    opacity: 1;
    border-width: 3px;
  }
  100% {
    width: 250px;
    height: 250px;
    margin: -125px 0 0 -125px;
    opacity: 0;
    border-width: 1px;
  }
}

/* Particles */
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #ffff00, #ff6600);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 200, 0, 0.8);
  animation: particleExplode 1s ease-out forwards;
}

.particle-1 {
  animation-delay: 0s;
  --tx: 80px;
  --ty: -80px;
}

.particle-2 {
  animation-delay: 0.05s;
  --tx: -80px;
  --ty: -80px;
}

.particle-3 {
  animation-delay: 0.1s;
  --tx: 80px;
  --ty: 80px;
}

.particle-4 {
  animation-delay: 0.15s;
  --tx: -80px;
  --ty: 80px;
}

.particle-5 {
  animation-delay: 0.05s;
  --tx: 100px;
  --ty: 0;
}

.particle-6 {
  animation-delay: 0.1s;
  --tx: -100px;
  --ty: 0;
}

.particle-7 {
  animation-delay: 0.15s;
  --tx: 0;
  --ty: 100px;
}

.particle-8 {
  animation-delay: 0.08s;
  --tx: 0;
  --ty: -100px;
}

@keyframes particleExplode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0.3);
    opacity: 0;
  }
}

/* Flash effect */
.flash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%);
  border-radius: 50%;
  animation: flash 0.3s ease-out forwards;
}

@keyframes flash {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
</style>
