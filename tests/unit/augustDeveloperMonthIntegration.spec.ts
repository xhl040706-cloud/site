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
  it('renders the activity banner before the homepage Hero', () => {
    const wrapper = shallowMount(HomeIndex, { global: { plugins: [i18n] } })
    const banner = wrapper.findComponent(AugustDeveloperMonthBanner)
    const hero = wrapper.findComponent({ name: 'SloganSection' })
    const surveyGift = wrapper.findComponent({ name: 'SurveyGiftEntry' })

    expect(banner.exists()).toBe(true)
    expect(hero.exists()).toBe(true)
    expect(wrapper.html().indexOf(banner.html())).toBeLessThan(wrapper.html().indexOf(hero.html()))
    expect(surveyGift.classes()).toContain('max-md:top-[124px]')
  })

  it('renders the August details before existing active activities', () => {
    const wrapper = shallowMount(OperationPage, {
      global: {
        plugins: [i18n],
        stubs: { NDataTable: true, RouterLink: true },
      },
    })
    const augustSection = wrapper.findComponent(AugustDeveloperMonthSection)
    const activeActivities = wrapper.find('[data-section="active-activities"]')

    expect(augustSection.exists()).toBe(true)
    expect(activeActivities.exists()).toBe(true)
    expect(
      augustSection.element.compareDocumentPosition(activeActivities.element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
