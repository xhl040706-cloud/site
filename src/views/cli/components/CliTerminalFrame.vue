<script setup lang="ts">
defineOptions({
  name: 'CliTerminalFrame',
})

withDefaults(
  defineProps<{
    title?: string
    compact?: boolean
  }>(),
  { title: 'csc', compact: false },
)
</script>

<template>
  <div class="cli-terminal-frame" :class="{ compact }">
    <div class="frame-titlebar">
      <span class="frame-dots" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
      <span class="frame-title">{{ title }}</span>
      <span class="frame-spacer" aria-hidden="true"></span>
    </div>
    <div class="frame-body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="less">
.cli-terminal-frame {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  background: linear-gradient(180deg, #0b0d10, #060708);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.035);

  &.compact {
    border-radius: 14px;
    box-shadow: none;
  }
}

.frame-titlebar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.055);
  background: rgba(255, 255, 255, 0.016);

  .compact & {
    height: 32px;
    padding: 0 12px;
  }
}

.frame-dots {
  display: inline-flex;
  gap: 6px;

  i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    opacity: 0.72;

    &:nth-child(1) {
      background: #ff5f57;
    }

    &:nth-child(2) {
      background: #febc2e;
    }

    &:nth-child(3) {
      background: #28c840;
    }
  }
}

.frame-title {
  overflow: hidden;
  color: #6f8096;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;

  .compact & {
    font-size: 11px;
  }
}

.frame-spacer {
  flex: 1;
}

.frame-body {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
  font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>
