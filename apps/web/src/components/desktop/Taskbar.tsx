import { Fragment, useEffect, useRef, useState } from 'react'
import { dockApps, type DockApp } from '@/lib/dock-apps'
import { windowedApps } from '@/apps/registry'
import { useWindowActions, useWindows } from '@/window-manager/actions'
import { useWindowStore } from '@/window-manager/store'
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
  const dockRef = useRef<HTMLDivElement>(null)
  const [bouncingId, setBouncingId] = useState<string | null>(null)

  const windows = useWindows()
  const { openWindow, focusWindow, minimizeWindow, restoreWindow, setDockRect } = useWindowActions()
  const dockAutoHidden = useWindowStore((s) => s.dockAutoHidden)

  useEffect(() => {
    const el = dockRef.current
    if (!el) return
    const report = () => {
      const rect = el.getBoundingClientRect()
      setDockRect({ x: rect.left, y: rect.top, width: rect.width, height: rect.height })
    }
    report()
    const observer = new ResizeObserver(report)
    observer.observe(el)
    window.addEventListener('resize', report)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', report)
    }
  }, [setDockRect])

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

    const def = windowedApps[app.id]
    if (!def) return // decorative-only dock app for now — no window content yet

    const existing = windows.find((w) => w.appId === app.id)
    if (!existing) {
      openWindow({
        appId: def.id,
        title: def.title,
        width: def.defaultWidth,
        height: def.defaultHeight,
        minWidth: def.minWidth,
        minHeight: def.minHeight,
      })
    } else if (existing.minimized) {
      restoreWindow(existing.id)
    } else if (existing.focused) {
      minimizeWindow(existing.id)
    } else {
      focusWindow(existing.id)
    }
  }

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-[90] flex justify-center pb-2 transition-all duration-200 ease-out',
        dockAutoHidden && 'pointer-events-none translate-y-[calc(100%+12px)] opacity-0',
      )}
    >
      <div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex items-end gap-2 rounded-[20px] border border-macos-border bg-macos-dock-background px-3 pb-2 pt-2 shadow-macos-dock backdrop-blur-macos-dock"
      >
        {dockApps.map((app) => {
          const hasWindow = windows.some((w) => w.appId === app.id)
          return (
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
                    hasWindow ? 'opacity-100' : 'opacity-0',
                  )}
                  aria-hidden="true"
                />
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
