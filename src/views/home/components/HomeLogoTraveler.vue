<template>
  <div ref="traveler" class="home-logo-traveler" aria-hidden="true" data-logo-traveler>
    <LogoScene ref="logoScene" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import LogoScene from '@/views/logo3d/components/LogoScene.vue'
import type { LogoSceneControls } from '@/views/logo3d/types'

defineOptions({ name: 'HomeLogoTraveler' })

interface LogoSceneInstance {
  controls: LogoSceneControls
  setPointerNormalized: (x: number, y: number) => void
  setRenderEnabled: (enabled: boolean) => void
}

const TRAVELER_SIZE = 180
const HERO_ROTATION = { x: -0.28, y: 0.14, z: 0 }
const HERO_TILT_Z = 0.2
const DOCK_ROTATION = { x: -0.08, y: 0.12, z: 0 }
const traveler = useTemplateRef<HTMLElement>('traveler')
const logoScene = useTemplateRef<LogoSceneInstance>('logoScene')

let heroAnchor: HTMLElement | null = null
let productDock: HTMLElement | null = null
let productHeading: HTMLElement | null = null
let heroSection: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let scrollFrame = 0
let lastRenderEnabled = true

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress
const smoothstep = (progress: number) => {
  const value = clamp(progress)
  return value * value * (3 - 2 * value)
}

const setSceneRendering = (enabled: boolean) => {
  if (enabled === lastRenderEnabled) return
  lastRenderEnabled = enabled
  logoScene.value?.setRenderEnabled(enabled)
}

const getResponsiveMotion = () => {
  if (window.innerWidth < 768) {
    return { rangeFactor: 0.92, curveY: 6, curveX: 0, rotationY: 48, rotationFactor: 0.3 }
  }
  if (window.innerWidth < 1100) {
    return { rangeFactor: 0.88, curveY: 14, curveX: 8, rotationY: 114, rotationFactor: 0.6 }
  }
  return { rangeFactor: 0.84, curveY: 22, curveX: 18, rotationY: 190, rotationFactor: 1 }
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

const updateRotation = (progress: number, rotationYDegrees: number, rotationFactor: number) => {
  const controls = logoScene.value?.controls
  if (!controls) return

  const peakX = HERO_ROTATION.x + (14 * Math.PI * rotationFactor) / 180
  const peakY = HERO_ROTATION.y + (rotationYDegrees * Math.PI) / 180
  let rotationX = HERO_ROTATION.x
  let rotationY = HERO_ROTATION.y

  if (progress <= 0.65) {
    const rotationProgress = smoothstep(progress / 0.65)
    rotationX = lerp(HERO_ROTATION.x, peakX, rotationProgress)
    rotationY = lerp(HERO_ROTATION.y, peakY, rotationProgress)
  } else {
    const faceProgress = smoothstep((progress - 0.65) / 0.35)
    rotationX = lerp(peakX, DOCK_ROTATION.x, faceProgress)
    rotationY = lerp(peakY, DOCK_ROTATION.y, faceProgress)
  }

  const heroTiltZ = HERO_TILT_Z * (1 - smoothstep(progress / 0.35))
  controls.setRotation(rotationX, rotationY, heroTiltZ + Math.sin(Math.PI * progress) * 0.025)
  controls.setTravelProgress(progress)
}

const updateReducedMotion = (
  progress: number,
  anchorRect: DOMRect,
  startScale: number,
  headingRect: DOMRect,
) => {
  const travelerElement = traveler.value
  const scene = logoScene.value
  if (!travelerElement || !scene) return

  const opacity = 1 - smoothstep((progress - 0.25) / 0.37)
  const centerX = anchorRect.left + anchorRect.width / 2
  const centerY = anchorRect.top + anchorRect.height / 2
  travelerElement.style.transform = `translate3d(${centerX - TRAVELER_SIZE / 2}px, ${centerY - TRAVELER_SIZE / 2}px, 0) scale(${startScale})`
  travelerElement.style.opacity = `${opacity}`
  travelerElement.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible'
  travelerElement.dataset.logoTravelState = opacity <= 0.01 ? 'reduced-hidden' : 'reduced-hero'
  travelerElement.dataset.logoTravelProgress = progress.toFixed(4)
  scene.controls.setRotation(HERO_ROTATION.x, HERO_ROTATION.y, HERO_TILT_Z)
  scene.controls.setTravelProgress(0)
  scene.setPointerNormalized(0, 0)
  setSceneRendering(opacity > 0.01 && headingRect.bottom > 0)
  heroSection?.style.setProperty('--hero-logo-field-opacity', `${opacity}`)
}

const updateTraveler = () => {
  const travelerElement = traveler.value
  const scene = logoScene.value
  if (!travelerElement || !scene || !heroAnchor || !productDock || !productHeading) return

  const anchorRect = heroAnchor.getBoundingClientRect()
  const dockRect = productDock.getBoundingClientRect()
  const headingRect = productHeading.getBoundingClientRect()
  const anchorDocumentY = anchorRect.top + window.scrollY + anchorRect.height / 2
  const dockDocumentY = dockRect.top + window.scrollY + dockRect.height / 2
  const heroTop = heroSection?.getBoundingClientRect().top ?? 0
  const heroDocumentTop = heroTop + window.scrollY
  const travelStart = Math.max(0, anchorDocumentY - anchorRect.height / 2 - heroDocumentTop)
  const responsiveMotion = getResponsiveMotion()
  const travelRange = Math.max(1, (dockDocumentY - anchorDocumentY) * responsiveMotion.rangeFactor)
  const progress = clamp((window.scrollY - travelStart) / travelRange)
  const startScale = anchorRect.width / TRAVELER_SIZE
  const dockScale = dockRect.width / TRAVELER_SIZE

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    updateReducedMotion(progress, anchorRect, startScale, headingRect)
    return
  }

  const startCenterX = anchorRect.left + anchorRect.width / 2
  const startCenterY = anchorRect.top + anchorRect.height / 2
  const targetCenterX = dockRect.left + dockRect.width / 2
  const targetCenterY = dockRect.top + dockRect.height / 2
  const curveProgress = Math.sin(Math.PI * progress)
  const direction = targetCenterX < startCenterX ? -1 : 1
  const centerX =
    lerp(startCenterX, targetCenterX, progress) +
    curveProgress * responsiveMotion.curveX * direction
  const centerY =
    lerp(startCenterY, targetCenterY, progress) + curveProgress * responsiveMotion.curveY
  const scale =
    (progress <= 0.55
      ? lerp(startScale, startScale * 0.58, smoothstep(progress / 0.55))
      : lerp(startScale * 0.58, dockScale, smoothstep((progress - 0.55) / 0.45))) *
    getSettleScale(progress)
  const headingHasLeft = progress >= 1 && headingRect.bottom <= 0

  travelerElement.style.transform = `translate3d(${centerX - TRAVELER_SIZE / 2}px, ${centerY - TRAVELER_SIZE / 2}px, 0) scale(${scale})`
  travelerElement.style.opacity = headingHasLeft ? '0' : '1'
  travelerElement.style.visibility = headingHasLeft ? 'hidden' : 'visible'
  travelerElement.dataset.logoTravelProgress = progress.toFixed(4)
  travelerElement.dataset.logoTravelState = headingHasLeft
    ? 'hidden'
    : progress >= 1
      ? 'docked'
      : progress > 0
        ? 'traveling'
        : 'hero'

  updateRotation(progress, responsiveMotion.rotationY, responsiveMotion.rotationFactor)
  setSceneRendering(!headingHasLeft)

  if (progress > 0 && !headingHasLeft) scheduleUpdate()

  if (heroSection) {
    const ambientWeight = 1 - progress * 0.6
    heroSection.style.setProperty('--hero-ambient-from-opacity', `${0.65 * ambientWeight}`)
    heroSection.style.setProperty('--hero-ambient-to-opacity', `${ambientWeight}`)
    heroSection.style.setProperty('--hero-logo-field-opacity', `${1 - progress}`)
  }
}

function scheduleUpdate() {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateTraveler()
  })
}

const handlePointerMove = (event: PointerEvent) => {
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return
  }
  logoScene.value?.setPointerNormalized(
    clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1),
    clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1),
  )
}

onMounted(async () => {
  await nextTick()
  heroAnchor = document.querySelector<HTMLElement>('#hero-logo-anchor')
  productDock = document.querySelector<HTMLElement>('#product-logo-dock')
  productHeading = document.querySelector<HTMLElement>('#product-environment-title')
  heroSection = document.querySelector<HTMLElement>('.hero-section')

  if (!heroAnchor || !productDock || !productHeading) return
  resizeObserver = new ResizeObserver(scheduleUpdate)
  resizeObserver.observe(heroAnchor)
  resizeObserver.observe(productDock)
  resizeObserver.observe(productHeading)
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.fonts.ready.then(scheduleUpdate)
  scheduleUpdate()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  window.removeEventListener('pointermove', handlePointerMove)
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
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .home-logo-traveler {
    transition: opacity var(--motion-base) ease;
  }
}
</style>
