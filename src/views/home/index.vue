<template>
  <div class="home-page">
    <HomeLogoTraveler />
    <main>
      <SloganSection />
      <ProductEnvironment />
      <CapabilityShowcase />
      <HomeDarkLightTransition />
      <OrganizationValue />
      <div class="home-closing-zone">
        <HomeFaq />
        <HomeFinalCta />
      </div>
    </main>
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/hooks/useScrollReveal'
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

const { t, locale } = useI18n()

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CoStrict',
  operatingSystem: 'Windows, macOS, Linux',
  applicationCategory: 'DeveloperApplication',
}

useHead(() => {
  const title = t('home.redesign.seo.title')
  const description = t('home.redesign.seo.description')
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CoStrict',
    url: 'https://costrict.ai/',
    logo: 'https://costrict.ai/favicon.png',
    description: t('home.redesign.seo.organizationDescription'),
    sameAs: ['https://github.com/zgsm-ai/costrict'],
  }

  return {
    htmlAttrs: { lang: locale.value === 'en' ? 'en' : 'zh-CN' },
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:locale', content: locale.value === 'en' ? 'en_US' : 'zh_CN' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: 'https://costrict.ai/' },
      { property: 'og:image', content: 'https://costrict.ai/og-image.png' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
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
  }
})
</script>

<style scoped lang="less">
.home-page {
  min-width: 0;
  overflow-x: clip;
  overflow-y: visible;
  color: var(--color-home-text);
  background: #050505;
  font-family:
    'PingFang SC',
    'Microsoft YaHei',
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.home-closing-zone {
  position: relative;
  background: #050505;
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
