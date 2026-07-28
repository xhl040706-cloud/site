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
    expect(link.props('to')).toBe('/operation#august-2026')
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
