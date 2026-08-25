<template>
  <div ref="traveler" class="home-logo-traveler" aria-hidden="true" data-logo-traveler>
    <LogoScene ref="logoScene" :auto-rotate="false" :floating="false" :pointer-parallax="false" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import LogoScene from '@/views/logo3d/components/LogoScene.vue'
import type { LogoSceneControls } from '@/views/logo3d/types'

defineOptions({ name: 'HomeLogoTraveler' })

interface LogoSceneInstance {
  controls: LogoSceneControls
  setRenderEnabled: (enabled: boolean) => void
}

const TRAVELER_SIZE = 180
const HERO_ROTATION = { x: -0.24, y: 0.12, z: 0 }
const DOCK_ROTATION = { x: -0.08, y: 0.12, z: 0 }
const SPIN_TURNS = 2
const HERO_SYMBOL_SIZE = 44
const COLLAPSE_START = 28
const COLLAPSE_END = 124
const SYMBOL_REVEAL_START = 82
const SYMBOL_REVEAL_END = 134
const TRAVEL_START = 118
const traveler = useTemplateRef<HTMLElement>('traveler')
const logoScene = useTemplateRef<LogoSceneInstance>('logoScene')

let wordmarkAnchor: HTMLElement | null = null
let productDock: HTMLElement | null = null
let productHeading: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let scrollFrame = 0
let settleUntil = 0
let isMounted = false
let lastRenderEnabled = true
let dockedSince = 0

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress
const smoothstep = (progress: number) => {
  const value = clamp(progress)
  return value * value * (3 - 2 * value)
}

const getResponsiveMotion = () => {
  if (window.innerWidth < 768) {
    return { rangeFactor: 0.92, curveY: -12, curveX: 0 }
  }
  if (window.innerWidth < 1100) {
    return { rangeFactor: 0.88, curveY: -36, curveX: 48 }
  }
  return { rangeFactor: 0.84, curveY: -60, curveX: 96 }
}

const setSceneRendering = (enabled: boolean) => {
  if (enabled === lastRenderEnabled) return
  lastRenderEnabled = enabled
  logoScene.value?.setRenderEnabled(enabled)
}

const getSettleScale = (progress: number) => {
  if (progress < 0.88) return 1
  const settleProgress = clamp((progress - 0.88) / 0.12)
  if (settleProgress < 0.33) return lerp(1, 1.04, smoothstep(settleProgress / 0.33))
  if (settleProgress < 0.72) {
    return lerp(1.04, 0.99, smoothstep((settleProgress - 0.33) / 0.39))
  }
  return lerp(0.99, 1, smoothstep((settleProgress - 0.72) / 0.28))
}

const updateRotation = (progress: number) => {
  const controls = logoScene.value?.controls
  if (!controls) return

  const rotationProgress = smoothstep(progress)
  const finalRotationY = DOCK_ROTATION.y + Math.PI * 2 * SPIN_TURNS
  const rotationX =
    lerp(HERO_ROTATION.x, DOCK_ROTATION.x, rotationProgress) + Math.sin(Math.PI * progress) * 0.16
  const rotationY = lerp(HERO_ROTATION.y, finalRotationY, rotationProgress)
  const rotationZ = Math.sin(Math.PI * progress) * 0.07

  controls.setRotation(rotationX, rotationY, rotationZ)
  controls.setTravelProgress(progress)
}

const updateTraveler = () => {
  const travelerElement = traveler.value
  const scene = logoScene.value
  if (!travelerElement || !scene || !wordmarkAnchor || !productDock || !productHeading) {
    return
  }

  const anchorRect = wordmarkAnchor.getBoundingClientRect()
  const dockRect = productDock.getBoundingClientRect()
  const headingRect = productHeading.getBoundingClientRect()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const anchorDocumentY = anchorRect.top + window.scrollY + anchorRect.height / 2
  const dockDocumentY = dockRect.top + window.scrollY + dockRect.height / 2
  const responsiveMotion = getResponsiveMotion()
  const travelRange = Math.max(1, (dockDocumentY - anchorDocumentY) * responsiveMotion.rangeFactor)
  const progress = clamp((window.scrollY - TRAVEL_START) / travelRange)
  const motionProgress = reducedMotion ? 0 : progress
  const collapseProgress = reducedMotion
    ? 0
    : clamp((window.scrollY - COLLAPSE_START) / (COLLAPSE_END - COLLAPSE_START))
  const collapseEase = smoothstep(collapseProgress)
  const revealProgress = reducedMotion
    ? 0
    : smoothstep((window.scrollY - SYMBOL_REVEAL_START) / (SYMBOL_REVEAL_END - SYMBOL_REVEAL_START))
  const textFadeProgress = smoothstep((collapseProgress - 0.38) / 0.52)
  const coreProgress = Math.sin(Math.PI * collapseProgress)
  wordmarkAnchor.style.setProperty('--hero-wordmark-scale-x', `${lerp(1, 0.12, collapseEase)}`)
  wordmarkAnchor.style.setProperty('--hero-wordmark-scale-y', `${lerp(1, 0.82, collapseEase)}`)
  wordmarkAnchor.style.setProperty('--hero-wordmark-opacity', `${1 - textFadeProgress}`)
  wordmarkAnchor.style.setProperty('--hero-wordmark-blur', `${lerp(0, 5, collapseEase)}px`)
  wordmarkAnchor.style.setProperty(
    '--hero-wordmark-core-opacity',
    `${coreProgress * (1 - revealProgress * 0.55)}`,
  )
  wordmarkAnchor.style.setProperty(
    '--hero-wordmark-core-scale',
    `${lerp(0.72, 1.12, coreProgress)}`,
  )

  const startScale = HERO_SYMBOL_SIZE / TRAVELER_SIZE
  const dockScale = dockRect.width / TRAVELER_SIZE

  const startCenterX = anchorRect.left + anchorRect.width / 2
  const startCenterY = anchorRect.top + anchorRect.height / 2
  const targetCenterX = dockRect.left + dockRect.width / 2
  const targetCenterY = dockRect.top + dockRect.height / 2
  const curveProgress = Math.sin(Math.PI * motionProgress)
  const direction = targetCenterX < startCenterX ? -1 : 1
  const centerX =
    lerp(startCenterX, targetCenterX, motionProgress) +
    curveProgress * responsiveMotion.curveX * direction
  const centerY =
    lerp(startCenterY, targetCenterY, motionProgress) + curveProgress * responsiveMotion.curveY
  const travelScale =
    (motionProgress <= 0.55
      ? lerp(startScale, startScale * 0.82, smoothstep(motionProgress / 0.55))
      : lerp(startScale * 0.82, dockScale, smoothstep((motionProgress - 0.55) / 0.45))) *
    getSettleScale(motionProgress)
  const scale = travelScale
  const headingHasLeft = progress >= 1 && headingRect.bottom <= 0

  travelerElement.style.transform = `translate3d(${centerX - TRAVELER_SIZE / 2}px, ${centerY - TRAVELER_SIZE / 2}px, 0) scale(${scale})`
  travelerElement.style.opacity = headingHasLeft ? '0' : `${revealProgress}`
  travelerElement.style.visibility = headingHasLeft || revealProgress <= 0.01 ? 'hidden' : 'visible'
  travelerElement.dataset.logoTravelProgress = motionProgress.toFixed(4)
  travelerElement.dataset.logoTravelState = headingHasLeft
    ? 'hidden'
    : reducedMotion
      ? 'reduced-hidden'
      : progress >= 1
        ? 'docked'
        : progress > 0
          ? 'traveling'
          : revealProgress > 0
            ? 'handoff'
            : 'wordmark'

  updateRotation(motionProgress)

  if (headingHasLeft || revealProgress <= 0.01) {
    dockedSince = 0
    setSceneRendering(false)
  } else if (progress < 1) {
    dockedSince = 0
    setSceneRendering(true)
  } else {
    if (!dockedSince) dockedSince = performance.now()
    setSceneRendering(performance.now() - dockedSince < 180)
  }
}

function scheduleUpdate() {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateTraveler()
    if (performance.now() < settleUntil) scheduleUpdate()
  })
}

const requestSettledUpdate = () => {
  if (!isMounted) return
  settleUntil = performance.now() + 900
  scheduleUpdate()
}

onMounted(async () => {
  isMounted = true
  await nextTick()
  wordmarkAnchor = document.querySelector<HTMLElement>('#hero-logo-anchor')
  productDock = document.querySelector<HTMLElement>('#product-logo-dock')
  productHeading = document.querySelector<HTMLElement>('#product-environment-title')

  if (!wordmarkAnchor || !productDock || !productHeading) return
  resizeObserver = new ResizeObserver(requestSettledUpdate)
  resizeObserver.observe(wordmarkAnchor)
  resizeObserver.observe(productDock)
  resizeObserver.observe(productHeading)
  window.addEventListener('scroll', requestSettledUpdate, { passive: true })
  window.addEventListener('resize', requestSettledUpdate, { passive: true })
  document.fonts.ready.then(requestSettledUpdate)
  requestSettledUpdate()
})

onBeforeUnmount(() => {
  isMounted = false
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', requestSettledUpdate)
  window.removeEventListener('resize', requestSettledUpdate)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<style scoped lang="less">
.home-logo-traveler {
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(-220px, -220px, 0);
  transform-origin: center;
  transition: opacity 240ms ease-out;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .home-logo-traveler {
    transition: opacity var(--motion-base) ease;
  }
}
</style>
