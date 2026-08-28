<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ideWorkflowEnVideo from '@/assets/video/ide_workflow_en.mp4'
import ideWorkflowZhVideo from '@/assets/video/ide_workflow_zh.mp4'

defineOptions({
  name: 'IdeWorkflow',
})

type WorkflowZoneKey = 'interaction' | 'agent' | 'changes'

interface WorkflowZone {
  key: WorkflowZoneKey
  number: string
  label: string
  title: string
  description: string
}

const { t, locale } = useI18n()

const isEnglish = computed(() => locale.value.startsWith('en'))
const videoMedia = computed(() =>
  isEnglish.value
    ? { source: ideWorkflowEnVideo, aspectRatio: '1719 / 1080' }
    : { source: ideWorkflowZhVideo, aspectRatio: '1719 / 1080' },
)
const workflowZoneKeys = ['interaction', 'agent', 'changes'] as const

const zones = computed<WorkflowZone[]>(() =>
  workflowZoneKeys.map((key, index) => ({
    key,
    number: String(index + 1).padStart(2, '0'),
    label: t(`ide.workflow.zones.${key}.label`),
    title: t(`ide.workflow.zones.${key}.title`),
    description: t(`ide.workflow.zones.${key}.description`),
  })),
)
</script>

<template>
  <section class="ide-workflow" aria-labelledby="ide-workflow-title">
    <div class="workflow-inner">
      <header class="section-heading" data-home-reveal="heading">
        <h2 id="ide-workflow-title">{{ t('ide.workflow.title') }}</h2>
        <p>{{ t('ide.workflow.subtitle') }}</p>
      </header>

      <div class="workflow-scroll-shell">
        <div class="workflow-stage" :class="{ 'is-reversed': isEnglish }">
          <article
            v-for="zone in zones"
            :key="zone.key"
            class="zone-callout"
            :class="`is-${zone.key}`"
          >
            <span class="zone-meta">
              <code>{{ zone.number }}</code>
              <small>{{ zone.label }}</small>
            </span>
            <h3>{{ zone.title }}</h3>
            <p>{{ zone.description }}</p>
            <span class="zone-guide" aria-hidden="true"><i></i></span>
          </article>

          <div class="stage-media" :style="{ aspectRatio: videoMedia.aspectRatio }">
            <video
              :key="videoMedia.source"
              class="stage-video"
              :src="videoMedia.source"
              :aria-label="t('ide.workflow.demo.videoLabel')"
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
              controls
            ></video>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.ide-workflow {
  padding: 24px 0 16px;
  color: #f3f7fb;
  background: #050505;
}

.workflow-inner {
  width: min(1240px, calc(100% - 48px));
  margin: 0 auto;
}

.section-heading {
  width: min(var(--home-content-max-width), calc(100vw - (2 * var(--home-page-gutter))));
  max-width: 760px;
  margin-left: max(
    0px,
    calc(
      (100% - min(var(--home-content-max-width), calc(100vw - (2 * var(--home-page-gutter))))) / 2
    )
  );

  h2 {
    margin: 0;
    font-size: 38px;
    font-weight: 600;
    line-height: 46px;
  }

  p {
    max-width: 700px;
    margin: 12px 0 0;
    color: #8495aa;
    font-size: 15px;
    line-height: 26px;
  }
}

.workflow-scroll-shell {
  margin-top: 26px;
}

.workflow-stage {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 460px;
  grid-template-columns: minmax(180px, 194px) minmax(0, 800px) minmax(180px, 194px);
  grid-template-rows: repeat(2, minmax(0, 1fr));
  justify-content: center;
  column-gap: 22px;
  isolation: isolate;
}

.zone-callout {
  --zone-color: #12e6c2;

  position: relative;
  z-index: 2;
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;

  &.is-agent,
  &.is-interaction {
    grid-column: 1;
    align-items: flex-end;
    padding-right: 2px;
    text-align: right;
  }

  &.is-agent {
    --zone-color: #3b8cff;

    grid-row: 1;
  }

  &.is-interaction {
    --zone-color: #ff6b62;

    grid-row: 2;
  }

  &.is-changes {
    grid-column: 3;
    grid-row: 1 / -1;
    align-items: flex-start;
    align-self: center;
    padding-left: 2px;
    text-align: left;
  }

  h3 {
    max-width: 230px;
    margin: 10px 0 0;
    color: #dbe5ed;
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
  }

  p {
    max-width: 230px;
    margin: 7px 0 0;
    color: #68798b;
    font-size: 11px;
    line-height: 19px;
  }
}

.zone-meta {
  display: inline-flex;
  align-items: center;
  gap: 9px;

  code {
    padding-right: 9px;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--zone-color);
    font-family: 'SF Mono', 'Consolas', monospace;
    font-size: 10px;
    line-height: 15px;
  }

  small {
    color: #8c9cad;
    font-size: 11px;
    font-weight: 600;
    line-height: 16px;
  }
}

.zone-guide {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 1px;
  background: color-mix(in srgb, var(--zone-color) 58%, transparent);
  transform: translateY(-50%);

  .is-agent &,
  .is-interaction & {
    right: -30px;
  }

  .is-changes & {
    left: -30px;
  }

  i {
    position: absolute;
    top: 50%;
    width: 7px;
    height: 7px;
    border: 1px solid var(--zone-color);
    border-radius: 50%;
    background: #050505;
    transform: translateY(-50%);
  }

  .is-agent & i,
  .is-interaction & i {
    right: -3px;
  }

  .is-changes & i {
    left: -3px;
  }
}

.workflow-stage.is-reversed {
  .zone-callout.is-agent,
  .zone-callout.is-interaction {
    grid-column: 3;
    align-items: flex-start;
    padding-right: 0;
    padding-left: 2px;
    text-align: left;

    .zone-guide {
      right: auto;
      left: -30px;

      i {
        right: auto;
        left: -3px;
      }
    }
  }

  .zone-callout.is-changes {
    grid-column: 1;
    align-items: flex-end;
    padding-right: 2px;
    padding-left: 0;
    text-align: right;

    .zone-guide {
      right: -30px;
      left: auto;

      i {
        right: -3px;
        left: auto;
      }
    }
  }
}

.stage-media {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  align-self: center;
  grid-column: 2;
  grid-row: 1 / -1;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  background: #080b0f;
  box-shadow: 0 28px 84px rgba(0, 0, 0, 0.48);
}

.stage-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #080b0f;
}

@media (max-width: 1279px) {
  .workflow-stage {
    grid-template-columns: minmax(150px, 176px) minmax(0, 760px) minmax(150px, 176px);
    column-gap: 20px;
  }

  .zone-callout {
    h3 {
      max-width: 188px;
      font-size: 14px;
      line-height: 21px;
    }

    p {
      max-width: 188px;
      font-size: 10px;
      line-height: 17px;
    }
  }

  .zone-guide {
    width: 24px;

    .is-agent &,
    .is-interaction & {
      right: -24px;
    }

    .is-changes & {
      left: -24px;
    }
  }

  .workflow-stage.is-reversed {
    .zone-callout.is-agent .zone-guide,
    .zone-callout.is-interaction .zone-guide {
      left: -24px;
    }

    .zone-callout.is-changes .zone-guide {
      right: -24px;
    }
  }
}

@media (max-width: 1199px) {
  .workflow-inner {
    width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  }

  .section-heading {
    width: 100%;
    margin-left: 0;
  }

  .workflow-stage {
    min-height: 0;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: auto;
    gap: 0 20px;
  }

  .stage-media {
    width: 100%;
    max-width: 800px;
    justify-self: center;
    grid-column: 1 / -1;
    grid-row: auto;
    order: -1;
  }

  .zone-callout,
  .zone-callout.is-agent,
  .zone-callout.is-interaction,
  .zone-callout.is-changes {
    min-height: 154px;
    align-items: flex-start;
    align-self: stretch;
    grid-column: auto;
    grid-row: auto;
    padding: 22px 0 18px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    text-align: left;

    h3,
    p {
      max-width: none;
    }
  }

  .workflow-stage.is-reversed {
    .zone-callout.is-agent,
    .zone-callout.is-interaction,
    .zone-callout.is-changes {
      align-items: flex-start;
      grid-column: auto;
      padding: 22px 0 18px 14px;
      text-align: left;
    }
  }

  .zone-callout.is-agent {
    order: 2;
  }

  .zone-callout.is-interaction {
    order: 1;
  }

  .zone-callout.is-changes {
    order: 3;
  }

  .zone-guide {
    display: none;
  }
}

@media (max-width: 767px) {
  .ide-workflow {
    padding: 36px 0;
  }

  .section-heading h2 {
    font-size: 32px;
    line-height: 40px;
  }

  .workflow-scroll-shell {
    margin-top: 36px;
  }

  .workflow-stage {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .stage-media {
    grid-column: 1;
  }

  .zone-callout,
  .zone-callout.is-agent,
  .zone-callout.is-interaction,
  .zone-callout.is-changes {
    min-height: 128px;
    grid-column: 1;
    padding: 20px 0 18px 14px;

    h3 {
      font-size: 15px;
      line-height: 22px;
    }

    p {
      font-size: 11px;
      line-height: 19px;
    }
  }
}
</style>
