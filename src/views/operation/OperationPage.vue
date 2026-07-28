<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import AugustDeveloperMonthSection from './components/AugustDeveloperMonthSection.vue'
import { useScrollAnimation } from './hooks/useScrollAnimation'
import CcfLogo from '@/assets/home/ccf_logo.webp'
import {
  CARD1_URL,
  CARD2_URL,
  CARD3_URL,
  HISTORY1_URL,
  CCF_COMPETITION_PATH,
  CARD2_HINT_STEPS,
  CONTRIB_ROW_HIGHLIGHT_CLASS,
  CONTRIB_ACTION_HIGHLIGHT_CLASS,
  CONTRIB_STAR_CLASS,
  CONTRIB_ACTION_NORMAL_CLASS,
  CONTRIB_CREDITS_BASE_CLASSES,
  CONTRIB_CREDITS_GLOW_CLASS,
  CONTRIB_ROW_HIGHLIGHTS,
} from './constants'

defineOptions({ name: 'OperationPage' })

const { t, locale } = useI18n()

const isEnglish = computed(() => locale.value === 'en')

useHead({
  title: 'CoStrict 运营活动 - 免费领取 Credits，加速你的 AI 编程体验',
  meta: [
    { name: 'description', content: '参与 CoStrict 社区活动，通过注册、邀请好友、GitHub 开源贡献获取免费 Credits，加速你的 AI 编程体验。' },
    { property: 'og:title', content: 'CoStrict 运营活动 - 免费领取 Credits' },
    { property: 'og:description', content: '参与 CoStrict 社区活动，通过注册、邀请好友、GitHub 开源贡献获取免费 Credits。' },
    { property: 'og:url', content: 'https://costrict.ai/operation' },
    { name: 'twitter:title', content: 'CoStrict 运营活动 - 免费领取 Credits' },
    { name: 'twitter:description', content: '参与活动，免费领取 Credits，加速你的 AI 编程体验。' },
  ],
  link: [{ rel: 'canonical', href: 'https://costrict.ai/operation' }],
})

const card2Rules = computed(() => [
  t('operation.card2Rule1'),
  t('operation.card2Rule2'),
])

const contribRows = computed(() =>
  (['contrib1', 'contrib2', 'contrib3', 'contrib4', 'contrib5'] as const).map((key, idx) => ({
    action: t(`operation.${key}`),
    credits: t(`operation.${key}Credits`),
    highlight: CONTRIB_ROW_HIGHLIGHTS[idx],
  })),
)

type ContribRow = (typeof contribRows.value)[number]

const contribColumns = computed<DataTableColumns<ContribRow>>(() => [
  {
    key: 'action',
    title: t('operation.tableColAction'),
    render(row) {
      if (row.highlight) {
        return h('span', { class: CONTRIB_ACTION_HIGHLIGHT_CLASS }, [
          h('span', { class: CONTRIB_STAR_CLASS }, '★'),
          row.action,
        ])
      }
      return h('span', { class: CONTRIB_ACTION_NORMAL_CLASS }, row.action)
    },
  },
  {
    key: 'credits',
    title: t('operation.tableColReward'),
    align: 'right',
    render(row) {
      return h(
        'span',
        {
          class: [
            ...CONTRIB_CREDITS_BASE_CLASSES,
            row.highlight ? CONTRIB_CREDITS_GLOW_CLASS : '',
          ],
        },
        row.credits,
      )
    },
  },
])

const rowClassName = (row: ContribRow) =>
  row.highlight ? CONTRIB_ROW_HIGHLIGHT_CLASS : ''

// Scroll fade-up animation
const [card1Ref, card2Ref, card3Ref, card4Ref, history1Ref] = useScrollAnimation(5)
</script>

<template>
  <div class="min-h-screen pt-16 bg-black text-white text-sm leading-relaxed">

    <!-- CCF 大赛浮动入口 -->
    <router-link
      v-if="!isEnglish"
      :to="CCF_COMPETITION_PATH"
      class="absolute right-0 top-[88px] z-[1000] block cursor-pointer md:right-[-15px] md:top-20 md:transition-transform md:duration-300 md:ease-in md:hover:-translate-x-[15px]"
    >
      <img :src="CcfLogo" alt="CCF 大赛" class="w-[120px] md:w-[198px] h-auto pointer-events-none select-none" />
    </router-link>

    <AugustDeveloperMonthSection />

    <!-- Active Activities -->
    <section
      data-section="active-activities"
      class="max-w-[960px] mx-auto px-6 py-12 flex flex-col gap-4"
    >

      <!-- Card 1: 注册有礼 -->
      <div class="scroll-animation-wrapper card-base" ref="card1Ref">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div class="flex items-center gap-2.5 shrink-0">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,102,255,0.2)] border border-[rgba(0,102,255,0.4)] text-[13px] font-bold text-[#197dff] shrink-0">1</span>
            <div class="flex items-center flex-wrap gap-2.5 font-bold text-[18px] text-white/85">
              {{ t('operation.card1Title') }}
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-[40px] bg-[rgba(0,255,183,0.12)] border border-[rgba(0,255,183,0.3)] text-[13px] font-semibold text-[#00ffb7]">{{
                  t('operation.card1Credits') }}</span>
            </div>
          </div>
          <a :href="CARD1_URL" class="cta-btn" target="_blank" rel="noopener">
            {{ t('operation.card1Btn') }}<span class="arrow">></span>
          </a>
        </div>
        <p class="text-sm text-white/70 leading-[1.7]">{{ t('operation.card1Desc') }}</p>
      </div>

      <!-- Card 2: 邀请有礼 -->
      <div class="scroll-animation-wrapper card-base" ref="card2Ref">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div class="flex items-center gap-2.5 shrink-0">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,102,255,0.2)] border border-[rgba(0,102,255,0.4)] text-[13px] font-bold text-[#197dff] shrink-0">2</span>
            <div class="flex items-center flex-wrap gap-2.5 font-bold text-[18px] text-white/85">
              {{ t('operation.card2Title') }}
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-[40px] bg-[rgba(0,255,183,0.12)] border border-[rgba(0,255,183,0.3)] text-[13px] font-semibold text-[#00ffb7]">{{
                  t('operation.card2Credits') }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <a :href="CARD2_URL" class="cta-btn" target="_blank" rel="noopener">
              {{ t('operation.card2Btn') }}<span class="arrow">></span>
            </a>
            <div class="hidden sm:flex items-center gap-1 text-[11px] text-white/50 whitespace-nowrap">
              <template v-for="(step, idx) in CARD2_HINT_STEPS" :key="step">
                <span
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[rgba(0,102,255,0.15)] border border-[rgba(0,102,255,0.3)] text-[10px] font-semibold text-[#197dff] shrink-0">{{
                    step }}</span>
                {{ t(`operation.card2HintStep${step}`) }}
                <span v-if="idx < CARD2_HINT_STEPS.length - 1" class="text-white/30">›</span>
              </template>
            </div>
          </div>
        </div>
        <p class="text-sm text-white/70 leading-[1.7] mb-3">{{ t('operation.card2Desc') }}</p>
        <ul class="flex flex-col gap-2">
          <li v-for="rule in card2Rules" :key="rule"
            class="flex items-start gap-2 text-sm text-white/70 leading-relaxed before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#197dff] before:shrink-0 before:mt-[7px]">
            {{ rule }}
          </li>
        </ul>
      </div>

      <!-- Card 3: 开源贡献激励 -->
      <div class="scroll-animation-wrapper card-base" ref="card3Ref">
        <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div class="flex items-center gap-2.5 shrink-0">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,102,255,0.2)] border border-[rgba(0,102,255,0.4)] text-[13px] font-bold text-[#197dff] shrink-0">3</span>
            <div class="font-bold text-[18px] text-white/85">{{ t('operation.card3Title') }}</div>
          </div>
          <a :href="CARD3_URL" class="cta-btn" target="_blank" rel="noopener">
            {{ t('operation.card3Btn') }}<span class="arrow">></span>
          </a>
        </div>
        <p class="text-sm text-white/70 leading-[1.7] mb-4">{{ t('operation.card3Desc') }}</p>

        <!-- Contribution table (Naive UI NDataTable) -->
        <NDataTable class="contrib-table mt-4" :columns="contribColumns" :data="contribRows"
          :row-class-name="rowClassName" :bordered="false" size="small" />
        <p class="text-xs text-white/50 mt-3 leading-relaxed">{{ t('operation.contribNote') }}</p>
      </div>

      <!-- Card 4: CCF × CoStrict AI 原生创新大赛 -->
      <div class="scroll-animation-wrapper card-base" ref="card4Ref">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,102,255,0.2)] border border-[rgba(0,102,255,0.4)] text-[13px] font-bold text-[#197dff] shrink-0">4</span>
            <div class="font-bold text-[18px] text-white/85 break-words">{{ t('operation.card4Title') }}</div>
          </div>
          <a :href="CCF_COMPETITION_PATH" class="cta-btn" target="_blank" rel="noopener">
            {{ t('operation.card4Btn') }}<span class="arrow">></span>
          </a>
        </div>
        <p class="text-sm text-white/70 leading-[1.7]">{{ t('operation.card4Desc') }}</p>
      </div>
    </section>

    <!-- History Activities -->
    <section class="max-w-[960px] mx-auto px-6 pb-20 pt-0">
      <div class="history-section-title">{{ t('operation.historyTitle') }}</div>
      <div class="flex flex-col gap-4">

        <!-- History Card 1: 校园挑战赛 -->
        <div class="scroll-animation-wrapper card-history" ref="history1Ref">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <span
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-[13px] font-bold text-white/50 shrink-0">1</span>
              <div class="flex items-center flex-wrap gap-2.5 text-[15px] font-semibold text-white/50">
                {{ t('operation.history1Title') }}
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-[40px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[12px] font-medium text-white/50">{{
                    t('operation.history1Badge') }}</span>
              </div>
            </div>
            <a :href="HISTORY1_URL" class="cta-btn cta-btn-ghost" target="_blank" rel="noopener">
              {{ t('operation.history1Btn') }}<span class="arrow">></span>
            </a>
          </div>
          <p class="text-[13px] text-white/50 leading-[1.7]">{{ t('operation.history1Desc') }}</p>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped lang="less">
.card-base {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  transition:
    background 0.25s ease-in-out,
    border-color 0.25s ease-in-out,
    transform 0.25s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #0066ff, #00ffb7);
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(0, 102, 255, 0.35);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }
  }
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #c3defa;
  border: 1px solid rgba(0, 102, 255, 0.5);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.25s ease-in-out;

  .arrow {
    font-size: 13px;
    transition: transform 0.25s ease-in-out;
  }

  &:hover {
    background: rgba(0, 102, 255, 0.12);
    border-color: #0066ff;
    color: #fff;
    transform: translateY(-1px);

    .arrow {
      transform: translateX(3px);
    }
  }
}

// NDataTable 主题覆盖
.contrib-table {
  :deep(.n-data-table) {
    background: transparent;
  }

  :deep(.n-data-table-wrapper) {
    border-radius: 8px;
    overflow: hidden;
  }

  :deep(.n-data-table-table) {
    background: transparent;
  }

  :deep(.n-data-table-thead) {
    .n-data-table-th {
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 12px;
    }
  }

  :deep(.n-data-table-tbody) {
    .n-data-table-tr {
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.15s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.03) !important;
      }

      &.contrib-row-highlight {
        background: rgba(0, 255, 183, 0.06);
      }

      .n-data-table-td {
        background: transparent;
        border: none;
        padding: 10px 12px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
      }
    }
  }

  :deep(.n-data-table-thead) {
    background-color: transparent;

    .n-data-table-tr {
      background-color: transparent;
    }
  }
}

// 贡献行 action 渲染样式
:deep(.contrib-action-highlight) {
  position: relative;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.7);

  .contrib-star {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #00ffb7;
    font-size: 11px;
  }
}

:deep(.credits-glow) {
  text-shadow: 0 0 8px rgba(0, 255, 183, 0.4);
}

// 历史活动分区标题
.history-section-title {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
}

// 历史活动卡片
.card-history {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px 24px;
  transition: border-color 0.25s ease-in-out;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    transform: none;
  }

  // 覆盖 card-base 的 ::before 发光效果
  &::before {
    display: none;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .4;
  }
}

// 历史活动 ghost 按钮
.cta-btn-ghost {
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.7);
    transform: none;
  }
}
</style>
