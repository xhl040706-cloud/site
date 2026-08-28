<template>
  <section class="home-final-cta" aria-labelledby="final-cta-title">
    <div class="cta-texture cta-texture-left" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-left.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="cta-texture cta-texture-right" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-right.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="cta-particles" aria-hidden="true">
      <ParticleField variant="closing" :interactive="false" />
    </div>

    <div class="cta-inner" data-home-reveal="content">
      <div class="cta-content">
        <h2 id="final-cta-title">{{ t('home.redesign.finalCta.title') }}</h2>
        <p>{{ t('home.redesign.finalCta.description') }}</p>
        <div class="cta-actions">
          <button class="cta-button cta-button-primary" type="button" @click="toCloud">
            {{ t('home.redesign.finalCta.primary') }}
          </button>
          <div
            ref="downloadMenu"
            class="cta-download"
            @pointerenter="handleDownloadPointerEnter"
            @pointerleave="handleDownloadPointerLeave"
          >
            <button
              ref="downloadTrigger"
              class="cta-button cta-button-secondary cta-download-trigger"
              :class="{ 'is-open': isDownloadMenuOpen }"
              type="button"
              aria-haspopup="menu"
              aria-controls="final-cta-download-menu"
              :aria-expanded="isDownloadMenuOpen"
              @click="toggleDownloadMenu"
              @keydown.down.prevent="openDownloadMenu(true)"
            >
              {{ t('home.redesign.finalCta.secondary') }}
              <svg class="cta-download-chevron" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M5.5 7L9 10.5L12.5 7" />
              </svg>
            </button>

            <Transition name="cta-download-menu">
              <div
                v-if="isDownloadMenuOpen"
                id="final-cta-download-menu"
                class="cta-download-menu"
                role="menu"
                :aria-label="t('home.redesign.finalCta.secondary')"
                @keydown="handleDownloadMenuKeydown"
              >
                <button
                  v-for="item in downloadItems"
                  :key="item.key"
                  class="cta-download-item"
                  type="button"
                  role="menuitem"
                  @click="selectDownload(item.key)"
                >
                  <span class="cta-download-item-icon" aria-hidden="true">
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
                  <span class="cta-download-item-copy">
                    <strong>{{ item.title }}</strong>
                    <span>{{ item.description }}</span>
                  </span>
                  <svg class="cta-download-item-arrow" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M4.5 2.5L8 6L4.5 9.5" />
                  </svg>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ParticleField from '@/components/particle/ParticleField.vue'

defineOptions({
  name: 'HomeFinalCta',
})

const { t } = useI18n()
const router = useRouter()
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
let downloadCloseTimer = 0

const focusDownloadItem = (index: number) => {
  const items = downloadMenu.value?.querySelectorAll<HTMLButtonElement>('.cta-download-item')
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
  if (key === 'cli') {
    router.push({ name: 'CliIndex' })
    return
  }

  router.push({
    name: 'download',
    query: { product: 'ide', tab: 'vscode' },
  })
}

const handleDownloadMenuKeydown = (event: KeyboardEvent) => {
  const items = Array.from(
    downloadMenu.value?.querySelectorAll<HTMLButtonElement>('.cta-download-item') ?? [],
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

onMounted(() => {
  window.addEventListener('pointerdown', handleDownloadOutside)
  window.addEventListener('keydown', handleDownloadEscape)
})

onBeforeUnmount(() => {
  if (downloadCloseTimer) window.clearTimeout(downloadCloseTimer)
  window.removeEventListener('pointerdown', handleDownloadOutside)
  window.removeEventListener('keydown', handleDownloadEscape)
})

const toCloud = () => window.open('https://zgsm.sangfor.com/', '_blank', 'noopener')
</script>

<style scoped lang="less">
.home-final-cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 440px;
  box-sizing: border-box;
  overflow: visible;
  background: #050505;
}

.cta-inner {
  position: relative;
  z-index: 2;
  width: min(760px, calc(100% - 48px));
  margin: 0 auto;
  transform: translateY(58px);
}

.cta-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  transform: translateY(8px);

  h2 {
    max-width: 760px;
    margin: 0;
    color: #f3f7fb;
    font-size: 42px;
    font-weight: 600;
    line-height: 52px;
  }

  p {
    margin: 16px 0 0;
    color: #8495aa;
    font-size: 16px;
    line-height: 28px;
  }
}

.cta-actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
  margin-top: 26px;
}

.cta-button {
  height: 46px;
  padding: 0 22px;
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
    filter var(--motion-fast) ease;

  &:focus-visible {
    outline: 2px solid rgba(101, 207, 230, 0.62);
    outline-offset: 2px;
  }

  span {
    display: inline-block;
    margin-left: 4px;
  }
}

.cta-button-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #347fff 0%, #279fe9 55%, #22c7d9 100%);
  box-shadow:
    0 9px 26px rgba(43, 143, 242, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background: linear-gradient(135deg, #438bff 0%, #33aaef 55%, #2dd3e2 100%);
    filter: brightness(1.05);
  }
}

.cta-download {
  position: relative;
  display: flex;
}

.cta-button-secondary {
  border: 1px solid rgba(255, 255, 255, 0.11);
  color: #edf2f7;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.065);
  }
}

.cta-download-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  &.is-open {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.07);
  }
}

.cta-download-chevron {
  width: 18px;
  height: 18px;
  margin-left: 0 !important;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform var(--motion-fast) ease;

  .is-open & {
    transform: rotate(180deg);
  }
}

.cta-download-menu {
  position: absolute;
  z-index: 10;
  top: calc(100% + 10px);
  left: 50%;
  width: min(300px, calc(100vw - 48px));
  overflow: hidden;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(10, 14, 20, 0.98);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38);
  transform: translateX(-50%);
}

.cta-download-item {
  display: grid;
  width: 100%;
  grid-template-columns: 34px minmax(0, 1fr) 12px;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  color: #edf2f7;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--motion-fast) ease;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.065);
    outline: none;
  }
}

.cta-download-item-icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(76, 186, 226, 0.16);
  border-radius: 8px;
  color: #79d4e6;
  background: rgba(37, 137, 177, 0.08);

  svg {
    width: 19px;
    height: 19px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.cta-download-item-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  span {
    color: #7f8da1;
    font-size: 12px;
    line-height: 17px;
  }
}

.cta-download-item-arrow {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: #68778b;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cta-download-menu-enter-active,
.cta-download-menu-leave-active {
  transition:
    opacity 160ms ease,
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.cta-download-menu-enter-from,
.cta-download-menu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

.cta-texture {
  position: absolute;
  z-index: 0;
  pointer-events: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    filter: brightness(0.74) saturate(0.62) contrast(1.04);
    -webkit-mask-image: radial-gradient(ellipse 72% 68% at 50% 50%, #000 22%, transparent 74%);
    mask-image: radial-gradient(ellipse 72% 68% at 50% 50%, #000 22%, transparent 74%);
  }
}

.cta-texture-left {
  top: 18%;
  left: -160px;
  width: 520px;
  opacity: 0.08;
}

.cta-texture-right {
  top: 14%;
  right: -150px;
  width: 500px;
  opacity: 0.075;
}

.cta-particles {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 66%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 66%, transparent 100%);
}

@media (max-width: 767px) {
  .home-final-cta {
    min-height: 480px;
    padding: 0 24px;
  }

  .cta-inner {
    width: 100%;
    transform: translateY(42px);

    h2 {
      font-size: 34px;
      line-height: 44px;
    }
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-texture-left {
    left: -140px;
    width: 300px;
  }

  .cta-texture-right {
    right: -130px;
    width: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-button,
  .cta-download-chevron,
  .cta-download-item,
  .cta-download-menu-enter-active,
  .cta-download-menu-leave-active {
    transition: none;
  }
}
</style>
