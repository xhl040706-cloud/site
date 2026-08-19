<template>
  <section class="particle-showcase" aria-label="Particle background showcase">
    <article class="particle-card particle-card--small">
      <ParticleField variant="ember" />
      <div class="particle-card__content"><slot name="top-left" /></div>
    </article>

    <article class="particle-card particle-card--wide">
      <ParticleField variant="horizon" />
      <div class="particle-card__content"><slot name="top-right" /></div>
    </article>

    <article class="particle-card particle-card--wide">
      <ParticleField variant="ribbon" />
      <div class="particle-card__content"><slot name="bottom-left" /></div>
    </article>

    <article class="particle-card particle-card--small">
      <ParticleField variant="vortex" />
      <div class="particle-card__content"><slot name="bottom-right" /></div>
    </article>
  </section>
</template>

<script setup lang="ts">
import ParticleField from '@/components/particle/ParticleField.vue'

defineOptions({
  name: 'ParticleShowcase',
})
</script>

<style scoped lang="less">
.particle-showcase {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 20px;
  width: min(100%, 1340px);
  margin: 0 auto;
}

.particle-card {
  position: relative;
  min-width: 0;
  height: clamp(360px, 29.6vw, 464px);
  overflow: hidden;
  border: 6px solid rgba(255, 255, 255, 0.42);
  border-radius: 14px;
  background: #070a10;
  box-shadow:
    0 14px 36px rgba(31, 35, 44, 0.09),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  isolation: isolate;
}

.particle-card--small {
  grid-column: span 4;
}

.particle-card--wide {
  grid-column: span 8;
}

.particle-card__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

@media (max-width: 1024px) {
  .particle-showcase {
    gap: 16px;
  }

  .particle-card {
    height: clamp(300px, 31vw, 360px);
  }
}

@media (max-width: 767px) {
  .particle-showcase {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .particle-card,
  .particle-card--small,
  .particle-card--wide {
    grid-column: 1;
    height: min(82vw, 360px);
    border-width: 4px;
    border-radius: 10px;
  }
}
</style>
