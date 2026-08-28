import type { StoryStage } from './types'

export const CLI_DOCS_URL = 'https://docs.costrict.ai'
export const CLI_DOCS_INSTALL_URL = `${CLI_DOCS_URL}/cli/guide/installation`

export const CLI_VERIFY_COMMAND = 'cs --version'
export const CLI_START_COMMAND = 'csc'

/* S02 任务故事：分析并修复登录模块 token 刷新失败（终端输出保持英文真实感） */
export const STORY_STAGES: StoryStage[] = [
  {
    key: 'understand',
    panel: 'terminal',
    lines: [
      { tone: 'info', text: 'Scanning project structure…' },
      { tone: 'file', text: '  src/auth/authService.ts' },
      { tone: 'file', text: '  src/auth/tokenStore.ts' },
      { tone: 'file', text: '  src/auth/requestInterceptor.ts' },
      { tone: 'info', text: 'Reading package.json, tsconfig, tests setup…' },
      { tone: 'ok', text: '✓ Context loaded · 12 related files' },
    ],
  },
  {
    key: 'analyze',
    panel: 'findings',
    lines: [
      { tone: 'warn', text: '! 3 related issues found' },
      { tone: 'file', text: 'authService.ts:142  refreshAccessToken() ignores token expiry' },
      { tone: 'file', text: 'tokenStore.ts:58       returns stale cached refresh token' },
      { tone: 'file', text: 'requestInterceptor.ts:87 concurrent 401s trigger duplicate refresh' },
      { tone: 'dim', text: 'Root cause: expired refresh token is reused across retries.' },
    ],
  },
  {
    key: 'modify',
    panel: 'diff',
    diff: [
      { kind: 'hunk', text: '@@ src/auth/tokenStore.ts @@' },
      { kind: 'ctx', text: '  export async function getRefreshToken() {' },
      { kind: 'del', text: '-   return cache.get(KEY) ?? loadFromDisk()' },
      { kind: 'add', text: '+   const token = cache.get(KEY)' },
      { kind: 'add', text: "+   if (!token || isExpired(token)) return refreshLock.acquire()" },
      { kind: 'add', text: '+   return token' },
      { kind: 'ctx', text: '  }' },
      { kind: 'hunk', text: '@@ src/auth/requestInterceptor.ts @@' },
      { kind: 'add', text: '+   pendingRefresh = pendingRefresh ?? refreshAccessToken()' },
      { kind: 'add', text: '+   return await pendingRefresh' },
    ],
  },
  {
    key: 'verify',
    panel: 'tests',
    lines: [
      { tone: 'ok', text: '✓ auth refresh returns a valid new token (12ms)' },
      { tone: 'ok', text: '✓ session restore keeps the login state (8ms)' },
      { tone: 'ok', text: '✓ request interceptor retries 401 only once (21ms)' },
      { tone: 'dim', text: '' },
      { tone: 'accent', text: 'Test Files  3 passed (3)' },
      { tone: 'accent', text: '     Tests  18 passed (18) · 0 failed' },
    ],
  },
]

export const STORY_STAGE_ORDER = ['understand', 'analyze', 'modify', 'verify'] as const
