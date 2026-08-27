<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'CliFaq',
})

const { t } = useI18n()

const FAQ_COUNT = 4
</script>

<template>
  <section class="cli-faq" aria-labelledby="cli-faq-title">
    <div class="faq-inner">
      <header class="faq-heading" data-home-reveal="heading">
        <h2 id="cli-faq-title">{{ t('cli.faq.title') }}</h2>
        <p>{{ t('cli.faq.subtitle') }}</p>
      </header>

      <div class="faq-list" data-home-reveal="content">
        <article v-for="n in FAQ_COUNT" :key="n" class="faq-item">
          <span class="question-index">{{ String(n).padStart(2, '0') }}</span>
          <div class="faq-content">
            <h3>{{ t(`cli.faq.q${n}`) }}</h3>
            <p>{{ t(`cli.faq.a${n}`) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.cli-faq {
  position: relative;
  padding: 64px 0 92px;
  background: #050505;
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
  .cli-faq {
    padding: 56px 0 80px;
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
