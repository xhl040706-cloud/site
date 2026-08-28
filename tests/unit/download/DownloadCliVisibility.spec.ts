import { describe, expect, it } from 'vitest'
import { VISIBLE_DOWNLOAD_TABS } from '@/views/download/constants'
import downloadPageSource from '@/views/download/index.vue?raw'
import downloadDataSource from '@/views/download/useDownloadData.ts?raw'

describe('download page CLI visibility', () => {
  it('temporarily removes CLI from the visible download tabs', () => {
    expect(VISIBLE_DOWNLOAD_TABS).toEqual(['vscode', 'jetbrains'])
    expect(downloadDataSource).toContain(
      '.filter((tab) => VISIBLE_DOWNLOAD_TABS.includes(tab.key))',
    )
  })

  it('falls back to VS Code for old CLI tab links', () => {
    expect(downloadPageSource).toContain("const DEFAULT_DOWNLOAD_TAB: TabType = 'vscode'")
    expect(downloadPageSource).toContain('tab: DEFAULT_DOWNLOAD_TAB')
    expect(downloadPageSource).toContain('product: undefined')
  })
})
