import type { TabConfig, TabType } from './types'

export const CLI_COMMAND_INSTALL_NPM =
  'npm install -g @costrict/csc --registry=https://registry.npmjs.org/'
export const CLI_COMMAND_INSTALL_BASH = 'curl -fsSL https://costrict.ai/install.sh | bash'
export const CLI_COMMAND_INSTALL_POWERSHELL =
  'iwr https://costrict.ai/install.bat -Out install.bat;.\\install.bat'
export const CLI_VERIFY_COMMAND = 'cs --version'

export const VISIBLE_DOWNLOAD_TABS: readonly TabType[] = ['vscode', 'jetbrains']

export const TAB_CONFIGS: TabConfig[] = [
  { key: 'vscode', icon: 'vscode', titleKey: 'download.vscodeTitle' },
  { key: 'jetbrains', icon: 'jetbrains', titleKey: 'download.jetbrainsTitle' },
  { key: 'cli', icon: 'cli', titleKey: 'download.cliTitle' },
]

export const JETBRAINS_IDES = [
  'IntelliJ IDEA (Ultimate & Community)',
  'WebStorm - JavaScript and TypeScript development',
  'PyCharm (Professional & Community) - Python development',
  'PhpStorm - PHP development',
  'RubyMine - Ruby development',
  'CLion - C/C++ development',
  'GoLand - Go development',
  'DataGrip - Database development',
  'Rider - .NET development',
  'Android Studio - Android development',
]

export const DOWNLOAD_URLS = {
  vscode: 'https://costrict.ai/plugin/download/',
  /** VSCode 插件安装深链：由系统拉起 VS Code 并打开 CoStrict 扩展安装页 */
  vscodeExtension: 'vscode:extension/zgsm-ai.zgsm',
  jetbrainsPrimary: 'https://costrict.ai/plugin/jetbrain/',
  jetbrainsSecondary: 'https://zgsm.sangfor.com/costrict-static/jetbrains-plugin',
} as const
