import { useState } from 'react'
import { Topbar } from './Topbar'
import { Taskbar } from './Taskbar'
import { DesktopIcons } from './DesktopIcons'
import { AppLauncher } from './AppLauncher'
import { WindowManager } from './WindowManager'
import { useTheme } from '@/hooks/useTheme'
import { useWallpaper } from '@/hooks/useWallpaper'

export function Desktop() {
  const { mode, setMode } = useTheme()
  const { wallpaper, wallpaperId, setWallpaperId, wallpapers } = useWallpaper()
  const [launcherOpen, setLauncherOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const useImage = Boolean(wallpaper.src) && !imageFailed

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={!useImage ? { background: wallpaper.gradient } : undefined}
      >
        {useImage && (
          <img
            key={wallpaper.id}
            src={wallpaper.src}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <Topbar
        mode={mode}
        onModeChange={setMode}
        wallpapers={wallpapers}
        wallpaperId={wallpaperId}
        onWallpaperChange={(id) => {
          setImageFailed(false)
          setWallpaperId(id)
        }}
      />

      <DesktopIcons />

      <WindowManager />

      <Taskbar
        launcherOpen={launcherOpen}
        onToggleLauncher={() => setLauncherOpen((open) => !open)}
      />

      <AppLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </div>
  )
}
