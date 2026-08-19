<template>
  <section ref="heroSection" class="hero-section" aria-labelledby="home-hero-title">
    <div class="hero-texture hero-texture-left" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-left.webp"
        alt=""
        decoding="async"
        fetchpriority="high"
      />
    </div>
    <div class="hero-texture hero-texture-right" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-right.webp"
        alt=""
        decoding="async"
        fetchpriority="high"
      />
    </div>
    <div class="hero-quiet-zone" aria-hidden="true"></div>
    <div ref="rippleLayer" class="hero-ripple-layer" aria-hidden="true"></div>

    <div id="hero-logo-anchor" class="hero-logo-anchor" aria-hidden="true"></div>

    <div class="hero-orb hero-orb-a" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-a.webp" alt="" />
    </div>
    <div class="hero-orb hero-orb-d" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-orb-d.webp" alt="" />
    </div>

    <div class="hero-content">
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
          :aria-label="t('home.redesign.hero.download')"
          @click="toDownload"
        >
          <span class="wave-label" aria-hidden="true">
            <span
              v-for="(character, index) in downloadCharacters"
              :key="`${character}-${index}`"
              class="wave-character"
              :style="{ '--wave-index': index }"
            >
              <span>{{ character === ' ' ? '\u00a0' : character }}</span>
              <span>{{ character === ' ' ? '\u00a0' : character }}</span>
            </span>
          </span>
        </button>
        <button
          class="hero-button hero-button-secondary"
          type="button"
          :aria-label="t('home.redesign.hero.tryOnline')"
          @click="toCloud"
        >
          <span class="wave-label" aria-hidden="true">
            <span
              v-for="(character, index) in tryOnlineCharacters"
              :key="`${character}-${index}`"
              class="wave-character"
              :style="{ '--wave-index': index }"
            >
              <span>{{ character === ' ' ? '\u00a0' : character }}</span>
              <span>{{ character === ' ' ? '\u00a0' : character }}</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePointerSurface } from '@/hooks/usePointerSurface'

defineOptions({
  name: 'SloganSection',
})

const { t } = useI18n()
const router = useRouter()
const heroSection = useTemplateRef<HTMLElement>('heroSection')
const downloadCharacters = computed(() => Array.from(t('home.redesign.hero.download')))
const tryOnlineCharacters = computed(() => Array.from(t('home.redesign.hero.tryOnline')))
let scrollFrame = 0

usePointerSurface(heroSection, { lerp: 0.07 })

const toDownload = () => {
  router.push({ name: 'download' })
}

const toCloud = () => {
  router.push({ name: 'cloud' })
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

const writeRipple = () => {
  const layer = rippleLayer.value
  if (!layer) return
  layer.style.setProperty('--hero-mx', `${rippleCurrent.x.toFixed(1)}px`)
  layer.style.setProperty('--hero-my', `${rippleCurrent.y.toFixed(1)}px`)
  layer.style.setProperty('--hero-ripple-strength', rippleStrength.toFixed(3))
}

const animateRipple = () => {
  rippleCurrent.x += (rippleTarget.x - rippleCurrent.x) * RIPPLE_LERP
  rippleCurrent.y += (rippleTarget.y - rippleCurrent.y) * RIPPLE_LERP
  rippleStrength += (rippleStrengthTarget - rippleStrength) * 0.1
  writeRipple()

  const settled =
    Math.abs(rippleTarget.x - rippleCurrent.x) < 0.4 &&
    Math.abs(rippleTarget.y - rippleCurrent.y) < 0.4 &&
    Math.abs(rippleStrengthTarget - rippleStrength) < 0.01
  if (settled) {
    rippleCurrent = { ...rippleTarget }
    rippleStrength = rippleStrengthTarget
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
  const inQuietZone = Math.abs(x - rect.width / 2) < 410
  rippleStrengthTarget = inQuietZone ? 0.18 : 1
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
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  heroSection.value?.removeEventListener('pointermove', handleRipplePointerMove)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
  if (rippleFrame) window.cancelAnimationFrame(rippleFrame)
})
</script>

<style scoped lang="less">
.hero-section {
  --hero-content-opacity: 1;
  --hero-content-scroll-y: 0px;
  --hero-quiet-zone-width: 820px;
  position: relative;
  height: 620px;
  overflow: hidden;
  background: var(--color-home-bg);

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

.hero-texture {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    opacity: 0.18;
    filter: saturate(0.66) brightness(0.78) contrast(1.06);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 94%, transparent 100%);
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      #000 10%,
      #000 94%,
      transparent 100%
    );
  }
}

.hero-texture-left {
  top: 21%;
  left: -5%;
  width: 40vw;
  max-width: 620px;
  mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 72%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 72%, transparent 100%);

  img {
    animation: none;
    transform: none;
  }
}

.hero-texture-right {
  top: 18%;
  right: -2.5%;
  width: 38vw;
  max-width: 600px;
  mask-image: linear-gradient(270deg, transparent 0%, #000 14%, #000 72%, transparent 100%);
  -webkit-mask-image: linear-gradient(270deg, transparent 0%, #000 14%, #000 72%, transparent 100%);

  img {
    animation: none;
    transform: none;
  }
}

.hero-quiet-zone {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 50%;
  width: min(calc(var(--hero-quiet-zone-width) + 100px), 100%);
  background: linear-gradient(
    90deg,
    transparent 0,
    var(--color-home-bg) 50px,
    var(--color-home-bg) calc(100% - 50px),
    transparent 100%
  );
  pointer-events: none;
  transform: translateX(-50%);
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
      circle var(--hero-ripple-radius, 200px) at var(--hero-mx, 50%) var(--hero-my, 50%),
      rgba(55, 199, 232, 0.065) 0%,
      rgba(62, 141, 255, 0.035) 42%,
      transparent 100%
    );
    content: '';
    opacity: calc(var(--hero-ripple-strength, 1) * var(--hero-ripple-power, 1));
  }

  &::after {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(180, 230, 245, 0.1) 0.65px, transparent 0.65px);
    background-size: 20px 20px;
    content: '';
    mask-image: radial-gradient(
      circle var(--hero-ripple-dot-radius, 190px) at var(--hero-mx, 50%) var(--hero-my, 50%),
      #000 0%,
      rgba(0, 0, 0, 0.65) 44%,
      transparent 78%
    );
    -webkit-mask-image: radial-gradient(
      circle var(--hero-ripple-dot-radius, 190px) at var(--hero-mx, 50%) var(--hero-my, 50%),
      #000 0%,
      rgba(0, 0, 0, 0.65) 44%,
      transparent 78%
    );
    opacity: calc(var(--hero-ripple-strength, 1) * var(--hero-ripple-power, 1) * 0.22);
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
  padding-top: 242px;
  opacity: var(--hero-content-opacity);
  text-align: center;
  transform: translate3d(0, var(--hero-content-scroll-y), 0);
  will-change: opacity, transform;
}

.hero-logo-anchor {
  position: absolute;
  z-index: 4;
  top: 20px;
  left: 50%;
  width: 170px;
  height: 170px;
  transform: translateX(-50%);
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
  margin: 18px 0 0;
  color: var(--color-home-body);
  font-size: 18px;
  line-height: 30px;
  letter-spacing: 0;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.hero-button {
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 48px;
  border: 0;
  border-radius: 10px;
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

  .wave-label {
    position: relative;
    z-index: 1;
    display: inline-flex;
    height: 22px;
    overflow: hidden;
    line-height: 22px;
  }

  .wave-character {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    height: 22px;
    transform: translateY(0);
    transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(var(--wave-index) * 28ms);
    will-change: transform;

    > span {
      flex: 0 0 22px;
      height: 22px;
      line-height: 22px;
    }
  }

  &:hover .wave-character {
    transform: translateY(-100%);
  }
}

.hero-button-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #347fff 0%, #279fe9 55%, #22c7d9 100%);
  box-shadow:
    0 9px 26px rgba(43, 143, 242, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background: linear-gradient(135deg, #438bff 0%, #33aaef 55%, #2dd3e2 100%);
  }
}

.hero-button-secondary {
  border: 1px solid rgba(255, 255, 255, 0.11);
  color: #edf2f7;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.065);
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
  top: 156px;
  left: calc(50% - 470px);
  width: 36px;
  height: 36px;
  transform: translate3d(var(--pointer-x-5, 0px), var(--pointer-y-5, 0px), 0);
}

.hero-orb-d {
  top: 404px;
  left: calc(50% + 444px);
  width: 42px;
  height: 42px;
  transform: translate3d(
    calc(0px - var(--pointer-x-5, 0px)),
    calc(0px - var(--pointer-y-5, 0px)),
    0
  );
}

@media (max-width: 1439px) {
  .hero-texture-left {
    width: 42vw;
  }

  .hero-texture-right {
    width: 40vw;
  }
}

@media (max-width: 1099px) {
  .hero-texture-left img {
    opacity: 0.16;
  }

  .hero-texture-right img {
    opacity: 0.18;
  }
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

  .hero-texture-left {
    display: none;
  }

  .hero-texture-right img {
    opacity: 0.18;
  }

  .hero-ripple-layer {
    display: none;
  }

  .hero-logo-anchor {
    top: 58px;
    width: 100px;
    height: 100px;
  }

  .hero-content {
    padding-top: 190px;
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
}

@media (hover: none) {
  .hero-ripple-layer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-ripple-layer {
    display: none;
  }

  .hero-texture img {
    animation: none;
  }

  .hero-orb {
    animation: none;
  }

  .wave-character {
    transform: none !important;
    transition: none !important;
  }
}
</style>
