import { useEffect, useRef } from 'react'
import { Check, Moon, Sun, SunMoon } from 'lucide-react'
import type { ThemeMode } from '@/hooks/useTheme'
import type { Wallpaper } from '@/lib/wallpapers'
import { cn } from '@/lib/utils'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  mode: ThemeMode
  onModeChange: (mode: ThemeMode) => void
  wallpapers: Wallpaper[]
  wallpaperId: string
  onWallpaperChange: (id: string) => void
}

const modeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: SunMoon },
]

export function SettingsPanel({
  open,
  onClose,
  mode,
  onModeChange,
  wallpapers,
  wallpaperId,
  onWallpaperChange,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Settings"
      className="absolute right-3 top-10 z-30 w-72 rounded-macos-lg border border-macos-border bg-macos-windowBackground p-4 shadow-macos-window backdrop-blur-xl"
    >
      <h2 className="text-sm font-medium text-macos-foreground">Appearance</h2>

      <div className="mt-2 flex gap-1 rounded-macos-md bg-macos-muted p-1">
        {modeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onModeChange(value)}
            aria-pressed={mode === value}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-macos-sm px-2 py-1.5 text-xs font-medium transition-colors',
              mode === value
                ? 'bg-macos-background text-macos-foreground shadow-sm'
                : 'text-macos-foreground/60 hover:text-macos-foreground',
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <h2 className="mt-4 text-sm font-medium text-macos-foreground">Wallpaper</h2>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {wallpapers.map((wallpaper) => (
          <button
            key={wallpaper.id}
            type="button"
            onClick={() => onWallpaperChange(wallpaper.id)}
            aria-label={wallpaper.name}
            aria-pressed={wallpaper.id === wallpaperId}
            title={wallpaper.name}
            className={cn(
              'relative h-14 rounded-macos-sm ring-2 ring-transparent transition',
              wallpaper.id === wallpaperId && 'ring-macos-primary',
            )}
            style={{
              backgroundImage: wallpaper.src
                ? `url(${wallpaper.src}), ${wallpaper.gradient}`
                : wallpaper.gradient,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {wallpaper.id === wallpaperId && (
              <span className="absolute right-1 top-1 rounded-full bg-macos-primary p-0.5 text-white">
                <Check size={10} />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
