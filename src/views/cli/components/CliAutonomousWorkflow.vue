<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CliTerminalFrame from './CliTerminalFrame.vue'
import cliBrandLogo from '@/assets/cli/costrict-terminal-logo.webp'

defineOptions({
  name: 'CliAutonomousWorkflow',
})

type WorkflowStageKey = 'analyze' | 'modify' | 'verify'
type TaskProgressKey = 'context' | 'scope' | 'plan' | 'modify' | 'test' | 'checkpoint'
type PermissionKey = 'read' | 'run' | 'change' | 'release'
type ToolKey = 'git' | 'lsp' | 'test' | 'ci'
type IntegrationContextKey = 'repository' | 'symbols' | 'tests'
type ScenarioKey = 'refactor' | 'upgrade' | 'migration' | 'ciFix'

interface WorkflowStage {
  key: WorkflowStageKey
  label: string
  title: string
  description: string
}

interface TaskProgressStep {
  key: TaskProgressKey
  label: string
  completedLabel: string
}

interface PermissionItem {
  key: PermissionKey
  label: string
  status: string
  gated: boolean
}

interface ToolItem {
  key: ToolKey
  label: string
}

interface IntegrationContextItem {
  key: IntegrationContextKey
  label: string
}

interface ScenarioItem {
  key: ScenarioKey
  title: string
  description: string
}

const { t } = useI18n()

const workflowStageKeys: WorkflowStageKey[] = ['analyze', 'modify', 'verify']
const taskProgressKeys: TaskProgressKey[] = [
  'context',
  'scope',
  'plan',
  'modify',
  'test',
  'checkpoint',
]
const permissionKeys: PermissionKey[] = ['read', 'run', 'change', 'release']
const toolKeys: ToolKey[] = ['git', 'lsp', 'test', 'ci']
const integrationContextKeys: IntegrationContextKey[] = ['repository', 'symbols', 'tests']
const scenarioKeys: ScenarioKey[] = ['refactor', 'upgrade', 'migration', 'ciFix']

const workflowStages = computed<WorkflowStage[]>(() =>
  workflowStageKeys.map((key) => ({
    key,
    label: t(`cli.autonomy.loop.workflow.stages.${key}.label`),
    title: t(`cli.autonomy.loop.workflow.stages.${key}.title`),
    description: t(`cli.autonomy.loop.workflow.stages.${key}.description`),
  })),
)

const taskProgressSteps = computed<TaskProgressStep[]>(() =>
  taskProgressKeys.map((key) => ({
    key,
    label: t(`cli.autonomy.state.steps.${key}.label`),
    completedLabel: t(`cli.autonomy.state.steps.${key}.completedLabel`),
  })),
)

const permissions = computed<PermissionItem[]>(() =>
  permissionKeys.map((key) => ({
    key,
    label: t(`cli.autonomy.security.permissions.${key}.label`),
    status: t(`cli.autonomy.security.permissions.${key}.status`),
    gated: key === 'release',
  })),
)

const tools = computed<ToolItem[]>(() =>
  toolKeys.map((key) => ({
    key,
    label: t(`cli.autonomy.integration.tools.${key}`),
  })),
)

const integrationContextItems = computed<IntegrationContextItem[]>(() =>
  integrationContextKeys.map((key) => ({
    key,
    label: t(`cli.autonomy.integration.visual.context.${key}`),
  })),
)

const scenarios = computed<ScenarioItem[]>(() =>
  scenarioKeys.map((key) => ({
    key,
    title: t(`cli.autonomy.scenarios.items.${key}.title`),
    description: t(`cli.autonomy.scenarios.items.${key}.description`),
  })),
)

const activeTaskStep = ref(0)
const activeWorkflowStage = ref(0)
const activeIntegrationTool = ref(0)
let taskProgressTimer: ReturnType<typeof window.setTimeout> | undefined
let workflowProgressTimer: ReturnType<typeof window.setTimeout> | undefined
let integrationProgressTimer: ReturnType<typeof window.setTimeout> | undefined

const clearTaskProgressTimer = () => {
  if (taskProgressTimer) window.clearTimeout(taskProgressTimer)
  taskProgressTimer = undefined
}

const clearWorkflowProgressTimer = () => {
  if (workflowProgressTimer) window.clearTimeout(workflowProgressTimer)
  workflowProgressTimer = undefined
}

const clearIntegrationProgressTimer = () => {
  if (integrationProgressTimer) window.clearTimeout(integrationProgressTimer)
  integrationProgressTimer = undefined
}

const advanceTaskProgress = () => {
  if (activeTaskStep.value < taskProgressSteps.value.length) {
    activeTaskStep.value += 1
    taskProgressTimer = window.setTimeout(advanceTaskProgress, 1100)
    return
  }

  taskProgressTimer = window.setTimeout(() => {
    activeTaskStep.value = 0
    taskProgressTimer = window.setTimeout(advanceTaskProgress, 700)
  }, 1800)
}

const advanceWorkflowProgress = () => {
  activeWorkflowStage.value = (activeWorkflowStage.value + 1) % workflowStages.value.length
  workflowProgressTimer = window.setTimeout(advanceWorkflowProgress, 1550)
}

const advanceIntegrationProgress = () => {
  activeIntegrationTool.value = (activeIntegrationTool.value + 1) % tools.value.length
  integrationProgressTimer = window.setTimeout(advanceIntegrationProgress, 1350)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activeTaskStep.value = taskProgressSteps.value.length
    return
  }

  taskProgressTimer = window.setTimeout(advanceTaskProgress, 900)
  workflowProgressTimer = window.setTimeout(advanceWorkflowProgress, 1550)
  integrationProgressTimer = window.setTimeout(advanceIntegrationProgress, 1350)
})

onBeforeUnmount(() => {
  clearTaskProgressTimer()
  clearWorkflowProgressTimer()
  clearIntegrationProgressTimer()
})
</script>

<template>
  <section class="cli-autonomy" aria-labelledby="cli-autonomy-title">
    <div class="autonomy-inner">
      <header class="autonomy-heading" data-home-reveal="heading">
        <h2 id="cli-autonomy-title">{{ t('cli.autonomy.title') }}</h2>
        <p>{{ t('cli.autonomy.description') }}</p>
      </header>

      <div class="autonomy-grid" data-home-reveal="content">
        <article class="autonomy-card autonomy-card--loop">
          <div class="autonomy-copy">
            <span class="feature-label">{{ t('cli.autonomy.loop.label') }}</span>
            <h3>{{ t('cli.autonomy.loop.title') }}</h3>
            <p>{{ t('cli.autonomy.loop.description') }}</p>
          </div>

          <div class="loop-visual" aria-hidden="true">
            <div class="workflow-board">
              <div class="workflow-board-header">
                <span>{{ t('cli.autonomy.loop.workflow.title') }}</span>
              </div>
              <div class="workflow-flow">
                <template v-for="(stage, index) in workflowStages" :key="stage.key">
                  <div class="workflow-node" :class="{ 'is-active': index === activeWorkflowStage }">
                    <span class="workflow-node-type">{{ stage.label }}</span>
                    <strong>{{ stage.title }}</strong>
                    <p>{{ stage.description }}</p>
                    <span
                      class="workflow-node-live"
                      :class="{ 'is-visible': index === activeWorkflowStage }"
                    >
                      <i></i>
                      {{ t('cli.autonomy.loop.workflow.running') }}
                    </span>
                  </div>
                  <span
                    v-if="index < workflowStages.length - 1"
                    class="workflow-connector"
                    :class="{ 'is-active': index < activeWorkflowStage }"
                  ></span>
                </template>
              </div>
            </div>
          </div>
        </article>

        <article class="autonomy-card autonomy-card--state">
          <div class="autonomy-copy">
            <span class="feature-label">{{ t('cli.autonomy.state.label') }}</span>
            <h3>{{ t('cli.autonomy.state.title') }}</h3>
            <p>{{ t('cli.autonomy.state.description') }}</p>
          </div>

          <div class="state-visual" aria-hidden="true">
            <div class="state-process-header">
              <span>{{ t('cli.autonomy.state.progressLabel') }}</span>
              <span>{{ activeTaskStep }}/{{ taskProgressSteps.length }}</span>
            </div>
            <div class="state-process-list">
              <div
                v-for="(step, index) in taskProgressSteps"
                :key="step.key"
                class="state-process-step"
                :class="{
                  'is-completed': index < activeTaskStep,
                  'is-active': index === activeTaskStep,
                }"
              >
                <span class="state-process-marker" aria-hidden="true"></span>
                <span class="state-process-label">
                  {{ index < activeTaskStep ? step.completedLabel : step.label }}
                </span>
                <span v-if="index === activeTaskStep" class="state-process-status">
                  {{ t('cli.autonomy.state.running') }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="cli-controls" aria-labelledby="cli-controls-title">
    <div class="controls-inner">
      <h2 id="cli-controls-title" class="visually-hidden">{{ t('cli.autonomy.controlsLabel') }}</h2>

      <div class="controls-grid" data-home-reveal="content">
        <article class="control-card control-card--security">
          <div class="control-copy">
            <span class="feature-label">{{ t('cli.autonomy.security.label') }}</span>
            <h3>{{ t('cli.autonomy.security.title') }}</h3>
            <p>{{ t('cli.autonomy.security.description') }}</p>
          </div>

          <div class="security-visual" aria-hidden="true">
            <div class="security-panel">
              <div class="security-panel-header">
                <span>{{ t('cli.autonomy.security.visual.title') }}</span>
                <span class="security-panel-status">
                  <i></i>
                  {{ t('cli.autonomy.security.visual.status') }}
                </span>
              </div>
              <div class="permission-options">
                <div
                  v-for="permission in permissions"
                  :key="permission.key"
                  class="permission-option"
                  :class="{ 'is-gated': permission.gated }"
                >
                  <span class="permission-checkbox">
                    <svg v-if="!permission.gated" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  </span>
                  <span class="permission-option-copy">
                    <strong>{{ permission.label }}</strong>
                    <em>{{ permission.status }}</em>
                  </span>
                </div>
              </div>
              <div class="security-confirmation">
                <span></span>
                <p>{{ t('cli.autonomy.security.visual.gatedHint') }}</p>
              </div>
            </div>
          </div>
        </article>

        <article class="control-card control-card--integration">
          <div class="control-copy">
            <span class="feature-label">{{ t('cli.autonomy.integration.label') }}</span>
            <h3>{{ t('cli.autonomy.integration.title') }}</h3>
            <p>{{ t('cli.autonomy.integration.description') }}</p>
          </div>

          <div class="integration-visual" aria-hidden="true">
            <div class="integration-panel">
              <div class="integration-panel-header">
                <span>{{ t('cli.autonomy.integration.visual.title') }}</span>
                <span>
                  <i></i>
                  {{ t('cli.autonomy.integration.visual.status') }}
                </span>
              </div>
              <div class="integration-console">
                <div class="integration-tool-list">
                  <span
                    v-for="(tool, index) in tools"
                    :key="tool.key"
                    class="integration-tool"
                    :class="{ 'is-active': index === activeIntegrationTool }"
                  >
                    <i></i>
                    {{ tool.label }}
                  </span>
                </div>

                <CliTerminalFrame class="integration-terminal" title="~/workspace" compact>
                  <div class="integration-terminal-body">
                    <div class="integration-terminal-command">
                      <span>developer@mac</span>
                      <span>~ %</span>
                      <strong>csc</strong>
                      <i aria-hidden="true"></i>
                    </div>
                    <img class="integration-terminal-brand" :src="cliBrandLogo" alt="" />
                    <div class="integration-terminal-details">
                      <span>
                        <b>[{{ t('cli.hero.terminalVersionLabel') }}]</b>
                        v4.2.30
                      </span>
                      <span>
                        <b>[{{ t('cli.hero.terminalModelLabel') }}]</b>
                        GLM-5.3
                      </span>
                      <span>
                        <b>[{{ t('cli.hero.terminalAccountLabel') }}]</b>
                        workspace
                      </span>
                    </div>
                  </div>
                </CliTerminalFrame>

                <div class="integration-context">
                  <div class="integration-context-header">
                    <span>{{ t('cli.autonomy.integration.visual.contextTitle') }}</span>
                    <span>{{ integrationContextItems.length }}</span>
                  </div>
                  <span
                    v-for="(item, index) in integrationContextItems"
                    :key="item.key"
                    class="integration-context-item"
                    :class="{ 'is-active': index === activeIntegrationTool % integrationContextItems.length }"
                  >
                    {{ item.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="scenario-section" data-home-reveal="content">
        <h3>{{ t('cli.autonomy.scenarios.title') }}</h3>
        <div class="scenario-grid">
          <article v-for="(scenario, index) in scenarios" :key="scenario.key" class="scenario-item">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <h4>{{ scenario.title }}</h4>
            <p>{{ scenario.description }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.cli-autonomy,
.cli-controls {
  color: #eef4fa;
  background: #050505;
}

.cli-autonomy {
  padding: 88px 0 16px;
}

.autonomy-inner,
.controls-inner {
  width: min(var(--home-content-max-width), calc(100% - (2 * var(--home-page-gutter))));
  margin: 0 auto;
}

.autonomy-heading {
  max-width: 920px;
  margin: 0 auto;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 42px;
    font-weight: 600;
    line-height: 54px;
  }

  p {
    margin: 18px 0 0;
    color: #92a2b5;
    font-size: 16px;
    line-height: 29px;
  }
}

.autonomy-grid,
.controls-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 50px;
}

.autonomy-card,
.control-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 520px;
  flex-direction: column;
  padding: 36px 40px 34px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 6px;
  background: #0a0a0a;
}

.autonomy-copy,
.control-copy {
  position: relative;
  z-index: 1;

  h3 {
    max-width: 520px;
    margin: 14px 0 0;
    color: #edf3f8;
    font-size: 25px;
    font-weight: 600;
    line-height: 35px;
  }

  p {
    max-width: 530px;
    margin: 14px 0 0;
    color: #8493a6;
    font-size: 14px;
    line-height: 25px;
  }
}

.feature-label {
  display: inline-flex;
  align-items: center;
  color: #43d8bc;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
}

.loop-visual {
  display: flex;
  min-height: 0;
  flex: 1;
  width: 100%;
  margin: 20px auto 0;
}

.workflow-board {
  display: grid;
  width: 100%;
  min-height: 0;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 16px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.085);
  border-radius: 6px;
  background: #0a0f10;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

.workflow-board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  color: #90a2ae;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;

  > span:last-child {
    color: #5d727d;
    font-size: 9px;
    font-weight: 500;
    white-space: nowrap;
  }
}

.workflow-flow {
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 32px minmax(0, 1fr) 32px minmax(0, 1fr);
  align-items: stretch;
  padding-top: 14px;
}

.workflow-node {
  display: flex;
  min-height: 126px;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(121, 146, 155, 0.28);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.018);
  transition:
    border-color 260ms ease,
    background-color 260ms ease,
    box-shadow 260ms ease;
}

.workflow-node.is-active {
  border-color: rgba(59, 246, 203, 0.78);
  background: rgba(15, 132, 112, 0.1);
  box-shadow: 0 0 18px rgba(0, 234, 191, 0.12);
}

.workflow-node-type {
  color: #78909a;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1.3px;
  line-height: 12px;
}

.workflow-node strong {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 6px;
  color: #edf3f8;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.workflow-node p {
  display: -webkit-box;
  margin: 7px 0 0;
  overflow: hidden;
  color: #8297a0;
  font-size: 9px;
  line-height: 13px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.workflow-node-live {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: auto;
  color: #647a84;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 12px;
  opacity: 0.42;
  transition: color 220ms ease, opacity 220ms ease;

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
}

.workflow-node-live.is-visible {
  color: #38efc7;
  opacity: 1;
}

.workflow-connector {
  position: relative;
  align-self: center;
  height: 1px;
  border-top: 1px dashed rgba(102, 130, 140, 0.55);

  &::before {
    position: absolute;
    top: -3px;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #38efc7;
    box-shadow: 0 0 8px rgba(56, 239, 199, 0.85);
    content: '';
    opacity: 0;
  }

  &::after {
    position: absolute;
    top: -4px;
    right: -2px;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 5px solid #718993;
    content: '';
  }
}

.workflow-connector.is-active {
  border-top-color: rgba(56, 239, 199, 0.72);

  &::before {
    opacity: 1;
    animation: workflow-connection 1.1s linear infinite;
  }

  &::after {
    border-left-color: #38efc7;
  }
}

@keyframes workflow-connection {
  to {
    transform: translateX(27px);
  }
}

.state-visual {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  margin-top: 26px;
  padding: 14px 16px 15px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.018);
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

.state-process-header {
  display: flex;
  justify-content: space-between;
  color: #63758a;
  font-size: 10px;
  line-height: 16px;
  text-transform: uppercase;
}

.state-process-list {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
}

.state-process-step {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 28px;
  color: #59697d;
  font-size: 11px;
  line-height: 16px;
  transition: color 220ms ease;
}

.state-process-marker {
  position: relative;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border: 1px solid rgba(151, 169, 188, 0.36);
  border-radius: 50%;
}

.state-process-label {
  min-width: 0;
}

.state-process-status {
  color: #12e6c2;
  font-size: 9px;
  line-height: 14px;
}

.state-process-step.is-active {
  color: #dbe8f2;

  .state-process-marker {
    border-color: rgba(18, 230, 194, 0.32);

    &::after {
      position: absolute;
      inset: -2px;
      border: 2px solid transparent;
      border-top-color: #12e6c2;
      border-right-color: #12e6c2;
      border-radius: 50%;
      content: '';
      animation: task-spinner 800ms linear infinite;
    }
  }
}

.state-process-step.is-completed {
  color: #9aacbc;

  .state-process-marker {
    border-color: #12e6c2;
    background: rgba(18, 230, 194, 0.1);

    &::after {
      position: absolute;
      top: 2px;
      left: 4px;
      width: 3px;
      height: 6px;
      border-right: 1px solid #12e6c2;
      border-bottom: 1px solid #12e6c2;
      content: '';
      transform: rotate(42deg);
    }
  }
}

@keyframes task-spinner {
  to {
    transform: rotate(360deg);
  }
}

.cli-controls {
  padding: 0 0 24px;
}

.controls-grid {
  margin-top: 0;
}

.control-card {
  min-height: 470px;
}

.security-visual {
  display: flex;
  min-height: 0;
  flex: 1;
  margin-top: auto;
  padding-top: 26px;
}

.security-panel {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 0;
  grid-template-rows: auto minmax(0, 1fr) auto;
  padding: 17px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.085);
  border-radius: 6px;
  background: #0b1011;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

.security-panel-header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  color: #9caeb9;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
}

.security-panel-status {
  display: inline-flex;
  min-width: 0;
  gap: 6px;
  align-items: center;
  color: #83c9bd;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;

  i {
    width: 5px;
    height: 5px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #12e6c2;
    box-shadow: 0 0 8px rgba(18, 230, 194, 0.7);
  }
}

.permission-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
  align-content: center;
  padding: 15px 0;
}

.permission-option {
  display: flex;
  min-width: 0;
  min-height: 54px;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.015);
}

.permission-checkbox {
  display: inline-flex;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid #12e6c2;
  border-radius: 4px;
  color: #041210;
  background: #12e6c2;

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
  }
}

.permission-option-copy {
  display: grid;
  min-width: 0;
  gap: 3px;

  strong,
  em {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: #c7d3da;
    font-size: 11px;
    font-weight: 500;
    font-style: normal;
    line-height: 15px;
  }

  em {
    color: #12e6c2;
    font-size: 9px;
    font-style: normal;
    line-height: 12px;
  }
}

.permission-option.is-gated {
  border-color: rgba(233, 205, 74, 0.26);
  background: rgba(233, 205, 74, 0.035);

  .permission-checkbox {
    border-color: rgba(233, 205, 74, 0.7);
    background: transparent;
  }

  .permission-option-copy em {
    color: #e9cd4a;
  }
}

.security-confirmation {
  display: flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.075);
  color: #8495a0;
  font-size: 10px;
  line-height: 16px;

  > span {
    width: 6px;
    height: 6px;
    flex: 0 0 auto;
    border: 1px solid #e9cd4a;
    border-radius: 2px;
  }

  p {
    margin: 0;
  }
}

.integration-visual {
  display: flex;
  min-height: 0;
  flex: 1;
  margin-top: auto;
  padding-top: 26px;
}

.integration-panel {
  display: grid;
  width: 100%;
  min-height: 0;
  grid-template-rows: auto minmax(0, 1fr);
  padding: 17px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.085);
  border-radius: 6px;
  background: #0a0f10;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}

.integration-panel-header {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.075);
  color: #9caeb9;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
}

.integration-panel-header > span:last-child {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: #83c9bd;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;

  i {
    width: 5px;
    height: 5px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #12e6c2;
    box-shadow: 0 0 8px rgba(18, 230, 194, 0.7);
  }
}

.integration-console {
  display: grid;
  min-height: 0;
  grid-template-columns: 90px minmax(128px, 1fr) minmax(106px, 1.12fr);
  gap: 14px;
  align-items: center;
  padding-top: 14px;
}

.integration-tool-list {
  display: grid;
  gap: 7px;
}

.integration-tool {
  display: flex;
  min-width: 0;
  min-height: 28px;
  gap: 7px;
  align-items: center;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #718593;
  background: rgba(255, 255, 255, 0.016);
  font-size: 10px;
  line-height: 14px;
  transition:
    border-color 220ms ease,
    background-color 220ms ease,
    color 220ms ease;

  i {
    width: 4px;
    height: 4px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: currentColor;
  }
}

.integration-tool.is-active {
  border-color: rgba(18, 230, 194, 0.44);
  color: #c8f4eb;
  background: rgba(18, 230, 194, 0.06);

  i {
    background: #12e6c2;
    box-shadow: 0 0 8px rgba(18, 230, 194, 0.68);
  }
}

.integration-terminal {
  display: flex;
  width: min(100%, 140px);
  height: 122px;
  justify-self: center;
  overflow: hidden;
  border-color: rgba(18, 230, 194, 0.26);
  border-radius: 6px;
  background: #090d10;
  box-shadow: 0 0 20px rgba(18, 230, 194, 0.05);
}

.integration-terminal :deep(.frame-titlebar) {
  height: 22px;
  gap: 5px;
  padding: 0 7px;
}

.integration-terminal :deep(.frame-dots) {
  gap: 3px;

  i {
    width: 5px;
    height: 5px;
  }
}

.integration-terminal :deep(.frame-title) {
  font-size: 7px;
  line-height: 10px;
}

.integration-terminal :deep(.frame-body) {
  min-height: 0;
}

.integration-terminal-body {
  display: grid;
  gap: 4px;
  padding: 7px 8px;
  color: #82949f;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 6px;
  line-height: 9px;
}

.integration-terminal-command {
  display: flex;
  min-width: 0;
  gap: 3px;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;

  > span:first-child {
    overflow: hidden;
    color: #b6e4da;
    text-overflow: ellipsis;
  }

  > span:nth-child(2) {
    color: #12e6c2;
  }

  strong {
    color: #e0edf0;
    font-size: inherit;
    font-weight: 500;
  }

  i {
    width: 2px;
    height: 7px;
    flex: 0 0 auto;
    background: #12e6c2;
    animation: integration-terminal-cursor 1.1s steps(1, end) infinite;
  }
}

.integration-terminal-brand {
  display: block;
  width: 100%;
  height: 20px;
  object-fit: contain;
  object-position: left center;
}

.integration-terminal-details {
  display: grid;
  gap: 1px;
  min-width: 0;
  color: #97a8b2;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  b {
    margin-right: 3px;
    color: #cad7dd;
    font-weight: 500;
  }
}

@keyframes integration-terminal-cursor {
  50% {
    opacity: 0;
  }
}

.integration-context {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.integration-context-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #82949f;
  font-size: 9px;
  line-height: 14px;

  > span:last-child {
    color: #526671;
  }
}

.integration-context-item {
  min-width: 0;
  padding: 7px 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 3px;
  color: #738693;
  background: rgba(255, 255, 255, 0.014);
  font-size: 9px;
  line-height: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    border-color 220ms ease,
    color 220ms ease;

  &.is-active {
    border-color: rgba(18, 230, 194, 0.3);
    color: #bce9e1;
  }
}

.scenario-section {
  margin-top: 16px;
  padding: 36px 40px 38px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 6px;
  background: #0a0a0a;

  > h3 {
    margin: 0;
    color: #eaf0f6;
    font-size: 22px;
    font-weight: 600;
    line-height: 32px;
    text-align: center;
  }
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin-top: 28px;
}

.scenario-item {
  min-width: 0;
  padding: 0 26px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);

  &:first-child {
    padding-left: 0;
    border-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }

  > span {
    color: #12e6c2;
    font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 11px;
    font-weight: 700;
    line-height: 16px;
  }

  h4 {
    margin: 12px 0 0;
    color: #dce6ef;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  p {
    margin: 10px 0 0;
    color: #77879b;
    font-size: 13px;
    line-height: 22px;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1023px) {
  .autonomy-heading h2 {
    font-size: 38px;
    line-height: 50px;
  }

  .autonomy-card,
  .control-card {
    min-height: 550px;
    padding: 32px 30px 30px;
  }

  .security-visual {
    padding-top: 22px;
  }

  .scenario-item {
    padding: 0 18px;
  }
}

@media (max-width: 767px) {
  .cli-autonomy {
    padding: 66px 0 12px;
  }

  .cli-controls {
    padding-bottom: 32px;
  }

  .autonomy-heading {
    max-width: 100%;

    h2 {
      font-size: 32px;
      line-height: 43px;
    }

    p {
      margin-top: 14px;
      font-size: 15px;
      line-height: 26px;
    }
  }

  .autonomy-grid,
  .controls-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    margin-top: 36px;
  }

  .controls-grid {
    margin-top: 0;
  }

  .autonomy-card,
  .control-card {
    min-height: 460px;
    padding: 28px 24px 24px;
  }

  .autonomy-copy,
  .control-copy {
    h3 {
      margin-top: 12px;
      font-size: 22px;
      line-height: 31px;
    }

    p {
      margin-top: 10px;
      font-size: 14px;
      line-height: 24px;
    }
  }

  .feature-label {
    font-size: 9px;
  }

  .loop-visual {
    width: 100%;
    min-height: 212px;
    margin-top: 16px;
  }

  .workflow-board {
    padding: 12px;
  }

  .workflow-board-header {
    padding-bottom: 10px;
    font-size: 9px;
  }

  .workflow-flow {
    grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr) 16px minmax(0, 1fr);
    padding-top: 12px;
  }

  .workflow-node {
    min-height: 114px;
    padding: 7px;
  }

  .workflow-node-type {
    font-size: 7px;
    letter-spacing: 0.7px;
  }

  .workflow-node strong {
    margin-top: 4px;
    font-size: 10px;
    line-height: 13px;
  }

  .workflow-node p {
    margin-top: 5px;
    font-size: 8px;
    line-height: 11px;
  }

  .workflow-node-live {
    gap: 4px;
    font-size: 7px;
    letter-spacing: 0.45px;

    i {
      width: 4px;
      height: 4px;
    }
  }

  .workflow-connector {
    &::before {
      width: 4px;
      height: 4px;
    }

    &::after {
      right: -1px;
    }
  }

  .state-visual {
    margin-top: 18px;
    padding: 12px;
  }

  .state-process-step {
    grid-template-columns: 18px minmax(0, 1fr) auto;
    gap: 7px;
    min-height: 27px;
    font-size: 10px;
  }

  .security-visual {
    padding-top: 18px;
  }

  .security-panel {
    padding: 14px;
  }

  .security-panel-header {
    padding-bottom: 10px;
  }

  .security-panel-status {
    font-size: 8px;
  }

  .permission-options {
    gap: 8px;
    padding: 12px 0;
  }

  .permission-option {
    min-height: 50px;
    gap: 8px;
    padding: 8px;
  }

  .permission-checkbox {
    width: 18px;
    height: 18px;
  }

  .permission-option-copy strong {
    font-size: 10px;
  }

  .security-confirmation {
    padding-top: 10px;
    font-size: 9px;
  }

  .integration-visual {
    padding-top: 18px;
  }

  .integration-panel {
    padding: 12px;
  }

  .integration-panel-header {
    padding-bottom: 10px;
    font-size: 9px;
  }

  .integration-panel-header > span:last-child {
    font-size: 8px;
  }

  .integration-console {
    grid-template-columns: 64px minmax(90px, 1fr) minmax(0, 1.05fr);
    gap: 8px;
    padding-top: 12px;
  }

  .integration-tool-list {
    gap: 5px;
  }

  .integration-tool {
    min-height: 25px;
    gap: 5px;
    padding: 0 6px;
    font-size: 9px;
  }

  .integration-terminal {
    width: min(100%, 102px);
    height: 88px;
  }

  .integration-terminal :deep(.frame-titlebar) {
    height: 18px;
    gap: 4px;
    padding: 0 5px;
  }

  .integration-terminal :deep(.frame-dots) {
    gap: 2px;

    i {
      width: 4px;
      height: 4px;
    }
  }

  .integration-terminal :deep(.frame-title) {
    font-size: 6px;
  }

  .integration-terminal-body {
    gap: 3px;
    padding: 5px 6px;
    font-size: 5px;
    line-height: 7px;
  }

  .integration-terminal-command i {
    height: 6px;
  }

  .integration-terminal-brand {
    height: 16px;
  }

  .integration-context {
    gap: 5px;
  }

  .integration-context-header {
    font-size: 8px;
  }

  .integration-context-item {
    padding: 5px 6px;
    font-size: 8px;
    line-height: 12px;
  }

  .scenario-section {
    margin-top: 12px;
    padding: 28px 24px 30px;
  }

  .scenario-section > h3 {
    font-size: 21px;
    line-height: 30px;
  }

  .scenario-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 0;
    margin-top: 24px;
  }

  .scenario-item {
    padding: 0 16px;

    &:nth-child(odd) {
      padding-left: 0;
      border-left: 0;
    }

    &:nth-child(3) {
      border-left: 0;
    }

    &:nth-child(even) {
      padding-right: 0;
    }

    h4 {
      margin-top: 9px;
      font-size: 15px;
      line-height: 22px;
    }

    p {
      margin-top: 7px;
      font-size: 12px;
      line-height: 20px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .workflow-connector.is-active::before,
  .integration-terminal-command i {
    animation: none;
  }
}
</style>
