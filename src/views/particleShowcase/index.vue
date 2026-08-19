<template>
  <main class="particle-showcase-page">
    <ParticleShowcase />
  </main>
</template>

<script setup lang="ts">
import ParticleShowcase from './components/ParticleShowcase.vue'

defineOptions({
  name: 'ParticleShowcasePage',
})
</script>

<style scoped lang="less">
.particle-showcase-page {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 16px max(16px, calc((100vw - 1340px) / 2));
  background: #f4f4f3;
}

@media (max-width: 767px) {
  .particle-showcase-page {
    padding: 12px;
  }
}
</style>
