<template>
  <div class="ranged-shot">
    <div class="muzzle-flash"></div>
    <div class="projectile"></div>
    <div class="projectile-trail"></div>
    <div class="impact-hit"></div>
    <div class="impact-sparks">
      <div class="spark" v-for="i in 5" :key="i" :style="`--spark-delay: ${i * 0.02}s`"></div>
    </div>
  </div>
</template>

<style scoped>
.ranged-shot {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 50;
}

.muzzle-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #fbbf24, #f59e0b, transparent);
  border-radius: 50%;
  box-shadow: 0 0 20px #fbbf24;
  animation: muzzle 0.15s ease-out forwards;
}

@keyframes muzzle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
}

.projectile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #fbbf24, #f59e0b);
  border-radius: 50%;
  box-shadow: 0 0 15px #fbbf24, 0 0 30px rgba(251, 191, 36, 0.5);
  animation: projectile 0.3s linear 0.1s forwards;
  opacity: 0;
}

@keyframes projectile {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

.projectile-trail {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 30px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.6), transparent);
  filter: blur(2px);
  animation: trail 0.3s linear 0.1s forwards;
  opacity: 0;
}

@keyframes trail {
  0% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scaleY(0.3);
  }
}

.impact-hit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(251, 191, 36, 1), rgba(245, 158, 11, 0.6), transparent);
  border-radius: 50%;
  box-shadow: 0 0 20px #fbbf24;
  animation: impact 0.25s ease-out 0.35s forwards;
  transform-origin: center;
  opacity: 0;
}

@keyframes impact {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.impact-sparks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
}

.spark {
  position: absolute;
  width: 3px;
  height: 8px;
  background: linear-gradient(180deg, #fbbf24, transparent);
  top: 50%;
  left: 50%;
  animation: sparkFly 0.3s ease-out calc(0.35s + var(--spark-delay)) forwards;
  opacity: 0;
}

.spark:nth-child(1) { --spark-angle: 30deg; }
.spark:nth-child(2) { --spark-angle: 90deg; }
.spark:nth-child(3) { --spark-angle: 150deg; }
.spark:nth-child(4) { --spark-angle: 210deg; }
.spark:nth-child(5) { --spark-angle: 330deg; }

@keyframes sparkFly {
  0% {
    transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--spark-angle)) translateY(-30px);
    opacity: 0;
  }
}
</style>
