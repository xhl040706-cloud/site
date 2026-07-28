<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'AugustDeveloperMonthSection' })

const { t } = useI18n()

const itemCounts = {
  rights: 2,
  models: 4,
  product: 3,
} as const

const upgrades = computed(() =>
  (['rights', 'models', 'product'] as const).map((key) => ({
    key,
    date: t(`operation.august.${key}.date`),
    title: t(`operation.august.${key}.title`),
    summary: t(`operation.august.${key}.summary`),
    items: Array.from({ length: itemCounts[key] }, (_, index) =>
      t(`operation.august.${key}.items[${index}]`),
    ),
  })),
)
</script>

<template>
  <section id="august-2026" class="august-month" aria-labelledby="august-2026-title">
    <header class="august-month__header">
      <p class="august-month__period">{{ t('operation.august.period') }}</p>
      <h1 id="august-2026-title">{{ t('operation.august.title') }}</h1>
      <p class="august-month__summary">{{ t('operation.august.summary') }}</p>
    </header>

    <div class="august-month__upgrades">
      <article v-for="upgrade in upgrades" :key="upgrade.key" class="upgrade-item">
        <time class="upgrade-item__date">{{ upgrade.date }}</time>
        <div class="upgrade-item__content">
          <h2>{{ upgrade.title }}</h2>
          <p>{{ upgrade.summary }}</p>
          <ul>
            <li v-for="item in upgrade.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="less">
.august-month {
  max-width: 960px;
  margin: 0 auto;
  padding: 56px 24px 44px;
  scroll-margin-top: 80px;
}

.august-month__header {
  max-width: 720px;
  margin-bottom: 40px;
}

.august-month__period,
.upgrade-item__date {
  color: #16dec2;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
}

.august-month__header h1 {
  margin: 10px 0 14px;
  color: #fff;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: 0;
}

.august-month__summary,
.upgrade-item__content p,
.upgrade-item__content li {
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.75;
}

.august-month__upgrades {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.upgrade-item {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 32px;
  padding: 32px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.upgrade-item__content h2 {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.92);
  font-size: 22px;
  line-height: 1.35;
  letter-spacing: 0;
}

.upgrade-item__content p {
  margin: 0 0 14px;
}

.upgrade-item__content ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
}

@media (max-width: 768px) {
  .august-month {
    padding: 40px 20px 32px;
  }

  .upgrade-item {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 26px 0;
  }
}
</style>
