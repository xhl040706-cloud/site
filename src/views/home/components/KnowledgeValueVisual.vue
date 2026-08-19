<template>
  <div class="knowledge-visual" aria-hidden="true">
    <img :src="knowledgeVisual" alt="" draggable="false" />
  </div>
</template>

<script setup lang="ts">
import knowledgeVisual from '@/assets/home/redesign/s5-knowledge-visual.webp'

defineOptions({
  name: 'KnowledgeValueVisual',
})
</script>

<style scoped lang="less">
.knowledge-visual {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #12131a 0%, #090a0c 100%);
  pointer-events: none;

  &::before {
    position: absolute;
    z-index: 2;
    inset: -18% -10%;
    background:
      radial-gradient(ellipse at 14% 42%, rgba(55, 199, 232, 0.28), transparent 32%),
      radial-gradient(ellipse at 78% 38%, rgba(126, 167, 255, 0.3), transparent 36%);
    content: '';
    filter: blur(30px);
    opacity: 0.68;
    mix-blend-mode: screen;
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 56%, transparent 76%);
    mask-image: linear-gradient(180deg, #000 0%, #000 56%, transparent 76%);
    animation: knowledge-glow-flow 8.4s ease-in-out infinite;
    will-change: transform, opacity;
  }

  img {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    user-select: none;
  }
}

@keyframes knowledge-glow-flow {
  0%,
  100% {
    opacity: 0.38;
    transform: translate3d(-8%, 3%, 0) scale(0.94);
  }

  52% {
    opacity: 0.82;
    transform: translate3d(10%, -5%, 0) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .knowledge-visual::before {
    animation: none;
    opacity: 0.38;
    transform: none;
  }
}
</style>
