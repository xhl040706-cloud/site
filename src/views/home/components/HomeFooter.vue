<template>
  <footer class="home-footer">
    <div class="footer-inner" data-home-reveal="content">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="brand-lockup">
            <img src="@/assets/logo.webp" alt="" />
            <span>CoStrict</span>
          </div>
          <p>{{ t('home.redesign.footer.tagline') }}</p>
        </div>

        <nav class="footer-columns" aria-label="Footer navigation">
          <div v-for="column in columns" :key="column.key" class="footer-column">
            <h2>{{ column.title }}</h2>
            <button
              v-for="link in column.links"
              :key="link.key"
              type="button"
              @click="navigate(link.key)"
            >
              {{ link.label }}
            </button>
          </div>
        </nav>
      </div>

      <div class="footer-bottom">
        <span>© {{ currentYear }} CoStrict</span>
        <button class="footer-github" type="button" @click="navigate('github')">GitHub</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'HomeFooter',
})

interface FooterLink {
  key: string
  label: string
}

interface FooterColumn {
  key: string
  title: string
  links: FooterLink[]
}

const { t } = useI18n()
const router = useRouter()
const currentYear = new Date().getFullYear()

const columns = computed<FooterColumn[]>(() => [
  {
    key: 'product',
    title: t('home.redesign.footer.product'),
    links: [
      { key: 'cloud', label: 'Cloud' },
      { key: 'cli', label: 'CLI' },
      { key: 'ide', label: t('home.redesign.footer.ide') },
    ],
  },
  {
    key: 'resources',
    title: t('home.redesign.footer.resources'),
    links: [
      { key: 'docs', label: t('home.redesign.header.docs') },
      { key: 'blog', label: t('home.redesign.header.blog') },
      { key: 'pricing', label: t('home.redesign.header.pricing') },
    ],
  },
  {
    key: 'enterprise',
    title: t('home.redesign.footer.enterprise'),
    links: [{ key: 'enterprise', label: t('home.redesign.header.enterprise') }],
  },
])

const openExternal = (url: string) => window.open(url, '_blank', 'noopener')

const navigate = (key: string) => {
  if (key === 'cloud') return void router.push({ name: 'cloud' })
  if (key === 'cli') {
    return void router.push({ name: 'download', query: { product: 'cli', tab: 'cli' } })
  }
  if (key === 'ide') {
    return void router.push({ name: 'download', query: { product: 'ide', tab: 'vscode' } })
  }
  if (key === 'blog' || key === 'pricing') {
    return void router.push({ name: key })
  }
  if (key === 'docs') return openExternal('https://docs.costrict.ai')
  if (key === 'enterprise') {
    return openExternal('https://docs.costrict.ai/deployment/introduction/')
  }
  if (key === 'github') return openExternal('https://github.com/zgsm-ai/costrict')
}
</script>

<style scoped lang="less">
.home-footer {
  padding-top: 42px;
  background: #050505;
}

.footer-inner {
  position: relative;
  z-index: 2;
  width: min(1280px, calc(100% - 160px));
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 80px;
}

.brand-lockup {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 28px;
    height: 28px;
  }

  span {
    color: #f3f7fb;
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
  }
}

.footer-brand p {
  max-width: 320px;
  margin: 16px 0 0;
  color: #718196;
  font-size: 14px;
  line-height: 22px;
}

.footer-columns {
  display: grid;
  grid-template-columns: 140px 140px 120px;
  gap: 56px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    margin: 0 0 12px;
    color: #a9b5c2;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
  }

  button {
    padding: 0;
    border: 0;
    color: #718196;
    background: transparent;
    font: inherit;
    font-size: 13px;
    line-height: 22px;
    text-align: left;
    cursor: pointer;
    transition: color 180ms ease;

    &:hover {
      color: #eaf1f7;
    }
  }
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 44px;
  padding: 20px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.045);
  color: #536276;
  font-size: 12px;
  line-height: 18px;
}

.footer-github {
  padding: 0;
  border: 0;
  color: #536276;
  background: transparent;
  font: inherit;
  cursor: pointer;
  transition: color 180ms ease;

  &:hover {
    color: #a9b5c2;
  }
}

/* 覆盖全局 reveal：Footer 只允许极轻进入动效 */
.footer-inner[data-home-reveal] {
  opacity: 1;
  transform: none;
  transition: none;
}

.footer-brand,
.footer-column,
.footer-bottom {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 550ms ease,
    transform 550ms ease;
}

.footer-inner.is-revealed {
  .footer-brand,
  .footer-column,
  .footer-bottom {
    opacity: 1;
    transform: none;
  }

  .footer-column:nth-child(1) {
    transition-delay: 50ms;
  }

  .footer-column:nth-child(2) {
    transition-delay: 100ms;
  }

  .footer-column:nth-child(3) {
    transition-delay: 150ms;
  }

  .footer-bottom {
    transition-delay: 200ms;
  }
}

@media (max-width: 1023px) {
  .footer-inner {
    width: calc(100% - 64px);
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 767px) {
  .home-footer {
    padding: 40px 24px 24px;
  }

  .footer-inner {
    width: 100%;
  }

  .footer-columns {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
    margin-top: 40px;
  }

  .footer-main {
    gap: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-brand,
  .footer-column,
  .footer-bottom {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .footer-column button,
  .footer-github {
    transition: none;
  }
}
</style>
