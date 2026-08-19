<template>
  <div class="home-page">
    <HomeHeader />
    <HomeLogoTraveler />
    <main>
      <SloganSection />
      <ProductEnvironment />
      <CapabilityShowcase />
      <HomeDarkLightTransition />
      <OrganizationValue />
      <HomeFaq />
      <HomeFinalCta />
    </main>
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import HomeHeader from './components/HomeHeader.vue'
import HomeLogoTraveler from './components/HomeLogoTraveler.vue'
import SloganSection from './SloganSection.vue'
import ProductEnvironment from './components/ProductEnvironment.vue'
import CapabilityShowcase from './components/CapabilityShowcase.vue'
import HomeDarkLightTransition from './components/HomeDarkLightTransition.vue'
import OrganizationValue from './components/OrganizationValue.vue'
import HomeFaq from './components/HomeFaq.vue'
import HomeFinalCta from './components/HomeFinalCta.vue'
import HomeFooter from './components/HomeFooter.vue'

defineOptions({
  name: 'HomeIndex',
})

useScrollReveal()

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CoStrict',
  url: 'https://costrict.ai/',
  logo: 'https://costrict.ai/favicon.png',
  description: 'CoStrict 是面向真实研发流程的企业级 AI 编程平台',
  sameAs: ['https://github.com/zgsm-ai/costrict'],
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CoStrict',
  operatingSystem: 'Windows, macOS, Linux',
  applicationCategory: 'DeveloperApplication',
}

useHead({
  title: 'CoStrict - 企业级 AI 研发基础设施',
  meta: [
    {
      name: 'description',
      content: 'CoStrict 让 AI 进入真实研发流程，把个人效率转化为可复用、可治理的组织研发能力。',
    },
    { property: 'og:title', content: 'CoStrict - 企业级 AI 研发基础设施' },
    {
      property: 'og:description',
      content: '让 AI 进入真实研发流程，把个人效率转化为可复用、可治理的组织研发能力。',
    },
    { property: 'og:url', content: 'https://costrict.ai/' },
    { property: 'og:image', content: 'https://costrict.ai/og-image.png' },
    { name: 'twitter:title', content: 'CoStrict - 企业级 AI 研发基础设施' },
    {
      name: 'twitter:description',
      content: '让 AI 进入真实研发流程，把个人效率转化为可复用、可治理的组织研发能力。',
    },
    { name: 'twitter:image', content: 'https://costrict.ai/og-image.png' },
  ],
  link: [{ rel: 'canonical', href: 'https://costrict.ai/' }],
  script: [
    {
      key: 'organization-json-ld',
      type: 'application/ld+json',
      textContent: JSON.stringify(organizationSchema),
    },
    {
      key: 'software-application-json-ld',
      type: 'application/ld+json',
      textContent: JSON.stringify(softwareApplicationSchema),
    },
  ],
})
</script>

<style scoped lang="less">
.home-page {
  min-width: 0;
  overflow-x: clip;
  overflow-y: visible;
  color: var(--color-home-text);
  background: var(--color-home-bg);
  font-family:
    'PingFang SC',
    'Microsoft YaHei',
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

:global([data-home-reveal]) {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 650ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

:global([data-home-reveal='content']) {
  transition-delay: 110ms;
}

:global([data-home-reveal].is-revealed) {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  :global([data-home-reveal]) {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
