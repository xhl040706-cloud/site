<template>
  <section id="products" class="product-environment" aria-labelledby="product-environment-title">
    <div class="section-inner">
      <header class="section-heading" data-home-reveal="heading">
        <h2 id="product-environment-title">
          <span class="product-title-line">
            <span>{{ productTitle.before }}</span>
            <span id="product-logo-dock" class="product-logo-dock" aria-hidden="true">
              <img :src="logoSvgUrl" alt="" />
            </span>
            <span>{{ productTitle.after }}</span>
          </span>
        </h2>
        <p>{{ t('home.redesign.products.subtitle') }}</p>
      </header>

      <div
        ref="productGrid"
        class="product-grid"
        data-home-reveal="content"
        @mouseleave="resetActiveProduct"
        @focusout="handleGridFocusOut"
      >
        <article
          v-for="product in products"
          :key="product.key"
          class="product-card"
          :class="{
            expanded: activeProduct === product.key,
            collapsed: activeProduct !== product.key,
          }"
          tabindex="0"
          :aria-expanded="activeProduct === product.key"
          @mouseenter="setActiveProduct(product.key)"
          @focusin="setActiveProduct(product.key)"
          @keydown.enter.prevent="setActiveProduct(product.key)"
          @keydown.space.prevent="setActiveProduct(product.key)"
        >
          <div class="product-visual" :class="`product-visual-${product.key}`">
            <div class="product-visual-stage">
              <ProductDemoSurface
                v-if="product.key === 'cloud'"
                :is-active="activeProduct === product.key"
                :prompt="t('home.redesign.products.cloud.demoPrompt')"
                :replay-label="t('home.redesign.products.cloud.replayDemo')"
                :video-src="cloudDemoVideoUrl"
              />
              <img
                v-else
                class="product-image"
                :src="product.imageSrc"
                :alt="product.name"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div class="product-copy">
            <p class="product-name">{{ product.name }}</p>
            <h3>{{ product.title }}</h3>
            <div class="product-detail">
              <p class="product-description">{{ product.description }}</p>
              <button type="button" @click="openProduct(product.key)">
                {{ product.action }} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import cloudImageUrl from '@/assets/home/redesign/s3-cloud-main.webp'
import cliImageUrl from '@/assets/home/redesign/s3-cli-costrict.webp'
import cliImageEnUrl from '@/assets/home/redesign/s3-cli-costrict-en.webp'
import ideImageUrl from '@/assets/home/redesign/s3-ide-main.webp'
import ideImageEnUrl from '@/assets/home/redesign/s3-ide-main-en.webp'
import logoSvgUrl from '@/assets/logo3d/costrict-symbol.svg?url'
import cloudDemoVideoUrl from '@/assets/video/cloud-run-demo.mp4'
import ProductDemoSurface from './ProductDemoSurface.vue'

defineOptions({
  name: 'ProductEnvironment',
})

type ProductKey = 'cloud' | 'cli' | 'ide'
type ProductImageKey = Exclude<ProductKey, 'cloud'>
type ProductLocale = 'zh' | 'en'

interface ProductCard {
  key: ProductKey
  name: string
  title: string
  description: string
  action: string
  imageSrc: string
}

const PRODUCT_IMAGES: Record<ProductImageKey, Record<ProductLocale, string>> = {
  cli: {
    zh: cliImageUrl,
    en: cliImageEnUrl,
  },
  ide: {
    zh: ideImageUrl,
    en: ideImageEnUrl,
  },
}

const { t, locale } = useI18n()
const router = useRouter()
const productGrid = useTemplateRef<HTMLElement>('productGrid')
const activeProduct = ref<ProductKey>('cloud')
const productLocale = computed<ProductLocale>(() => (locale.value === 'en' ? 'en' : 'zh'))

const productTitle = computed(() => {
  const title = t('home.redesign.products.title')
  const [before = title, ...afterParts] = title.split('CoStrict')

  return {
    before: before.trim(),
    after: afterParts.length ? `CoStrict${afterParts.join('CoStrict')}`.trim() : '',
  }
})

const products = computed<ProductCard[]>(() =>
  (['ide', 'cloud', 'cli'] as const).map((key) => ({
    key,
    name: t(`home.redesign.products.${key}.name`),
    title: t(`home.redesign.products.${key}.title`),
    description: t(`home.redesign.products.${key}.description`),
    action: t(`home.redesign.products.${key}.action`),
    imageSrc: key === 'cloud' ? cloudImageUrl : PRODUCT_IMAGES[key][productLocale.value],
  })),
)

const openProduct = (key: ProductKey) => {
  if (key === 'cloud') {
    window.open('https://zgsm.sangfor.com/', '_blank', 'noopener')
    return
  }

  router.push({
    name: 'download',
    query: key === 'cli' ? { product: 'cli', tab: 'cli' } : { product: 'ide', tab: 'vscode' },
  })
}

const setActiveProduct = (key: ProductKey) => {
  activeProduct.value = key
}

const resetActiveProduct = () => {
  activeProduct.value = 'cloud'
}

const handleGridFocusOut = (event: FocusEvent) => {
  if (event.relatedTarget instanceof Node && productGrid.value?.contains(event.relatedTarget))
    return
  resetActiveProduct()
}
</script>

<style scoped lang="less">
.product-environment {
  position: relative;
  z-index: 1;
  padding: 72px 0 108px;
  color: var(--color-home-text);
  background: var(--color-home-bg);
}

.section-inner {
  position: relative;
  z-index: 1;
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

.section-heading {
  h2 {
    overflow: hidden;
    margin: 0;
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0;

    > .product-title-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      min-height: 48px;
      column-gap: 10px;
      transform: translateY(110%);
      transition: transform 700ms var(--ease-out-expo);
    }
  }

  p {
    margin: 16px 0 0;
    max-width: 760px;
    color: var(--color-home-body);
    font-size: 15px;
    line-height: 26px;
    letter-spacing: 0;
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity var(--motion-slow) var(--ease-out-expo) 100ms,
      transform var(--motion-slow) var(--ease-out-expo) 100ms;
  }

  &.is-revealed h2 > .product-title-line {
    transform: translateY(0);
  }

  &.is-revealed p {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-logo-dock {
  position: relative;
  display: inline-flex;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;

  img {
    display: none;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.section-heading[data-home-reveal],
.product-grid[data-home-reveal] {
  opacity: 1;
  transform: none;
  transition: none;
}

.product-grid {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;
}

.product-card {
  position: relative;
  z-index: 1;
  flex-basis: 0;
  min-width: 0;
  opacity: 0;
  outline: none;
  transition:
    flex-grow var(--motion-slow) var(--ease-out-expo),
    opacity 700ms var(--ease-out-expo),
    transform 700ms var(--ease-out-expo);

  &:nth-child(1) {
    transform: translateX(-28px);
  }

  &:nth-child(2) {
    transform: scale(0.97);
    transition-delay: 60ms;
  }

  &:nth-child(3) {
    transform: translateX(28px);
    transition-delay: 120ms;
  }

  &:focus-visible .product-visual {
    box-shadow: 0 0 0 2px rgba(170, 190, 215, 0.24);
  }

  .product-copy {
    position: relative;
    box-sizing: border-box;
    height: 124px;
    padding-top: 16px;
  }

  .product-name {
    margin: 0;
    color: #65788f;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }

  h3 {
    margin: 4px 0 0;
    color: #dce5ef;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    letter-spacing: 0;
    transition: color var(--motion-fast) ease;
  }

  .product-detail {
    position: absolute;
    top: 66px;
    right: 0;
    left: 0;
  }

  .product-description {
    margin: 8px 0 0;
    color: #8fa1b5;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0;
    opacity: 1;
    transform: translateY(0);
    transition:
      opacity 220ms ease 300ms,
      transform 220ms var(--ease-out-expo) 300ms,
      visibility 0s linear 300ms;
    visibility: visible;
  }

  .product-detail > button {
    margin-top: 12px;
    padding: 0;
    border: 0;
    color: #afc6dd;
    background: transparent;
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    cursor: pointer;
    opacity: 1;
    transform: translateY(0);
    transition:
      color var(--motion-fast) ease,
      opacity 200ms ease 360ms,
      transform 200ms var(--ease-out-expo) 360ms,
      visibility 0s linear 360ms;
    visibility: visible;

    span {
      display: inline-block;
      margin-left: 4px;
      transition: transform 200ms ease;
    }

    &:hover {
      color: #f3f7fb;
    }

    &:hover span {
      transform: translateX(2px);
    }
  }
}

.product-grid.is-revealed .product-card {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.product-visual {
  position: relative;
  height: 390px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  background: linear-gradient(180deg, #0b0d10, #060708);
  box-shadow: none;
  transition:
    border-color var(--motion-base) ease,
    box-shadow var(--motion-base) ease;
}

.product-visual-stage {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: var(--stage-left);
  width: var(--stage-width);
  overflow: hidden;
  border-radius: 18px;
  background: #090d14;
  opacity: 1;
  transform: translate3d(-50%, 0, 0);
  transform-origin: center;
  transition:
    width var(--motion-slow) var(--ease-out-expo),
    left var(--motion-slow) var(--ease-out-expo),
    transform var(--motion-base) var(--ease-out-expo);
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  background: #0d1016;
  filter: saturate(0.92) brightness(0.93) contrast(1.025);
  opacity: 1;
  transition:
    filter var(--motion-base) ease,
    opacity var(--motion-base) ease,
    transform var(--motion-base) var(--ease-out-expo);
}

.product-demo-surface {
  opacity: 1;
  transition:
    filter var(--motion-base) ease,
    opacity var(--motion-base) ease;
}

.product-visual-cloud {
  --stage-width: 100%;
  --stage-left: 50%;
  --stage-fixed-width: 670px;
  --stage-collapsed-left: 50%;
  --stage-collapsed-translate-x: -42%;

  .product-image {
    object-position: 58% 12%;
    transform: scale(1.06);
    transform-origin: 62% 36%;
  }
}

.product-visual-cli {
  --stage-width: 100%;
  --stage-left: 50%;
  --stage-fixed-width: 627px;
  --stage-collapsed-left: 0;
  --stage-collapsed-translate-x: 0;

  .product-image {
    object-position: left top;
    transform: scale(1.05);
    transform-origin: left 24%;
  }
}

.product-visual-ide {
  --stage-width: 100%;
  --stage-left: 50%;
  --stage-fixed-width: 684px;
  --stage-collapsed-left: 100%;
  --stage-collapsed-translate-x: -100%;

  .product-image {
    object-position: right 8%;
    transform: scale(1.035);
    transform-origin: right top;
  }
}

@media (min-width: 1100px) {
  .product-grid {
    display: flex;
  }

  .product-card {
    flex-grow: 1;

    &.expanded {
      flex-grow: 2.7;

      .product-visual {
        border-color: rgba(170, 190, 215, 0.12);
        box-shadow:
          0 28px 80px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.035);
      }

      .product-image {
        filter: saturate(0.92) brightness(0.93) contrast(1.025);
        opacity: 1;
      }

      .product-visual-cli .product-image {
        transform: scale(1.1);
      }

      h3 {
        color: #f3f7fb;
      }
    }

    &.collapsed {
      .product-visual {
        border-color: rgba(170, 190, 215, 0.07);
        box-shadow: none;
      }

      .product-visual-stage {
        left: var(--stage-collapsed-left);
        width: var(--stage-fixed-width);
        transform: translate3d(var(--stage-collapsed-translate-x), 0, 0);
      }

      .product-image {
        filter: saturate(0.72) brightness(0.62) contrast(1.02);
        opacity: 0.82;
      }

      .product-demo-surface {
        filter: saturate(0.78) brightness(0.7) contrast(1.02);
        opacity: 0.84;
      }

      h3 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .product-description {
        opacity: 0;
        pointer-events: none;
        transform: translateY(4px);
        transition:
          opacity 120ms ease,
          transform 120ms ease,
          visibility 0s linear 120ms;
        visibility: hidden;
      }

      .product-detail > button {
        opacity: 0;
        pointer-events: none;
        transform: translateY(4px);
        transition:
          color var(--motion-fast) ease,
          opacity 120ms ease,
          transform 120ms ease,
          visibility 0s linear 120ms;
        visibility: hidden;
      }
    }
  }
}

@media (max-width: 1023px) {
  .product-environment {
    padding: 96px 0;
  }

  .product-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }

  .product-card {
    display: block;
    min-height: 0;
    transform: none;

    &:nth-child(n) {
      transform: none;
    }

    .product-copy {
      height: auto;
      padding-top: 14px;
    }

    .product-detail {
      position: static;
    }

    .product-description {
      margin-top: 8px;
    }

    .product-detail > button {
      display: inline-flex;
      margin-top: 12px;
    }
  }
}

@media (max-height: 900px) and (min-width: 1100px) {
  .section-heading p {
    line-height: 24px;
  }
}

@media (max-width: 767px) {
  .section-heading h2 {
    font-size: 34px;
    line-height: 44px;
  }

  .product-logo-dock {
    flex-basis: 40px;
    width: 40px;
    height: 40px;
  }

  .product-visual {
    height: auto;
    aspect-ratio: 1.28 / 1;
  }

  .product-visual-stage {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card h3,
  .product-visual,
  .product-visual > *,
  .product-image,
  .product-description,
  .product-detail > button {
    animation: none;
    transition: none;
  }

  .section-heading h2 > .product-title-line,
  .section-heading p,
  .product-card {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .product-logo-dock img {
    display: block;
  }
}
</style>
