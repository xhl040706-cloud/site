<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import CliTerminalFrame from './CliTerminalFrame.vue'
import { CLI_COMMAND_INSTALL_NPM } from '../../download/constants'
import { CLI_DOCS_URL, CLI_START_COMMAND } from '../constants'
import cliBrandLogo from '@/assets/cli/costrict-terminal-logo.webp'

type TerminalStreamStepKind = 'response' | 'receipt' | 'success'

interface TerminalStreamStep {
  kind: TerminalStreamStepKind
  textKey: string
}

interface TerminalStreamTask {
  promptKey: string
  steps: TerminalStreamStep[]
}

const PRIMARY_STREAM_TASK: TerminalStreamTask = {
  promptKey: 'cli.hero.terminalTaskPrompt',
  steps: [
    { kind: 'response', textKey: 'cli.hero.terminalTaskResponseOne' },
    { kind: 'receipt', textKey: 'cli.hero.terminalTaskReceiptOne' },
    { kind: 'response', textKey: 'cli.hero.terminalTaskResponseTwo' },
    { kind: 'success', textKey: 'cli.hero.terminalTaskReceiptTwo' },
  ],
}

const STREAM_TASKS: TerminalStreamTask[] = [
  PRIMARY_STREAM_TASK,
  {
    promptKey: 'cli.hero.terminalTaskTwoPrompt',
    steps: [
      { kind: 'response', textKey: 'cli.hero.terminalTaskTwoResponseOne' },
      { kind: 'receipt', textKey: 'cli.hero.terminalTaskTwoReceiptOne' },
      { kind: 'response', textKey: 'cli.hero.terminalTaskTwoResponseTwo' },
      { kind: 'success', textKey: 'cli.hero.terminalTaskTwoReceiptTwo' },
    ],
  },
  {
    promptKey: 'cli.hero.terminalTaskThreePrompt',
    steps: [
      { kind: 'response', textKey: 'cli.hero.terminalTaskThreeResponseOne' },
      { kind: 'receipt', textKey: 'cli.hero.terminalTaskThreeReceiptOne' },
      { kind: 'response', textKey: 'cli.hero.terminalTaskThreeResponseTwo' },
      { kind: 'success', textKey: 'cli.hero.terminalTaskThreeReceiptTwo' },
    ],
  },
]

defineOptions({
  name: 'CliHero',
})

const { t, locale } = useI18n()
const message = useMessage()
const typedChars = ref(0)
const isTyped = ref(false)
const streamTaskIndex = ref(0)
const visibleStreamEntries = ref(0)
const streamCycle = ref(0)
const typedCommand = CLI_START_COMMAND
let typeTimer: ReturnType<typeof window.setInterval> | undefined
let initialOutputTimer: ReturnType<typeof window.setTimeout> | undefined
let streamTimer: ReturnType<typeof window.setTimeout> | undefined

const docsUrl = computed(
  () => `${CLI_DOCS_URL}${locale.value === 'en' ? '/en' : ''}/cli/guide/installation`,
)
const currentStreamTask = computed(() => STREAM_TASKS[streamTaskIndex.value] ?? PRIMARY_STREAM_TASK)
const streamHasStaticPrompt = computed(() => streamTaskIndex.value === 0)
const streamEntryCount = computed(() => currentStreamTask.value.steps.length + 1)
const visibleStreamSteps = computed(() =>
  currentStreamTask.value.steps.slice(0, Math.max(visibleStreamEntries.value - 1, 0)),
)
const streamIsComplete = computed(() => visibleStreamEntries.value >= streamEntryCount.value)

const clearStreamTimer = () => {
  if (streamTimer) window.clearTimeout(streamTimer)
  streamTimer = undefined
}

const advanceStream = () => {
  if (visibleStreamEntries.value < streamEntryCount.value) {
    visibleStreamEntries.value += 1
    streamTimer = window.setTimeout(advanceStream, 780)
    return
  }

  streamTimer = window.setTimeout(() => {
    streamTaskIndex.value = (streamTaskIndex.value + 1) % STREAM_TASKS.length
    streamCycle.value += 1
    visibleStreamEntries.value = 0
    streamTimer = window.setTimeout(advanceStream, 360)
  }, 1900)
}

const startStream = () => {
  clearStreamTimer()
  visibleStreamEntries.value = 0
  streamTimer = window.setTimeout(advanceStream, 360)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedChars.value = typedCommand.length
    isTyped.value = true
    visibleStreamEntries.value = streamEntryCount.value
    return
  }

  typeTimer = window.setInterval(() => {
    typedChars.value += 1
    if (typedChars.value >= typedCommand.length) {
      if (typeTimer) window.clearInterval(typeTimer)
      typeTimer = undefined
      initialOutputTimer = window.setTimeout(() => {
        isTyped.value = true
        startStream()
      }, 240)
    }
  }, 170)
})

onBeforeUnmount(() => {
  if (typeTimer) window.clearInterval(typeTimer)
  if (initialOutputTimer) window.clearTimeout(initialOutputTimer)
  clearStreamTimer()
})

const copyInstallCommand = async () => {
  try {
    await navigator.clipboard.writeText(CLI_COMMAND_INSTALL_NPM)
    message.success(t('download.copySuccess'))
  } catch {
    message.error(t('download.copyFailed'))
  }
}
</script>

<template>
  <section class="cli-hero" aria-labelledby="cli-hero-title">
    <div class="hero-inner">
      <h1 id="cli-hero-title" data-home-reveal="heading">{{ t('cli.hero.title') }}</h1>
      <p class="hero-description" data-home-reveal="heading">
        {{ t('cli.hero.description') }}
      </p>
      <div class="hero-terminal" data-home-reveal="content">
        <CliTerminalFrame title="~/work/costrict-site">
          <div class="terminal-scroll">
            <div class="terminal-line terminal-login">
              {{ t('cli.hero.terminalLastLogin') }}
            </div>
            <div class="terminal-line terminal-cmd">
              <span class="terminal-user">developer@macbook-pro</span>
              <span class="terminal-path">~ %</span>
              <span class="cmd-text">{{ typedCommand.slice(0, typedChars) }}</span>
              <span class="terminal-cursor" :class="{ idle: isTyped }" aria-hidden="true"></span>
            </div>

            <div class="terminal-output" :class="{ shown: isTyped }">
              <div class="terminal-brand" aria-label="CoStrict">
                <img :src="cliBrandLogo" alt="" aria-hidden="true" />
              </div>

              <div class="terminal-details">
                <div class="terminal-detail-row">
                  <span class="detail-label">[{{ t('cli.hero.terminalVersionLabel') }}]</span>
                  <span>{{ t('cli.hero.terminalVersionValue') }}</span>
                </div>
                <div class="terminal-detail-row">
                  <span class="detail-label">[{{ t('cli.hero.terminalModelLabel') }}]</span>
                  <span>{{ t('cli.hero.terminalModelValue') }}</span>
                </div>
                <div class="terminal-detail-row">
                  <span class="detail-label">[{{ t('cli.hero.terminalAccountLabel') }}]</span>
                  <span>{{ t('cli.hero.terminalAccountValue') }}</span>
                </div>
              </div>

              <div class="terminal-divider" aria-hidden="true"></div>

              <div class="terminal-line terminal-help">
                <span class="detail-label">[{{ t('cli.hero.terminalMessageLabel') }}]</span>
                <span>{{ t('cli.hero.terminalMessageValue') }}</span>
              </div>

              <div class="terminal-line terminal-user-prompt">
                <span class="terminal-prompt-bar" aria-hidden="true"></span>
                <span class="terminal-you">[{{ t('cli.hero.terminalYouLabel') }}]</span>
                <span class="terminal-chevron">&gt;&gt;</span>
                <span
                  v-if="streamHasStaticPrompt && visibleStreamEntries > 0"
                  :key="streamCycle"
                  class="terminal-task-prompt terminal-primary-task-prompt"
                >
                  {{ t(currentStreamTask.promptKey) }}
                </span>
              </div>

              <div :key="streamCycle" class="terminal-task">
                <div
                  v-if="!streamHasStaticPrompt && visibleStreamEntries > 0"
                  class="terminal-task-prompt"
                >
                  {{ t(currentStreamTask.promptKey) }}
                </div>

                <template
                  v-for="(step, index) in visibleStreamSteps"
                  :key="`${streamCycle}-${index}`"
                >
                  <div v-if="step.kind === 'response'" class="terminal-task-response">
                    <span class="terminal-bullet" aria-hidden="true">●</span>
                    <span>{{ t(step.textKey) }}</span>
                  </div>
                  <div
                    v-else
                    class="terminal-task-receipt"
                    :class="{ 'terminal-task-success': step.kind === 'success' }"
                  >
                    {{ t(step.textKey) }}
                  </div>
                </template>

                <div
                  v-if="visibleStreamEntries > 0 && !streamIsComplete"
                  class="terminal-stream-live"
                >
                  <span class="terminal-stream-cursor" aria-hidden="true"></span>
                </div>

                <div v-else-if="streamIsComplete" class="terminal-line terminal-hint">
                  <span class="terminal-agent">[costrict]</span>
                  <span class="terminal-chevron">&gt;&gt;</span>
                  <span class="terminal-input-cursor" aria-hidden="true"></span>
                </div>
              </div>
            </div>
          </div>

          <div class="terminal-status" :class="{ shown: isTyped }">
            <span class="status-chip status-model">
              <span class="status-value">GLM-5.3-Zhipu</span>
            </span>
            <span class="status-separator" aria-hidden="true">|</span>
            <span class="status-chip">
              <span class="status-label">{{ t('cli.hero.terminalContextLabel') }}</span>
              <span class="status-value status-accent">0%</span>
              <span class="status-value">(0/200k)</span>
            </span>
            <span class="status-separator" aria-hidden="true">|</span>
            <span class="status-chip">
              <span class="status-label">{{ t('cli.hero.terminalCacheLabel') }}</span>
              <span class="status-value">--%</span>
            </span>
            <span class="status-separator" aria-hidden="true">|</span>
            <span class="status-chip">
              <span class="status-label">{{ t('cli.hero.terminalReasoningLabel') }}</span>
              <span class="status-value">{{ t('cli.hero.terminalReasoningValue') }}</span>
            </span>
            <span class="status-right">422.8MB · pid: 6884</span>
          </div>
        </CliTerminalFrame>

        <div class="hero-install-command">
          <span class="terminal-install-label">{{ t('cli.install.universalLabel') }}</span>
          <div class="terminal-command-row">
            <span class="terminal-prompt">$</span>
            <code class="terminal-command">{{ CLI_COMMAND_INSTALL_NPM }}</code>
            <button
              class="terminal-install-button"
              type="button"
              :aria-label="t('download.copyCommand')"
              @click="copyInstallCommand"
            >
              {{ t('cli.hero.installCta') }}
            </button>
          </div>
          <a class="terminal-docs-link" :href="docsUrl" target="_blank" rel="noopener">
            <span>{{ t('cli.install.docsLink') }}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.cli-hero {
  position: relative;
  overflow: hidden;
  padding: 120px 0 44px;
  background: #050505;

  &::before {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 46% 40% at 50% 66%, rgba(55, 199, 232, 0.05), transparent 70%),
      radial-gradient(ellipse 40% 34% at 50% 62%, rgba(62, 141, 255, 0.035), transparent 72%);
    content: '';
    pointer-events: none;
  }
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(1160px, calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
  text-align: center;
}

h1 {
  max-width: 860px;
  margin: 0;
  color: #f3f7fb;
  font-size: 50px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 62px;
}

.hero-description {
  max-width: 720px;
  margin: 18px 0 0;
  color: #9fb0c3;
  font-size: 17px;
  line-height: 29px;
}

.hero-terminal {
  width: 100%;
  margin-top: 68px;
  text-align: left;

  :deep(.cli-terminal-frame) {
    height: clamp(610px, 68vh, 650px);
  }
}

.hero-install-command {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  margin-top: 12px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.018);
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

.terminal-install-label {
  color: #8fa0b3;
  font-family: inherit;
  font-size: 11px;
  line-height: 18px;
  white-space: nowrap;
}

.terminal-scroll {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 18px 24px 16px;
  font-size: 13px;
  line-height: 21px;
  overflow: auto;
}

.terminal-command-row {
  display: flex;
  min-width: 0;
  gap: 10px;
  align-items: center;
}

.terminal-prompt {
  flex: none;
  color: #12e6c2;
  font-weight: 700;
}

.terminal-command {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  color: #dce6f0;
  font: inherit;
  font-size: 12.5px;
  line-height: 20px;
  scrollbar-width: none;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
}

.terminal-install-button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 13px;
  border: 1px solid rgba(18, 230, 194, 0.75);
  border-radius: 6px;
  color: #041512;
  background: #12e6c2;
  font: inherit;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition:
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    color var(--motion-fast) ease;

  &:hover {
    border-color: #6ff4dc;
    background: #6ff4dc;
  }
}

.terminal-docs-link {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  color: #aebed0;
  font-family: inherit;
  font-size: 11.5px;
  line-height: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--motion-fast) ease;

  &:hover,
  &:focus-visible {
    color: #12e6c2;
  }
}

.terminal-output {
  .terminal-brand,
  .terminal-details,
  .terminal-divider,
  .terminal-line {
    opacity: 0;
    transform: translateY(4px);
    transition:
      opacity 420ms var(--ease-out-expo),
      transform 420ms var(--ease-out-expo);
  }

  &.shown {
    .terminal-brand,
    .terminal-details,
    .terminal-divider,
    .terminal-line {
      opacity: 1;
      transform: none;
    }
  }
}

.terminal-line {
  display: flex;
  gap: 8px;
  align-items: baseline;
  white-space: pre;
}

.terminal-login {
  color: #75879d;
}

.terminal-cmd {
  margin-top: 2px;
  color: #e8eef5;
  font-weight: 500;
}

.terminal-user {
  color: #e7edf5;
}

.terminal-path {
  color: #8799ae;
}

.terminal-cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background: #37c7e8;
  opacity: 0.9;
  transform: translateY(2px);

  &.idle {
    animation: cli-cursor-blink 1.1s steps(1) infinite;
  }
}

.terminal-brand {
  display: block;
  width: min(64%, 640px);
  align-self: flex-start;
  margin: 14px 0 10px;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.terminal-details {
  display: grid;
  gap: 1px;
  color: #aebbd0;
}

.terminal-detail-row {
  display: flex;
  gap: 10px;
  min-width: max-content;
}

.detail-label {
  color: #c8d3e6;
  font-weight: 600;
}

.terminal-divider {
  width: 100%;
  height: 1px;
  margin: 10px 0;
  background: linear-gradient(90deg, #aebbd0 0%, #506176 65%, transparent 100%);
  opacity: 0.55;
}

.terminal-help {
  color: #aebbd0;
}

.terminal-user-prompt {
  gap: 7px;
  margin-top: 18px;
  color: #edf3f9;
  font-weight: 600;
}

.terminal-prompt-bar {
  display: inline-block;
  width: 2px;
  height: 16px;
  margin-right: 2px;
  background: #12e6c2;
  box-shadow: 0 0 8px rgba(18, 230, 194, 0.24);
  transform: translateY(3px);
}

.terminal-you {
  padding: 0 3px;
  border-radius: 3px;
  color: #071914;
  background: #12e6c2;
  font-weight: 700;
  line-height: 17px;
}

.terminal-task {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.terminal-task-prompt {
  color: #edf3f9;
  font-weight: 600;
}

.terminal-task-response {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  color: #e3eaf2;
  font-weight: 500;
  line-height: 22px;
}

.terminal-bullet {
  flex: none;
  color: #ffffff;
  font-size: 11px;
  line-height: 22px;
}

.terminal-task-receipt {
  padding-left: 18px;
  color: #77899f;
  font-size: 12px;
  line-height: 19px;
}

.terminal-task-success {
  color: #50d2b1;
}

.terminal-stream-live {
  display: flex;
  align-items: center;
  height: 21px;
  padding-left: 18px;
}

.terminal-stream-cursor {
  width: 7px;
  height: 14px;
  background: #12e6c2;
  box-shadow: 0 0 9px rgba(18, 230, 194, 0.36);
  animation: cli-cursor-blink 1.1s steps(1) infinite;
}

.terminal-hint {
  color: #e5edf8;
  font-weight: 500;
}

.terminal-agent,
.terminal-chevron {
  color: #12e6c2;
  font-weight: 700;
}

.terminal-input-cursor {
  display: inline-block;
  width: 7px;
  height: 14px;
  margin-left: 2px;
  background: #12e6c2;
  transform: translateY(2px);
  animation: cli-cursor-blink 1.1s steps(1) infinite;
}

.terminal-status {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: auto;
  padding: 10px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.055);
  background: rgba(255, 255, 255, 0.016);
  font-size: 11px;
  opacity: 0;
  overflow-x: auto;
  transition: opacity 520ms ease 720ms;

  &.shown {
    opacity: 1;
  }
}

.status-chip {
  display: inline-flex;
  gap: 6px;
  white-space: nowrap;
}

.status-label {
  color: #73859a;
}

.status-value {
  color: #bdc9da;
}

.status-model .status-value,
.status-accent {
  color: #12e6c2;
}

.status-separator {
  color: #46576b;
}

.status-right {
  margin-left: auto;
  color: #65778c;
  white-space: nowrap;
}

@keyframes cli-cursor-blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 1023px) {
  h1 {
    font-size: 40px;
    line-height: 52px;
  }

  .status-right {
    display: none;
  }
}

@media (max-width: 767px) {
  .cli-hero {
    padding: 76px 0 32px;
  }

  h1 {
    font-size: 31px;
    line-height: 42px;
  }

  .hero-description {
    font-size: 15px;
    line-height: 26px;
  }

  .hero-terminal {
    margin-top: 64px;

    :deep(.cli-terminal-frame) {
      height: 530px;
    }
  }

  .hero-install-command {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    padding: 9px 10px 10px;
  }

  .terminal-docs-link {
    justify-self: start;
  }

  .terminal-scroll {
    padding: 14px 14px 16px;
    font-size: 11.5px;
    line-height: 19px;
  }

  .terminal-brand {
    width: min(76%, 420px);
    margin: 10px 0 8px;
  }

  .terminal-detail-row {
    min-width: 0;
  }

  .terminal-detail-row span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .terminal-help,
  .terminal-user-prompt,
  .terminal-hint {
    align-items: flex-start;
    white-space: normal;
  }

  .terminal-user-prompt {
    gap: 6px;
    margin-top: 14px;
  }

  .terminal-prompt-bar {
    height: 14px;
  }

  .terminal-task {
    gap: 8px;
    margin-top: 14px;
  }

  .terminal-task-response {
    gap: 7px;
    line-height: 19px;
  }

  .terminal-bullet {
    line-height: 19px;
  }

  .terminal-task-receipt {
    padding-left: 16px;
    font-size: 10.5px;
    line-height: 17px;
  }

  .terminal-stream-live {
    height: 19px;
    padding-left: 16px;
  }

  .terminal-status {
    gap: 7px;
    padding: 9px 12px;
    font-size: 9.5px;
  }

  .terminal-command {
    font-size: 11px;
  }

  .terminal-install-button {
    height: 30px;
    padding: 0 10px;
    font-size: 10.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-output .terminal-brand,
  .terminal-output .terminal-details,
  .terminal-output .terminal-divider,
  .terminal-output .terminal-line,
  .terminal-install-button,
  .terminal-docs-link,
  .terminal-status {
    transition: none;
  }

  .terminal-cursor,
  .terminal-input-cursor,
  .terminal-stream-cursor {
    animation: none;
  }
}
</style>
