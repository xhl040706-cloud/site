<template>
  <section
    ref="capabilitySection"
    class="capability-showcase"
    :class="{ 'story-enabled': isScrollStoryEnabled }"
    aria-labelledby="capability-section-title"
  >
    <div class="capability-sticky" :style="storyExitStyle">
      <div class="capability-inner">
        <header class="capability-heading" data-home-reveal="heading">
          <h2 id="capability-section-title">{{ t('home.redesign.capabilities.sectionTitle') }}</h2>
          <p>{{ t('home.redesign.capabilities.sectionSubtitle') }}</p>
        </header>

        <div class="capability-layout" data-home-reveal="content">
          <div class="capability-tabs" role="tablist" aria-orientation="vertical">
            <button
              v-for="(capability, index) in capabilities"
              :id="`capability-tab-${index}`"
              :key="capability.key"
              class="capability-tab"
              :class="{
                active: activeIndex === index,
                complete: isScrollStoryEnabled && index < activeIndex,
              }"
              :style="{
                '--tab-progress': getTabProgress(index),
                '--tab-opacity': getTabOpacity(index),
              }"
              type="button"
              role="tab"
              :aria-selected="activeIndex === index"
              :aria-controls="`capability-panel-${index}`"
              @click="selectCapability(index)"
            >
              <span class="tab-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="tab-label">{{ capability.label }}</span>
              <span class="tab-progress" aria-hidden="true"></span>
            </button>
          </div>

          <article
            :id="`capability-panel-${activeIndex}`"
            class="capability-panel"
            :style="capabilityGlowCenter"
            role="tabpanel"
            :aria-labelledby="`capability-tab-${activeIndex}`"
          >
            <Transition name="capability-panel" mode="out-in">
              <div
                :key="activeCapability.key"
                class="panel-frame"
                :class="`panel-frame-${activeCapability.key}`"
              >
                <div
                  class="panel-visual"
                  :class="`panel-visual-${activeCapability.key}`"
                  aria-hidden="true"
                >
                  <div v-if="activeCapability.key === 'collaboration'" class="collaboration-motion">
                    <i v-for="index in 4" :key="`link-${index}`"></i>
                    <span v-for="index in 5" :key="`node-${index}`"></span>
                    <b></b>
                  </div>
                  <div v-else-if="activeCapability.key === 'agents'" class="agent-motion">
                    <span v-for="index in 3" :key="index"></span>
                    <i v-for="index in 3" :key="`signal-${index}`"></i>
                    <b></b>
                  </div>
                  <video
                    v-else-if="activeCapability.key === 'knowledge'"
                    class="knowledge-demo"
                    :src="knowledgeGraphDemo"
                    autoplay
                    loop
                    muted
                    playsinline
                    preload="metadata"
                  ></video>
                  <div v-else-if="activeCapability.key === 'security'" class="security-motion">
                    <i></i>
                    <span v-for="index in 4" :key="index"></span>
                  </div>
                  <svg v-else class="analytics-motion" viewBox="0 0 520 200" focusable="false">
                    <defs>
                      <linearGradient id="analytics-line" x1="0" x2="1">
                        <stop stop-color="#37c7e8" stop-opacity="0.08" />
                        <stop offset="0.72" stop-color="#7ea7ff" stop-opacity="0.72" />
                        <stop offset="1" stop-color="#d8f4ff" stop-opacity="0.96" />
                      </linearGradient>
                    </defs>
                    <path class="analytics-grid" d="M18 42 H502 M18 84 H502 M18 126 H502 M18 168 H502" />
                    <path class="analytics-area" d="M20 164 C84 150 108 112 168 124 S264 72 324 90 S420 36 500 48 V184 H20 Z" />
                    <path class="analytics-line" d="M20 164 C84 150 108 112 168 124 S264 72 324 90 S420 36 500 48" />
                    <circle cx="168" cy="124" r="4" />
                    <circle cx="324" cy="90" r="4" />
                    <circle cx="500" cy="48" r="5" />
                  </svg>
                </div>

                <div class="panel-copy">
                  <h3>{{ activeCapability.title }}</h3>
                  <p>{{ activeCapability.description }}</p>
                </div>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import knowledgeGraphDemo from '@/assets/video/knowledge-graph-demo.mp4'

defineOptions({
  name: 'CapabilityShowcase',
})

interface Capability {
  key: string
  label: string
  title: string
  description: string
}

const { t } = useI18n()
const capabilitySection = useTemplateRef<HTMLElement>('capabilitySection')
const activeIndex = ref(0)
const storyProgress = ref(0)
const activeSegmentProgress = ref(0)
const isScrollStoryEnabled = ref(false)
let scrollFrame = 0

const capabilityKeys = ['collaboration', 'agents', 'knowledge', 'security', 'analytics'] as const
const capabilities = computed<Capability[]>(() =>
  capabilityKeys.map((key) => ({
    key,
    label: t(`home.redesign.capabilities.${key}.label`),
    title: t(`home.redesign.capabilities.${key}.title`),
    description: t(`home.redesign.capabilities.${key}.description`),
  })),
)
const activeCapability = computed(() => capabilities.value[activeIndex.value])
const capabilityGlowCenter = computed(() => {
  const centers = [
    ['68%', '26%'],
    ['72%', '30%'],
    ['64%', '24%'],
    ['70%', '34%'],
    ['76%', '28%'],
  ]
  const [x, y] = centers[activeIndex.value] ?? centers[0]
  return { '--panel-glow-x': x, '--panel-glow-y': y }
})
const storyExitStyle = computed(() => {
  const exitProgress = Math.min(1, Math.max(0, (storyProgress.value - 0.9) / 0.1))
  return {
    '--story-exit-scale': `${1 - exitProgress * 0.015}`,
    '--story-exit-opacity': `${1 - exitProgress * 0.1}`,
  }
})

const updateStoryMode = () => {
  isScrollStoryEnabled.value =
    window.matchMedia('(min-width: 1100px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const updateScrollStory = () => {
  const section = capabilitySection.value
  if (!section || !isScrollStoryEnabled.value) return

  const sectionTop = window.scrollY + section.getBoundingClientRect().top
  const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight)
  const progress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollDistance))
  storyProgress.value = progress

  const hysteresis = 0.025
  const currentLowerBound = activeIndex.value / capabilityKeys.length - hysteresis
  const currentUpperBound = (activeIndex.value + 1) / capabilityKeys.length + hysteresis
  if (progress < currentLowerBound || progress > currentUpperBound) {
    activeIndex.value = Math.min(
      capabilityKeys.length - 1,
      Math.floor(progress * capabilityKeys.length),
    )
  }

  activeSegmentProgress.value = Math.min(
    1,
    Math.max(0, progress * capabilityKeys.length - activeIndex.value),
  )
}

const handleScroll = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateScrollStory()
  })
}

const handleViewportChange = () => {
  updateStoryMode()
  if (isScrollStoryEnabled.value) updateScrollStory()
  else {
    storyProgress.value = 0
    activeSegmentProgress.value = activeIndex.value === 0 ? 1 : 0
  }
}

const getTabProgress = (index: number) => {
  if (!isScrollStoryEnabled.value) return activeIndex.value === index ? 1 : 0
  if (index < activeIndex.value) return 1
  if (index > activeIndex.value) return 0
  return activeSegmentProgress.value
}

const getTabOpacity = (index: number) => {
  const distance = Math.abs(index - activeIndex.value)
  if (distance === 0) return 1
  if (distance === 1) return 0.76
  return 0.58
}

const selectCapability = (index: number) => {
  activeIndex.value = index
  if (!isScrollStoryEnabled.value) return

  const section = capabilitySection.value
  if (!section) return
  const sectionTop = window.scrollY + section.getBoundingClientRect().top
  const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight)
  const targetProgress = (index + 0.5) / capabilityKeys.length
  window.scrollTo({
    top: sectionTop + scrollDistance * targetProgress,
    behavior: 'smooth',
  })
}

onMounted(() => {
  updateStoryMode()
  updateScrollStory()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleViewportChange, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleViewportChange)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<style scoped lang="less">
.capability-showcase {
  position: relative;
  padding: 96px 0 88px;
  background: var(--color-home-bg);
}

.capability-showcase.story-enabled {
  box-sizing: border-box;
  height: 235vh;
}

.capability-sticky {
  --story-exit-scale: 1;
  --story-exit-opacity: 1;
}

.story-enabled .capability-sticky {
  position: sticky;
  top: clamp(76px, 9vh, 104px);
  opacity: var(--story-exit-opacity);
  transform: scale(var(--story-exit-scale));
  transform-origin: center top;
  will-change: opacity, transform;
}

.capability-inner {
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

.capability-heading {
  h2 {
    margin: 0;
    color: var(--color-home-text);
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0;
  }

  p {
    max-width: 760px;
    margin: 16px 0 0;
    color: var(--color-home-body);
    font-size: 15px;
    line-height: 26px;
  }
}

.capability-layout {
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  gap: 32px;
  margin-top: 40px;
}

.capability-tabs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.capability-tab {
  --tab-progress: 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 264px;
  height: 60px;
  padding: 0 16px;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: transparent;
  font: inherit;
  opacity: var(--tab-opacity);
  text-align: left;
  cursor: pointer;
  transition:
    opacity var(--motion-fast) ease,
    color var(--motion-fast) ease,
    background-color var(--motion-fast) ease;

  &::before {
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 0;
    width: 2px;
    background: var(--color-home-brand-cyan);
    opacity: 0;
    content: '';
    transform: scaleY(0.45);
    transition:
      opacity 280ms ease,
      transform 280ms var(--ease-out-expo);
  }

  .tab-number {
    color: var(--color-home-muted);
    font-size: 15px;
    font-weight: 500;
    line-height: 22px;
    font-variant-numeric: tabular-nums;
    transition: color var(--motion-fast) ease;
  }

  .tab-label {
    color: var(--color-home-body-secondary);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    transition: color var(--motion-fast) ease;
  }

  &:hover {
    background: rgba(132, 170, 214, 0.035);
    opacity: 1;

    .tab-label {
      color: var(--color-home-strong);
    }
  }

  &:focus-visible {
    outline: 1px solid rgba(55, 199, 232, 0.38);
    outline-offset: -2px;
  }

  &.active {
    background: linear-gradient(90deg, rgba(62, 141, 255, 0.07), rgba(55, 199, 232, 0.018));

    &::before {
      opacity: 0.72;
      transform: scaleY(1);
    }

    .tab-number {
      color: var(--color-home-brand-cyan);
    }

    .tab-label {
      color: var(--color-home-text);
    }
  }
}

.tab-progress {
  position: absolute;
  right: 16px;
  bottom: 7px;
  left: 16px;
  height: 1px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    rgba(203, 224, 255, 0.08),
    rgba(203, 224, 255, 0.3) 58%,
    rgba(240, 247, 255, 0.78)
  );
  box-shadow: 0 0 12px rgba(160, 200, 255, 0.22);
  opacity: 0.32;
  transform: scaleX(var(--tab-progress));
  transform-origin: left;
  transition: transform 120ms ease-out;
}

.capability-tab.active .tab-progress {
  opacity: 1;
}

.capability-tab.complete .tab-progress {
  opacity: 0.18;
}

.capability-panel {
  position: relative;
  height: clamp(440px, 49vh, 468px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background:
    radial-gradient(
      circle at var(--panel-glow-x, 68%) var(--panel-glow-y, 26%),
      rgba(62, 141, 255, 0.035),
      transparent 48%
    ),
    linear-gradient(145deg, #0c0f13, #070809 72%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.02),
    0 22px 62px rgba(0, 0, 0, 0.28);
}

.panel-frame {
  position: absolute;
  inset: 0;
}

.panel-visual {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  transform: translateY(-4%);
}

.panel-copy {
  position: absolute;
  z-index: 2;
  right: 36px;
  bottom: 32px;
  left: 36px;

  h3 {
    margin: 0;
    color: var(--color-home-text);
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }

  p {
    margin: 10px 0 0;
    color: var(--color-home-body);
    font-size: 15px;
    line-height: 24px;

    @media (min-width: 1400px) {
      white-space: nowrap;
    }
  }
}

.capability-panel-enter-active,
.capability-panel-leave-active {
  transition-property: opacity, transform;
  transition-timing-function: var(--ease-out-expo);
}

.capability-panel-enter-active {
  transition-duration: 480ms;
}

.capability-panel-leave-active {
  transition-duration: 180ms;
}

.capability-panel-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.capability-panel-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.collaboration-motion {
  position: absolute;
  top: 54px;
  left: 55%;
  width: min(440px, 62%);
  height: 244px;
  transform: translateX(-50%);

  &::before {
    position: absolute;
    top: 51%;
    right: 8%;
    left: 8%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(55, 199, 232, 0.3), transparent);
    content: '';
  }

  i {
    position: absolute;
    top: 50%;
    width: 26%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(126, 167, 255, 0.44), transparent);
    transform-origin: left;

    &:nth-of-type(1) {
      left: 10%;
      transform: rotate(-28deg);
    }

    &:nth-of-type(2) {
      left: 34%;
      transform: rotate(24deg);
    }

    &:nth-of-type(3) {
      right: 15%;
      transform: rotate(-22deg);
    }

    &:nth-of-type(4) {
      right: 3%;
      transform: rotate(30deg);
    }
  }

  span {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(172, 217, 255, 0.45);
    background: #0b1119;
    box-shadow: 0 0 0 6px rgba(55, 199, 232, 0.035), 0 0 22px rgba(55, 199, 232, 0.18);

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--color-home-brand-cyan);
      content: '';
      transform: translate(-50%, -50%);
    }

    &:nth-of-type(1) {
      top: 15%;
      left: 4%;
    }

    &:nth-of-type(2) {
      top: 70%;
      left: 18%;
    }

    &:nth-of-type(3) {
      top: 23%;
      left: 46%;
    }

    &:nth-of-type(4) {
      top: 72%;
      left: 62%;
    }

    &:nth-of-type(5) {
      top: 31%;
      right: 4%;
    }
  }

  b {
    position: absolute;
    top: calc(50% - 22px);
    left: calc(50% - 22px);
    width: 44px;
    height: 44px;
    border: 1px solid rgba(179, 228, 255, 0.72);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(179, 228, 255, 0.36), rgba(55, 199, 232, 0.08) 42%, transparent 72%);
    box-shadow: 0 0 46px rgba(55, 199, 232, 0.28);
    animation: capability-pulse 4.6s ease-in-out infinite;
  }
}

.agent-motion {
  position: absolute;
  top: 56px;
  left: 56%;
  width: min(400px, 64%);
  height: 236px;
  transform: translateX(-50%);

  span {
    position: absolute;
    width: 68%;
    height: 124px;
    border: 1px solid rgba(132, 170, 214, 0.12);
    border-radius: 12px;
    background:
      linear-gradient(90deg, rgba(126, 167, 255, 0.16) 0 23%, transparent 23% 100%),
      repeating-linear-gradient(180deg, transparent 0 25px, rgba(184, 215, 255, 0.08) 25px 26px),
      rgba(11, 18, 28, 0.76);
    box-shadow: 0 20px 46px rgba(0, 0, 0, 0.24);

    &:nth-child(1) {
      top: 82px;
      left: 0;
      opacity: 0.3;
    }

    &:nth-child(2) {
      top: 43px;
      left: 13%;
      opacity: 0.52;
    }

    &:nth-child(3) {
      top: 4px;
      left: 26%;
      border-color: rgba(150, 202, 255, 0.32);
      opacity: 0.9;
    }
  }

  i {
    position: absolute;
    z-index: 2;
    left: 37%;
    width: 34%;
    height: 4px;
    border-radius: 4px;
    background: linear-gradient(90deg, rgba(55, 199, 232, 0.1), rgba(129, 167, 255, 0.85), transparent);
    box-shadow: 0 0 18px rgba(126, 167, 255, 0.24);

    &:nth-of-type(1) {
      top: 34px;
    }

    &:nth-of-type(2) {
      top: 60px;
    }

    &:nth-of-type(3) {
      top: 86px;
      width: 22%;
    }
  }

  b {
    position: absolute;
    z-index: 3;
    top: 21px;
    left: 20%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d8f4ff;
    box-shadow: 0 0 0 5px rgba(55, 199, 232, 0.12), 0 0 22px rgba(55, 199, 232, 0.58);
    animation: agent-signal 5.2s ease-in-out infinite;
  }
}

.knowledge-motion {
  position: absolute;
  top: 54px;
  left: 58%;
  width: 300px;
  height: 210px;
  transform: translateX(-50%);

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: rgba(62, 141, 255, 0.05);
    filter: blur(12px);
    content: '';
    transform: translate(-50%, -50%);
  }

  span {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--color-home-brand-cyan);
    opacity: 0.34;

    &:nth-child(1) {
      --gather-x: 100px;
      --gather-y: 80px;
      top: 12%;
      left: 8%;
    }

    &:nth-child(2) {
      --gather-x: 20px;
      --gather-y: 80px;
      top: 12%;
      left: 42%;
    }

    &:nth-child(3) {
      --gather-x: -100px;
      --gather-y: 65px;
      top: 18%;
      left: 84%;
    }

    &:nth-child(4) {
      --gather-x: 110px;
      --gather-y: 15px;
      top: 42%;
      left: 4%;
    }

    &:nth-child(5) {
      --gather-x: 54px;
      --gather-y: 28px;
      top: 37%;
      left: 32%;
    }

    &:nth-child(6) {
      --gather-x: -110px;
      --gather-y: 10px;
      top: 44%;
      left: 88%;
    }

    &:nth-child(7) {
      --gather-x: 95px;
      --gather-y: -45px;
      top: 72%;
      left: 10%;
    }

    &:nth-child(8) {
      --gather-x: 30px;
      --gather-y: -55px;
      top: 78%;
      left: 39%;
    }

    &:nth-child(9) {
      --gather-x: -90px;
      --gather-y: -42px;
      top: 70%;
      left: 83%;
    }

    &:nth-child(10) {
      --gather-x: 78px;
      --gather-y: 48px;
      top: 28%;
      left: 18%;
    }

    &:nth-child(11) {
      --gather-x: -40px;
      --gather-y: 70px;
      top: 16%;
      left: 68%;
    }

    &:nth-child(12) {
      --gather-x: -42px;
      --gather-y: -68px;
      top: 84%;
      left: 67%;
    }
  }
}

.panel-visual-knowledge {
  transform: none;
  background: #080a0f;

  &::after {
    position: absolute;
    z-index: 1;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(8, 10, 15, 0.04) 36%,
      rgba(8, 10, 15, 0.3) 56%,
      rgba(8, 10, 15, 0.8) 78%,
      #080a0f 100%
    );
    content: '';
    pointer-events: none;
  }
}

.knowledge-demo {
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
}

.security-motion {
  position: absolute;
  inset: 0;

  &::before {
    position: absolute;
    top: 48%;
    right: 13%;
    left: 13%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(126, 167, 255, 0.42), transparent);
    content: '';
  }

  i {
    position: absolute;
    top: calc(48% - 2px);
    left: 17%;
    width: 18%;
    height: 4px;
    border-radius: 4px;
    background: linear-gradient(90deg, transparent, #7ea7ff, #d8f4ff, transparent);
    box-shadow: 0 0 18px rgba(126, 167, 255, 0.42);
    animation: security-scan 6s ease-in-out infinite;
  }

  span {
    position: absolute;
    top: calc(48% - 32px);
    width: 64px;
    height: 64px;
    border: 1px solid rgba(153, 202, 255, 0.34);
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(126, 167, 255, 0.08), rgba(8, 10, 15, 0.24));
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.02);

    &::before {
      position: absolute;
      top: 18px;
      right: 18px;
      bottom: 18px;
      left: 18px;
      border: 1px solid rgba(216, 244, 255, 0.54);
      border-top: 0;
      border-radius: 0 0 5px 5px;
      content: '';
      transform: rotate(45deg);
    }

    &:nth-of-type(1) {
      left: 17%;
    }

    &:nth-of-type(2) {
      left: 35%;
    }

    &:nth-of-type(3) {
      left: 53%;
    }

    &:nth-of-type(4) {
      left: 71%;
    }
  }
}

.analytics-motion {
  position: absolute;
  top: 64px;
  left: 50%;
  width: 520px;
  max-width: 72%;
  transform: translateX(-50%);

  .analytics-grid {
    fill: none;
    stroke: rgba(153, 202, 255, 0.1);
    stroke-width: 1;
  }

  .analytics-area {
    fill: rgba(65, 130, 255, 0.05);
  }

  .analytics-line {
    fill: none;
    stroke: url(#analytics-line);
    stroke-dasharray: 620;
    stroke-dashoffset: 620;
    stroke-width: 2;
    animation: analytics-trace 5.6s ease-out infinite;
  }

  circle {
    fill: #d8f4ff;
    stroke: rgba(55, 199, 232, 0.34);
    stroke-width: 7;
    animation: capability-pulse 4.8s ease-in-out infinite;

    &:nth-of-type(2) {
      animation-delay: 0.8s;
    }

    &:nth-of-type(3) {
      animation-delay: 1.6s;
    }
  }
}

@keyframes capability-pulse {
  0%,
  100% {
    opacity: 0.58;
    transform: scale(0.94);
  }

  52% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes agent-signal {
  0%,
  100% {
    opacity: 0.46;
    transform: translateX(0);
  }

  48% {
    opacity: 1;
    transform: translateX(160px);
  }
}

@keyframes security-scan {
  0%,
  100% {
    opacity: 0.3;
    transform: translateX(0);
  }

  50% {
    opacity: 1;
    transform: translateX(250px);
  }
}

@keyframes analytics-trace {
  0%,
  18% {
    stroke-dashoffset: 620;
    opacity: 0.2;
  }

  66%,
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@media (max-width: 1099px) {
  .capability-showcase,
  .capability-showcase.story-enabled {
    height: auto;
    padding: 96px 0;
  }

  .story-enabled .capability-sticky {
    position: static;
    opacity: 1;
    transform: none;
  }

  .capability-layout {
    display: block;
  }

  .capability-tabs {
    display: grid;
    grid-auto-columns: 190px;
    grid-auto-flow: column;
    justify-content: start;
    overflow-x: auto;
  }

  .capability-tab {
    width: 190px;
  }

  .capability-panel {
    height: 480px;
    margin-top: 24px;
  }
}

@media (max-height: 900px) and (min-width: 1100px) {
  .capability-showcase {
    padding: 76px 0 112px;
  }

  .story-enabled .capability-sticky {
    top: 76px;
  }

  .capability-heading p {
    line-height: 24px;
  }

  .capability-layout {
    margin-top: 36px;
  }

  .capability-tab {
    height: 56px;
  }

  .capability-panel {
    height: 436px;
  }

  .panel-copy {
    bottom: 28px;
  }
}

@media (max-width: 767px) {
  .capability-heading h2 {
    font-size: 34px;
    line-height: 44px;
  }

  .capability-panel {
    height: 420px;
  }

  .panel-copy {
    right: 24px;
    bottom: 28px;
    left: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .capability-tab::before,
  .capability-panel-enter-active,
  .capability-panel-leave-active {
    transition: none;
  }
}
</style>
