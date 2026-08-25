<template>
  <section class="organization-value" aria-labelledby="organization-value-title">
    <div class="value-texture" aria-hidden="true"></div>
    <div class="section-inner">
      <header data-home-reveal="heading">
        <h2 id="organization-value-title">{{ t('home.redesign.value.title') }}</h2>
        <p>{{ t('home.redesign.value.subtitle') }}</p>
      </header>

      <div ref="valueGrid" class="value-grid" data-home-reveal="content">
        <div v-for="(row, rowIndex) in valueRows" :key="rowIndex" class="value-row">
          <article
            v-for="item in row"
            :key="item.key"
            class="value-card"
            :class="`value-card--${item.key}`"
            tabindex="0"
            @mouseenter="hoveredKey = item.key"
            @mouseleave="hoveredKey = null"
            @focus="hoveredKey = item.key"
            @blur="hoveredKey = null"
          >
            <div class="value-visual-shell">
              <CollaborationValueVisual
                v-if="item.key === 'collaboration'"
                :active="hoveredKey === item.key"
              />
              <DeliveryFlow v-else-if="item.key === 'delivery'" :active="hoveredKey === item.key" />
              <KnowledgeValueVisual v-else-if="item.key === 'knowledge'" />
              <GovernanceValueVisual v-else :active="hoveredKey === item.key" />
            </div>
            <div class="value-card-copy">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import CollaborationValueVisual from './CollaborationValueVisual.vue'
import DeliveryFlow from './DeliveryFlow.vue'
import GovernanceValueVisual from './GovernanceValueVisual.vue'
import KnowledgeValueVisual from './KnowledgeValueVisual.vue'

defineOptions({
  name: 'OrganizationValue',
})

export type ValueResultKey = 'delivery' | 'collaboration' | 'knowledge' | 'governance'

interface ValueItem {
  key: ValueResultKey
  title: string
  description: string
}

const { t } = useI18n()
const valueGrid = useTemplateRef<HTMLElement>('valueGrid')
const hoveredKey = ref<ValueResultKey | null>(null)
const valueKeys: ValueResultKey[] = ['collaboration', 'delivery', 'knowledge', 'governance']
const valueItems = computed<ValueItem[]>(() =>
  valueKeys.map((key) => ({
    key,
    title: t(`home.redesign.value.items.${key}.title`),
    description: t(`home.redesign.value.items.${key}.description`),
  })),
)
const valueRows = computed(() => [valueItems.value.slice(0, 2), valueItems.value.slice(2, 4)])

let valueRevealObserver: IntersectionObserver | null = null

onMounted(() => {
  const element = valueGrid.value
  if (!element) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion || !('IntersectionObserver' in window)) {
    element.classList.add('is-value-visible')
    return
  }

  valueRevealObserver = new IntersectionObserver(
    ([entry]) => {
      element.classList.toggle('is-value-visible', (entry?.intersectionRatio ?? 0) >= 0.12)
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: [0, 0.12],
    },
  )
  valueRevealObserver.observe(element)
})

onBeforeUnmount(() => valueRevealObserver?.disconnect())
</script>

<style scoped lang="less">
.organization-value {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 84px 0 112px;
  color: #f3f5f7;
  background: #05070b;
}

.value-texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(232, 238, 246, 0.52) 0.65px, transparent 0.65px);
  background-size: 25px 25px;
  opacity: 0.05;
  pointer-events: none;
  -webkit-mask-image:
    linear-gradient(180deg, transparent 0%, #000 16%, #000 86%, transparent 100%),
    linear-gradient(90deg, #000 0%, transparent 24%, transparent 76%, #000 100%);
  mask-image:
    linear-gradient(180deg, transparent 0%, #000 16%, #000 86%, transparent 100%),
    linear-gradient(90deg, #000 0%, transparent 24%, transparent 76%, #000 100%);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

.section-inner {
  position: relative;
  z-index: 1;
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

header {
  h2 {
    margin: 0;
    color: #f3f5f7;
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0;
  }

  p {
    max-width: 780px;
    margin: 16px 0 0;
    color: #929da9;
    font-size: 15px;
    line-height: 26px;
    letter-spacing: 0;
  }
}

.value-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 44px;
}

.value-row {
  display: grid;
  grid-template-columns: 448px minmax(0, 1fr);
  gap: 16px;

  &:nth-child(2) {
    grid-template-columns: minmax(0, 1fr) 448px;
  }
}

.value-card {
  position: relative;
  min-width: 0;
  height: 420px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.025);
  outline: none;
  transition:
    background-color 180ms ease,
    border-color 180ms ease;
}

.value-visual-shell {
  position: absolute;
  z-index: 1;
  inset: 0;
  transform: scale(1);
  transform-origin: center;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.value-card-copy {
  position: absolute;
  z-index: 3;
  right: 30px;
  bottom: 24px;
  left: 30px;
  display: block;
  min-width: 0;

  h3 {
    margin: 0;
    color: #f0f2f5;
    font-size: 17px;
    font-weight: 500;
    line-height: 25px;
    letter-spacing: 0;
  }

  p {
    margin: 8px 0 0;
    color: #929ca8;
    font-size: 13px;
    line-height: 21px;
    letter-spacing: 0;
  }
}

.value-grid[data-home-reveal] {
  opacity: 1;
  transform: none;
  transition: none;
}

.value-grid .value-card {
  --value-reveal-delay: 0ms;

  opacity: 0;
  transform: translateX(-24px) scale(0.985);
  transition:
    opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms ease,
    border-color 180ms ease;
  transition-delay: var(--value-reveal-delay), var(--value-reveal-delay), 0ms, 0ms;
}

.value-row .value-card:nth-child(2) {
  transform: translateX(24px) scale(0.985);
}

.value-row:nth-child(2) .value-card:nth-child(1) {
  --value-reveal-delay: 100ms;
}

.value-row:nth-child(2) .value-card:nth-child(2) {
  --value-reveal-delay: 100ms;
}

.value-grid.is-value-visible .value-card {
  opacity: 1;
  transform: translateX(0) scale(1);
}

@media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
  .value-card:hover,
  .value-card:focus-visible {
    border-color: rgba(255, 255, 255, 0.115);
    background: rgba(255, 255, 255, 0.04);

    .value-visual-shell {
      transform: scale(1.02);
    }
  }
}

@media (max-width: 1023px) {
  .organization-value {
    padding: 96px 0;
  }

  .value-row,
  .value-row:nth-child(2) {
    grid-template-columns: 1fr;
  }
}

@media (max-height: 900px) and (min-width: 1100px) {
  header p {
    line-height: 24px;
  }
}

@media (max-width: 767px) {
  header h2 {
    font-size: 34px;
    line-height: 44px;
  }

  .value-card {
    height: 360px;
  }

  .value-card--governance {
    height: 420px;
  }

  .value-card-copy {
    right: 24px;
    bottom: 22px;
    left: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .value-card,
  .value-visual-shell {
    transition: none;
  }

  .value-grid .value-card,
  .value-grid.is-value-visible .value-card {
    opacity: 1;
    transform: none;
  }
}
</style>
