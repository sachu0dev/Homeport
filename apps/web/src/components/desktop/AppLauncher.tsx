import { useEffect } from 'react'
import { dockApps } from '@/lib/dock-apps'
import { AppIconTile } from './AppIconTile'

interface AppLauncherProps {
  open: boolean
  onClose: () => void
}

const launcherApps = dockApps.filter((app) => app.kind === 'app')

export function AppLauncher({ open, onClose }: AppLauncherProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="App Launcher"
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="grid grid-cols-4 gap-6 rounded-macos-lg p-8"
        onClick={(event) => event.stopPropagation()}
      >
        {launcherApps.map((app) => (
          <div
            key={app.id}
            className="flex w-20 flex-col items-center gap-1.5 rounded-macos-md p-2 text-white select-none"
          >
            <div className="h-14 w-14">
              <AppIconTile app={app} />
            </div>
            <span className="text-xs drop-shadow-md">{app.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
