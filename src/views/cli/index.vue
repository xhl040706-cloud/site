<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import HomeFooter from '../home/components/HomeFooter.vue'
import CliHero from './components/CliHero.vue'
import CliAutonomousWorkflow from './components/CliAutonomousWorkflow.vue'
import CliFaq from './components/CliFaq.vue'
import CliFinalCta from './components/CliFinalCta.vue'
import { useScrollReveal } from '@/hooks/useScrollReveal'

defineOptions({
  name: 'CliIndex',
})

const { t } = useI18n()

useHead({
  title: computed(() => t('cli.meta.title')),
  meta: [{ name: 'description', content: computed(() => t('cli.meta.description')) }],
})

useScrollReveal()
</script>

<template>
  <div class="cli-page">
    <main>
      <CliHero />
      <CliAutonomousWorkflow />
      <CliFaq />
      <CliFinalCta />
    </main>
    <HomeFooter id="cli-footer" />
  </div>
</template>

<style scoped lang="less">
.cli-page {
  overflow: clip;
  background: #050505;
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
