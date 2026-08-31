<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  TabType,
  StepItem,
  CliStepLists,
  CliEnvRequirements,
  Platform,
  PlatformConfig,
} from '../types'
import { JETBRAINS_IDES } from '../constants'
import StepTimeline from './StepTimeline.vue'
import PlatformTabs from './PlatformTabs.vue'
import PlatformInstallPanel from './PlatformInstallPanel.vue'

defineOptions({
  name: 'DownloadContent',
})

defineProps<{
  activeTab: TabType
  headerIcon: string
  headerTitle: string
  steps: StepItem[]
  cliStepLists?: CliStepLists
  cliEnvRequirements?: CliEnvRequirements
  activePlatform?: Platform
  activePlatformConfig?: PlatformConfig
}>()

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'downloadJetbrainsPrimary'): void
  (e: 'downloadJetbrainsSecondary'): void
  (e: 'copyCliCommand', command: string): void
  (e: 'platformChange', platform: Platform): void
}>()

const { t, locale } = useI18n()
const cliDocsUrl = computed(
  () => `https://docs.costrict.ai${locale.value === 'en' ? '/en' : ''}/csc/quickstart`,
)

const handleDownload = () => emit('download')
const handlePlatformChange = (platform: Platform) => {
  emit('platformChange', platform)
}
const handleCopyCommand = (command: string) => {
  emit('copyCliCommand', command)
}
</script>

<template>
  <div class="download-content">
    <!-- Header Section -->
    <div v-if="activeTab !== 'cli'" class="content-header flex flex-wrap">
      <img class="download-icon w-6 h-6 mr-1" :src="headerIcon" alt="CoStrict Download" />
      <span class="text-white mr-4">{{ headerTitle }}</span>
      <!-- VSCode: IDE 下载链接 -->
      <div v-if="activeTab === 'vscode'" class="ide-download-wrapper">
        <span>(</span>
        <span class="link-prefix">{{ t('download.vscodeDownloadPrefix') }}</span>
        <a href="https://code.visualstudio.com/Download" target="_blank" class="ide-download-link">
          <span class="link-text">{{ t('download.ideDownloadLinkText') }}</span>
        </a>
        <span>)</span>
      </div>
      <!-- JetBrains: IDE 下载链接 -->
      <div v-if="activeTab === 'jetbrains'" class="ide-download-wrapper">
        <span>(</span>
        <span class="link-prefix">{{ t('download.jetbrainsDownloadPrefix') }}</span>
        <a href="https://www.jetbrains.com.cn/" target="_blank" class="ide-download-link">
          <span class="link-text">{{ t('download.ideDownloadLinkText') }}</span>
        </a>
        <span>)</span>
      </div>
    </div>

    <!-- JetBrains IDE List -->
    <div v-if="activeTab === 'jetbrains'" class="supported-ides mt-5">
      <p class="text-white mb-2">{{ t('download.jetbrainsSupportIdes') }}</p>
      <ul class="list-disc ml-4">
        <li v-for="ide in JETBRAINS_IDES" :key="ide">{{ ide }}</li>
      </ul>
    </div>

    <!-- Installation Steps for CLI -->
    <template v-if="activeTab === 'cli' && cliEnvRequirements">
      <!-- 安装步骤 -->
      <div class="cli-install-section">
        <p class="cli-desc">
          {{ $t('download.cliStep2SubContent', { link: '' })
          }}<a :href="cliDocsUrl" target="_blank">{{
            $t('download.cliStep2DocLink')
          }}</a>
        </p>

        <!-- 按平台分组的安装命令 -->
        <div class="cli-install-container">
          <PlatformTabs :active-platform="activePlatform" @change="handlePlatformChange" />
          <PlatformInstallPanel
            v-if="activePlatformConfig"
            :config="activePlatformConfig"
            @copy="handleCopyCommand"
          />
        </div>
      </div>

      <!-- 环境要求 -->
      <div class="cli-env-section">
        <h3 class="env-title">{{ t('download.cliStep1Title') }}</h3>

        <!-- 操作系统 -->
        <div class="env-group">
          <h4 class="env-group-title">{{ cliEnvRequirements?.osTitle }}</h4>
          <ul class="env-list">
            <li><strong>Windows：</strong>{{ cliEnvRequirements?.osWindows }}</li>
            <li><strong>Linux：</strong>{{ cliEnvRequirements?.osLinux }}</li>
            <li><strong>macOS：</strong>{{ cliEnvRequirements?.osMacOS }}</li>
            <li>
              <strong>{{ t('download.cliStep1OsContainerLabel') }}</strong
              >{{ cliEnvRequirements?.osContainer }}
            </li>
          </ul>
        </div>

        <!-- 终端 -->
        <div class="env-group">
          <h4 class="env-group-title">{{ cliEnvRequirements?.terminalTitle }}</h4>
          <ul class="env-list">
            <li><strong>Windows：</strong>{{ cliEnvRequirements?.terminalWindows }}</li>
            <li><strong>Linux /macOS：</strong>{{ cliEnvRequirements?.terminalUnix }}</li>
          </ul>
        </div>

        <!-- 备用方案 -->
        <div class="env-group env-group-web">
          <h4 class="env-group-title">{{ cliEnvRequirements?.webModeTitle }}</h4>
          <p class="env-web-content">{{ cliEnvRequirements?.webModeContent }}</p>
        </div>
      </div>
    </template>

    <!-- Installation Steps for VSCode/JetBrains -->
    <div v-else class="manual-methods download-methods">
      <p class="tips">{{ t('download.installSteps') }}</p>
      <div class="download-methods">
        <StepTimeline
          :steps="steps"
          :active-tab="activeTab"
          @download="handleDownload"
          @download-jetbrains-primary="$emit('downloadJetbrainsPrimary')"
          @download-jetbrains-secondary="$emit('downloadJetbrainsSecondary')"
          @copy-cli-command="() => $emit('copyCliCommand', '')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content-header {
  @media (max-width: 968px) {
    flex-wrap: wrap;

    img {
      display: none;
    }

    span {
      flex: 0 1 auto;
      word-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }

    div {
      flex: 1 1 100%;
      margin-top: 8px;
    }
  }
}

.supported-ides {
  margin-top: 2rem;
  margin-bottom: 1rem;

  p {
    font-weight: 600;
    color: #f4f8ff;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      color: #a1a7b3;
      line-height: 1.5;
    }
  }
}

.download-content {
  margin-top: 32px;
}

.tips {
  margin-top: 32px;
  margin-bottom: 12px;
  color: #c2c7d1;
}

// CLI 安装区域
.cli-install-section {
  margin-bottom: 48px;

  @media (max-width: 768px) {
    align-items: stretch;
  }
}

.cli-desc {
  color: #a8a8a8;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;

  a {
    color: #5b8def;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #7aa3f5;
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    font-size: 13px;
    text-align: left;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
}

.cli-install-container {
  width: 100%;
  max-width: 720px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

// IDE 下载链接样式（在 header 中使用）
.ide-download-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 14px;
  color: #a1a7b3;

  .link-prefix {
    color: #a1a7b3;
  }

  svg {
    color: #fff;
    margin-left: 4px;
  }
}

.ide-download-link {
  color: #4083e8;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  .link-text {
    color: #4083e8;
  }
}

.cli-env-section {
  margin-top: 48px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;

  .env-title {
    font-size: 16px;
    font-weight: 600;
    color: #f4f8ff;
    margin-bottom: 20px;
  }

  .env-group {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .env-group-title {
    font-size: 14px;
    font-weight: 600;
    color: #c2c7d1;
    margin-bottom: 8px;
  }

  .env-list {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0;

    li {
      margin-bottom: 6px;
      color: #a1a7b3;
      font-size: 13px;
      line-height: 1.6;

      strong {
        color: #f4f8ff;
        font-weight: 500;
      }
    }
  }

  .env-group-web {
    background: rgba(255, 193, 7, 0.08);
    border-left: 3px solid #ffc107;
    padding: 12px 16px;
    border-radius: 6px;

    .env-web-content {
      color: #c2c7d1;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }
  }
}
</style>
