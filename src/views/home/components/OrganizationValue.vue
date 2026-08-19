<template>
  <section class="organization-value" aria-labelledby="organization-value-title">
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
            :class="{
              'value-card--collaboration': item.key === 'collaboration',
              'value-card--delivery': item.key === 'delivery',
              'value-card--knowledge': item.key === 'knowledge',
              'value-card--governance': item.key === 'governance',
            }"
            tabindex="0"
            @mouseenter="hoveredKey = item.key"
            @mouseleave="hoveredKey = null"
            @focus="hoveredKey = item.key"
            @blur="hoveredKey = null"
          >
            <ParticleField
              class="value-particles"
              :variant="item.variant"
              :interactive="false"
              :active="hoveredKey === item.key"
            />
            <div class="value-card-glow" aria-hidden="true"></div>
            <CollaborationValueVisual
              v-if="item.key === 'collaboration'"
              :active="hoveredKey === item.key"
            />
            <DeliveryFlow v-if="item.key === 'delivery'" :active="hoveredKey === item.key" />
            <KnowledgeValueVisual v-if="item.key === 'knowledge'" />
            <GovernanceValueVisual
              v-if="item.key === 'governance'"
              :active="hoveredKey === item.key"
            />
            <div class="value-card-overlay"></div>
            <div class="value-card-foreground" aria-hidden="true"></div>
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
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import ParticleField from '@/components/particle/ParticleField.vue'
import type { HomeParticleFieldVariant } from '@/components/particle/types'
import { usePointerSurface } from '@/hooks/usePointerSurface'
import CollaborationValueVisual from './CollaborationValueVisual.vue'
import DeliveryFlow from './DeliveryFlow.vue'
import GovernanceValueVisual from './GovernanceValueVisual.vue'
import KnowledgeValueVisual from './KnowledgeValueVisual.vue'

defineOptions({
  name: 'OrganizationValue',
})

interface ValueItem {
  key: HomeParticleFieldVariant
  variant: HomeParticleFieldVariant
  title: string
  description: string
}

const { t } = useI18n()
const valueGrid = useTemplateRef<HTMLElement>('valueGrid')
const hoveredKey = ref<HomeParticleFieldVariant | null>(null)

usePointerSurface(valueGrid, {
  surfaceSelector: '.value-card',
  lerp: 0.08,
  disabled: () => !window.matchMedia('(min-width: 1100px)').matches,
})
const valueKeys = ['collaboration', 'delivery', 'knowledge', 'governance'] as const
const valueItems = computed<ValueItem[]>(() =>
  valueKeys.map((key) => ({
    key,
    variant: key,
    title: t(`home.redesign.value.items.${key}.title`),
    description: t(`home.redesign.value.items.${key}.description`),
  })),
)
const valueRows = computed(() => [valueItems.value.slice(0, 2), valueItems.value.slice(2, 4)])
</script>

<style scoped lang="less">
.organization-value {
  position: relative;
  z-index: 1;
  margin-top: 0;
  padding: 80px 0 104px;
  color: var(--color-home-light-text);
  background: var(--color-home-light);
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
    font-size: 36px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0;
  }

  p {
    margin: 16px 0 0;
    color: var(--color-home-light-muted);
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
  overflow: hidden;
  isolation: isolate;
  border-radius: 20px;
  background: #07090c;
  height: 420px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
  outline: none;
  transform-style: preserve-3d;
  transition:
    transform 500ms var(--ease-out-expo),
    box-shadow var(--motion-base) ease;

  &::after {
    content: '';
    display: none;
  }

  &:hover,
  &:focus-visible {
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    transform: perspective(1200px) translateY(-2px) rotateX(var(--pointer-rotate-x, 0deg))
      rotateY(var(--pointer-rotate-y, 0deg));
  }

  &:hover .value-particles,
  &:focus-visible .value-particles {
    filter: brightness(1.04);
  }

  &:hover .value-card-glow,
  &:focus-visible .value-card-glow {
    opacity: 0.3;
    transform: translate3d(
        calc(0px - var(--pointer-x-8, 0px)),
        calc(0px - var(--pointer-y-8, 0px)),
        0
      )
      scale(1.01);
  }
}

.value-particles {
  z-index: 0;
  opacity: 0.72;
  transform: translate3d(
    calc(0px - var(--pointer-x-5, 0px)),
    calc(0px - var(--pointer-y-5, 0px)),
    0
  );
  transition:
    filter var(--motion-base) ease,
    transform 500ms var(--ease-out-expo);
}

.value-card-glow {
  position: absolute;
  z-index: 1;
  inset: -2%;
  background: radial-gradient(
    ellipse at var(--glow-x, 50%) var(--glow-y, 40%),
    rgba(62, 141, 255, 0.08) 0%,
    rgba(55, 199, 232, 0.04) 28%,
    transparent 67%
  );
  opacity: 0.2;
  pointer-events: none;
  transform-origin: var(--glow-x, 50%) var(--glow-y, 40%);
  transition:
    opacity 420ms ease,
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.value-card:nth-child(1) {
  --glow-x: 38%;
  --glow-y: 35%;
}

.value-card:nth-child(2) {
  --glow-x: 58%;
  --glow-y: 38%;
}

.value-card--delivery {
  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
  }

  &:hover .value-particles,
  &:focus-visible .value-particles {
    filter: brightness(0.9);
  }

  .value-card-overlay {
    background: linear-gradient(
      180deg,
      rgba(9, 10, 12, 0) 48%,
      rgba(9, 10, 12, 0.24) 61%,
      rgba(9, 10, 12, 0.62) 72%,
      rgba(9, 10, 12, 0.94) 82%,
      #090a0c 100%
    );
  }
}

.value-card--collaboration {
  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
  }

  .value-card-overlay {
    background: linear-gradient(
      180deg,
      rgba(9, 10, 12, 0) 54%,
      rgba(9, 10, 12, 0.14) 64%,
      rgba(9, 10, 12, 0.82) 80%,
      #090a0c 100%
    );
  }
}

.value-card--governance {
  .value-particles {
    opacity: 0;
  }

  .value-card-overlay {
    background: linear-gradient(
      180deg,
      rgba(9, 10, 12, 0) 61%,
      rgba(9, 10, 12, 0.2) 68%,
      rgba(9, 10, 12, 0.82) 81%,
      #090a0c 100%
    );
  }
}

.value-card--knowledge {
  .value-particles {
    opacity: 0;
  }

  .value-card-overlay {
    background: linear-gradient(
      180deg,
      rgba(9, 10, 12, 0) 52%,
      rgba(9, 10, 12, 0.1) 60%,
      rgba(9, 10, 12, 0.42) 69%,
      rgba(9, 10, 12, 0.82) 78%,
      #090a0c 92%
    );
  }
}

.value-row:nth-child(2) .value-card:nth-child(1) {
  --glow-x: 62%;
  --glow-y: 42%;
}

.value-row:nth-child(2) .value-card:nth-child(2) {
  --glow-x: 54%;
  --glow-y: 36%;
}

.value-card-overlay {
  position: absolute;
  z-index: 3;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(7, 9, 12, 0) 34%,
    rgba(7, 9, 12, 0.15) 52%,
    rgba(7, 9, 12, 0.86) 82%,
    #07090c 100%
  );
  pointer-events: none;
}

.value-card-foreground {
  position: absolute;
  z-index: 4;
  inset: 0;
  pointer-events: none;
  transform: translate3d(var(--pointer-x-4, 0px), var(--pointer-y-4, 0px), 0);
}

.value-card-copy {
  position: absolute;
  z-index: 5;
  right: 45px;
  bottom: 22px;
  left: 45px;
  height: 78px;

  h3 {
    margin: 0;
    color: #f3f3f4;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0;
  }

  p {
    margin: 8px 0 0;
    color: #a6a6aa;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0;
  }
}

.value-grid[data-home-reveal] {
  opacity: 1;
  transform: none;
  transition: none;
}

.value-grid .value-card {
  opacity: 0;
  transform: translateX(-24px) scale(0.985);
  transition:
    opacity 700ms var(--ease-out-expo),
    transform 700ms var(--ease-out-expo),
    box-shadow var(--motion-base) ease;
}

.value-row .value-card:nth-child(2) {
  transform: translateX(24px) scale(0.985);
}

.value-row:nth-child(2) .value-card {
  transition-delay: 100ms;
}

.value-grid.is-revealed .value-card {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.value-grid.is-revealed .value-card:hover,
.value-grid.is-revealed .value-card:focus-visible {
  transform: perspective(1200px) translateY(-2px) rotateX(var(--pointer-rotate-x, 0deg))
    rotateY(var(--pointer-rotate-y, 0deg));
  transition-delay: 0ms;
}

.value-grid.is-revealed .value-card--collaboration:hover,
.value-grid.is-revealed .value-card--collaboration:focus-visible,
.value-grid.is-revealed .value-card--delivery:hover,
.value-grid.is-revealed .value-card--delivery:focus-visible {
  transform: translateY(-2px);
}

@media (max-width: 1023px) {
  .organization-value {
    padding: 96px 0;
  }

  .section-inner {
    padding-top: 0;
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

  .value-card-copy {
    right: 28px;
    bottom: 20px;
    left: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .value-card,
  .value-particles,
  .value-card-glow {
    transition: none;
  }

  .value-grid .value-card,
  .value-grid.is-revealed .value-card {
    opacity: 1;
    transform: none;
  }
}
</style>
