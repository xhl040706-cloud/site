<template>
  <header
    class="home-header"
    :class="{ 'without-notice': !showNotice, 'is-morphing': scrollProgress > 0 }"
    :style="navStyle"
  >
    <div v-if="showNotice" class="notice-bar">
      <AugustDeveloperMonthBanner embedded />
      <button
        class="notice-close"
        type="button"
        :aria-label="t('home.redesign.header.closeNotice')"
        @click="dismissNotice"
      >
        ×
      </button>
    </div>

    <div class="main-nav-row">
      <div class="main-nav-inner">
        <button class="brand-anchor" type="button" @click="toHome">
          <img src="@/assets/logo.webp" alt="" />
          <span>CoStrict</span>
        </button>

        <nav
          class="nav-pill"
          :class="{ 'is-morphing': scrollProgress > 0 }"
          aria-label="Primary navigation"
        >
          <ProductMenu class="home-product-menu" />
          <button
            class="nav-pill-item"
            :class="{ active: activeNav === 'pricing' }"
            type="button"
            @click="toRoute('pricing')"
          >
            {{ t('home.redesign.header.pricing') }}
          </button>
          <a class="nav-pill-item" :href="docsUrl" target="_blank" rel="noopener">
            {{ t('home.redesign.header.docs') }}
          </a>
          <button
            class="nav-pill-item"
            :class="{ active: activeNav === 'blog' }"
            type="button"
            @click="toRoute('blog')"
          >
            {{ t('home.redesign.header.blog') }}
          </button>
          <button
            class="nav-pill-item"
            :class="{ active: activeNav === 'operation' }"
            type="button"
            @click="toRoute('operation')"
          >
            {{ t('home.redesign.header.activity') }}
          </button>
          <button class="nav-pill-item" type="button" @click="toEnterprise">
            {{ t('home.redesign.header.enterprise') }}
          </button>
        </nav>

        <div class="actions-anchor" :class="{ 'is-morphing': scrollProgress > 0 }">
          <GithubStars />
          <LanguageSwitcher
            :is-open="isLanguageSwitcherOpen"
            :is-pricing-page="false"
            :is-ccf-competition-page="false"
            @update:is-open="handleLanguageSwitcherUpdate"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import GithubStars from '@/components/navbar/GithubStars.vue'
import LanguageSwitcher from '@/components/navbar/LanguageSwitcher.vue'
import ProductMenu from '@/components/navbar/ProductMenu.vue'
import AugustDeveloperMonthBanner from './AugustDeveloperMonthBanner.vue'

defineOptions({
  name: 'HomeHeader',
})

const { t, locale } = useI18n()
const router = useRouter()
const showNotice = ref(true)
const scrollProgress = ref(0)
const isLanguageSwitcherOpen = ref(false)
let scrollFrame = 0
const docsUrl = computed(() => `https://docs.costrict.ai${locale.value === 'en' ? '/en' : ''}`)
const NOTICE_HEIGHT = 34
const NAV_MORPH_DISTANCE = 72
const GLASS_REVEAL_START = 48

const navStyle = computed<Record<string, string>>(() => {
  const progress = scrollProgress.value
  const morphProgress = progress * progress
  const scrollDistance = progress * NAV_MORPH_DISTANCE
  const glassProgress = Math.min(
    1,
    Math.max(0, (scrollDistance - GLASS_REVEAL_START) / (NAV_MORPH_DISTANCE - GLASS_REVEAL_START)),
  )
  const glassReveal = glassProgress * glassProgress
  const originTop = showNotice.value ? NOTICE_HEIGHT : 0
  const lerp = (from: number, to: number) => from + (to - from) * morphProgress

  return {
    '--nav-top': `${originTop + (14 - originTop) * progress}px`,
    '--nav-height': `${lerp(60, 48)}px`,
    '--nav-padding': `${lerp(0, 18)}px`,
    '--nav-gap': `${lerp(28, 24)}px`,
    '--nav-background-alpha': `${0.52 * glassReveal}`,
    '--nav-border-alpha': `${0.1 * glassReveal}`,
    '--nav-blur': `${18 * glassReveal}px`,
    '--nav-saturation': `${100 + 25 * glassReveal}%`,
    '--nav-shadow-alpha': `${0.26 * glassReveal}`,
    '--nav-highlight-alpha': `${0.055 * glassReveal}`,
    '--brand-opacity': `${1 - progress}`,
  }
})

const activeNav = computed(() => {
  const name = router.currentRoute.value.name as string
  if (name === 'blogDetail') return 'blog'
  if (['home', 'download', 'pricing', 'blog', 'operation'].includes(name)) return name
  return ''
})

const toHome = () => {
  if (router.currentRoute.value.name === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  router.push({ name: 'home' })
}
const toRoute = (name: string) => router.push({ name })
const toEnterprise = () =>
  window.open('https://docs.costrict.ai/deployment/introduction/', '_blank', 'noopener')

const updateScrollState = () => {
  scrollProgress.value = Math.min(1, Math.max(0, window.scrollY / NAV_MORPH_DISTANCE))
}

const handleScroll = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    updateScrollState()
  })
}

const dismissNotice = () => {
  showNotice.value = false
  updateScrollState()
}

const handleLanguageSwitcherUpdate = (value: boolean) => {
  isLanguageSwitcherOpen.value = value
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})
</script>

<style scoped lang="less">
.home-header {
  position: relative;
  z-index: var(--z-navbar);
  height: 94px;
  background: var(--color-home-bg);

  &.without-notice {
    height: 60px;
  }

  &.is-morphing {
    background: transparent;

    .main-nav-row {
      background: transparent;
    }
  }
}

.notice-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 34px;
  background: #0b8f7b;
}

.notice-close {
  padding: 0;
  border: 0;
  color: #dcfff7;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.notice-close {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: max(var(--home-page-gutter), calc((100% - var(--home-content-max-width)) / 2));
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  color: rgba(247, 255, 253, 0.76);
  font-size: 18px;
  line-height: 1;
  transform: translateY(-50%);

  &:hover,
  &:focus-visible {
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }
}

.main-nav-row {
  position: relative;
  width: 100%;
  height: 60px;
  background: var(--color-home-bg);
}

.main-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(var(--home-content-max-width), calc(100% - 160px));
  height: 60px;
  margin: 0 auto;
}

.brand-anchor {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  padding: 0;
  border: 0;
  color: #f4f6f8;
  background: transparent;
  font: inherit;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  white-space: nowrap;
  cursor: pointer;
  opacity: var(--brand-opacity);
  img {
    width: 28px;
    height: 28px;
  }
}

.nav-pill {
  position: absolute;
  z-index: var(--z-navbar);
  top: 0;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 28px;
  box-sizing: border-box;
  height: 60px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  transform: translateX(-50%);
  transition:
    top 420ms cubic-bezier(0.22, 1, 0.36, 1),
    gap 420ms cubic-bezier(0.22, 1, 0.36, 1),
    height 420ms cubic-bezier(0.22, 1, 0.36, 1),
    padding 420ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 420ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 420ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1),
    backdrop-filter 420ms cubic-bezier(0.22, 1, 0.36, 1);

  &.is-morphing {
    position: fixed;
    top: var(--nav-top);
    gap: var(--nav-gap);
    height: var(--nav-height);
    padding: 0 var(--nav-padding);
    border: 1px solid rgba(255, 255, 255, var(--nav-border-alpha));
    border-radius: 999px;
    background: rgba(14, 16, 19, var(--nav-background-alpha));
    box-shadow:
      0 10px 36px rgba(0, 0, 0, var(--nav-shadow-alpha)),
      inset 0 1px 0 rgba(255, 255, 255, var(--nav-highlight-alpha));
    backdrop-filter: blur(var(--nav-blur)) saturate(var(--nav-saturation));
    -webkit-backdrop-filter: blur(var(--nav-blur)) saturate(var(--nav-saturation));
  }
}

.nav-pill-item {
  padding: 0;
  border: 0;
  color: #a4afbb;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition: color 200ms ease;

  &:hover,
  &.active {
    color: #ffffff;
  }

  &:focus-visible {
    color: #ffffff;
    border-radius: 4px;
    outline: 1px solid rgba(255, 255, 255, 0.28);
    outline-offset: 4px;
  }
}

.home-product-menu {
  :deep(.product-trigger) {
    gap: 4px;
    padding: 0;
    color: #a4afbb;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    transition: color 200ms ease;

    &:hover,
    &.is-open,
    &.is-active {
      color: #ffffff;
    }

    &:focus-visible {
      border-radius: 4px;
      outline: 1px solid rgba(255, 255, 255, 0.28);
      outline-offset: 4px;
    }
  }

  :deep(.trigger-arrow) {
    width: 9px;
    height: 9px;
    opacity: 0.72;
  }

  :deep(.product-panel) {
    top: calc(100% + 14px);
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(14, 17, 21, 0.94);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(18px) saturate(115%);
    -webkit-backdrop-filter: blur(18px) saturate(115%);
  }

  :deep(.product-item:hover .icon-box),
  :deep(.product-item.is-active .icon-box) {
    border-color: rgba(61, 114, 255, 0.48);
    box-shadow: none;
  }

  :deep(.icon-glow) {
    display: none;
  }
}

.actions-anchor {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 60px;
  transition:
    top 420ms cubic-bezier(0.22, 1, 0.36, 1),
    height 420ms cubic-bezier(0.22, 1, 0.36, 1);

  &.is-morphing {
    position: fixed;
    z-index: var(--z-navbar);
    top: var(--nav-top);
    right: max(32px, calc((100vw - var(--home-content-max-width)) / 2));
    height: var(--nav-height);
  }

  :deep(.github-icon) {
    margin: 0;
    color: #a4afbb;
    opacity: 1;

    &:hover {
      color: #ffffff;
    }
  }

  :deep(.github-svg) {
    width: 18px;
    height: 18px;
  }

  :deep(.star-count) {
    margin-left: 6px;
    color: #a4afbb;
    font-size: 13px;
  }

  :deep(.language-trigger) {
    gap: 6px;
    padding: 0;
    color: #a4afbb;
    font-size: 14px;
    line-height: 22px;
    transition: color 200ms ease;

    &:hover {
      color: #ffffff;
      background: transparent;
    }
  }

  :deep(.language-trigger .arrow) {
    margin-left: 0;
    color: currentColor;
    font-size: 8px;
    opacity: 0.72;
  }
}

@media (max-width: 1023px) {
  .main-nav-inner {
    width: calc(100% - 64px);
  }

  .nav-pill {
    display: none;
  }
}

@media (max-width: 767px) {
  .notice-bar {
    gap: 12px;
    padding: 0 var(--home-page-gutter);
    font-size: 12px;
  }

  .notice-close {
    right: var(--home-page-gutter);
  }

  .main-nav-inner {
    width: calc(100% - 48px);
  }

  .brand-anchor {
    span {
      display: none;
    }
  }

  .actions-anchor {
    gap: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill,
  .nav-pill-item {
    transition: none;
  }
}
</style>
