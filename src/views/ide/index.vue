<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import HomeFooter from '@/views/home/components/HomeFooter.vue'
import IdeHero from './components/IdeHero.vue'
import IdeWorkflow from './components/IdeWorkflow.vue'
import IdeCodeReview from './components/IdeCodeReview.vue'
import IdeShowcaseBento from './components/IdeShowcaseBento.vue'
import IdeFaq from './components/IdeFaq.vue'
import IdeFinalCta from './components/IdeFinalCta.vue'

defineOptions({
  name: 'IdeIndex',
})

const { t } = useI18n()

useHead({
  title: computed(() => t('ide.meta.title')),
  meta: [{ name: 'description', content: computed(() => t('ide.meta.description')) }],
})

useScrollReveal()
</script>

<template>
  <div class="ide-page">
    <main>
      <IdeHero class="ide-screen-paced" />
      <IdeWorkflow class="ide-screen-paced" />
      <IdeCodeReview class="ide-screen-paced" />
      <IdeShowcaseBento class="ide-screen-paced" />
      <IdeFaq class="ide-screen-paced" />
      <IdeFinalCta />
    </main>
    <HomeFooter />
  </div>
</template>

<style scoped lang="less">
.ide-page {
  overflow: clip;
  background: #050505;
}

@media (min-width: 1024px) {
  .ide-screen-paced {
    min-height: clamp(680px, calc(100svh - 100px), 1240px);
    box-sizing: border-box;
  }
}

:global([data-home-reveal]) {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 650ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

:global([data-home-reveal='content']) {
  transition-delay: 110ms;
}

:global([data-home-reveal].is-revealed) {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  :global([data-home-reveal]) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
