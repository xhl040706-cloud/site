<template>
  <div class="value-result-visual" :class="`value-result-visual--${kind}`" aria-hidden="true">
    <div v-if="kind === 'delivery'" class="result-canvas delivery-canvas">
      <div class="workflow-node workflow-node--input"><i></i><span></span><span></span></div>
      <div class="workflow-rail workflow-rail--left"><i></i></div>
      <div class="workflow-panel ui-panel">
        <div class="ui-panel-header"><span class="ui-status-dot"></span><i></i><b>03</b></div>
        <div class="workflow-tasks">
          <span class="is-complete"><i></i><b></b></span>
          <span class="is-active"><i></i><b></b></span>
          <span><i></i><b></b></span>
        </div>
        <div class="workflow-progress"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="workflow-rail workflow-rail--right"><i></i></div>
      <div class="workflow-node workflow-node--output"><i></i><span></span><span></span></div>
    </div>

    <div v-else-if="kind === 'collaboration'" class="result-canvas collaboration-canvas">
      <div class="shared-module shared-module--task"><i></i><span></span><span></span></div>
      <div class="collaboration-panel ui-panel">
        <div class="ui-panel-header"><span class="ui-status-dot"></span><i></i><b>04</b></div>
        <div class="collaboration-layout">
          <div class="collaboration-sidebar"><i></i><i></i><i></i><i></i></div>
          <div class="collaboration-stream">
            <span><i></i><b></b><em></em></span>
            <span><i></i><b></b><em></em></span>
            <span><i></i><b></b><em></em></span>
          </div>
        </div>
      </div>
      <div class="shared-module shared-module--knowledge"><i></i><span></span><span></span></div>
      <div class="shared-module shared-module--state"><i></i><span></span><b></b></div>
    </div>

    <div v-else-if="kind === 'knowledge'" class="result-canvas knowledge-canvas">
      <div class="knowledge-inputs">
        <span><i></i><b></b></span>
        <span><i></i><b></b></span>
        <span><i></i><b></b></span>
      </div>
      <div class="knowledge-panel ui-panel">
        <div class="ui-panel-header"><span class="ui-status-dot"></span><i></i><b>12</b></div>
        <div class="knowledge-index">
          <span><i></i><b></b></span>
          <span><i></i><b></b></span>
          <span><i></i><b></b></span>
          <span><i></i><b></b></span>
        </div>
      </div>
      <div class="knowledge-output">
        <div class="knowledge-answer"><i></i><span></span><span></span><span></span></div>
        <div class="knowledge-citations"><i>01</i><i>02</i><i>03</i></div>
      </div>
    </div>

    <div v-else class="result-canvas governance-canvas">
      <div class="governance-panel ui-panel">
        <div class="ui-panel-header"><span class="ui-status-dot"></span><i></i><b>LIVE</b></div>
        <div class="governance-metrics">
          <div><span>98</span><i></i></div>
          <div><span>03</span><i></i></div>
          <div><span>100%</span><i></i></div>
        </div>
        <div class="governance-detail">
          <div class="governance-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="governance-checks">
            <span><i></i><b></b></span>
            <span><i></i><b></b></span>
            <span class="has-risk"><i></i><b></b></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ValueResultKey } from './OrganizationValue.vue'

defineOptions({
  name: 'ValueResultVisual',
})

interface Props {
  kind: ValueResultKey
}

defineProps<Props>()
</script>

<style scoped lang="less">
.value-result-visual {
  position: relative;
  overflow: hidden;
  background: rgba(1, 3, 7, 0.22);
  pointer-events: none;

  &::before {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
    background-size: 32px 32px;
    content: '';
    opacity: 0.55;
    -webkit-mask-image: linear-gradient(180deg, #000, transparent 88%);
    mask-image: linear-gradient(180deg, #000, transparent 88%);
  }
}

.result-canvas {
  position: absolute;
  inset: 26px 30px 22px;
}

.ui-panel,
.workflow-node,
.shared-module,
.knowledge-inputs span,
.knowledge-output {
  border: 1px solid rgba(255, 255, 255, 0.085);
  background: #0a0d12;
}

.ui-panel {
  overflow: hidden;
  border-radius: 10px;
}

.ui-panel-header {
  display: flex;
  height: 30px;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  > i {
    width: 58px;
    height: 3px;
    border-radius: 2px;
    background: rgba(225, 232, 241, 0.2);
  }

  > b {
    margin-left: auto;
    color: rgba(216, 225, 236, 0.42);
    font-size: 8px;
    font-weight: 600;
    line-height: 1;
  }
}

.ui-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6ee7b7;
}

.delivery-canvas {
  display: grid;
  grid-template-columns: 112px minmax(26px, 1fr) minmax(210px, 280px) minmax(26px, 1fr) 112px;
  align-items: center;
}

.workflow-panel {
  position: relative;
  z-index: 2;
  height: 166px;
  border-color: rgba(255, 255, 255, 0.11);
  background: #0b0f15;
}

.workflow-node {
  position: relative;
  z-index: 1;
  height: 80px;
  padding: 13px;
  border-radius: 8px;
  opacity: 0.62;

  > i {
    display: block;
    width: 18px;
    height: 18px;
    margin-bottom: 10px;
    border: 1px solid rgba(125, 211, 252, 0.36);
    border-radius: 5px;
    background: rgba(125, 211, 252, 0.07);
  }

  > span {
    display: block;
    width: 72%;
    height: 3px;
    margin-top: 6px;
    border-radius: 2px;
    background: rgba(224, 231, 240, 0.16);

    &:last-child {
      width: 48%;
    }
  }
}

.workflow-node--output > i {
  border-color: rgba(110, 231, 183, 0.34);
  background: rgba(110, 231, 183, 0.07);
}

.workflow-rail {
  position: relative;
  z-index: 0;
  height: 1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);

  i {
    position: absolute;
    top: -1px;
    width: 22px;
    height: 3px;
    border-radius: 2px;
    background: rgba(125, 211, 252, 0.42);
  }
}

.workflow-rail--left i {
  right: 14%;
}

.workflow-rail--right i {
  left: 22%;
  background: rgba(110, 231, 183, 0.42);
}

.workflow-tasks {
  display: grid;
  gap: 8px;
  padding: 14px 14px 10px;

  span {
    display: flex;
    height: 22px;
    align-items: center;
    gap: 9px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.022);

    i {
      width: 7px;
      height: 7px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 50%;
    }

    b {
      width: 58%;
      height: 3px;
      border-radius: 2px;
      background: rgba(218, 227, 238, 0.16);
    }
  }

  .is-complete i {
    border-color: #6ee7b7;
    background: #6ee7b7;
  }

  .is-active {
    border-color: rgba(125, 211, 252, 0.12);
    background: rgba(125, 211, 252, 0.045);

    i {
      border-color: #7dd3fc;
    }
  }
}

.workflow-progress {
  display: flex;
  gap: 5px;
  padding: 0 14px;

  i {
    height: 2px;
    flex: 1;
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.08);

    &:first-child,
    &:nth-child(2) {
      background: rgba(110, 231, 183, 0.48);
    }

    &:nth-child(3) {
      background: rgba(125, 211, 252, 0.36);
    }
  }
}

.collaboration-canvas {
  display: grid;
  place-items: center;
}

.collaboration-panel {
  width: min(70%, 350px);
  height: 172px;
  border-color: rgba(255, 255, 255, 0.11);
  background: #0b0f15;
}

.collaboration-layout {
  display: grid;
  height: calc(100% - 31px);
  grid-template-columns: 42px 1fr;
}

.collaboration-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 11px;
  border-right: 1px solid rgba(255, 255, 255, 0.055);

  i {
    width: 18px;
    height: 5px;
    border-radius: 2px;
    background: rgba(223, 230, 239, 0.12);

    &:first-child {
      background: rgba(125, 211, 252, 0.34);
    }
  }
}

.collaboration-stream {
  display: grid;
  align-content: center;
  gap: 9px;
  padding: 12px;

  span {
    display: grid;
    height: 25px;
    grid-template-columns: 12px 1fr 26px;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    border: 1px solid rgba(255, 255, 255, 0.045);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.018);

    i {
      width: 8px;
      height: 8px;
      border-radius: 3px;
      background: rgba(125, 211, 252, 0.24);
    }

    b {
      width: 72%;
      height: 3px;
      border-radius: 2px;
      background: rgba(219, 227, 236, 0.15);
    }

    em {
      height: 3px;
      border-radius: 2px;
      background: rgba(110, 231, 183, 0.36);
    }
  }
}

.shared-module {
  position: absolute;
  width: 108px;
  height: 64px;
  box-sizing: border-box;
  padding: 11px;
  border-radius: 8px;
  opacity: 0.56;

  i {
    display: block;
    width: 15px;
    height: 15px;
    margin-bottom: 8px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  span,
  b {
    display: block;
    width: 70%;
    height: 3px;
    margin-top: 5px;
    border-radius: 2px;
    background: rgba(220, 228, 238, 0.13);
  }

  b {
    width: 38%;
    background: rgba(110, 231, 183, 0.32);
  }
}

.shared-module--task {
  top: 7px;
  left: 3%;
}

.shared-module--knowledge {
  right: 2%;
  bottom: 6px;

  i {
    border-color: rgba(125, 211, 252, 0.32);
    background: rgba(125, 211, 252, 0.055);
  }
}

.shared-module--state {
  right: 4%;
  top: 12px;
  width: 88px;
  height: 52px;

  i {
    float: left;
    width: 8px;
    height: 8px;
    margin: 1px 8px 0 0;
    border: 0;
    border-radius: 50%;
    background: #6ee7b7;
  }
}

.knowledge-canvas {
  display: grid;
  grid-template-columns: 106px minmax(180px, 1fr) minmax(126px, 0.8fr);
  align-items: center;
  gap: 14px;
}

.knowledge-inputs {
  display: grid;
  gap: 8px;

  span {
    display: grid;
    height: 48px;
    box-sizing: border-box;
    grid-template-columns: 20px 1fr;
    align-items: center;
    gap: 9px;
    padding: 9px;
    border-radius: 7px;
    opacity: 0.58;

    i {
      width: 17px;
      height: 21px;
      border: 1px solid rgba(125, 211, 252, 0.25);
      border-radius: 3px;
      background: rgba(125, 211, 252, 0.045);
    }

    b {
      width: 70%;
      height: 3px;
      border-radius: 2px;
      background: rgba(220, 228, 237, 0.15);
    }
  }
}

.knowledge-panel {
  height: 176px;
  background: #0b0f15;
}

.knowledge-index {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 13px;

  span {
    height: 52px;
    padding: 9px;
    border: 1px solid rgba(255, 255, 255, 0.055);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.018);

    i {
      display: block;
      width: 17px;
      height: 7px;
      margin-bottom: 10px;
      border-radius: 2px;
      background: rgba(125, 211, 252, 0.2);
    }

    b {
      display: block;
      width: 68%;
      height: 3px;
      border-radius: 2px;
      background: rgba(220, 228, 237, 0.14);
    }
  }
}

.knowledge-output {
  height: 112px;
  padding: 13px;
  border-radius: 8px;
  opacity: 0.78;
}

.knowledge-answer {
  i,
  span {
    display: block;
    height: 3px;
    margin-top: 8px;
    border-radius: 2px;
    background: rgba(218, 226, 236, 0.15);
  }

  i {
    width: 28%;
    margin-top: 0;
    background: rgba(110, 231, 183, 0.35);
  }

  span:nth-child(2) {
    width: 88%;
  }

  span:nth-child(3) {
    width: 72%;
  }

  span:nth-child(4) {
    width: 54%;
  }
}

.knowledge-citations {
  display: flex;
  gap: 5px;
  margin-top: 14px;

  i {
    display: grid;
    width: 24px;
    height: 15px;
    place-items: center;
    border: 1px solid rgba(125, 211, 252, 0.16);
    border-radius: 4px;
    color: rgba(173, 219, 240, 0.52);
    font-size: 7px;
    font-style: normal;
  }
}

.governance-canvas {
  display: grid;
  place-items: center;
}

.governance-panel {
  width: min(88%, 480px);
  height: 182px;
  background: #0b0f15;
}

.governance-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 12px 9px;

  div {
    height: 48px;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.055);
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.018);
  }

  span {
    display: block;
    color: #dce3eb;
    font-size: 15px;
    font-weight: 500;
    line-height: 18px;
  }

  i {
    display: block;
    width: 44%;
    height: 3px;
    margin-top: 7px;
    border-radius: 2px;
    background: rgba(110, 231, 183, 0.33);
  }

  div:nth-child(2) i {
    background: rgba(251, 113, 133, 0.38);
  }

  div:nth-child(3) i {
    background: rgba(125, 211, 252, 0.34);
  }
}

.governance-detail {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 12px;
  padding: 0 12px 12px;
}

.governance-chart,
.governance-checks {
  height: 60px;
  border: 1px solid rgba(255, 255, 255, 0.045);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.012);
}

.governance-chart {
  display: flex;
  align-items: end;
  gap: 6px;
  padding: 9px 10px;

  i {
    width: 8px;
    height: 30%;
    border-radius: 2px 2px 0 0;
    background: rgba(125, 211, 252, 0.23);

    &:nth-child(2) {
      height: 54%;
    }

    &:nth-child(3) {
      height: 42%;
    }

    &:nth-child(4) {
      height: 72%;
      background: rgba(110, 231, 183, 0.35);
    }

    &:nth-child(5) {
      height: 64%;
    }

    &:nth-child(6) {
      height: 84%;
    }

    &:nth-child(7) {
      height: 76%;
      background: rgba(110, 231, 183, 0.42);
    }
  }
}

.governance-checks {
  display: grid;
  align-content: center;
  gap: 6px;
  padding: 8px 10px;

  span {
    display: flex;
    align-items: center;
    gap: 7px;

    i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6ee7b7;
    }

    b {
      width: 62%;
      height: 3px;
      border-radius: 2px;
      background: rgba(220, 228, 237, 0.14);
    }
  }

  .has-risk i {
    background: #fb7185;
  }
}

@media (max-width: 767px) {
  .result-canvas {
    inset: 22px 20px 18px;
  }

  .delivery-canvas {
    grid-template-columns: 72px 16px minmax(150px, 1fr) 16px 72px;
  }

  .workflow-node {
    height: 70px;
    padding: 10px;
  }

  .workflow-panel {
    height: 154px;
  }

  .shared-module {
    transform: scale(0.86);
  }

  .shared-module--task {
    left: -6px;
  }

  .shared-module--knowledge,
  .shared-module--state {
    right: -7px;
  }

  .knowledge-canvas {
    grid-template-columns: 72px minmax(148px, 1fr) 86px;
    gap: 8px;
  }

  .knowledge-inputs span {
    grid-template-columns: 16px 1fr;
    gap: 6px;
    padding: 7px;
  }

  .knowledge-panel {
    height: 160px;
  }

  .knowledge-output {
    padding: 10px;
  }

  .governance-panel {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .value-result-visual {
    transition: none;
  }
}
</style>
