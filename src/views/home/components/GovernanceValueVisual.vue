<template>
  <div class="governance-visual" :class="{ 'is-active': active }" aria-hidden="true">
    <div class="governance-visual-ambient">
      <img :src="governanceAmbient" alt="" draggable="false" />
    </div>
    <div class="governance-visual-glow governance-visual-glow--blue"></div>
    <div class="governance-visual-glow governance-visual-glow--cyan"></div>
    <div class="governance-visual-sweep"></div>

    <div class="governance-visual-core">
      <img class="governance-visual-ring" :src="governanceRing" alt="" draggable="false" />
      <img class="governance-visual-shield" :src="governanceShield" alt="" draggable="false" />
      <span class="governance-visual-badge">26</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import governanceAmbient from '@/assets/home/redesign/s5-governance-ambient.svg'
import governanceRing from '@/assets/home/redesign/s5-governance-ring.svg'
import governanceShield from '@/assets/home/redesign/s5-governance-shield.webp'

interface Props {
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
})

defineOptions({
  name: 'GovernanceValueVisual',
})
</script>

<style scoped lang="less">
.governance-visual {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #12131a 0%, #090a0c 100%);
  pointer-events: none;
}

.governance-visual-ambient {
  position: absolute;
  z-index: 0;
  inset: -7% -4% -1%;
  opacity: 0.78;
  transform-origin: 52% 40%;
  animation: governance-ambient-drift 12s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  transition: opacity 480ms ease;
  will-change: transform, opacity;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    user-select: none;
  }
}

.governance-visual-glow {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.16;
  mix-blend-mode: screen;
  will-change: transform, opacity;
}

.governance-visual-glow--blue {
  top: 42px;
  left: 42px;
  width: 242px;
  height: 228px;
  background: rgba(22, 119, 255, 0.34);
  animation: governance-blue-mist 10.8s ease-in-out infinite;
}

.governance-visual-glow--cyan {
  top: 54px;
  right: 22px;
  width: 194px;
  height: 238px;
  background: rgba(34, 211, 238, 0.26);
  animation: governance-cyan-mist 13.2s ease-in-out infinite;
}

.governance-visual-core {
  position: absolute;
  z-index: 2;
  top: calc(31.67% - 14px);
  left: 50%;
  width: 154px;
  height: 154px;
  transform: translateX(-50%);
}

.governance-visual-sweep {
  position: absolute;
  z-index: 1;
  top: calc(31.67% - 32px);
  left: calc(50% - 92px);
  width: 184px;
  height: 184px;
  border-radius: 50%;
  background: conic-gradient(
    from 132deg,
    transparent 0deg 188deg,
    rgba(150, 222, 255, 0.06) 202deg,
    rgba(216, 244, 255, 0.78) 220deg,
    rgba(75, 184, 255, 0.3) 235deg,
    transparent 250deg 360deg
  );
  filter: blur(0.4px);
  mask: radial-gradient(transparent 58%, #000 60% 63%, transparent 66%);
  opacity: 0;
  transform: rotate(-18deg);
  transform-origin: center;
  animation: governance-arc-sweep 7.2s ease-in-out infinite;
  will-change: transform, opacity;
}

.governance-visual-ring {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
}

.governance-visual-shield {
  position: absolute;
  top: 26px;
  left: 22px;
  display: block;
  width: 110px;
  height: 106px;
  object-fit: contain;
  user-select: none;
}

.governance-visual-badge {
  position: absolute;
  top: 40px;
  right: 35px;
  display: grid;
  width: 26px;
  height: 26px;
  box-sizing: border-box;
  place-items: center;
  border: 3px solid #ff7041;
  border-radius: 50%;
  background: #ff835d;
  color: #53200e;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.governance-visual.is-active {
  .governance-visual-ambient {
    opacity: 0.88;
  }

  .governance-visual-glow {
    opacity: 0.2;
  }
}

@keyframes governance-ambient-drift {
  0%,
  100% {
    transform: translate3d(-5px, 3px, 0) scale(1.015);
  }

  50% {
    transform: translate3d(6px, -4px, 0) scale(1.045);
  }
}

@keyframes governance-blue-mist {
  0%,
  100% {
    opacity: 0.13;
    transform: translate3d(-8px, 5px, 0) scale(0.96);
  }

  50% {
    opacity: 0.2;
    transform: translate3d(9px, -7px, 0) scale(1.06);
  }
}

@keyframes governance-cyan-mist {
  0%,
  100% {
    opacity: 0.12;
    transform: translate3d(7px, -4px, 0) scale(1.04);
  }

  50% {
    opacity: 0.19;
    transform: translate3d(-9px, 8px, 0) scale(0.97);
  }
}

@keyframes governance-arc-sweep {
  0%,
  58%,
  100% {
    opacity: 0;
    transform: rotate(-24deg) scale(0.96);
  }

  12% {
    opacity: 0.9;
  }

  32% {
    opacity: 0.3;
    transform: rotate(36deg) scale(1.04);
  }
}

@media (max-width: 767px) {
  .governance-visual-core {
    top: calc(29% - 10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .governance-visual-ambient,
  .governance-visual-glow,
  .governance-visual-sweep {
    animation: none;
    transform: none;
  }
}
</style>
