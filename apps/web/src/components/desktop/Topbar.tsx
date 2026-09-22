import { useState } from 'react'
import { MenuBar } from '@sylonikse/macos-ui'
import { Settings } from 'lucide-react'
import { Clock } from './Clock'
import { ConnectionStatus } from './ConnectionStatus'
import { SettingsPanel } from './SettingsPanel'
import type { ThemeMode } from '@/hooks/useTheme'
import type { Wallpaper } from '@/lib/wallpapers'

interface TopbarProps {
  mode: ThemeMode
  onModeChange: (mode: ThemeMode) => void
  wallpapers: Wallpaper[]
  wallpaperId: string
  onWallpaperChange: (id: string) => void
}

export function Topbar({
  mode,
  onModeChange,
  wallpapers,
  wallpaperId,
  onWallpaperChange,
}: TopbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="relative z-20">
      <MenuBar
        // @sylonikse/macos-ui's MenuBar hardcodes `bg-white/20` instead of
        // using the --macos-menuBarBackground token, so it never responds to
        // dark mode on its own — override its background/border here.
        className="border-macos-border bg-macos-menubar-background backdrop-blur-macos-menubar"
        logo={<span className="px-2 text-sm font-semibold text-macos-foreground">Homeport</span>}
        menus={[]}
        rightContent={
          <div className="flex items-center gap-3 pr-1">
            <ConnectionStatus />
            <Clock />
            <button
              type="button"
              aria-label="Settings"
              onClick={() => setSettingsOpen((open) => !open)}
              className="rounded-macos-sm p-1 text-macos-foreground/80 transition hover:bg-white/10 hover:text-macos-foreground"
            >
              <Settings size={16} />
            </button>
          </div>
        }
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        onModeChange={onModeChange}
        wallpapers={wallpapers}
        wallpaperId={wallpaperId}
        onWallpaperChange={onWallpaperChange}
      />
    </div>
  )
}
