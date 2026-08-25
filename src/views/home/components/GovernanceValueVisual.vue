<template>
  <div class="governance-visual" :class="{ 'is-active': active }" aria-hidden="true">
    <img
      class="governance-visual-art"
      :src="governanceVisual"
      alt=""
      loading="lazy"
      decoding="async"
      draggable="false"
    />
    <div class="governance-visual-copy-mask"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import governanceVisualEn from '@/assets/home/redesign/s5-governance-visual-en.webp'
import governanceVisualZh from '@/assets/home/redesign/s5-governance-visual.webp'

interface Props {
  active?: boolean
}

defineOptions({
  name: 'GovernanceValueVisual',
})

withDefaults(defineProps<Props>(), {
  active: false,
})

const { locale } = useI18n()
const governanceVisual = computed(() =>
  locale.value === 'en' ? governanceVisualEn : governanceVisualZh,
)
</script>

<style scoped lang="less">
.governance-visual {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  background: #05070b;
  pointer-events: none;
}

.governance-visual-art {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transform: translateY(-30px);
  transition:
    filter 260ms ease,
    transform 260ms ease;
  user-select: none;
}

/* The exported Figma card includes copy; the page renders localized copy above this layer. */
.governance-visual-copy-mask {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  height: 36%;
  background: linear-gradient(180deg, rgba(5, 7, 11, 0), #05070b 45%, #05070b 100%);
}

.governance-visual.is-active .governance-visual-art {
  filter: brightness(1.04);
}

@media (max-width: 1023px) {
  .governance-visual-art {
    object-fit: contain;
    background: #05070b;
    transform: translateY(-24px);
  }
}

@media (max-width: 767px) {
  .governance-visual-art {
    transform: translateY(-30px);
  }

  .governance-visual-copy-mask {
    height: 52%;
    background: linear-gradient(180deg, rgba(5, 7, 11, 0), #05070b 10%, #05070b 100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .governance-visual-art {
    transition: none;
  }
}
</style>
