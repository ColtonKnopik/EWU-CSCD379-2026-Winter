<template>
  <div class="explosive-attack">
    <!-- Initial explosion flash -->
    <div class="explosion-core"></div>
    
    <!-- Shockwave rings -->
    <div class="shockwave shockwave-1"></div>
    <div class="shockwave shockwave-2"></div>
    
    <!-- Fire particles -->
    <div class="fire-particles">
      <div class="fire-particle" v-for="i in 8" :key="i" :style="`--fire-delay: ${i * 0.05}s; --fire-angle: ${i * 45}deg`"></div>
    </div>
    
    <!-- Smoke puffs -->
    <div class="smoke-cloud"></div>
  </div>
</template>

<style scoped>
.explosive-attack {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 50;
}

.explosion-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  background: radial-gradient(circle, #fff 0%, #ff6600 20%, #ff3300 50%, #ff0000 70%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px #ff6600;
  animation: explodeCore 0.5s ease-out forwards;
}

@keyframes explodeCore {
  0% {
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    opacity: 1;
  }
  50% {
    width: 80px;
    height: 80px;
    margin: -40px 0 0 -40px;
    opacity: 0.95;
  }
  100% {
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;
    opacity: 0;
  }
}

.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 3px solid rgba(255, 150, 0, 0.9);
  border-radius: 50%;
  animation: shockwaveExpand 0.6s ease-out forwards;
}

.shockwave-2 {
  animation-delay: 0.1s;
  border-color: rgba(255, 100, 0, 0.7);
}

@keyframes shockwaveExpand {
  0% {
    width: 30px;
    height: 30px;
    margin: -15px 0 0 -15px;
    opacity: 1;
    border-width: 3px;
  }
  100% {
    width: 120px;
    height: 120px;
    margin: -60px 0 0 -60px;
    opacity: 0;
    border-width: 1px;
  }
}

.fire-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
}

.fire-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ffff00, #ff6600);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 8px rgba(255, 150, 0, 0.8);
  animation: fireExplode 0.5s ease-out var(--fire-delay) forwards;
}

@keyframes fireExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--fire-angle)) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--fire-angle)) translateX(50px) scale(0.2);
    opacity: 0;
  }
}

.smoke-cloud {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(100, 100, 100, 0.6), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: smokeRise 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

@keyframes smokeRise {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -80%) scale(1.5);
    opacity: 0;
  }
}
</style>
