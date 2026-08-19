<template>
  <div class="collaboration-visual" :class="{ 'is-active': active }" aria-hidden="true">
    <div class="collaboration-visual-ribbons">
      <span v-for="index in 3" :key="index"></span>
    </div>
    <img class="collaboration-visual-art" :src="collaborationVisual" alt="" draggable="false" />
    <div class="collaboration-visual-bloom"></div>
  </div>
</template>

<script setup lang="ts">
import collaborationVisual from '@/assets/home/redesign/s5-collaboration-system.webp'

interface Props {
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
})

defineOptions({
  name: 'CollaborationValueVisual',
})
</script>

<style scoped lang="less">
.collaboration-visual {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: #090a0c;
  pointer-events: none;
}

.collaboration-visual-art {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  transition: filter 500ms ease;
  -webkit-mask-image: linear-gradient(
    180deg,
    #000 0%,
    #000 66%,
    rgba(0, 0, 0, 0.88) 72%,
    rgba(0, 0, 0, 0.22) 80%,
    transparent 84%
  );
  mask-image: linear-gradient(
    180deg,
    #000 0%,
    #000 66%,
    rgba(0, 0, 0, 0.88) 72%,
    rgba(0, 0, 0, 0.22) 80%,
    transparent 84%
  );
}

.collaboration-visual-ribbons {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  mix-blend-mode: screen;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 9%, #000 62%, transparent 74%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 9%, #000 62%, transparent 74%);

  span {
    position: absolute;
    top: -18%;
    width: 44px;
    height: 132%;
    border-radius: 50%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(138, 255, 180, 0.05) 18%,
      rgba(122, 242, 156, 0.24) 50%,
      rgba(68, 209, 129, 0.07) 84%,
      transparent 100%
    );
    filter: blur(9px);
    opacity: 0.5;
    transform-origin: center;
    animation: collaboration-ribbon-flow 9s ease-in-out infinite;
    will-change: transform, opacity;

    &:nth-child(1) {
      left: 42%;
    }

    &:nth-child(2) {
      left: 49%;
      opacity: 0.46;
      animation-delay: -3.1s;
    }

    &:nth-child(3) {
      left: 56%;
      opacity: 0.34;
      animation-delay: -5.8s;
    }
  }
}

.collaboration-visual-bloom {
  position: absolute;
  z-index: 0;
  top: -104px;
  left: 50%;
  width: 360px;
  height: 250px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 66% 38%, rgba(188, 255, 203, 0.12), transparent 24%),
    radial-gradient(circle at 45% 54%, rgba(34, 211, 238, 0.1), transparent 42%),
    radial-gradient(circle at 42% 54%, rgba(22, 119, 255, 0.16), transparent 72%);
  filter: blur(42px);
  opacity: 0.26;
  transform: translateX(-50%) scale(0.96);
  transform-origin: center;
  mix-blend-mode: screen;
  animation: collaboration-bloom-breathe 11s ease-in-out infinite;
  will-change: transform, opacity;
}

.collaboration-visual.is-active {
  .collaboration-visual-art {
    filter: brightness(1.025) saturate(1.015);
  }

  .collaboration-visual-bloom {
    opacity: 0.32;
  }
}

@keyframes collaboration-bloom-breathe {
  0%,
  100% {
    opacity: 0.22;
    transform: translate3d(-50%, 3px, 0) scale(0.96);
  }

  50% {
    opacity: 0.29;
    transform: translate3d(calc(-50% + 5px), -3px, 0) scale(1.025);
  }
}

@keyframes collaboration-ribbon-flow {
  0%,
  100% {
    opacity: 0.38;
    transform: translate3d(-10px, 10px, 0) rotate(-5deg) scaleY(0.94);
  }

  48% {
    opacity: 0.78;
    transform: translate3d(12px, -14px, 0) rotate(6deg) scaleY(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .collaboration-visual-bloom,
  .collaboration-visual-ribbons span {
    animation: none;
    opacity: 0.25;
    transform: translateX(-50%);
  }
}
</style>
