<template>
  <section class="home-final-cta" aria-labelledby="final-cta-title">
    <div class="cta-texture cta-texture-left" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-left.webp" alt="" />
    </div>
    <div class="cta-texture cta-texture-right" aria-hidden="true">
      <img src="@/assets/home/redesign/hero-texture-right.webp" alt="" />
    </div>
    <div class="cta-particles" aria-hidden="true">
      <ParticleField variant="closing" :interactive="false" />
    </div>

    <div class="cta-inner" data-home-reveal="content">
      <h2 id="final-cta-title">{{ t('home.redesign.finalCta.title') }}</h2>
      <p>{{ t('home.redesign.finalCta.description') }}</p>
      <div class="cta-actions">
        <button class="cta-button cta-button-primary" type="button" @click="toDownload">
          {{ t('home.redesign.finalCta.primary') }}
        </button>
        <button class="cta-button cta-button-secondary" type="button" @click="toCloud">
          {{ t('home.redesign.finalCta.secondary') }}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ParticleField from '@/components/particle/ParticleField.vue'

defineOptions({
  name: 'HomeFinalCta',
})

const { t } = useI18n()
const router = useRouter()

const toDownload = () => router.push({ name: 'download' })
const toCloud = () => router.push({ name: 'cloud' })
</script>

<style scoped lang="less">
.home-final-cta {
  position: relative;
  background: #050505;
}

.cta-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(760px, calc(100% - 48px));
  min-height: 372px;
  margin: 0 auto;
  padding-top: 72px;
  text-align: center;

  h2 {
    max-width: 760px;
    margin: 0;
    color: #f3f7fb;
    font-size: 42px;
    font-weight: 600;
    line-height: 52px;
  }

  p {
    margin: 16px 0 0;
    color: #8495aa;
    font-size: 16px;
    line-height: 28px;
  }
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 26px;
}

.cta-button {
  height: 46px;
  padding: 0 22px;
  border: 0;
  border-radius: 10px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition:
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    color var(--motion-fast) ease;

  span {
    display: inline-block;
    margin-left: 4px;
  }
}

.cta-button-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #347fff 0%, #279fe9 55%, #22c7d9 100%);
  box-shadow:
    0 9px 26px rgba(43, 143, 242, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    background: linear-gradient(135deg, #438bff 0%, #33aaef 55%, #2dd3e2 100%);
  }
}

.cta-button-secondary {
  border: 1px solid rgba(255, 255, 255, 0.11);
  color: #edf2f7;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.065);
  }
}

.cta-texture {
  position: absolute;
  z-index: 0;
  pointer-events: none;

  img {
    display: block;
    width: 100%;
    height: auto;
    filter: brightness(0.74) saturate(0.62) contrast(1.04);
    -webkit-mask-image: radial-gradient(ellipse 72% 68% at 50% 50%, #000 22%, transparent 74%);
    mask-image: radial-gradient(ellipse 72% 68% at 50% 50%, #000 22%, transparent 74%);
  }
}

.cta-texture-left {
  top: 20%;
  left: -160px;
  width: 520px;
  opacity: 0.08;
}

.cta-texture-right {
  top: 14%;
  right: -150px;
  width: 500px;
  opacity: 0.075;
}

.cta-particles {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
}

@media (max-width: 767px) {
  .home-final-cta {
    padding: 64px 24px;
  }

  .cta-inner {
    width: 100%;
    min-height: 0;
    padding-top: 0;

    h2 {
      font-size: 34px;
      line-height: 44px;
    }
  }

  .cta-texture-left {
    left: -140px;
    width: 300px;
  }

  .cta-texture-right {
    right: -130px;
    width: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-button {
    transition: none;
  }
}
</style>
