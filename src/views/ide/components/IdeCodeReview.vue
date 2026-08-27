<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import codeReviewPoster from '@/assets/codeReview/codereview_buffer.webp'
import codeReviewEnVideo from '@/assets/video/code_review_en.mp4'
import codeReviewZhVideo from '@/assets/video/code_review_zh.mp4'

defineOptions({
  name: 'IdeCodeReview',
})

interface CodeReviewMedia {
  video: string
  aspectRatio: string
}

const { t, locale } = useI18n()

const currentMedia = computed<CodeReviewMedia>(() =>
  locale.value.startsWith('en')
    ? { video: codeReviewEnVideo, aspectRatio: '1736 / 1080' }
    : { video: codeReviewZhVideo, aspectRatio: '2544 / 1440' },
)
</script>

<template>
  <section class="ide-code-review" aria-labelledby="ide-code-review-title">
    <div class="code-review-inner">
      <header class="section-heading" data-home-reveal="heading">
        <h2 id="ide-code-review-title">{{ t('ide.codeReview.title') }}</h2>
        <p>{{ t('ide.codeReview.description') }}</p>
      </header>

      <div
        class="video-frame"
        data-home-reveal="content"
        :style="{ aspectRatio: currentMedia.aspectRatio }"
      >
        <video
          :key="currentMedia.video"
          :src="currentMedia.video"
          :poster="codeReviewPoster"
          :aria-label="t('ide.codeReview.videoLabel')"
          preload="metadata"
          autoplay
          muted
          loop
          playsinline
          controls
        ></video>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.ide-code-review {
  padding: 64px 0;
  color: #f3f7fb;
  background: #080808;
}

.code-review-inner {
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

.section-heading {
  width: 100%;
  margin: 0;
  text-align: left;

  h2 {
    margin: 0;
    font-size: 38px;
    font-weight: 600;
    line-height: 46px;
    letter-spacing: 0;
  }

  p {
    width: 100%;
    margin: 20px 0 0;
    color: #8995a3;
    font-size: 16px;
    line-height: 29px;
    letter-spacing: 0;
  }
}

.video-frame {
  overflow: hidden;
  width: 100%;
  margin-top: 48px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: #030405;
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.32);

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #030405;
  }
}

@media (max-width: 1023px) {
  .ide-code-review {
    padding: 60px 0 64px;
  }

  .section-heading h2 {
    font-size: 38px;
    line-height: 46px;
  }
}

@media (max-width: 767px) {
  .ide-code-review {
    padding: 56px 0 60px;
  }

  .section-heading {
    text-align: left;

    h2 {
      font-size: 32px;
      line-height: 40px;
    }

    p {
      margin-top: 16px;
      font-size: 14px;
      line-height: 24px;
    }
  }

  .video-frame {
    margin-top: 32px;
  }
}
</style>
