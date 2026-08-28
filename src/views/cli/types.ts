export type CliStageKey = 'understand' | 'analyze' | 'modify' | 'verify'

export type TerminalTone = 'cmd' | 'info' | 'ok' | 'warn' | 'dim' | 'accent' | 'file'

export interface TerminalLine {
  tone: TerminalTone
  text: string
}

export interface DiffLine {
  kind: 'hunk' | 'ctx' | 'add' | 'del'
  text: string
}

export interface StoryStage {
  key: CliStageKey
  panel: 'terminal' | 'findings' | 'diff' | 'tests'
  lines?: TerminalLine[]
  diff?: DiffLine[]
}
