<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import modelProviderLogos from '@/assets/ide/model-logos/model-provider-logos.svg'

defineOptions({
  name: 'IdeShowcaseBento',
})

interface ModelEntry {
  name: string
  logoClass: string
  nodeClass: string
}

interface ExtensionCapability {
  name: string
  position: string
}

const { t, locale } = useI18n()

const models: ModelEntry[] = [
  { name: 'Kimi', logoClass: 'logo-kimi', nodeClass: 'provider-kimi' },
  { name: 'GLM', logoClass: 'logo-glm', nodeClass: 'provider-glm' },
  { name: 'DeepSeek', logoClass: 'logo-deepseek', nodeClass: 'provider-deepseek' },
  { name: 'Qwen', logoClass: 'logo-qwen', nodeClass: 'provider-qwen' },
  { name: 'MiniMax', logoClass: 'logo-minimax', nodeClass: 'provider-minimax' },
  { name: 'Stepfun', logoClass: 'logo-stepfun', nodeClass: 'provider-stepfun' },
  { name: 'Xiaomi', logoClass: 'logo-xiaomi', nodeClass: 'provider-xiaomi' },
]

const extensionCapabilities: ExtensionCapability[] = [
  { name: 'MCP', position: 'node-top-left' },
  { name: 'Skill', position: 'node-top-right' },
  { name: 'Slash Command', position: 'node-bottom-left' },
  { name: 'Rules', position: 'node-bottom-right' },
]
const workModes = [
  { name: 'Code', icon: 'code' },
  { name: 'Ask', icon: 'message' },
  { name: 'Orchestrator', icon: 'maximize' },
] as const
</script>

<template>
  <section class="ide-showcase" aria-labelledby="ide-showcase-title">
    <div class="showcase-inner">
      <header class="section-heading" data-home-reveal="heading">
        <h2 id="ide-showcase-title">{{ t('ide.capabilities.title') }}</h2>
      </header>

      <div class="ecosystem-grid" data-home-reveal="content">
        <article class="ecosystem-card model-card" :class="{ 'is-english': locale === 'en' }">
          <div class="model-section">
            <h3>{{ t('ide.capabilities.model.title') }}</h3>

            <div class="model-orbit">
              <span class="model-orbit-track" aria-hidden="true"></span>
              <span class="model-orbit-core" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none">
                  <path d="M16 7 8.5 11.5v9L16 25l7.5-4.5v-9L16 7Z" />
                  <circle cx="16" cy="16" r="3" />
                  <circle cx="16" cy="7" r="1.5" />
                  <circle cx="8.5" cy="20.5" r="1.5" />
                  <circle cx="23.5" cy="20.5" r="1.5" />
                </svg>
                <strong>Models</strong>
              </span>

              <ul class="model-list" :aria-label="t('ide.capabilities.model.listLabel')">
                <li v-for="model in models" :key="model.name" :class="model.nodeClass">
                  <span class="provider-content">
                    <span class="model-logo" aria-hidden="true">
                      <img :src="modelProviderLogos" alt="" :class="model.logoClass" />
                    </span>
                    <strong>{{ model.name }}</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div class="api-section">
            <h4>{{ t('ide.capabilities.model.apiTitle') }}</h4>
            <p>{{ t('ide.capabilities.model.apiDescription') }}</p>
          </div>
        </article>

        <article class="ecosystem-card agent-card">
          <h3>{{ t('ide.capabilities.agent.title') }}</h3>
          <p class="agent-description">{{ t('ide.capabilities.agent.description') }}</p>

          <div class="agent-composition">
            <div class="network-stage" :aria-label="t('ide.capabilities.agent.capabilityLabel')">
              <svg class="network-lines" viewBox="0 0 420 236" aria-hidden="true">
                <path d="M88 52 L210 118" />
                <path d="M332 52 L210 118" />
                <path d="M88 184 L210 118" />
                <path d="M332 184 L210 118" />
                <circle cx="210" cy="118" r="5" />
              </svg>

              <div class="agent-core" aria-hidden="true">
                <span>CoStrict</span>
                <strong>Agent</strong>
              </div>

              <code
                v-for="capability in extensionCapabilities"
                :key="capability.name"
                class="network-node"
                :class="capability.position"
              >
                <i aria-hidden="true"></i>
                {{ capability.name }}
              </code>
            </div>

            <div class="mode-layer">
              <span class="layer-label">{{ t('ide.capabilities.agent.modeLabel') }}</span>
              <div class="mode-list">
                <code v-for="mode in workModes" :key="mode.name">
                  <svg
                    v-if="mode.icon === 'message'"
                    class="ask-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <line class="ask-dot ask-dot-one" x1="16" y1="12" x2="16" y2="12" />
                      <line class="ask-dot ask-dot-two" x1="12" y1="12" x2="12" y2="12" />
                      <line class="ask-dot ask-dot-three" x1="8" y1="12" x2="8" y2="12" />
                    </g>
                  </svg>
                  <svg
                    v-else-if="mode.icon === 'code'"
                    class="code-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <g>
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <path class="code-bracket code-bracket-left" d="M10 9.5 8 12l2 2.5" />
                      <path class="code-bracket code-bracket-right" d="m14 9.5 2 2.5-2 2.5" />
                    </g>
                  </svg>
                  <svg
                    v-else-if="mode.icon === 'maximize'"
                    class="orchestrator-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path class="orchestrator-corner corner-top-left" d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path
                      class="orchestrator-corner corner-top-right"
                      d="M21 8V5a2 2 0 0 0-2-2h-3"
                    />
                    <path
                      class="orchestrator-corner corner-bottom-left"
                      d="M3 16v3a2 2 0 0 0 2 2h3"
                    />
                    <path
                      class="orchestrator-corner corner-bottom-right"
                      d="M16 21h3a2 2 0 0 0 2-2v-3"
                    />
                  </svg>
                  <i v-else aria-hidden="true">&gt;</i>
                  {{ mode.name }}
                </code>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.ide-showcase {
  padding: 64px 0;
  color: #eef4fa;
  background: #050505;
}

.showcase-inner {
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

.section-heading {
  h2 {
    margin: 0;
    color: #f0f5f8;
    font-size: 40px;
    font-weight: 600;
    line-height: 50px;
    letter-spacing: 0;
  }
}

.ecosystem-grid {
  display: grid;
  max-width: 1180px;
  grid-template-columns: minmax(0, 0.92fr) minmax(400px, 1.08fr);
  gap: 20px;
  align-items: stretch;
  margin: 42px auto 0;
}

.ecosystem-card {
  min-width: 0;
  min-height: 570px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  background: #0a0d10;
}

.model-card {
  display: flex;
  min-height: 520px;
  flex-direction: column;
  padding: 28px;

  &.is-english .model-orbit {
    contain: layout;
    transform: scale(0.84);
    transform-origin: center;
  }
}

.model-section {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  margin-top: 0;

  h3 {
    margin: 0;
    color: #e8eef3;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
  }
}

.model-orbit {
  --orbit-offset: -104px;

  position: relative;
  min-height: 240px;
  flex: 1;
  margin-top: 14px;
  contain: layout paint;
  isolation: isolate;
}

.model-orbit-track,
.model-orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.model-orbit-track {
  z-index: 0;
  width: 208px;
  height: 208px;
  border: 1px dashed rgba(18, 230, 194, 0.2);
  border-radius: 50%;
  opacity: 0.72;
  background: radial-gradient(circle, rgba(18, 230, 194, 0.055), transparent 64%);

  &::before,
  &::after {
    position: absolute;
    border-radius: 50%;
    content: '';
  }

  &::before {
    inset: 15px;
    border: 1px solid rgba(255, 255, 255, 0.045);
  }

  &::after {
    top: -2px;
    left: 50%;
    width: 5px;
    height: 5px;
    background: #12e6c2;
    box-shadow: 0 0 14px rgba(18, 230, 194, 0.68);
    transform: translateX(-50%);
  }
}

.model-orbit-core {
  z-index: 3;
  display: flex;
  width: 54px;
  height: 54px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(18, 230, 194, 0.34);
  border-radius: 50%;
  background: #0d1316;
  box-shadow:
    0 0 0 5px rgba(18, 230, 194, 0.035),
    0 12px 24px rgba(0, 0, 0, 0.34),
    0 0 18px rgba(18, 230, 194, 0.08);

  svg {
    width: 20px;
    height: 20px;
    overflow: visible;
    stroke: #12e6c2;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  strong {
    margin-top: 2px;
    color: #dce8eb;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 7px;
    font-weight: 600;
    line-height: 10px;
  }
}

.model-list {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: 72px;
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) rotate(var(--orbit-angle)) translateY(var(--orbit-offset))
      rotate(var(--orbit-counter-angle));
    backface-visibility: hidden;
    will-change: opacity, transform;
  }
}

.provider-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform;

  > strong {
    max-width: 72px;
    margin-top: 6px;
    overflow: hidden;
    color: #cbd5dd;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 9px;
    font-weight: 500;
    line-height: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.ecosystem-grid.is-revealed {
  .model-orbit-track {
    animation: orbit-track-in 520ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
  }

  .model-orbit-core {
    animation: orbit-core-spin 560ms cubic-bezier(0.22, 1, 0.36, 1) 180ms both;
  }

  .model-list li {
    animation: provider-orbit-emerge 720ms cubic-bezier(0.22, 1, 0.36, 1) var(--provider-delay) both;
  }

  .provider-content {
    animation: provider-float var(--float-duration) ease-in-out
      calc(var(--provider-delay) + 720ms + var(--float-delay)) infinite;
  }
}

.model-logo {
  position: relative;
  display: block;
  width: var(--orb-size);
  height: var(--orb-size);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  background: #edf2f7;
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.58);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;

  img {
    position: absolute;
    top: calc(50% - 15px);
    left: calc(50% - 15px);
    width: 415.625px;
    max-width: none;
    height: 30px;
  }

  .logo-glm {
    transform: translate(-64.4px, 0.75px);
  }

  .logo-deepseek {
    transform: translateX(-132.33px);
  }

  .logo-qwen {
    transform: translateX(-195.37px);
  }

  .logo-minimax {
    transform: translateX(-258.29px);
  }

  .logo-stepfun {
    transform: translateX(-324.88px);
  }

  .logo-xiaomi {
    transform: translate(-386.7px, 1.1px);
  }
}

.model-list li:hover .model-logo {
  border-color: rgba(18, 230, 194, 0.34);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, 0.36),
    0 0 0 4px rgba(18, 230, 194, 0.06);
  transform: scale(1.06);
}

.provider-kimi {
  --orbit-angle: 0deg;
  --orbit-counter-angle: 0deg;
  --provider-delay: 460ms;
  --float-delay: 0ms;
  --float-duration: 4.8s;
  --float-distance: 3px;
  --orb-size: 44px;
}

.provider-glm {
  --orbit-angle: 51.43deg;
  --orbit-counter-angle: -51.43deg;
  --provider-delay: 500ms;
  --float-delay: 260ms;
  --float-duration: 5.2s;
  --float-distance: 2px;
  --orb-size: 42px;
}

.provider-deepseek {
  --orbit-angle: 102.86deg;
  --orbit-counter-angle: -102.86deg;
  --provider-delay: 540ms;
  --float-delay: 520ms;
  --float-duration: 4.6s;
  --float-distance: 3px;
  --orb-size: 48px;
}

.provider-qwen {
  --orbit-angle: 154.29deg;
  --orbit-counter-angle: -154.29deg;
  --provider-delay: 580ms;
  --float-delay: 180ms;
  --float-duration: 5s;
  --float-distance: 2px;
  --orb-size: 42px;
}

.provider-minimax {
  --orbit-angle: 205.71deg;
  --orbit-counter-angle: -205.71deg;
  --provider-delay: 620ms;
  --float-delay: 420ms;
  --float-duration: 5.4s;
  --float-distance: 3px;
  --orb-size: 44px;
}

.provider-stepfun {
  --orbit-angle: 257.14deg;
  --orbit-counter-angle: -257.14deg;
  --provider-delay: 660ms;
  --float-delay: 80ms;
  --float-duration: 4.7s;
  --float-distance: 2px;
  --orb-size: 40px;
}

.provider-xiaomi {
  --orbit-angle: 308.57deg;
  --orbit-counter-angle: -308.57deg;
  --provider-delay: 700ms;
  --float-delay: 340ms;
  --float-duration: 5.1s;
  --float-distance: 3px;
  --orb-size: 44px;
}

.api-section {
  margin-top: auto;
  padding-top: 20px;

  h4 {
    margin: 0;
    color: #dce5ec;
    font-size: 17px;
    font-weight: 600;
    line-height: 26px;
  }

  p {
    max-width: 680px;
    margin: 8px 0 0;
    color: #778490;
    font-size: 13px;
    line-height: 23px;
  }
}

.agent-card {
  display: flex;
  min-height: 520px;
  flex-direction: column;
  padding: 28px;

  > h3 {
    max-width: 360px;
    margin: 0;
    color: #e8eef3;
    font-size: 24px;
    font-weight: 600;
    line-height: 34px;
  }
}

.agent-composition {
  margin-top: 26px;
}

.network-stage {
  position: relative;
  height: 244px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 6px;
  background:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px), #080b0e;
  background-size: 32px 32px;
}

.network-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;

  path {
    fill: none;
    stroke: rgba(18, 230, 194, 0.28);
    stroke-width: 1;
    stroke-dasharray: 4 6;
    animation: network-flow 10s linear infinite;
  }

  circle {
    fill: #0a0d10;
    stroke: #12e6c2;
    stroke-width: 1.5;
  }
}

.agent-core,
.network-node {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0e1317;
}

.agent-core {
  top: 50%;
  left: 50%;
  width: 124px;
  height: 68px;
  flex-direction: column;
  border-color: rgba(18, 230, 194, 0.42);
  border-radius: 6px;
  box-shadow: 0 0 26px rgba(18, 230, 194, 0.08);
  transform: translate(-50%, -50%);

  span {
    color: #6f7d88;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 9px;
    line-height: 14px;
  }

  strong {
    color: #e7f2f2;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 15px;
    font-weight: 600;
    line-height: 22px;
  }
}

.network-node {
  width: 116px;
  height: 40px;
  gap: 8px;
  border-radius: 4px;
  color: #c5d0d8;
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 10px;
  line-height: 16px;
  transition:
    border-color 180ms ease,
    color 180ms ease,
    background 180ms ease;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #12e6c2;
    box-shadow: 0 0 0 3px rgba(18, 230, 194, 0.1);
  }

  &:hover {
    border-color: rgba(18, 230, 194, 0.42);
    color: #edf7f6;
    background: #10181b;
  }
}

.node-top-left {
  top: 30px;
  left: 20px;
}

.node-top-right {
  top: 30px;
  right: 20px;
}

.node-bottom-left {
  bottom: 30px;
  left: 20px;
}

.node-bottom-right {
  right: 20px;
  bottom: 30px;
}

.mode-layer {
  padding-top: 18px;
}

.layer-label {
  display: block;
  color: #647280;
  font-size: 10px;
  line-height: 16px;
}

.mode-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;

  code {
    display: flex;
    min-width: 0;
    height: 38px;
    gap: 7px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(79, 147, 255, 0.16);
    border-radius: 4px;
    color: #c7d2db;
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 10px;
    line-height: 16px;
    background: rgba(79, 147, 255, 0.025);

    i {
      color: #4f93ff;
      font-style: normal;
    }

    &:hover {
      border-color: rgba(79, 147, 255, 0.36);
      color: #e6eef8;
      background: rgba(79, 147, 255, 0.06);

      .ask-icon g {
        animation: ask-icon-wobble 800ms ease-in-out;
        transform-origin: 20% 80%;
      }

      .code-icon g {
        animation: ask-icon-wobble 800ms ease-in-out;
        transform-origin: 20% 80%;
      }

      .ask-dot {
        animation: ask-dot-jump 600ms ease-in-out;
      }

      .code-bracket-left {
        animation: code-bracket-left 600ms ease-in-out;
      }

      .code-bracket-right {
        animation: code-bracket-right 600ms ease-in-out;
      }

      .orchestrator-corner {
        animation: orchestrator-expand 600ms ease-in-out;
      }

      .ask-dot-one {
        animation-delay: 200ms;
      }

      .ask-dot-two {
        animation-delay: 100ms;
      }
    }
  }
}

.ask-icon,
.code-icon,
.orchestrator-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: #66a1ff;
  overflow: visible;
  stroke: currentcolor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.corner-top-left {
  --corner-x: -2px;
  --corner-y: -2px;
}

.corner-top-right {
  --corner-x: 2px;
  --corner-y: -2px;
}

.corner-bottom-left {
  --corner-x: -2px;
  --corner-y: 2px;
}

.corner-bottom-right {
  --corner-x: 2px;
  --corner-y: 2px;
}

.agent-description {
  max-width: none;
  margin: 10px 0 0;
  color: #778490;
  font-size: 13px;
  line-height: 23px;
  white-space: nowrap;
}

@keyframes orbit-track-in {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.82);
  }

  100% {
    opacity: 0.72;
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
}

@keyframes orbit-core-spin {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.72) rotate(-360deg);
  }

  100% {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) scale(1) rotate(0);
  }
}

@keyframes provider-orbit-emerge {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) rotate(calc(var(--orbit-angle) - 42deg)) translateY(0)
      rotate(calc(42deg - var(--orbit-angle))) scale(0.72);
  }

  100% {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) rotate(var(--orbit-angle)) translateY(var(--orbit-offset))
      rotate(var(--orbit-counter-angle)) scale(1);
  }
}

@keyframes provider-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(calc(-1 * var(--float-distance)));
  }
}

@keyframes network-flow {
  to {
    stroke-dashoffset: -80;
  }
}

@keyframes ask-icon-wobble {
  0%,
  100% {
    transform: rotate(0);
  }

  40% {
    transform: rotate(8deg);
  }

  60% {
    transform: rotate(-8deg);
  }

  80% {
    transform: rotate(2deg);
  }
}

@keyframes ask-dot-jump {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-1.5px);
  }
}

@keyframes code-bracket-left {
  0%,
  100% {
    transform: translateX(0);
  }

  45% {
    transform: translateX(-1.5px);
  }

  75% {
    transform: translateX(0.75px);
  }
}

@keyframes code-bracket-right {
  0%,
  100% {
    transform: translateX(0);
  }

  45% {
    transform: translateX(1.5px);
  }

  75% {
    transform: translateX(-0.75px);
  }
}

@keyframes orchestrator-expand {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(var(--corner-x), var(--corner-y));
  }
}

@media (max-width: 1023px) {
  .ecosystem-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ecosystem-card {
    min-height: 0;
  }

  .agent-description {
    white-space: normal;
  }
}

@media (max-width: 767px) {
  .ide-showcase {
    padding: 56px 0 60px;
  }

  .section-heading h2 {
    font-size: 32px;
    line-height: 42px;
  }

  .ecosystem-grid {
    gap: 14px;
    margin-top: 30px;
  }

  .ecosystem-card {
    padding: 24px;
  }

  .model-section,
  .agent-card > h3 {
    margin-top: 0;
  }

  .model-section h3,
  .agent-card > h3 {
    font-size: 21px;
    line-height: 30px;
  }

  .model-orbit {
    --orbit-offset: -68px;

    height: 220px;
    margin-top: 12px;
  }

  .model-orbit-track {
    width: 136px;
    height: 136px;
  }

  .model-orbit-core {
    width: 48px;
    height: 48px;

    svg {
      width: 19px;
      height: 19px;
    }
  }

  .model-list li {
    width: 60px;
  }

  .provider-content > strong {
    max-width: 60px;
    margin-top: 5px;
    font-size: 8px;
    line-height: 13px;
  }

  .model-logo {
    width: min(var(--orb-size), 38px);
    height: min(var(--orb-size), 38px);
  }

  .api-section {
    margin-top: 20px;
  }

  .network-stage {
    height: 232px;
  }

  .network-node {
    width: 104px;
    font-size: 9px;
  }

  .node-top-left,
  .node-bottom-left {
    left: 10px;
  }

  .node-top-right,
  .node-bottom-right {
    right: 10px;
  }

  .agent-core {
    width: 112px;
  }

  .mode-list {
    gap: 6px;

    code {
      font-size: 9px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .ecosystem-grid.is-revealed .model-orbit-track,
  .ecosystem-grid.is-revealed .model-orbit-core,
  .ecosystem-grid.is-revealed .model-list li,
  .ecosystem-grid.is-revealed .provider-content,
  .network-lines path,
  .mode-list code:hover .ask-icon g,
  .mode-list code:hover .ask-dot,
  .mode-list code:hover .code-icon g,
  .mode-list code:hover .code-bracket,
  .mode-list code:hover .orchestrator-corner {
    animation: none;
  }
}
</style>
