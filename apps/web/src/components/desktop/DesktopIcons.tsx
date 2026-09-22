import { useState } from 'react'
import { dockApps } from '@/lib/dock-apps'
import { windowedApps } from '@/apps/registry'
import { useWindowActions } from '@/window-manager/actions'
import { AppIconTile } from './AppIconTile'
import { cn } from '@/lib/utils'

const desktopAppIds = ['finder', 'notes', 'trash']
const desktopApps = desktopAppIds
  .map((id) => dockApps.find((app) => app.id === id))
  .filter((app) => app !== undefined)

export function DesktopIcons() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { openWindow } = useWindowActions()

  const openApp = (appId: string) => {
    const def = windowedApps[appId]
    if (!def) return
    openWindow({
      appId: def.id,
      title: def.title,
      width: def.defaultWidth,
      height: def.defaultHeight,
      minWidth: def.minWidth,
      minHeight: def.minHeight,
    })
  }

  return (
    <div className="absolute left-4 top-14 z-10 flex flex-col gap-4">
      {desktopApps.map((app) => (
        <button
          key={app.id}
          type="button"
          onClick={() => setSelectedId((current) => (current === app.id ? null : app.id))}
          onDoubleClick={() => openApp(app.id)}
          className={cn(
            'flex w-20 flex-col items-center gap-1 rounded-macos-md p-2 select-none',
            selectedId === app.id && 'bg-white/20 backdrop-blur-sm',
          )}
        >
          <div className="h-12 w-12">
            <AppIconTile app={app} />
          </div>
          <span className="rounded-sm px-1 text-xs text-white drop-shadow-md">{app.label}</span>
        </button>
      ))}
    </div>
  )
}
