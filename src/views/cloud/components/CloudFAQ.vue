<template>
  <section id="faq" class="cloud-faq" aria-labelledby="cloud-faq-title">
    <div class="faq-texture faq-texture-left" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-left.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="faq-texture faq-texture-right" aria-hidden="true">
      <img
        src="@/assets/home/redesign/hero-texture-right.webp"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="faq-inner">
      <header class="faq-heading">
        <h2 id="cloud-faq-title">{{ t('cloud.faq.title') }}</h2>
        <p>{{ t('cloud.faq.lead') }}</p>
      </header>

      <div class="faq-list">
        <article v-for="(item, index) in faqItems" :key="item.key" class="faq-item">
          <span class="faq-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="faq-content">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'CloudFAQ',
})

interface FaqItem {
  key: number
  question: string
  answer: string
}

const { t } = useI18n()
const faqItems = computed<FaqItem[]>(() =>
  [0, 1, 2, 3].map((key) => ({
    key,
    question: t(`cloud.faq.items.${key}.title`),
    answer: t(`cloud.faq.items.${key}.answer`),
  })),
)
</script>

<style scoped lang="less">
.cloud-faq {
  position: relative;
  overflow: hidden;
  padding: 96px 0 0;
  background: transparent;
}

.faq-inner {
  position: relative;
  z-index: 1;
  width: min(1080px, calc(100% - 48px));
  margin: 0 auto;
}

.faq-texture {
  position: absolute;
  z-index: 0;
  pointer-events: none;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.faq-texture-left {
  top: 80px;
  left: -140px;
  width: 440px;
  opacity: 0.05;

  img {
    filter: brightness(0.72) saturate(0.6) contrast(1.04);
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 42% 50%, #000 18%, transparent 72%);
    mask-image: radial-gradient(ellipse 75% 70% at 42% 50%, #000 18%, transparent 72%);
  }
}

.faq-texture-right {
  right: -120px;
  bottom: 20px;
  width: 400px;
  opacity: 0.045;

  img {
    filter: brightness(0.7) saturate(0.58) contrast(1.04);
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 58% 50%, #000 18%, transparent 72%);
    mask-image: radial-gradient(ellipse 75% 70% at 58% 50%, #000 18%, transparent 72%);
  }
}

.faq-heading {
  text-align: center;

  h2 {
    margin: 0;
    color: #f3f7fb;
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
  }

  p {
    max-width: 620px;
    margin: 14px auto 0;
    color: #8495aa;
    font-size: 15px;
    line-height: 26px;
  }
}

.faq-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 48px;
  margin-top: 40px;
}

.faq-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 14px;
  padding: 22px 2px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.faq-index {
  color: #12e6c2;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 11.5px;
  line-height: 23px;
  font-variant-numeric: tabular-nums;
}

.faq-content {
  h3 {
    margin: 0;
    color: #dce5ef;
    font-size: 15px;
    font-weight: 500;
    line-height: 23px;
  }

  p {
    margin: 8px 0 0;
    color: #718196;
    font-size: 13px;
    line-height: 22px;
  }
}

@media (max-width: 767px) {
  .cloud-faq {
    padding: 80px 24px 0;
  }

  .faq-inner {
    width: 100%;
  }

  .faq-heading h2 {
    font-size: 32px;
    line-height: 40px;
  }

  .faq-list {
    grid-template-columns: 1fr;
    margin-top: 32px;
  }

  .faq-item {
    padding: 18px 0 20px;
  }
}
</style>
