import { Folder, Notebook, Settings, Trash2, type LucideIcon } from 'lucide-react'

export interface AppDef {
  id: string
  label: string
  icon: LucideIcon
}

export const desktopIcons: AppDef[] = [
  { id: 'finder', label: 'Finder', icon: Folder },
  { id: 'notes', label: 'Notes', icon: Notebook },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

export const launcherApps: AppDef[] = [
  { id: 'finder', label: 'Finder', icon: Folder },
  { id: 'notes', label: 'Notes', icon: Notebook },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]
