import { Fragment, useRef, useState } from 'react'
import { dockApps, type DockApp } from '@/lib/dock-apps'
import { AppIconTile } from './AppIconTile'
import { cn } from '@/lib/utils'

interface TaskbarProps {
  launcherOpen: boolean
  onToggleLauncher: () => void
}

const MAGNIFY_RADIUS = 90
const MAGNIFY_SCALE = 0.65

export function Taskbar({ launcherOpen, onToggleLauncher }: TaskbarProps) {
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [openApps, setOpenApps] = useState<Set<string>>(new Set())
  const [bouncingId, setBouncingId] = useState<string | null>(null)

  const handleMouseMove = (event: React.MouseEvent) => {
    for (const el of Object.values(iconRefs.current)) {
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const distance = Math.abs(event.clientX - center)
      const scale =
        distance < MAGNIFY_RADIUS ? 1 + (1 - distance / MAGNIFY_RADIUS) * MAGNIFY_SCALE : 1
      el.style.transform = `scale(${scale}) translateY(${(scale - 1) * -18}px)`
    }
  }

  const handleMouseLeave = () => {
    for (const el of Object.values(iconRefs.current)) {
      if (el) el.style.transform = 'scale(1) translateY(0)'
    }
  }

  const bounce = (id: string) => {
    setBouncingId(id)
    window.setTimeout(() => setBouncingId((current) => (current === id ? null : current)), 500)
  }

  const handleAppClick = (app: DockApp) => {
    bounce(app.id)
    if (app.kind === 'launchpad') {
      onToggleLauncher()
      return
    }
    if (app.kind === 'trash') return
    setOpenApps((current) => {
      const next = new Set(current)
      if (next.has(app.id)) next.delete(app.id)
      else next.add(app.id)
      return next
    })
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-2">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-2 rounded-[20px] border border-macos-border bg-macos-dock-background px-3 pb-2 pt-2 shadow-macos-dock backdrop-blur-macos-dock"
      >
        {dockApps.map((app) => (
          <Fragment key={app.id}>
            {app.kind === 'trash' && (
              <div className="mb-2 h-9 w-px self-end bg-macos-border" aria-hidden="true" />
            )}
            <div className="flex flex-col items-center">
              <button
                ref={(el) => {
                  iconRefs.current[app.id] = el
                }}
                type="button"
                aria-label={app.kind === 'launchpad' ? 'Open Launchpad' : app.label}
                aria-pressed={app.kind === 'launchpad' ? launcherOpen : undefined}
                onClick={() => handleAppClick(app)}
                className={cn(
                  'group relative h-12 w-12 origin-bottom transition-transform duration-150 ease-out will-change-transform',
                  bouncingId === app.id && 'animate-dock-bounce',
                )}
              >
                <AppIconTile app={app} />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[11px] whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {app.label}
                </span>
              </button>
              <span
                className={cn(
                  'mt-1 h-1 w-1 rounded-full bg-macos-foreground/70 transition-opacity',
                  openApps.has(app.id) ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden="true"
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
