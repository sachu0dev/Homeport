import type { ComponentType } from 'react'
import { FinderApp } from './FinderApp'
import { NotesApp } from './NotesApp'
import { ResourceMonitorApp } from './ResourceMonitorApp'
import { TerminalApp } from './TerminalApp'
import { CodeEditorApp } from './CodeEditorApp'

export interface AppWindowDef {
  id: string
  title: string
  component: ComponentType
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  minHeight: number
}

/** Apps that actually open a window. Dock/Launcher apps not listed here are still decorative. */
export const windowedApps: Record<string, AppWindowDef> = {
  finder: {
    id: 'finder',
    title: 'Finder',
    component: FinderApp,
    defaultWidth: 720,
    defaultHeight: 460,
    minWidth: 460,
    minHeight: 280,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    component: NotesApp,
    defaultWidth: 640,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 300,
  },
  'resource-monitor': {
    id: 'resource-monitor',
    title: 'Activity Monitor',
    component: ResourceMonitorApp,
    defaultWidth: 640,
    defaultHeight: 520,
    minWidth: 460,
    minHeight: 360,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    component: TerminalApp,
    defaultWidth: 620,
    defaultHeight: 400,
    minWidth: 360,
    minHeight: 240,
  },
  'code-editor': {
    id: 'code-editor',
    title: 'Code Editor',
    component: CodeEditorApp,
    defaultWidth: 760,
    defaultHeight: 520,
    minWidth: 480,
    minHeight: 320,
  },
}
