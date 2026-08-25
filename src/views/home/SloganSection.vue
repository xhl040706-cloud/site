<template>
  <section ref="heroSection" class="hero-section" aria-labelledby="home-hero-title">
    <div class="hero-grid-backdrop" aria-hidden="true"></div>
    <div ref="rippleLayer" class="hero-ripple-layer" aria-hidden="true"></div>
    <div class="hero-orb hero-orb-a" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-a.webp" alt="" />
    </div>
    <div class="hero-orb hero-orb-b" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-b.webp" alt="" />
    </div>
    <div class="hero-orb hero-orb-c" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-c.webp" alt="" />
    </div>
    <div class="hero-orb hero-orb-d" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-d.webp" alt="" />
    </div>

    <div class="hero-content">
      <div id="hero-logo-anchor" class="hero-logo-anchor" aria-label="CoStrict">
        <span class="hero-wordmark-text" aria-hidden="true">CoStrict</span>
        <span class="hero-wordmark-collapse-core" aria-hidden="true"></span>
      </div>
      <h1 id="home-hero-title">
        <span class="hero-title-line">{{ t('home.redesign.hero.titleLine1') }}</span>
        <span class="hero-title-line hero-title-accent">{{
          t('home.redesign.hero.titleLine2')
        }}</span>
      </h1>
      <p>{{ t('home.redesign.hero.subtitle') }}</p>
      <div class="hero-actions">
        <button
          class="hero-button hero-button-primary"
          type="button"
          :aria-label="t('home.redesign.hero.tryOnline')"
          @click="toCloud"
        >
          <span class="primary-cta-main" aria-hidden="true">
            <span class="cta-label">{{ t('home.redesign.hero.tryOnline') }}</span>
          </span>
          <span class="primary-cta-arrow" aria-hidden="true">
            <span class="primary-arrow-track">
              <svg viewBox="0 0 18 18">
                <path d="M5.5 12.5L12.5 5.5" />
                <path d="M6.5 5.5H12.5V11.5" />
              </svg>
              <svg viewBox="0 0 18 18">
                <path d="M5.5 12.5L12.5 5.5" />
                <path d="M6.5 5.5H12.5V11.5" />
              </svg>
            </span>
          </span>
        </button>
        <div
          ref="downloadMenu"
          class="hero-download"
          @pointerenter="handleDownloadPointerEnter"
          @pointerleave="handleDownloadPointerLeave"
        >
          <button
            ref="downloadTrigger"
            class="hero-button hero-button-secondary hero-download-trigger"
            :class="{ 'is-open': isDownloadMenuOpen }"
            type="button"
            :aria-label="t('home.redesign.hero.download')"
            aria-haspopup="menu"
            aria-controls="hero-download-menu"
            :aria-expanded="isDownloadMenuOpen"
            @click="toggleDownloadMenu"
            @keydown.down.prevent="openDownloadMenu(true)"
          >
            <span class="download-cta-main" aria-hidden="true">
              <span class="cta-label">{{ t('home.redesign.hero.download') }}</span>
            </span>
            <span class="download-cta-arrow" aria-hidden="true">
              <svg class="download-chevron" viewBox="0 0 18 18">
                <path d="M5.5 7L9 10.5L12.5 7" />
              </svg>
            </span>
          </button>

          <Transition name="download-menu">
            <div
              v-if="isDownloadMenuOpen"
              id="hero-download-menu"
              class="hero-download-menu"
              role="menu"
              :aria-label="t('home.redesign.hero.download')"
              @keydown="handleDownloadMenuKeydown"
            >
              <button
                v-for="item in downloadItems"
                :key="item.key"
                class="hero-download-item"
                type="button"
                role="menuitem"
                @click="selectDownload(item.key)"
              >
                <span class="download-item-icon" aria-hidden="true">
                  <svg v-if="item.key === 'cli'" viewBox="0 0 24 24">
                    <path d="M8.5 8L4.5 12L8.5 16" />
                    <path d="M15.5 8L19.5 12L15.5 16" />
                    <path d="M13.5 5.5L10.5 18.5" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path
                      d="M8.3 5.5H12c0 2 2.7 2 2.7 0h3.8v3.8c-2 0-2 2.7 0 2.7v4.4h-4.4c0-2-2.7-2-2.7 0H7v-3.8c2 0 2-2.7 0-2.7V5.5h1.3Z"
                    />
                  </svg>
                </span>
                <span class="download-item-copy">
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.description }}</span>
                </span>
                <svg class="download-item-arrow" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M4.5 2.5L8 6L4.5 9.5" />
                </svg>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePointerSurface } from '@/hooks/usePointerSurface'

defineOptions({
  name: 'SloganSection',
})

const { t } = useI18n()
const router = useRouter()
const heroSection = useTemplateRef<HTMLElement>('heroSection')
const downloadMenu = useTemplateRef<HTMLElement>('downloadMenu')
const downloadTrigger = useTemplateRef<HTMLButtonElement>('downloadTrigger')
const isDownloadMenuOpen = ref(false)
const downloadItems = computed(() => [
  {
    key: 'cli' as const,
    title: t('productMenu.cliTitle'),
    description: t('productMenu.cliDesc'),
  },
  {
    key: 'ide' as const,
    title: t('productMenu.ideTitle'),
    description: t('productMenu.ideDesc'),
  },
])
let scrollFrame = 0
let downloadCloseTimer = 0

usePointerSurface(heroSection, { lerp: 0.07 })

const focusDownloadItem = (index: number) => {
  const items = downloadMenu.value?.querySelectorAll<HTMLButtonElement>('.hero-download-item')
  if (!items?.length) return
  items[(index + items.length) % items.length]?.focus()
}

const openDownloadMenu = async (focusFirstItem = false) => {
  if (downloadCloseTimer) {
    window.clearTimeout(downloadCloseTimer)
    downloadCloseTimer = 0
  }
  isDownloadMenuOpen.value = true
  if (focusFirstItem) {
    await nextTick()
    focusDownloadItem(0)
  }
}

const closeDownloadMenu = (restoreFocus = false) => {
  if (downloadCloseTimer) {
    window.clearTimeout(downloadCloseTimer)
    downloadCloseTimer = 0
  }
  isDownloadMenuOpen.value = false
  if (restoreFocus) downloadTrigger.value?.focus()
}

const toggleDownloadMenu = (event?: MouseEvent) => {
  const openedByDesktopPointer =
    event?.detail && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (openedByDesktopPointer) {
    void openDownloadMenu()
    return
  }
  if (isDownloadMenuOpen.value) closeDownloadMenu()
  else void openDownloadMenu()
}

const handleDownloadPointerEnter = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  void openDownloadMenu()
}

const handleDownloadPointerLeave = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return
  downloadCloseTimer = window.setTimeout(() => closeDownloadMenu(), 160)
}

const selectDownload = (key: 'cli' | 'ide') => {
  closeDownloadMenu()
  router.push({
    name: 'download',
    query: key === 'cli' ? { product: 'cli', tab: 'cli' } : { product: 'ide', tab: 'vscode' },
  })
}

const handleDownloadMenuKeydown = (event: KeyboardEvent) => {
  const items = Array.from(
    downloadMenu.value?.querySelectorAll<HTMLButtonElement>('.hero-download-item') ?? [],
  )
  const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDownloadMenu(true)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusDownloadItem(currentIndex + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusDownloadItem(currentIndex - 1)
  }
}

const handleDownloadOutside = (event: PointerEvent) => {
  if (!downloadMenu.value?.contains(event.target as Node)) closeDownloadMenu()
}

const handleDownloadEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isDownloadMenuOpen.value) closeDownloadMenu(true)
}

const toCloud = () => {
  window.open('https://zgsm.sangfor.com/', '_blank', 'noopener')
}

const updateHeroScroll = () => {
  const element = heroSection.value
  if (!element) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const progress = reducedMotion ? 0 : Math.min(1, Math.max(0, window.scrollY / 380))
  element.style.setProperty('--hero-content-scroll-y', `${progress * -18}px`)
  element.style.setProperty('--hero-content-opacity', `${1 - progress * 0.28}`)
}

const handleScroll = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateHeroScroll()
  })
}

const rippleLayer = useTemplateRef<HTMLElement>('rippleLayer')
const RIPPLE_LERP = 0.12
let rippleFrame = 0
let rippleEnabled = false
let rippleTarget = { x: 0, y: 0 }
let rippleCurrent = { x: 0, y: 0 }
let rippleStrengthTarget = 0
let rippleStrength = 0
let gridDepthTarget = 0
let gridDepth = 0

const writeRipple = () => {
  const layer = rippleLayer.value
  if (!layer) return
  layer.style.setProperty('--hero-mx', `${rippleCurrent.x.toFixed(1)}px`)
  layer.style.setProperty('--hero-my', `${rippleCurrent.y.toFixed(1)}px`)
  layer.style.setProperty('--hero-ripple-strength', rippleStrength.toFixed(3))
  heroSection.value?.style.setProperty('--hero-grid-depth', `${gridDepth.toFixed(1)}px`)
}

const animateRipple = () => {
  rippleCurrent.x += (rippleTarget.x - rippleCurrent.x) * RIPPLE_LERP
  rippleCurrent.y += (rippleTarget.y - rippleCurrent.y) * RIPPLE_LERP
  rippleStrength += (rippleStrengthTarget - rippleStrength) * 0.1
  gridDepth += (gridDepthTarget - gridDepth) * 0.1
  writeRipple()

  const settled =
    Math.abs(rippleTarget.x - rippleCurrent.x) < 0.4 &&
    Math.abs(rippleTarget.y - rippleCurrent.y) < 0.4 &&
    Math.abs(rippleStrengthTarget - rippleStrength) < 0.01 &&
    Math.abs(gridDepthTarget - gridDepth) < 0.1
  if (settled) {
    rippleCurrent = { ...rippleTarget }
    rippleStrength = rippleStrengthTarget
    gridDepth = gridDepthTarget
    writeRipple()
    rippleFrame = 0
    return
  }
  rippleFrame = window.requestAnimationFrame(animateRipple)
}

const handleRipplePointerMove = (event: PointerEvent) => {
  const element = heroSection.value
  if (!element) return
  const rect = element.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  rippleTarget = { x, y }
  const normalizedX = (x / rect.width) * 2 - 1
  const normalizedY = (y / rect.height) * 2 - 1
  gridDepthTarget = -Math.min(1, Math.hypot(normalizedX, normalizedY)) * 28
  const inQuietZone = Math.abs(x - rect.width / 2) < 360
  rippleStrengthTarget = inQuietZone ? 0.34 : 1
  if (!rippleFrame) rippleFrame = window.requestAnimationFrame(animateRipple)
}

const handleRipplePointerLeave = () => {
  rippleStrengthTarget = 0
  gridDepthTarget = 0
  if (!rippleFrame) rippleFrame = window.requestAnimationFrame(animateRipple)
}

onMounted(() => {
  updateHeroScroll()
  rippleEnabled =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (rippleEnabled) {
    heroSection.value?.addEventListener('pointermove', handleRipplePointerMove, {
      passive: true,
    })
    heroSection.value?.addEventListener('pointerleave', handleRipplePointerLeave)
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('pointerdown', handleDownloadOutside)
  document.addEventListener('keydown', handleDownloadEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('pointerdown', handleDownloadOutside)
  document.removeEventListener('keydown', handleDownloadEscape)
  heroSection.value?.removeEventListener('pointermove', handleRipplePointerMove)
  heroSection.value?.removeEventListener('pointerleave', handleRipplePointerLeave)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
  if (rippleFrame) window.cancelAnimationFrame(rippleFrame)
  if (downloadCloseTimer) window.clearTimeout(downloadCloseTimer)
})
</script>

<style scoped lang="less">
.hero-section {
  --hero-content-opacity: 1;
  --hero-content-scroll-y: 0px;
  --hero-grid-depth: 0px;
  position: relative;
  z-index: 2;
  height: 620px;
  overflow: visible;
  background:
    radial-gradient(
      ellipse 48% 54% at 4% 8%,
      rgba(62, 141, 255, 0.055) 0%,
      rgba(62, 141, 255, 0.024) 42%,
      transparent 74%
    ),
    radial-gradient(
      ellipse 48% 56% at 96% 92%,
      rgba(55, 199, 232, 0.048) 0%,
      rgba(55, 199, 232, 0.02) 44%,
      transparent 76%
    ),
    radial-gradient(
      ellipse 62% 68% at 50% 76%,
      rgba(55, 199, 232, 0.04) 0%,
      rgba(62, 141, 255, 0.036) 32%,
      rgba(24, 94, 139, 0.02) 54%,
      transparent 78%
    ),
    var(--color-home-bg);

  &::after {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    height: 12%;
    background: linear-gradient(to bottom, rgba(5, 5, 5, 0), var(--color-home-bg) 94%);
    content: '';
    pointer-events: none;
  }
}

.hero-grid-backdrop {
  position: absolute;
  z-index: 0;
  inset: -38px -5% -10px;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(123, 157, 184, 0.075) 1px, transparent 1px),
    linear-gradient(90deg, rgba(123, 157, 184, 0.075) 1px, transparent 1px);
  background-position: center;
  background-size: 82px 82px;
  mask-image: linear-gradient(to bottom, transparent 0%, #000 7%, #000 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    #000 7%,
    #000 88%,
    transparent 100%
  );
  pointer-events: none;
  transform: perspective(880px) translateZ(var(--hero-grid-depth))
    rotateX(calc(2.5deg + var(--pointer-rotate-x, 0deg))) rotateY(var(--pointer-rotate-y, 0deg))
    scale(1.08);
  transform-origin: center 70%;
  transition: opacity 300ms ease-out;
  will-change: transform;
}

.hero-ripple-layer {
  position: absolute;
  z-index: 2;
  inset: 0;
  opacity: 0;
  transition: opacity 280ms ease-out;
  pointer-events: none;

  &::before {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle var(--hero-ripple-radius, 240px) at var(--hero-mx, 50%) var(--hero-my, 50%),
      rgba(55, 199, 232, 0.09) 0%,
      rgba(62, 141, 255, 0.045) 45%,
      transparent 100%
    );
    content: '';
    opacity: calc(var(--hero-ripple-strength, 1) * var(--hero-ripple-power, 1));
  }
}

.hero-section:hover .hero-ripple-layer {
  opacity: 1;
}

.hero-content {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 138px;
  opacity: var(--hero-content-opacity);
  text-align: center;
  transform: translate3d(0, var(--hero-content-scroll-y), 0);
  will-change: opacity, transform;
}

.hero-logo-anchor {
  --hero-wordmark-opacity: 1;
  --hero-wordmark-scale-x: 1;
  --hero-wordmark-scale-y: 1;
  --hero-wordmark-blur: 0px;
  --hero-wordmark-core-opacity: 0;
  --hero-wordmark-core-scale: 0.72;
  position: relative;
  z-index: 6;
  display: flex;
  width: 220px;
  height: 52px;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  color: #edf3f8;
  font-size: 42px;
  font-weight: 600;
  line-height: 52px;
  letter-spacing: 0;
}

.hero-wordmark-text {
  position: relative;
  z-index: 1;
  display: block;
  color: transparent;
  background: linear-gradient(180deg, #fbfdff 4%, #e2edf3 44%, #8eb4c5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  filter: blur(var(--hero-wordmark-blur));
  opacity: var(--hero-wordmark-opacity);
  transform: scaleX(var(--hero-wordmark-scale-x)) scaleY(var(--hero-wordmark-scale-y));
  transform-origin: center;
  will-change: transform, opacity, filter;
}

.hero-wordmark-collapse-core {
  position: absolute;
  z-index: 0;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(231, 250, 255, 0.62) 0%,
    rgba(55, 199, 232, 0.28) 34%,
    rgba(62, 141, 255, 0.14) 58%,
    transparent 76%
  );
  filter: blur(3px);
  opacity: var(--hero-wordmark-core-opacity);
  transform: scale(var(--hero-wordmark-core-scale));
  will-change: transform, opacity;
}

h1 {
  display: flex;
  flex-direction: column;
  margin: 0;
  color: var(--color-home-text);
  font-size: 60px;
  font-weight: 600;
  line-height: 68px;
  letter-spacing: 0;
}

.hero-title-accent {
  color: transparent;
  background: linear-gradient(100deg, #f7f9fc 0%, #eef4fa 62%, #d8eceb 100%);
  background-clip: text;
  -webkit-background-clip: text;
}

p {
  max-width: 760px;
  margin: 20px 0 0;
  color: var(--color-home-body);
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0;
}

.hero-actions {
  position: relative;
  z-index: 7;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 26px;

  &::before {
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 50%;
    width: 430px;
    height: 138px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      rgba(55, 199, 232, 0.14) 0%,
      rgba(62, 141, 255, 0.095) 40%,
      transparent 74%
    );
    content: '';
    filter: blur(30px);
    opacity: 0.68;
    pointer-events: none;
    transform: translate3d(-50%, -45%, 0) scale(0.94);
    transition:
      opacity 420ms ease,
      transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:has(.hero-button-primary:hover)::before {
    opacity: 0.94;
    transform: translate3d(-62%, -45%, 0) scale(1);
  }

  &:has(.hero-button-secondary:hover)::before {
    opacity: 0.9;
    transform: translate3d(-38%, -45%, 0) scale(1);
  }
}

.hero-download {
  position: relative;
  display: flex;
}

.hero-button {
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition:
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    color var(--motion-fast) ease,
    transform var(--motion-base) var(--ease-out-expo);

  &:focus-visible {
    outline: 2px solid rgba(101, 207, 230, 0.62);
    outline-offset: 2px;
  }
}

.cta-label {
  position: relative;
  z-index: 1;
  display: block;
  line-height: 22px;
}

.hero-button-primary {
  display: inline-flex;
  overflow: visible;
  width: 180px;
  align-items: center;
  gap: 2px;
  padding: 0;
  color: #ffffff;
  background: transparent;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;

    .primary-cta-main,
    .primary-cta-arrow {
      outline: 2px solid rgba(101, 207, 230, 0.7);
      outline-offset: 2px;
    }
  }

  &:hover,
  &:focus-visible {
    .primary-cta-main {
      color: #dffaff;
      background: rgba(9, 35, 45, 0.92);
      box-shadow:
        0 12px 30px rgba(5, 16, 26, 0.34),
        inset 0 0 0 1px rgba(82, 205, 229, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }

    .primary-cta-arrow {
      color: #b8f4ff;
      background: rgba(11, 47, 57, 0.94);
      box-shadow:
        0 12px 28px rgba(5, 16, 26, 0.3),
        inset 0 0 0 1px rgba(82, 205, 229, 0.14);

      .primary-arrow-track svg:first-child {
        opacity: 0;
        transform: translateX(20px);
      }

      .primary-arrow-track svg:last-child {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
}

.primary-cta-main,
.primary-cta-arrow {
  position: relative;
  display: inline-flex;
  height: 48px;
  align-items: center;
  justify-content: center;
  transition:
    color 360ms ease,
    background 420ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.primary-cta-main {
  overflow: visible;
  width: 130px;
  border-radius: 999px;
  background: linear-gradient(135deg, #347fff 0%, #2b99ec 58%, #2ab8d3 100%);
  box-shadow:
    0 10px 28px rgba(43, 143, 242, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.primary-cta-arrow {
  z-index: 2;
  width: 46px;
  flex: 0 0 46px;
  border-radius: 50%;
  color: #f6fdff;
  background: linear-gradient(145deg, #29a9e5 0%, #31c7d6 100%);
  box-shadow:
    0 10px 26px rgba(42, 174, 219, 0.17),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);

  svg {
    position: absolute;
    inset: 0;
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.55;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition:
      opacity 300ms ease,
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.primary-arrow-track {
  position: relative;
  display: block;
  overflow: hidden;
  width: 18px;
  height: 18px;

  svg:first-child {
    opacity: 1;
    transform: translateX(0);
  }

  svg:last-child {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.hero-button-secondary.hero-download-trigger {
  display: inline-flex;
  overflow: visible;
  width: 180px;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;

  &:hover {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;

    .download-cta-main,
    .download-cta-arrow {
      outline: 2px solid rgba(101, 207, 230, 0.7);
      outline-offset: 2px;
    }
  }

  &:hover,
  &.is-open,
  &:focus-visible {
    .download-cta-main {
      border-color: rgba(101, 207, 230, 0.3);
      color: #ffffff;
      background: rgba(18, 37, 51, 0.82);
    }

    .download-cta-arrow {
      border-color: rgba(101, 207, 230, 0.26);
      color: #dffaff;
      background: rgba(19, 52, 64, 0.9);
    }
  }

  .download-chevron {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.55;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  &.is-open .download-chevron {
    transform: rotate(180deg);
  }
}

.download-cta-main,
.download-cta-arrow {
  position: relative;
  display: inline-flex;
  height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(135, 177, 205, 0.2);
  color: #edf2f7;
  background: rgba(15, 25, 36, 0.56);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    border-color 260ms ease,
    color 260ms ease,
    background 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.download-cta-main {
  width: 130px;
  border-radius: 999px;
}

.download-cta-arrow {
  z-index: 2;
  width: 46px;
  flex: 0 0 46px;
  border-radius: 50%;
}

.hero-download-menu {
  position: absolute;
  z-index: 12;
  top: calc(100% + 8px);
  left: 0;
  width: 304px;
  padding: 7px;
  border: 1px solid rgba(125, 151, 181, 0.18);
  border-radius: 8px;
  background: rgba(9, 13, 19, 0.92);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.045);
  backdrop-filter: blur(18px) saturate(120%);
  -webkit-backdrop-filter: blur(18px) saturate(120%);
}

.hero-download-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 14px;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 51px;
  padding: 5px 9px;
  border: 0;
  border-radius: 6px;
  color: #e7edf5;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    color 180ms ease,
    background-color 180ms ease;

  &:hover,
  &:focus-visible {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.055);
    outline: none;
  }
}

.download-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(96, 132, 169, 0.22);
  border-radius: 7px;
  color: #65cfe6;
  background: rgba(21, 31, 43, 0.78);

  svg {
    width: 21px;
    height: 21px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.45;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.download-item-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;

  strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: #7f91a6;
    font-size: 12px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
}

.download-item-arrow {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #71849a;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    stroke 180ms ease,
    transform 180ms ease;

  .hero-download-item:hover &,
  .hero-download-item:focus-visible & {
    stroke: #d9e8f5;
    transform: translateX(2px);
  }
}

.download-menu-enter-active,
.download-menu-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.download-menu-enter-from,
.download-menu-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.985);
}

.hero-button-secondary {
  border: 1px solid rgba(135, 177, 205, 0.2);
  color: #edf2f7;
  background: rgba(15, 25, 36, 0.56);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &:hover {
    border-color: rgba(101, 207, 230, 0.34);
    background: rgba(19, 34, 48, 0.68);
    transform: translateY(-1px);
  }
}

.hero-orb {
  position: absolute;
  z-index: 3;
  overflow: hidden;
  border-radius: 50%;
  background: var(--color-home-bg-secondary);
  opacity: 0.42;
  will-change: transform;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.hero-orb-a {
  top: 70px;
  left: calc(50% - 349px);
  width: 36px;
  height: 36px;
  transform: translate3d(var(--pointer-x-5, 0px), var(--pointer-y-5, 0px), 0);
}

.hero-orb-b {
  top: 190px;
  left: calc(50% + 228px);
  width: 34px;
  height: 34px;
  transform: translate3d(
    calc(0px - var(--pointer-x-8, 0px)),
    calc(0px - var(--pointer-y-8, 0px)),
    0
  );
}

.hero-orb-c {
  top: 350px;
  left: calc(50% - 374px);
  width: 40px;
  height: 40px;
  transform: translate3d(var(--pointer-x-8, 0px), var(--pointer-y-8, 0px), 0);
}

.hero-orb-d {
  top: 404px;
  left: calc(50% + 387px);
  width: 42px;
  height: 42px;
  transform: translate3d(
    calc(0px - var(--pointer-x-5, 0px)),
    calc(0px - var(--pointer-y-5, 0px)),
    0
  );
}

@media (max-width: 1023px) {
  h1 {
    font-size: 56px;
    line-height: 68px;
  }

  p {
    max-width: calc(100% - (2 * var(--home-page-gutter)));
  }
}

@media (max-width: 767px) {
  .hero-section {
    height: 560px;
  }

  .hero-ripple-layer {
    display: none;
  }

  .hero-grid-backdrop {
    inset: 0 -20%;
    background-size: 64px 64px;
    opacity: 0.72;
    transform: none;
  }

  .hero-logo-anchor {
    width: 170px;
    height: 40px;
    margin-bottom: 18px;
    font-size: 32px;
    line-height: 40px;
  }

  .hero-content {
    padding-top: 112px;
  }

  .hero-actions {
    width: min(376px, calc(100% - 48px));
    gap: 12px;
  }

  .hero-actions > .hero-button,
  .hero-download {
    min-width: 0;
    flex: 1 1 0;
  }

  .hero-download .hero-button {
    width: 100%;
  }

  .primary-cta-main,
  .download-cta-main {
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
  }

  .primary-cta-arrow,
  .download-cta-arrow {
    width: 44px;
    flex-basis: 44px;
  }

  h1 {
    font-size: 40px;
    line-height: 50px;
  }

  p {
    font-size: 16px;
    line-height: 25px;
  }

  .hero-orb {
    opacity: 0.42;
  }

  .hero-download-menu {
    right: 0;
    left: auto;
    width: min(276px, calc(100vw - 48px));
  }
}

@media (max-width: 374px) {
  .hero-actions {
    width: calc(100% - 32px);
    gap: 12px;
    margin-right: auto;
    margin-left: auto;
  }

  .hero-actions > .hero-button,
  .hero-download {
    flex: 1 1 0;
    min-width: 0;
  }

  .hero-actions > .hero-button,
  .hero-download .hero-button {
    width: 100%;
  }

  .primary-cta-main {
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
  }

  .download-cta-main {
    width: auto;
    min-width: 0;
    flex: 1 1 auto;
  }

  .primary-cta-arrow,
  .download-cta-arrow {
    width: 42px;
    flex-basis: 42px;
  }
}

@media (hover: none) {
  .hero-ripple-layer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-wordmark-text {
    filter: none;
  }

  .hero-wordmark-collapse-core {
    display: none;
  }

  .hero-ripple-layer {
    display: none;
  }

  .hero-grid-backdrop {
    transform: none;
  }

  .hero-orb {
    animation: none;
  }

  .primary-arrow-track svg {
    transition: none !important;
  }

  .primary-arrow-track svg:first-child {
    opacity: 1 !important;
    transform: none !important;
  }

  .primary-arrow-track svg:last-child {
    display: none;
  }
}
</style>
