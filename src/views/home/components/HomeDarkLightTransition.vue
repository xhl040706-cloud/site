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
  height: 150px;
  margin-top: -1px;
  margin-bottom: -1px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    #050505 0%,
    #090b0d 12%,
    #171c20 28%,
    #36434b 46%,
    #718590 64%,
    #c7d5dc 84%,
    #f1f6f9 100%
  );

  &::after {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.055) 0.8px, transparent 0.8px);
    background-size: 28px 28px;
    opacity: 0.45;
    pointer-events: none;
    content: '';
    mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
  }
}
</style>
