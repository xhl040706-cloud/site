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
    const content = wrapper.text()

    expect(wrapper.attributes('id')).toBe('august-2026')
    for (const expectedText of [
      'CoStrict 8月开发者福利月',
      '8月1日',
      '8月5日',
      '8月14日',
      '有效期自动升级至12个月',
      '额外赠送20% Credits',
      'Kimi K3',
      'MiniMax M3',
      'step-3.7-flash',
      'mimo-v2.5-pro',
      '日常编码',
      '复杂代码分析',
      '企业级开发',
      '图片转代码',
      'CoStrict Cloud',
      'AI Native',
      '安全能力',
      '企业知识库',
      '技能市场',
      '多层级AI Coding数据看板',
      'CI/CD',
    ]) {
      expect(content).toContain(expectedText)
    }
  })

  it('renders English content without missing translation keys', () => {
    const wrapper = mountSection('en')

    expect(wrapper.text()).toContain('CoStrict August Developer Month')
    expect(wrapper.text()).toContain('12 months')
    expect(wrapper.text()).toContain('20% bonus Credits')
    expect(wrapper.text()).not.toContain('operation.august')
  })
})
