<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'IdeFaq',
})

const { t } = useI18n()
const FAQ_COUNT = 6
</script>

<template>
  <section class="ide-faq" aria-labelledby="ide-faq-title">
    <div class="faq-texture faq-texture-left" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-left.webp" alt="" />
    </div>
    <div class="faq-texture faq-texture-right" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-right.webp" alt="" />
    </div>

    <div class="faq-inner">
      <header class="faq-heading" data-home-reveal="heading">
        <h2 id="ide-faq-title">{{ t('ide.faq.title') }}</h2>
        <p>{{ t('ide.faq.subtitle') }}</p>
      </header>

      <div class="faq-list" data-home-reveal="content">
        <article v-for="n in FAQ_COUNT" :key="n" class="faq-item">
          <span class="question-index">{{ String(n).padStart(2, '0') }}</span>
          <div class="faq-content">
            <h3>{{ t(`ide.faq.q${n}`) }}</h3>
            <p>{{ t(`ide.faq.a${n}`) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.ide-faq {
  position: relative;
  padding: 64px 0 60px;
  background: #050505;
}

.faq-texture {
  position: absolute;
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

.faq-texture-left {
  top: 80px;
  left: -150px;
  width: 440px;
  opacity: 0.055;
}

.faq-texture-right {
  right: -140px;
  bottom: 20px;
  width: 420px;
  opacity: 0.045;
}

.faq-inner {
  position: relative;
  z-index: 1;
  width: min(1080px, calc(100% - 48px));
  margin: 0 auto;
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
    margin: 16px auto 0;
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

.question-index {
  color: #12e6c2;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 11.5px;
  line-height: 23px;
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
  .ide-faq {
    padding: 60px 0 56px;
  }

  .faq-heading h2 {
    font-size: 32px;
    line-height: 42px;
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
