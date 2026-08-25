<template>
  <div class="home-dark-light-transition" aria-hidden="true"></div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeDarkLightTransition',
})
</script>

<style scoped lang="less">
.home-dark-light-transition {
  position: relative;
  height: 72px;
  margin-top: -1px;
  margin-bottom: -1px;
  overflow: hidden;
  background: linear-gradient(180deg, #050505 0%, #05070b 100%);

  &::after {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 0.7px, transparent 0.7px);
    background-size: 28px 28px;
    opacity: 0.05;
    pointer-events: none;
    content: '';
    mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
  }
}
</style>
