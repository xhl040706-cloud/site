# August Developer Month Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal clickable August Developer Month banner to the CoStrict homepage and place the complete campaign details at the top of the existing operation page.

**Architecture:** The homepage gets one isolated presentation component whose only responsibility is rendering a localized RouterLink to `/operation#august-2026`. The operation page gets one isolated, localized details component rendered before existing activities. A pure router scroll behavior handles hash navigation with fixed-navbar offset; no new route, dependency, image asset, or shared campaign state is introduced.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Vue Router 4, vue-i18n, Tailwind CSS 4, scoped Less, Vitest 4, Vue Test Utils, happy-dom.

---

## File Map

**Create**

- `src/router/scrollBehavior.ts`: pure hash-aware router scroll behavior.
- `src/views/home/components/AugustDeveloperMonthBanner.vue`: minimal homepage activity link.
- `src/views/operation/components/AugustDeveloperMonthSection.vue`: full campaign content on the operation page.
- `tests/unit/router/scrollBehavior.spec.ts`: hash and default scroll behavior coverage.
- `tests/unit/home/AugustDeveloperMonthBanner.spec.ts`: homepage banner copy, route, and content-boundary coverage.
- `tests/unit/operation/AugustDeveloperMonthSection.spec.ts`: Chinese and English campaign content coverage.
- `tests/unit/augustDeveloperMonthIntegration.spec.ts`: verifies both components are mounted in the correct pages.

**Modify**

- `src/router/index.ts`: use the pure hash-aware scroll behavior.
- `src/views/home/index.vue`: render the banner before the existing Hero.
- `src/views/operation/OperationPage.vue`: render the August details before current active activities.
- `src/locales/zh.json`: add Chinese banner and campaign-detail copy.
- `src/locales/en.json`: add English banner and campaign-detail copy.

**Must remain unchanged**

- `src/components/NavBar.vue`
- `src/views/home/SloganSection.vue`
- Existing operation activity cards and their constants.

---

### Task 1: Make hash navigation land below the fixed navbar

**Files:**

- Create: `src/router/scrollBehavior.ts`
- Modify: `src/router/index.ts`
- Test: `tests/unit/router/scrollBehavior.spec.ts`

- [ ] **Step 1: Write the failing router scroll test**

Create `tests/unit/router/scrollBehavior.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import { scrollBehavior } from '@/router/scrollBehavior'

const routeWithHash = (hash: string) => ({ hash }) as RouteLocationNormalized

describe('scrollBehavior', () => {
  it('scrolls hash navigation below the fixed navbar', () => {
    expect(scrollBehavior(routeWithHash('#august-2026'), routeWithHash(''), null)).toEqual({
      el: '#august-2026',
      top: 80,
      behavior: 'smooth',
    })
  })

  it('scrolls normal navigation to the page top', () => {
    expect(scrollBehavior(routeWithHash(''), routeWithHash(''), null)).toEqual({ top: 0 })
  })
})
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```bash
pnpm exec vitest run tests/unit/router/scrollBehavior.spec.ts
```

Expected: FAIL because `@/router/scrollBehavior` does not exist.

- [ ] **Step 3: Implement the pure scroll behavior**

Create `src/router/scrollBehavior.ts`:

```ts
import type { RouterScrollBehavior } from 'vue-router'

export const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) {
    return {
      el: to.hash,
      top: 80,
      behavior: 'smooth',
    }
  }

  return { top: 0 }
}
```

Modify `src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/locales'
import { createPrefetchableRoute, prefetchRoutes } from './prefetch'
import { scrollBehavior } from './scrollBehavior'
```

Replace the inline `scrollBehavior()` in `createRouter` with:

```ts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})
```

- [ ] **Step 4: Run the focused test**

Run:

```bash
pnpm exec vitest run tests/unit/router/scrollBehavior.spec.ts
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit the router behavior**

```bash
git add src/router/scrollBehavior.ts src/router/index.ts tests/unit/router/scrollBehavior.spec.ts
git commit -m "feat(router): support anchored activity links"
```

---

### Task 2: Build the minimal homepage banner

**Files:**

- Create: `src/views/home/components/AugustDeveloperMonthBanner.vue`
- Modify: `src/locales/zh.json`
- Modify: `src/locales/en.json`
- Test: `tests/unit/home/AugustDeveloperMonthBanner.spec.ts`

- [ ] **Step 1: Write the failing banner component tests**

Create `tests/unit/home/AugustDeveloperMonthBanner.spec.ts`:

```ts
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import AugustDeveloperMonthBanner from '@/views/home/components/AugustDeveloperMonthBanner.vue'

const mountBanner = (locale: 'zh' | 'en') => {
  const i18n = createI18n({
    legacy: false,
    locale,
    messages: { zh, en },
  })

  return mount(AugustDeveloperMonthBanner, {
    global: {
      plugins: [i18n],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('AugustDeveloperMonthBanner', () => {
  it('renders one minimal Chinese activity message and the details route', () => {
    const wrapper = mountBanner('zh')
    const link = wrapper.findComponent(RouterLinkStub)

    expect(wrapper.text()).toContain('CoStrict 8月开发者福利月｜三大升级陆续上线')
    expect(link.attributes('to')).toBe('/operation#august-2026')
    expect(link.attributes('aria-label')).toBe('查看 CoStrict 8月开发者福利月详情')
    expect(wrapper.text()).not.toContain('20%')
    expect(wrapper.text()).not.toContain('Kimi')
    expect(wrapper.text()).not.toContain('8月1日')
  })

  it('renders the English activity message', () => {
    const wrapper = mountBanner('en')

    expect(wrapper.text()).toContain(
      'CoStrict August Developer Month | Three major upgrades are rolling out',
    )
  })
})
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```bash
pnpm exec vitest run tests/unit/home/AugustDeveloperMonthBanner.spec.ts
```

Expected: FAIL because the banner component and locale keys do not exist.

- [ ] **Step 3: Add the localized banner copy**

Add this object directly inside the existing `home` object in `src/locales/zh.json`, before `slogan`:

```json
"augustBanner": {
  "text": "CoStrict 8月开发者福利月｜三大升级陆续上线",
  "ariaLabel": "查看 CoStrict 8月开发者福利月详情"
},
```

Add the matching object in `src/locales/en.json`:

```json
"augustBanner": {
  "text": "CoStrict August Developer Month | Three major upgrades are rolling out",
  "ariaLabel": "View CoStrict August Developer Month details"
},
```

- [ ] **Step 4: Implement the banner component**

Create `src/views/home/components/AugustDeveloperMonthBanner.vue`:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'AugustDeveloperMonthBanner' })

const { t } = useI18n()
</script>

<template>
  <RouterLink
    to="/operation#august-2026"
    class="august-banner"
    :aria-label="t('home.augustBanner.ariaLabel')"
  >
    <span class="august-banner__content">
      <span>{{ t('home.augustBanner.text') }}</span>
      <span class="august-banner__arrow" aria-hidden="true">→</span>
    </span>
  </RouterLink>
</template>

<style scoped lang="less">
.august-banner {
  position: absolute;
  top: var(--space-16);
  left: 0;
  z-index: 60;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  min-height: 44px;
  align-items: center;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  background: rgba(3, 5, 10, 0.82);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: color 180ms ease, background-color 180ms ease;

  &:hover,
  &:focus-visible {
    color: #fff;
    background: rgba(7, 12, 20, 0.94);
  }

  &:focus-visible {
    outline: 2px solid #16dec2;
    outline-offset: -2px;
  }
}

.august-banner__content {
  display: flex;
  width: 70%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0;
  text-align: center;
}

.august-banner__arrow {
  flex: none;
  transition: transform 180ms ease;
}

.august-banner:hover .august-banner__arrow,
.august-banner:focus-visible .august-banner__arrow {
  transform: translateX(3px);
}

@media (max-width: 1024px) {
  .august-banner__content {
    width: 80%;
  }
}

@media (max-width: 768px) {
  .august-banner {
    min-height: 52px;
    padding: 6px 0;
  }

  .august-banner__content {
    width: 90%;
    gap: 8px;
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .august-banner,
  .august-banner__arrow {
    transition: none;
  }
}
</style>
```

- [ ] **Step 5: Run the banner tests**

Run:

```bash
pnpm exec vitest run tests/unit/home/AugustDeveloperMonthBanner.spec.ts
```

Expected: 2 tests PASS.

- [ ] **Step 6: Commit the isolated banner**

```bash
git add src/views/home/components/AugustDeveloperMonthBanner.vue src/locales/zh.json src/locales/en.json tests/unit/home/AugustDeveloperMonthBanner.spec.ts
git commit -m "feat(home): add august activity banner"
```

---

### Task 3: Build the complete operation-page campaign section

**Files:**

- Create: `src/views/operation/components/AugustDeveloperMonthSection.vue`
- Modify: `src/locales/zh.json`
- Modify: `src/locales/en.json`
- Test: `tests/unit/operation/AugustDeveloperMonthSection.spec.ts`

- [ ] **Step 1: Write the failing campaign section tests**

Create `tests/unit/operation/AugustDeveloperMonthSection.spec.ts`:

```ts
// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import AugustDeveloperMonthSection from '@/views/operation/components/AugustDeveloperMonthSection.vue'

const mountSection = (locale: 'zh' | 'en') => {
  const i18n = createI18n({
    legacy: false,
    locale,
    messages: { zh, en },
  })

  return mount(AugustDeveloperMonthSection, {
    global: { plugins: [i18n] },
  })
}

describe('AugustDeveloperMonthSection', () => {
  it('renders the complete Chinese campaign content under a stable anchor', () => {
    const wrapper = mountSection('zh')

    expect(wrapper.attributes('id')).toBe('august-2026')
    expect(wrapper.text()).toContain('CoStrict 8月开发者福利月')
    expect(wrapper.text()).toContain('有效期自动升级至12个月')
    expect(wrapper.text()).toContain('额外赠送20% Credits')
    expect(wrapper.text()).toContain('Kimi K3')
    expect(wrapper.text()).toContain('mimo-v2.5-pro')
    expect(wrapper.text()).toContain('CoStrict Cloud')
    expect(wrapper.text()).toContain('AI Native')
    expect(wrapper.text()).toContain('CI/CD')
  })

  it('renders English content without missing translation keys', () => {
    const wrapper = mountSection('en')

    expect(wrapper.text()).toContain('CoStrict August Developer Month')
    expect(wrapper.text()).toContain('12 months')
    expect(wrapper.text()).toContain('20% bonus Credits')
    expect(wrapper.text()).not.toContain('operation.august')
  })
})
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```bash
pnpm exec vitest run tests/unit/operation/AugustDeveloperMonthSection.spec.ts
```

Expected: FAIL because the operation component and locale keys do not exist.

- [ ] **Step 3: Add the complete Chinese campaign copy**

Add this nested object at the start of the existing `operation` object in `src/locales/zh.json`:

```json
"august": {
  "period": "2026年8月",
  "title": "CoStrict 8月开发者福利月",
  "summary": "围绕用户权益、模型能力和产品体验带来三大升级。",
  "rights": {
    "date": "8月1日起",
    "title": "用户权益升级",
    "summary": "感谢早鸟用户支持，Credits权益全面升级。",
    "items": [
      "已购买且未消耗的Credits，有效期自动升级至12个月。",
      "根据历史购买额度，额外赠送20% Credits。"
    ]
  },
  "models": {
    "date": "8月5日起",
    "title": "模型生态升级",
    "summary": "新接入Kimi K3、MiniMax M3、step-3.7-flash、mimo-v2.5-pro。",
    "items": [
      "日常编码：选择响应更快的模型，提升开发效率。",
      "复杂代码分析：选择推理能力更强的模型，解决复杂研发问题。",
      "企业级开发：选择更加稳定、安全可控的模型。",
      "图片转代码：选择支持图片输入的大模型。"
    ]
  },
  "product": {
    "date": "8月14日起",
    "title": "产品能力升级",
    "summary": "从AI编程工具走向企业研发转型伙伴。",
    "items": [
      "企业级开发：新增CoStrict Cloud，完善AI Native全流程闭环并升级安全能力。",
      "组织持续进化：建设企业知识库、技能市场和多层级AI Coding数据看板。",
      "人机协作：将AI Agent嵌入CI/CD，自动委派重复性工作。"
    ]
  }
},
```

- [ ] **Step 4: Add the complete English campaign copy**

Add this matching object at the start of the existing `operation` object in `src/locales/en.json`:

```json
"august": {
  "period": "August 2026",
  "title": "CoStrict August Developer Month",
  "summary": "Three upgrades across user benefits, model capabilities, and product experience.",
  "rights": {
    "date": "Available August 1",
    "title": "User benefits upgrade",
    "summary": "A thank-you to our early supporters, with upgraded Credits benefits.",
    "items": [
      "Purchased and unused Credits will automatically remain valid for 12 months.",
      "Users receive 20% bonus Credits based on their historical purchase amount."
    ]
  },
  "models": {
    "date": "Available August 5",
    "title": "Model ecosystem upgrade",
    "summary": "Now adding Kimi K3, MiniMax M3, step-3.7-flash, and mimo-v2.5-pro.",
    "items": [
      "Daily coding: choose faster models to improve development efficiency.",
      "Complex code analysis: choose stronger reasoning models for demanding engineering tasks.",
      "Enterprise development: choose stable, secure, and controllable models.",
      "Image-to-code: choose a model that supports image input."
    ]
  },
  "product": {
    "date": "Available August 14",
    "title": "Product capabilities upgrade",
    "summary": "Moving from an AI coding tool toward an enterprise engineering transformation partner.",
    "items": [
      "Enterprise development: add CoStrict Cloud, complete the AI Native workflow, and strengthen security.",
      "Organizational evolution: build an enterprise knowledge base, skill marketplace, and multi-level AI Coding dashboards.",
      "Human-agent collaboration: embed AI Agents into CI/CD to delegate repetitive work."
    ]
  }
},
```

- [ ] **Step 5: Implement the unframed campaign details component**

Create `src/views/operation/components/AugustDeveloperMonthSection.vue`:

```vue
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
```

- [ ] **Step 6: Run the campaign section tests**

Run:

```bash
pnpm exec vitest run tests/unit/operation/AugustDeveloperMonthSection.spec.ts
```

Expected: 2 tests PASS and no missing-i18n warnings.

- [ ] **Step 7: Commit the operation details component**

```bash
git add src/views/operation/components/AugustDeveloperMonthSection.vue src/locales/zh.json src/locales/en.json tests/unit/operation/AugustDeveloperMonthSection.spec.ts
git commit -m "feat(operation): add august developer month details"
```

---

### Task 4: Integrate both components without changing existing content

**Files:**

- Modify: `src/views/home/index.vue`
- Modify: `src/views/operation/OperationPage.vue`
- Test: `tests/unit/augustDeveloperMonthIntegration.spec.ts`

- [ ] **Step 1: Write the failing page-integration tests**

Create `tests/unit/augustDeveloperMonthIntegration.spec.ts`:

```ts
// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import HomeIndex from '@/views/home/index.vue'
import OperationPage from '@/views/operation/OperationPage.vue'
import AugustDeveloperMonthBanner from '@/views/home/components/AugustDeveloperMonthBanner.vue'
import AugustDeveloperMonthSection from '@/views/operation/components/AugustDeveloperMonthSection.vue'

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))
vi.mock('@/views/operation/hooks/useScrollAnimation', () => ({
  useScrollAnimation: () => Array.from({ length: 5 }, () => ({ value: null })),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: { zh, en },
})

describe('August Developer Month page integration', () => {
  it('renders the activity banner before the homepage Hero', () => {
    const wrapper = shallowMount(HomeIndex, { global: { plugins: [i18n] } })
    const banner = wrapper.findComponent(AugustDeveloperMonthBanner)
    const hero = wrapper.findComponent({ name: 'SloganSection' })

    expect(banner.exists()).toBe(true)
    expect(hero.exists()).toBe(true)
    expect(wrapper.html().indexOf(banner.html())).toBeLessThan(wrapper.html().indexOf(hero.html()))
  })

  it('renders the August details before existing active activities', () => {
    const wrapper = shallowMount(OperationPage, {
      global: {
        plugins: [i18n],
        stubs: { NDataTable: true },
      },
    })
    const augustSection = wrapper.findComponent(AugustDeveloperMonthSection)
    const activeActivities = wrapper.find('[data-section="active-activities"]')

    expect(augustSection.exists()).toBe(true)
    expect(activeActivities.exists()).toBe(true)
    expect(wrapper.html().indexOf(augustSection.html())).toBeLessThan(
      wrapper.html().indexOf(activeActivities.html()),
    )
  })
})
```

- [ ] **Step 2: Run the integration test and verify the expected failure**

Run:

```bash
pnpm exec vitest run tests/unit/augustDeveloperMonthIntegration.spec.ts
```

Expected: both tests FAIL because neither page renders the new component and the active section marker is absent.

- [ ] **Step 3: Integrate the banner into the homepage**

In `src/views/home/index.vue`, render the banner immediately before `SloganSection`:

```vue
<template>
  <div class="home-page w-full bg-black overflow-x-hidden">
    <AugustDeveloperMonthBanner />
    <SloganSection />
```

Add the import with the other home imports:

```ts
import AugustDeveloperMonthBanner from './components/AugustDeveloperMonthBanner.vue'
import SloganSection from './SloganSection.vue'
```

Do not modify `SloganSection.vue` or the rest of the homepage template.

- [ ] **Step 4: Integrate the details into the operation page**

In `src/views/operation/OperationPage.vue`, add the import:

```ts
import AugustDeveloperMonthSection from './components/AugustDeveloperMonthSection.vue'
```

Render it after the CCF floating entry and before the current Active Activities section:

```vue
    <AugustDeveloperMonthSection />

    <!-- Active Activities -->
    <section
      data-section="active-activities"
      class="max-w-[960px] mx-auto px-6 py-12 flex flex-col gap-4"
    >
```

Do not change existing activity card copy, URLs, animation refs, or table behavior.

- [ ] **Step 5: Run all August feature tests**

Run:

```bash
pnpm exec vitest run tests/unit/router/scrollBehavior.spec.ts tests/unit/home/AugustDeveloperMonthBanner.spec.ts tests/unit/operation/AugustDeveloperMonthSection.spec.ts tests/unit/augustDeveloperMonthIntegration.spec.ts
```

Expected: 8 tests PASS.

- [ ] **Step 6: Commit the page integration**

```bash
git add src/views/home/index.vue src/views/operation/OperationPage.vue tests/unit/augustDeveloperMonthIntegration.spec.ts
git commit -m "feat(site): connect august campaign entry and details"
```

---

### Task 5: Run build, accessibility, and responsive visual verification

**Files:**

- Verify only; modify only files already listed in this plan if a defect is found.

- [ ] **Step 1: Run all existing unit tests through Vitest directly**

Run:

```bash
pnpm exec vitest run tests/unit
```

Expected: all unit tests PASS. Use `pnpm exec vitest` because the repository's `pnpm test` script still prints a stale setup message despite Vitest already being installed.

- [ ] **Step 2: Run type checking**

Run:

```bash
pnpm type-check
```

Expected: exit code 0 with no TypeScript or Vue template errors.

- [ ] **Step 3: Run non-mutating lint checks on touched source files**

Run:

```bash
pnpm exec eslint src/router/index.ts src/router/scrollBehavior.ts src/views/home/index.vue src/views/home/components/AugustDeveloperMonthBanner.vue src/views/operation/OperationPage.vue src/views/operation/components/AugustDeveloperMonthSection.vue tests/unit/router/scrollBehavior.spec.ts tests/unit/home/AugustDeveloperMonthBanner.spec.ts tests/unit/operation/AugustDeveloperMonthSection.spec.ts tests/unit/augustDeveloperMonthIntegration.spec.ts
```

Expected: exit code 0 with no lint errors.

- [ ] **Step 4: Build the production bundle**

Run:

```bash
pnpm build
```

Expected: type checking and Vite production build both complete successfully.

- [ ] **Step 5: Start the local development server**

Run:

```bash
pnpm dev --host 127.0.0.1 --port 9002
```

Expected: Vite reports a local URL. If port `9002` is occupied, use the next available port and record it in the handoff.

- [ ] **Step 6: Verify the desktop homepage at `1440 x 900`**

Open the local homepage and capture a screenshot. Confirm all of the following:

- Navbar pixels, labels, spacing, and behavior are unchanged.
- Banner is one short strip below the navbar and is not the page's main visual.
- Banner contains only the approved sentence and arrow.
- Existing “开源免费” Hero, headline, description, and download CTA remain visible and unobstructed.
- Browser console has no errors.

- [ ] **Step 7: Verify desktop anchor navigation**

Activate the Banner with a mouse click, then repeat with keyboard focus and Enter. Confirm:

- URL becomes `/operation#august-2026`.
- “CoStrict 8月开发者福利月” is visible below the fixed navbar.
- All three detail groups are present.
- Existing operation activities remain unchanged below the new section.

- [ ] **Step 8: Verify the mobile experience at `390 x 844`**

Capture homepage and operation-page screenshots. Confirm:

- Banner content uses the 90% container and may wrap to two lines without clipping.
- Mobile navigation remains usable and does not overlap the Banner.
- Hero text and buttons do not overlap the Banner.
- Operation details stack into one column with readable line lengths.
- No horizontal overflow is present.

- [ ] **Step 9: Verify reduced-motion behavior**

Emulate `prefers-reduced-motion: reduce` and confirm the Banner still communicates clickability without relying on arrow animation.

- [ ] **Step 10: Run the final repository checks**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; status contains only the intended feature commits plus pre-existing untracked `.superpowers/` and `docs/site-redesign/` content.

If visual verification required a fix, rerun Steps 1-9 and commit only the changed feature files:

```bash
git add src tests
git commit -m "fix(home): polish august campaign responsiveness"
```

---

## Completion Gate

The implementation is complete only when:

- The four focused feature test files pass.
- The full `tests/unit` suite passes.
- `pnpm type-check` and `pnpm build` pass.
- Desktop and mobile screenshots confirm the Banner remains subordinate to the homepage Hero.
- `/operation#august-2026` lands below the fixed navbar.
- No existing navbar, Hero, operation activity, route, dependency, or asset was changed outside the defined scope.
