<template>
  <div class="product-demo-surface" :class="`is-${demoState}`">
    <div class="demo-idle-layer">
      <div class="demo-builder-heading">
        <p class="demo-builder-title">
          {{ t('home.redesign.products.cloud.builderTitle') }}
        </p>
        <p class="demo-builder-subtitle">
          {{ t('home.redesign.products.cloud.builderSubtitle') }}
        </p>
      </div>

      <div class="demo-composer">
        <div class="demo-prompt" :aria-label="t('home.redesign.products.cloud.promptPlaceholder')">
          <span>{{ displayedPrompt }}</span>
          <i class="demo-prompt-caret" aria-hidden="true"></i>
        </div>
        <div class="demo-composer-footer">
          <div class="demo-settings" aria-hidden="true">
            <span class="demo-mode">
              {{ t('home.redesign.products.cloud.buildMode') }}
              <i class="demo-chevron"></i>
            </span>
            <span class="demo-model">
              {{ t('home.redesign.products.cloud.model') }}
              <i class="demo-chevron"></i>
            </span>
          </div>
          <span class="demo-workspace">{{ t('home.redesign.products.cloud.workspace') }}</span>
          <button
            class="demo-send"
            type="button"
            :aria-label="t('home.redesign.products.cloud.sendPrompt')"
            :disabled="!hasPrompt"
            @click.stop="submitDemo"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 2 9 15m13-13-7 20-6-7-7-6 20-7Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="demo-running-layer" aria-live="polite">
      <video
        ref="videoElement"
        class="demo-video"
        :src="videoSrc"
        muted
        playsinline
        preload="metadata"
        @ended="handleEnded"
      ></video>

      <button
        v-if="isActive && demoState === 'completed'"
        class="demo-replay"
        type="button"
        :aria-label="replayLabel"
        :title="replayLabel"
        @click.stop="replayDemo"
      >
        <span aria-hidden="true">↻</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'ProductDemoSurface',
})

interface Props {
  isActive?: boolean
  prompt: string
  replayLabel: string
  videoSrc: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

type DemoState = 'idle' | 'submitting' | 'running' | 'completed'

const { t } = useI18n()
const videoElement = useTemplateRef<HTMLVideoElement>('videoElement')
const demoState = ref<DemoState>('idle')
const displayedPrompt = ref(props.prompt)
const hasPrompt = computed(() => displayedPrompt.value.trim().length > 0)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const SUBMIT_DURATION = reduceMotion ? 0 : 300
let submitTimer: number | undefined

const clearTimers = () => {
  if (submitTimer !== undefined) window.clearTimeout(submitTimer)
  submitTimer = undefined
}

const resetDemo = () => {
  clearTimers()
  const video = videoElement.value
  if (video) {
    video.pause()
    video.currentTime = 0
  }
  demoState.value = 'idle'
  displayedPrompt.value = props.prompt
}

const playVideo = async () => {
  const video = videoElement.value
  if (!video) return

  video.currentTime = 0
  demoState.value = 'running'

  try {
    await video.play()
  } catch (error) {
    console.warn('Cloud product demo could not start', error)
    resetDemo()
  }
}

const submitDemo = () => {
  if (!props.isActive || demoState.value !== 'idle' || !hasPrompt.value) return
  demoState.value = 'submitting'
  submitTimer = window.setTimeout(playVideo, SUBMIT_DURATION)
}

const replayDemo = () => {
  void playVideo()
}

const handleEnded = () => {
  demoState.value = 'completed'
}

watch(
  () => props.isActive,
  (isActive) => {
    if (!isActive) {
      resetDemo()
    }
  },
)

watch(
  () => props.prompt,
  (prompt) => {
    displayedPrompt.value = prompt
  },
)

onBeforeUnmount(() => {
  clearTimers()
  videoElement.value?.pause()
})
</script>

<style scoped lang="less">
.product-demo-surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #101011;
}

.demo-idle-layer,
.demo-running-layer {
  position: absolute;
  inset: 0;
}

.demo-idle-layer {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 68px 24px 24px;
  opacity: 1;
  transform: scale(1);
  transform-origin: 82% 68%;
  transition:
    opacity 180ms ease,
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 260ms ease;
}

.demo-builder-heading {
  text-align: center;
}

.demo-builder-title,
.demo-builder-subtitle {
  margin: 0;
  letter-spacing: 0;
}

.demo-builder-title {
  color: #f4f4f5;
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
}

.demo-builder-subtitle {
  margin-top: 8px;
  color: #8c8c93;
  font-size: 12px;
  line-height: 18px;
}

.demo-composer {
  position: relative;
  width: min(500px, 76%);
  min-width: 390px;
  min-height: 116px;
  margin-top: 30px;
  overflow: hidden;
  border: 1px solid #2d2d30;
  border-radius: 12px;
  background: #111113;
}

.demo-prompt {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 68px;
  align-items: flex-start;
  gap: 2px;
  padding: 14px 16px 8px;
  color: #d7d7da;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0;
  user-select: none;
}

.demo-prompt-caret {
  display: inline-block;
  width: 1px;
  height: 16px;
  margin-top: 2px;
  background: #d7d7da;
  animation: demo-caret-blink 1s steps(1, end) infinite;
}

.demo-composer-footer {
  display: flex;
  box-sizing: border-box;
  height: 48px;
  align-items: center;
  gap: 10px;
  padding: 0 9px 9px 10px;
  color: #a1a1a8;
  font-size: 12px;
  line-height: 18px;
}

.demo-settings {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.demo-mode,
.demo-model {
  display: inline-flex;
  height: 32px;
  align-items: center;
  white-space: nowrap;
}

.demo-mode {
  gap: 9px;
  padding: 0 11px;
  border-radius: 9px;
  color: #e4e4e7;
  background: #1d1d20;
}

.demo-model {
  gap: 7px;
  color: #dedee1;
}

.demo-chevron {
  width: 6px;
  height: 6px;
  margin: -3px 1px 0 2px;
  border-right: 1.5px solid currentcolor;
  border-bottom: 1.5px solid currentcolor;
  transform: rotate(45deg);
}

.demo-workspace {
  min-width: 0;
  margin-left: auto;
  overflow: hidden;
  color: #8c8c93;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.demo-send,
.demo-replay {
  display: inline-flex;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  color: #171719;
  background: #f1f1f2;
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition:
    filter 150ms ease,
    transform 100ms cubic-bezier(0.22, 1, 0.36, 1);

  svg {
    display: block;
    width: 19px;
    height: 19px;
    fill: none;
    stroke: currentcolor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    color: #29292c;
    background: #77777d;
    cursor: default;
  }
}

@keyframes demo-caret-blink {
  0%,
  48% {
    opacity: 1;
  }

  49%,
  100% {
    opacity: 0;
  }
}

.demo-running-layer {
  z-index: 1;
  overflow: hidden;
  background: #0d0f13;
  opacity: 0;
  transform: scale(0.985);
  transition:
    opacity 260ms ease 140ms,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1) 120ms;
}

.demo-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right top;
  pointer-events: none;
}

.is-submitting .demo-idle-layer,
.is-running .demo-idle-layer,
.is-completed .demo-idle-layer {
  filter: blur(5px);
  opacity: 0;
  pointer-events: none;
  transform: scale(0.12);
}

.is-running .demo-running-layer,
.is-completed .demo-running-layer {
  opacity: 1;
  transform: scale(1);
}

.demo-replay {
  position: absolute;
  z-index: 2;
  top: 12px;
  right: 12px;
  color: #e7edf5;
  background: rgba(12, 16, 22, 0.84);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (max-width: 767px) {
  .demo-idle-layer {
    padding: 54px 16px 18px;
  }

  .demo-builder-title {
    font-size: 20px;
    line-height: 28px;
  }

  .demo-builder-subtitle {
    max-width: 280px;
    margin-top: 6px;
  }

  .demo-composer {
    width: 100%;
    min-width: 0;
    margin-top: 24px;
  }

  .demo-model {
    font-size: 11px;
  }

  .demo-workspace {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-idle-layer,
  .demo-running-layer,
  .demo-send,
  .demo-replay,
  .demo-prompt-caret {
    animation: none;
    transition: none;
  }
}
</style>
