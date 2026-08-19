<template>
  <div
    class="particle-field"
    :class="{ 'particle-field--home': isHomeVariant, 'particle-field--closing': variant === 'closing' }"
    :data-particle-variant="variant"
    aria-hidden="true"
  >
    <canvas ref="canvas" class="particle-field__canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue'
import { useParticleField } from '@/hooks/useParticleField'
import { HOME_PARTICLE_FIELD_VARIANTS, type ParticleFieldVariant } from './types'

interface Props {
  variant?: ParticleFieldVariant
  interactive?: boolean
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'vortex',
  interactive: true,
  active: false,
})

defineOptions({
  name: 'ParticleField',
})

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const isHomeVariant = computed(() =>
  HOME_PARTICLE_FIELD_VARIANTS.some((item) => item === props.variant),
)

useParticleField({
  canvas,
  variant: toRef(props, 'variant').value,
  interactive: toRef(props, 'interactive').value,
  active: toRef(props, 'active'),
})
</script>

<style scoped lang="less">
.particle-field,
.particle-field__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.particle-field {
  overflow: hidden;
  background: #070a10;
}

.particle-field--home {
  background: #07090c;
}

.particle-field--closing {
  overflow: visible;
  background: transparent;
}

.particle-field__canvas {
  display: block;
  touch-action: none;
}
</style>
