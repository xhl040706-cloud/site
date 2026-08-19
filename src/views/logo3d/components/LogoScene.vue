<template>
  <div
    ref="container"
    class="logo-scene"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas ref="canvas" class="logo-scene__canvas" role="img" :aria-label="ariaLabel">
      CoStrict three-dimensional logo
    </canvas>

    <p v-if="isLoading" class="logo-scene__status" role="status">Loading</p>

    <div v-if="errorMessage" class="logo-scene__fallback" role="img" aria-label="CoStrict logo">
      <img :src="logoSvgUrl" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logoSvgUrl from '@/assets/logo3d/costrict-symbol.svg?url'
import { useLogoScene } from '../hooks/useLogoScene'

defineOptions({ name: 'Logo3DScene' })

interface Props {
  autoRotate?: boolean
  floating?: boolean
  pointerParallax?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoRotate: true,
  floating: true,
  pointerParallax: true,
  ariaLabel: 'CoStrict three-dimensional logo',
})

const container = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const {
  controls,
  isLoading,
  errorMessage,
  capturePng,
  onPointerMove,
  onPointerLeave,
  setPointerNormalized,
  setRenderEnabled,
} = useLogoScene({
  container,
  canvas,
  sourceUrl: logoSvgUrl,
  autoRotate: props.autoRotate,
  floating: props.floating,
  pointerParallax: props.pointerParallax,
})

defineExpose({ controls, capturePng, setPointerNormalized, setRenderEnabled })
</script>

<style scoped lang="less">
.logo-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  touch-action: pan-y;

  &__canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__status {
    position: absolute;
    right: 0;
    bottom: 4px;
    left: 0;
    margin: 0;
    color: rgba(255, 255, 255, 0.42);
    font-size: 10px;
    line-height: 14px;
    text-align: center;
  }

  &__fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;

    img {
      display: block;
      width: 86%;
      height: auto;
    }
  }
}
</style>
