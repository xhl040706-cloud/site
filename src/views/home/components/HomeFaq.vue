<template>
  <section id="faq" class="home-faq" aria-labelledby="home-faq-title">
    <div class="faq-texture faq-texture-left" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-left.webp" alt="" />
    </div>
    <div class="faq-texture faq-texture-right" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-right.webp" alt="" />
    </div>

    <div class="faq-inner">
      <header class="faq-heading" data-home-reveal="heading">
        <h2 id="home-faq-title">{{ t('home.redesign.faq.title') }}</h2>
        <p>{{ t('home.redesign.faq.subtitle') }}</p>
      </header>

      <div class="faq-list" data-home-reveal="content">
        <article
          v-for="(item, index) in faqItems"
          :key="item.key"
          class="faq-item"
          :class="{ 'is-open': openIndex === index }"
        >
          <button
            class="faq-question"
            type="button"
            :aria-expanded="openIndex === index"
            :aria-controls="`faq-answer-${index}`"
            @click="toggle(index)"
          >
            <span class="faq-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="faq-question-text">{{ item.question }}</span>
            <span class="faq-toggle" aria-hidden="true">
              <span class="faq-toggle-icon"></span>
            </span>
          </button>
          <div :id="`faq-answer-${index}`" class="faq-answer">
            <div class="faq-answer-inner">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'HomeFaq',
})

interface FaqItem {
  key: string
  question: string
  answer: string
}

const { t } = useI18n()
const openIndex = ref(0)
const faqKeys = ['entry', 'installation', 'team', 'security', 'pricing'] as const
const faqItems = computed<FaqItem[]>(() =>
  faqKeys.map((key) => ({
    key,
    question: t(`home.redesign.faq.items.${key}.question`),
    answer: t(`home.redesign.faq.items.${key}.answer`),
  })),
)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<style scoped lang="less">
.home-faq {
  position: relative;
  overflow: hidden;
  padding: 96px 0 92px;
  background: #050505;
}

.faq-inner {
  position: relative;
  z-index: 1;
  width: min(960px, calc(100% - 48px));
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
  left: -150px;
  width: 440px;
  opacity: 0.055;

  img {
    filter: brightness(0.72) saturate(0.6) contrast(1.04);
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 42% 50%, #000 18%, transparent 72%);
    mask-image: radial-gradient(ellipse 75% 70% at 42% 50%, #000 18%, transparent 72%);
  }
}

.faq-texture-right {
  right: -140px;
  bottom: 20px;
  width: 420px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 44px;
}

.faq-item {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 14px;
  background: #090b0e;
  transition:
    background 220ms ease,
    border-color 220ms ease;

  &::before {
    position: absolute;
    top: 0;
    right: 28px;
    left: 28px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(55, 199, 232, 0.4), transparent);
    content: '';
    opacity: 0;
    transition: opacity 260ms ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.11);
    background: #0c0f13;
  }

  &.is-open {
    border-color: rgba(255, 255, 255, 0.12);
    background: #0c0f13;

    &::before {
      opacity: 1;
    }
  }
}

.faq-index {
  flex: none;
  width: 30px;
  color: #536276;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  transition: color 220ms ease;

  .faq-item.is-open & {
    color: var(--color-home-brand-cyan);
  }
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 72px;
  padding: 0 22px 0 24px;
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.faq-question-text {
  flex: 1;
  color: #dce5ef;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  transition: color 220ms ease;

  .faq-question:hover & {
    color: #ffffff;
  }
}

.faq-toggle {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  color: #778493;
  background: rgba(255, 255, 255, 0.04);
  transition:
    color 220ms ease,
    background 220ms ease;

  .faq-question:hover & {
    color: #dce5ef;
    background: rgba(255, 255, 255, 0.07);
  }
}

.faq-toggle-icon {
  position: relative;
  display: block;
  width: 12px;
  height: 12px;

  &::before,
  &::after {
    position: absolute;
    content: '';
    border-radius: 1px;
    background: currentColor;
  }

  &::before {
    top: 50%;
    left: 0;
    width: 12px;
    height: 1.6px;
    margin-top: -0.8px;
  }

  &::after {
    top: 0;
    left: 50%;
    width: 1.6px;
    height: 12px;
    margin-left: -0.8px;
    transform-origin: center;
    transition:
      transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 200ms ease;
  }

  .faq-item.is-open & {
    &::after {
      opacity: 0;
      transform: scaleY(0);
    }
  }
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 260ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);

  .faq-item.is-open & {
    grid-template-rows: 1fr;
    opacity: 1;
  }
}

.faq-answer-inner {
  min-height: 0;
  overflow: hidden;

  p {
    max-width: 720px;
    margin: 0;
    padding: 0 64px 22px 70px;
    color: #8495aa;
    font-size: 14px;
    line-height: 24px;
  }
}

@media (max-width: 767px) {
  .home-faq {
    padding: 80px 24px;
  }

  .faq-inner {
    width: 100%;
  }

  .faq-heading h2 {
    font-size: 32px;
    line-height: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item,
  .faq-question-text,
  .faq-toggle,
  .faq-toggle-icon::after,
  .faq-answer {
    transition: none;
  }
}
</style>
