<template>
  <div class="melee-slash">
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Multiple slash arcs for dramatic effect -->
      <path
        class="slash-arc primary"
        d="M 20,100 Q 60,25 100,20"
        fill="none"
        stroke="#dc2626"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        class="slash-arc secondary"
        d="M 20,100 Q 60,25 100,20"
        fill="none"
        stroke="#ef4444"
        stroke-width="5"
        stroke-linecap="round"
      />
      <path
        class="slash-arc tertiary"
        d="M 20,100 Q 60,25 100,20"
        fill="none"
        stroke="#fca5a5"
        stroke-width="2"
        stroke-linecap="round"
      />
      <!-- Additional slash trail -->
      <path
        class="slash-arc trail"
        d="M 25,105 Q 65,30 105,25"
        fill="none"
        stroke="#991b1b"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
    
    <!-- Multiple impact flashes -->
    <div class="impact-flash primary-flash"></div>
    <div class="impact-flash secondary-flash"></div>
    
    <!-- Blood/energy splatter particles -->
    <div class="slash-particles">
      <div class="particle" v-for="i in 12" :key="i" :style="`--delay: ${i * 0.03}s; --angle: ${(i * 30) + (i % 2 * 15)}deg`"></div>
    </div>
    
    <!-- Screen distortion effect -->
    <div class="distortion-ring"></div>
  </div>
</template>

<style scoped>
.melee-slash {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 50;
}

.melee-slash svg {
  width: 100%;
  height: 100%;
}

/* Primary slash - darkest red */
.slash-arc.primary {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  animation: slashPrimary 0.25s ease-out forwards;
  filter: drop-shadow(0 0 12px #dc2626) drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
}

@keyframes slashPrimary {
  0% {
    stroke-dashoffset: 140;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

/* Secondary slash - bright red */
.slash-arc.secondary {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  animation: slashSecondary 0.3s ease-out 0.03s forwards;
  filter: drop-shadow(0 0 15px #ef4444);
}

@keyframes slashSecondary {
  0% {
    stroke-dashoffset: 140;
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
}

/* Tertiary slash - light red glow */
.slash-arc.tertiary {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  animation: slashTertiary 0.35s ease-out 0.05s forwards;
  filter: drop-shadow(0 0 20px #fca5a5) drop-shadow(0 0 30px rgba(252, 165, 165, 0.5));
}

@keyframes slashTertiary {
  0% {
    stroke-dashoffset: 140;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.4;
  }
}

/* Trail slash - dark red shadow */
.slash-arc.trail {
  stroke-dasharray: 140;
  stroke-dashoffset: 140;
  animation: slashTrail 0.4s ease-out 0.08s forwards;
  opacity: 0.6;
}

@keyframes slashTrail {
  to {
    stroke-dashoffset: 0;
    opacity: 0.2;
  }
}

/* Primary impact flash - intense red */
.impact-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
}

.primary-flash {
  width: 70px;
  height: 70px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(239, 68, 68, 1) 10%,
    rgba(220, 38, 38, 0.8) 30%,
    rgba(153, 27, 27, 0.4) 60%,
    transparent 100%
  );
  box-shadow: 
    0 0 30px rgba(239, 68, 68, 0.9),
    0 0 50px rgba(220, 38, 38, 0.6);
  animation: flashPrimary 0.35s ease-out 0.15s forwards;
}

@keyframes flashPrimary {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) scale(1.5) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3) rotate(360deg);
    opacity: 0;
  }
}

/* Secondary flash - outer glow */
.secondary-flash {
  width: 60px;
  height: 60px;
  background: radial-gradient(
    circle,
    rgba(239, 68, 68, 0.8) 0%,
    rgba(220, 38, 38, 0.4) 40%,
    transparent 100%
  );
  animation: flashSecondary 0.4s ease-out 0.2s forwards;
}

@keyframes flashSecondary {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.5);
    opacity: 0;
  }
}

/* Enhanced particles */
.slash-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fff, #ef4444);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  box-shadow: 
    0 0 10px #ef4444,
    0 0 20px rgba(239, 68, 68, 0.6);
  animation: particleExplode 0.5s ease-out var(--delay) forwards;
}

@keyframes particleExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(15px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px) scale(0.2);
    opacity: 0;
  }
}

/* Distortion ring effect */
.distortion-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(239, 68, 68, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: distortion 0.4s ease-out 0.15s forwards;
  opacity: 0;
}

@keyframes distortion {
  0% {
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
    opacity: 0;
    border-width: 4px;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5) rotate(180deg);
    opacity: 0;
    border-width: 1px;
  }
}
</style>
