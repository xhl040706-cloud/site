<template>
  <div class="knowledge-visual" aria-hidden="true">
    <img :src="knowledgeVisual" alt="" loading="lazy" decoding="async" draggable="false" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import knowledgeVisualEn from '@/assets/home/redesign/s5-knowledge-visual-en.webp'
import knowledgeVisualZh from '@/assets/home/redesign/s5-knowledge-visual.webp'

defineOptions({
  name: 'KnowledgeValueVisual',
})

const { locale } = useI18n()
const knowledgeVisual = computed(() =>
  locale.value === 'en' ? knowledgeVisualEn : knowledgeVisualZh,
)
</script>

<style scoped lang="less">
.knowledge-visual {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #0b1018 0%, #090a0c 100%);
  pointer-events: none;

  &::before {
    position: absolute;
    z-index: 0;
    inset: -10% -4%;
    background:
      radial-gradient(ellipse at 18% 40%, rgba(55, 199, 232, 0.16), transparent 28%),
      radial-gradient(ellipse at 74% 38%, rgba(126, 167, 255, 0.18), transparent 31%);
    content: '';
    filter: blur(24px);
    opacity: 0.46;
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
    opacity: 0.32;
    transform: translate3d(-4%, 2%, 0) scale(0.97);
  }

  52% {
    opacity: 0.52;
    transform: translate3d(5%, -3%, 0) scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .knowledge-visual::before {
    animation: none;
    opacity: 0.34;
    transform: none;
  }
}
</style>
