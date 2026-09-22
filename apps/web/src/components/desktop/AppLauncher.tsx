import { useEffect } from 'react'
import { dockApps } from '@/lib/dock-apps'
import { windowedApps } from '@/apps/registry'
import { useWindowActions } from '@/window-manager/actions'
import { AppIconTile } from './AppIconTile'

interface AppLauncherProps {
  open: boolean
  onClose: () => void
}

const launcherApps = dockApps.filter((app) => app.kind === 'app')

export function AppLauncher({ open, onClose }: AppLauncherProps) {
  const { openWindow } = useWindowActions()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleOpen = (appId: string) => {
    const def = windowedApps[appId]
    if (def) {
      openWindow({
        appId: def.id,
        title: def.title,
        width: def.defaultWidth,
        height: def.defaultHeight,
        minWidth: def.minWidth,
        minHeight: def.minHeight,
      })
    }
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-label="App Launcher"
      className="absolute inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="grid grid-cols-4 gap-6 rounded-macos-lg p-8"
        onClick={(event) => event.stopPropagation()}
      >
        {launcherApps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => handleOpen(app.id)}
            className="flex w-20 flex-col items-center gap-1.5 rounded-macos-md p-2 text-white select-none hover:bg-white/10"
          >
            <div className="h-14 w-14">
              <AppIconTile app={app} />
            </div>
            <span className="text-xs drop-shadow-md">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
