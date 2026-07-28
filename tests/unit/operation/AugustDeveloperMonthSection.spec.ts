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
