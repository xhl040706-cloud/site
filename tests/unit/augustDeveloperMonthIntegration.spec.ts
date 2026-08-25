// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import zh from '@/locales/zh.json'
import en from '@/locales/en.json'
import OperationPage from '@/views/operation/OperationPage.vue'
import AugustDeveloperMonthSection from '@/views/operation/components/AugustDeveloperMonthSection.vue'
import operationPageSource from '@/views/operation/OperationPage.vue?raw'
import pricingPageSource from '@/views/pricing/PricingPage.vue?raw'
import augustPageSource from '@/views/operation/AugustDeveloperMonthPage.vue?raw'
import homePageSource from '@/views/home/index.vue?raw'
import siteHeaderSource from '@/components/SiteHeader.vue?raw'
import appSource from '@/App.vue?raw'
import { routes } from '@/router'

vi.mock('@unhead/vue', () => ({ useHead: vi.fn() }))
vi.mock('@/views/operation/hooks/useScrollAnimation', async () => {
  const { shallowRef } = await vi.importActual<typeof import('vue')>('vue')

  return {
    useScrollAnimation: () => Array.from({ length: 5 }, () => shallowRef(null)),
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: { zh, en },
})

describe('August Developer Month page integration', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/operation')
  })

  it('renders the scheduled activity banner inside the shared site Header', () => {
    expect(appSource).toContain('<SiteHeader v-if="showNavbar" />')
    expect(siteHeaderSource).toContain('<AugustDeveloperMonthBanner embedded />')
    expect(siteHeaderSource.indexOf('<AugustDeveloperMonthBanner embedded />')).toBeLessThan(
      siteHeaderSource.indexOf('<div class="main-nav-row">'),
    )
    expect(homePageSource).not.toContain('<HomeHeader')
  })

  it('uses the shared Header banner instead of a second pricing-page banner', () => {
    expect(pricingPageSource).not.toContain('AugustDeveloperMonthBanner')
    expect(pricingPageSource).toContain('<div class="pricing-page-shell">')
    expect(pricingPageSource).toMatch(/\.pricing-page-shell\s*\{[^}]*width: 100%;/)
  })

  it('renders August Developer Month as the first long-term activity', () => {
    const wrapper = shallowMount(OperationPage, {
      global: {
        plugins: [i18n],
        stubs: { NDataTable: true, RouterLink: true },
      },
    })
    const activityRows = wrapper.findAll('[data-activity-row]')
    const ledgerStyles = operationPageSource.match(/\.activity-ledger\s*\{([\s\S]*?)\n\}/)?.[1]
    const rowStyles = operationPageSource.match(/\.activity-row\s*\{([\s\S]*?)\n\}/)?.[1]
    const linkStyles = operationPageSource.match(/\n\.activity-link\s*\{([\s\S]*?)\n\}/)?.[1]

    expect(operationPageSource).toContain(
      "import AugustDeveloperMonthEntry from './components/AugustDeveloperMonthEntry.vue'",
    )
    expect(operationPageSource).not.toContain(
      "import AugustDeveloperMonthSection from './components/AugustDeveloperMonthSection.vue'",
    )
    expect(operationPageSource).toContain('<AugustDeveloperMonthEntry')
    expect(wrapper.findComponent(AugustDeveloperMonthSection).exists()).toBe(false)
    expect(activityRows).toHaveLength(6)
    expect(wrapper.findAll('[data-activity-status="active"]')).toHaveLength(5)
    expect(wrapper.findAll('[data-activity-status="ended"]')).toHaveLength(1)
    expect(wrapper.findAll('.activity-link')).toHaveLength(5)
    expect(wrapper.findAll('.card-base')).toHaveLength(0)
    expect(wrapper.findAll('.card-history')).toHaveLength(0)
    expect(wrapper.findAll('.cta-btn')).toHaveLength(0)
    expect(wrapper.find('table.contribution-table').exists()).toBe(true)
    expect(wrapper.findAll('.activity-row--contribution')).toHaveLength(1)
    expect(wrapper.find('.activity-invite-details').text()).toContain('进入个人中心')
    expect(wrapper.find('.activity-invite-details').text()).toContain(
      '每成功邀请 1 位新用户，奖励 400 Credits',
    )
    expect(wrapper.text()).toContain('提交 PR 并被合并')
    expect(ledgerStyles).toContain('width: min(1120px, calc(100% - 48px))')
    expect(ledgerStyles).toContain('padding-top: 16px')
    expect(rowStyles).toContain('border-bottom: 1px solid rgba(255, 255, 255, 0.14)')
    expect(linkStyles).toContain('color: rgba(132, 193, 255, 0.88)')
    expect(operationPageSource).toMatch(
      /\.activity-row--ended \.activity-title-line h3[\s\S]*?rgba\(255, 255, 255, 0\.54\)/,
    )
    expect(operationPageSource).toMatch(
      /\.activity-row--contribution \.activity-main\s*\{[\s\S]*?grid-column: 2 \/ -1/,
    )
    expect(operationPageSource).toMatch(
      /\.activity-ledger:not\(\.activity-ledger--history\)[\s\S]*?\.activity-row:last-child[\s\S]*?border-bottom: 0/,
    )
    expect(operationPageSource).toMatch(
      /\.activity-row--ended \.activity-status\s*\{[\s\S]*?rgba\(255, 255, 255, 0\.66\)/,
    )
    expect(operationPageSource.indexOf('<AugustDeveloperMonthEntry')).toBeGreaterThan(
      operationPageSource.indexOf('<div class="activity-list">'),
    )
    expect(operationPageSource.indexOf('<AugustDeveloperMonthEntry')).toBeLessThan(
      operationPageSource.indexOf('ref="card1Ref"'),
    )
  })

  it('registers the standalone August campaign route', () => {
    const augustRoute = routes.find((route) => route.path === '/operation/august-developer-month')

    expect(augustRoute).toBeDefined()
    expect(augustRoute?.name).toBe('augustDeveloperMonth')
    expect(augustRoute?.meta?.hideNavbar).toBeUndefined()
  })

  it('renders the complete standalone campaign without stage resolution or activity rows', async () => {
    const augustRoute = routes.find((route) => route.path === '/operation/august-developer-month')

    expect(augustRoute).toBeDefined()
    window.history.replaceState({}, '', '/operation/august-developer-month')

    const pageModule = await (
      augustRoute?.component as () => Promise<{ default: import('vue').Component }>
    )()
    const wrapper = shallowMount(pageModule.default, {
      global: {
        plugins: [i18n],
        stubs: { RouterLink: true },
      },
    })

    expect(wrapper.findComponent(AugustDeveloperMonthSection).props()).toEqual({})
    expect(wrapper.findAll('[data-activity-row]')).toHaveLength(0)
    expect(augustPageSource).not.toContain('resolveAugustDeveloperMonthStage')
    expect(augustPageSource).not.toContain('pt-16')
    expect(augustPageSource).not.toContain('<HomeHeader')
    expect(augustPageSource).toContain('padding-top: 0')
  })

  it('uses the shared navigation on homepage, campaign, and existing site routes', () => {
    const augustRoute = routes.find((route) => route.path === '/operation/august-developer-month')
    const homeRoute = routes.find((route) => route.path === '/')

    expect(homeRoute?.meta?.hideNavbar).toBeUndefined()
    expect(augustRoute?.meta?.hideNavbar).toBeUndefined()
    expect(appSource).toContain('<SiteHeader v-if="showNavbar" />')
    expect(appSource).toContain('route.meta.hideNavbar !== true')
    expect(siteHeaderSource).toContain('noticeEnabled: true')
    expect(siteHeaderSource).toContain("!['home', 'augustDeveloperMonth'].includes")
    expect(siteHeaderSource).toContain(
      "'--brand-opacity': `${isHomeRoute.value ? 1 - progress : 1}`",
    )
  })

  it('removes unavailable English navigation items without leaving placeholders', () => {
    expect(siteHeaderSource).toContain("const isEnglish = computed(() => locale.value === 'en')")
    expect(siteHeaderSource).toMatch(
      /v-if="!isEnglish"[\s\S]*?activeNav === 'pricing'[\s\S]*?home\.redesign\.header\.pricing/,
    )
    expect(siteHeaderSource).toMatch(
      /v-if="!isEnglish"[\s\S]*?activeNav === 'blog'[\s\S]*?home\.redesign\.header\.blog/,
    )
    expect(siteHeaderSource).toContain(
      '<button v-if="!isEnglish" type="button" @click="navigateMobile(\'pricing\')">',
    )
    expect(siteHeaderSource).toContain(
      '<button v-if="!isEnglish" type="button" @click="navigateMobile(\'blog\')">',
    )
  })
})
