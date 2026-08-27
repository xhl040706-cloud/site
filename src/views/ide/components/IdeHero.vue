<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ideProductImageZh from '@/assets/ide/hero-vscode-zh.webp'
import ideProductImageEn from '@/assets/ide/hero-vscode-en.webp'

defineOptions({
  name: 'IdeHero',
})

const { t, locale } = useI18n()
const docsUrl = computed(() => `https://docs.costrict.ai${locale.value === 'en' ? '/en' : ''}`)
const heroProductImage = computed(() =>
  locale.value === 'en' ? ideProductImageEn : ideProductImageZh,
)
</script>

<template>
  <section class="ide-hero" aria-labelledby="ide-hero-title">
    <div class="hero-inner">
      <div class="hero-copy" :class="{ 'is-english': locale === 'en' }">
        <div class="product-tag">
          <i aria-hidden="true"></i>
          <span>{{ t('ide.hero.eyebrow') }}</span>
        </div>

        <h1 id="ide-hero-title">
          <span>{{ t('ide.hero.titleLine1') }}</span>
          <span>{{ t('ide.hero.titleLine2') }}</span>
        </h1>

        <p class="hero-description">{{ t('ide.hero.description') }}</p>

        <div class="hero-actions">
          <RouterLink
            class="hero-button primary-button"
            :to="{ name: 'download', query: { tab: 'vscode' } }"
          >
            <span>{{ t('ide.hero.primaryCta') }}</span>
            <i aria-hidden="true">→</i>
          </RouterLink>
          <a class="hero-button secondary-button" :href="docsUrl" target="_blank" rel="noopener">
            <span>{{ t('ide.hero.docsCta') }}</span>
            <i aria-hidden="true">→</i>
          </a>
        </div>
      </div>

      <div class="hero-visual">
        <img class="hero-product-shot" :src="heroProductImage" :alt="t('ide.hero.imageAlt')" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.ide-hero {
  display: flex;
  min-height: 540px;
  align-items: center;
  overflow: clip;
  padding: 60px 0 32px;
  color: #f3f7fb;
  background: #050505;
}

.hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 580px) minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  width: min(1760px, calc(100% - 96px));
  margin: 0 auto;
}

.hero-copy {
  width: 100%;
  max-width: 580px;
  animation: hero-copy-enter 650ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.product-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #16dec2;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0;

  i {
    width: 18px;
    height: 1px;
    background: #16dec2;
  }
}

h1 {
  margin: 22px 0 0;
  color: #f3f7fb;
  font-size: 56px;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: 1px;

  span {
    display: block;
    white-space: nowrap;
  }
}

.hero-copy.is-english h1 {
  font-size: 50px;
}

.hero-description {
  max-width: 520px;
  margin: 26px 0 0;
  color: #8495aa;
  font-size: 18px;
  line-height: 30px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.hero-button {
  display: inline-flex;
  width: 216px;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-1px);
  }
}

.primary-button {
  border: 1px solid #16dec2;
  color: #031410;
  background: #16dec2;

  &:hover,
  &:focus-visible {
    border-color: #45e8d0;
    background: #45e8d0;
  }
}

.secondary-button {
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #d8e0e6;
  background: transparent;

  &:hover,
  &:focus-visible {
    border-color: rgba(255, 255, 255, 0.26);
    background: rgba(255, 255, 255, 0.05);
  }
}

.hero-button i {
  font-size: 15px;
  font-style: normal;
  transition: transform 180ms ease;
}

.hero-button:hover i,
.hero-button:focus-visible i {
  transform: translateX(2px);
}

.hero-visual {
  display: grid;
  width: min(100%, 920px);
  justify-self: center;
  place-items: center;
}

.hero-product-shot {
  display: block;
  width: 105%;
  max-width: none;
  height: auto;
}

@keyframes hero-copy-enter {
  from {
    opacity: 0;
    transform: translateY(18px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1199px) {
  .ide-hero {
    min-height: 580px;
    padding: 68px 0 44px;
  }

  .hero-inner {
    width: min(1280px, calc(100% - (2 * var(--home-page-gutter))));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px;
  }

  h1 {
    font-size: 46px;
    line-height: 1.1;
    letter-spacing: 0.8px;

    span {
      white-space: normal;
    }
  }

  .hero-copy.is-english h1 {
    font-size: 42px;
  }
}

@media (max-width: 1099px) {
  .hero-inner {
    gap: 40px;
  }

  h1 {
    font-size: 42px;
    letter-spacing: 0.6px;
  }

  .hero-copy.is-english h1 {
    font-size: 38px;
  }
}

@media (max-width: 999px) {
  .ide-hero {
    min-height: 0;
    padding: 88px 0 56px;
  }

  .hero-inner {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }

  .hero-copy {
    max-width: 660px;
  }

  .hero-description {
    max-width: 600px;
  }

  .hero-visual {
    width: 100%;
    max-width: 720px;
    justify-self: start;
    place-items: center;
  }

  .hero-product-shot {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .ide-hero {
    padding: 72px 0 36px;
  }

  .hero-inner {
    gap: 32px;
  }

  h1 {
    margin-top: 18px;
    font-size: 34px;
    line-height: 1.16;
    letter-spacing: 0.5px;
  }

  .hero-copy.is-english h1 {
    font-size: 32px;
  }

  .hero-description {
    margin-top: 22px;
    font-size: 16px;
    line-height: 28px;
  }

  .hero-actions {
    margin-top: 28px;
  }

  .hero-button {
    padding: 0 16px;
    font-size: 13px;
  }

  .hero-actions {
    gap: 10px;
  }

  .hero-button {
    width: auto;
    min-width: 152px;
  }
}

@media (max-width: 479px) {
  h1 {
    font-size: 32px;
  }

  .hero-copy.is-english h1 {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy {
    animation: none;
  }

  .hero-button,
  .hero-button i {
    transition: none;
  }
}
</style>
