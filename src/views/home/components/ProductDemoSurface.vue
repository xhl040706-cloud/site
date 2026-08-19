<template>
  <div
    ref="surfaceElement"
    class="product-demo-surface"
    :class="[`is-${demoState}`, { 'is-visible': isVisible }]"
  >
    <div class="demo-idle-layer">
      <div class="demo-composer">
        <div class="demo-prompt" aria-live="polite">
          <span>{{ displayedPrompt }}</span>
          <span v-if="isTyping" class="demo-caret" aria-hidden="true"></span>
        </div>
        <div class="demo-composer-footer">
          <span>Build · GLM-5.3-Zhipu</span>
          <button
            class="demo-send"
            type="button"
            :aria-label="prompt"
            :disabled="!displayedPrompt"
            @click.stop="submitDemo"
          >
            <span aria-hidden="true">↑</span>
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
        preload="auto"
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
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

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

const surfaceElement = useTemplateRef<HTMLElement>('surfaceElement')
const videoElement = useTemplateRef<HTMLVideoElement>('videoElement')
const demoState = ref<DemoState>('idle')
const displayedPrompt = ref('')
const isTyping = ref(false)
const isVisible = ref(false)
const hasTyped = ref(false)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const TYPE_INTERVAL = 26
const SUBMIT_DURATION = reduceMotion ? 0 : 300
let typingTimer: number | undefined
let submitTimer: number | undefined
let visibilityObserver: IntersectionObserver | undefined

const clearTimers = () => {
  if (typingTimer !== undefined) window.clearTimeout(typingTimer)
  if (submitTimer !== undefined) window.clearTimeout(submitTimer)
  typingTimer = undefined
  submitTimer = undefined
}

const completePrompt = () => {
  if (typingTimer !== undefined) window.clearTimeout(typingTimer)
  typingTimer = undefined
  displayedPrompt.value = props.prompt
  isTyping.value = false
  hasTyped.value = true
}

const typePrompt = (index = 0) => {
  if (!props.isActive || !isVisible.value || hasTyped.value) return

  if (reduceMotion || index >= props.prompt.length) {
    completePrompt()
    return
  }

  isTyping.value = true
  displayedPrompt.value = props.prompt.slice(0, index + 1)
  typingTimer = window.setTimeout(() => typePrompt(index + 1), TYPE_INTERVAL)
}

const preparePrompt = () => {
  if (!props.isActive || !isVisible.value || demoState.value !== 'idle') return
  if (hasTyped.value) {
    displayedPrompt.value = props.prompt
    return
  }
  typePrompt()
}

const resetDemo = () => {
  clearTimers()
  const video = videoElement.value
  if (video) {
    video.pause()
    video.currentTime = 0
  }
  demoState.value = 'idle'
  isTyping.value = false
  displayedPrompt.value = hasTyped.value ? props.prompt : ''
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
    preparePrompt()
  }
}

const submitDemo = () => {
  if (!props.isActive || demoState.value !== 'idle') return
  completePrompt()
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
      return
    }
    preparePrompt()
  },
)

watch(
  () => props.prompt,
  () => {
    hasTyped.value = false
    displayedPrompt.value = ''
    preparePrompt()
  },
)

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isVisible.value = true
    preparePrompt()
    return
  }

  visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry?.isIntersecting ?? false
      if (isVisible.value) preparePrompt()
    },
    { threshold: 0.45 },
  )
  visibilityObserver.observe(surfaceElement.value!)
})

onBeforeUnmount(() => {
  clearTimers()
  visibilityObserver?.disconnect()
  videoElement.value?.pause()
})
</script>

<style scoped lang="less">
.product-demo-surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 42%, rgba(45, 58, 76, 0.13), transparent 48%), #0d0f13;
}

.demo-idle-layer,
.demo-running-layer {
  position: absolute;
  inset: 0;
}

.demo-idle-layer {
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  opacity: 1;
  transform: scale(1);
  transform-origin: 82% 68%;
  transition:
    opacity 180ms ease,
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 260ms ease;
}

.demo-composer {
  width: min(520px, 100%);
  min-height: 112px;
  overflow: hidden;
  border: 1px solid rgba(162, 180, 202, 0.15);
  border-radius: 13px;
  background: rgba(20, 23, 29, 0.96);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.24);
}

.demo-prompt {
  min-height: 64px;
  padding: 18px 18px 12px;
  color: #dce5ef;
  font-size: 14px;
  line-height: 22px;
}

.demo-caret {
  display: inline-block;
  width: 1px;
  height: 14px;
  margin-left: 2px;
  background: #8fa1b5;
  vertical-align: -2px;
  animation: caret-blink 900ms steps(1, end) infinite;
}

.demo-composer-footer {
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 18px;
  border-top: 1px solid rgba(162, 180, 202, 0.09);
  color: #718298;
  font-size: 11px;
  line-height: 18px;
}

.demo-send,
.demo-replay {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #0d1117;
  background: #e7edf5;
  font: inherit;
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 180ms ease,
    background 180ms ease,
    transform 180ms ease;

  &:hover:not(:disabled) {
    color: #07121b;
    background: #ffffff;
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.38;
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
  object-position: center top;
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

@keyframes caret-blink {
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-idle-layer,
  .demo-running-layer,
  .demo-send,
  .demo-replay {
    animation: none;
    transition: none;
  }
}
</style>
