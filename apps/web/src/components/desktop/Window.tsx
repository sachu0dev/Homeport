import { useEffect, useState } from 'react'
import { Rnd, type RndDragCallback, type RndResizeCallback } from 'react-rnd'
import type { WindowInstance } from '@/window-manager/types'
import { getPointerPosition, resolveSnapZone, useWindowActions } from '@/window-manager/actions'
import { useWindowStore } from '@/window-manager/store'
import { windowedApps } from '@/apps/registry'
import { cn } from '@/lib/utils'

interface WindowProps {
  win: WindowInstance
}

const MINIMIZE_MS = 280
const RESTORE_MS = 320
const APPEAR_MS = 220
const CLOSE_MS = 180

function rectsOverlap(
  a: { left: number; right: number; bottom: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return a.right > b.x && a.left < b.x + b.width && a.bottom > b.y
}

export function Window({ win }: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    applySnap,
    unsnapForDrag,
    setDockAutoHidden,
    setSnapPreview,
  } = useWindowActions()

  const appDef = windowedApps[win.appId]
  const Content = appDef?.component

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [closing, setClosing] = useState(false)
  const [visualMinimized, setVisualMinimized] = useState(win.minimized)
  const [minimizing, setMinimizing] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [justOpened, setJustOpened] = useState(!win.minimized)
  // Starts false so the very first paint (including React StrictMode's dev-only extra
  // mount pass) renders with a plain, untransformed box — react-rnd measures that first
  // paint to calibrate its internal parent-offset, and if `animate-window-appear`'s
  // scale/translateY were already applied at that moment, it would calibrate against a
  // transiently-transformed box and permanently mis-position the window afterward
  // (most visible on the very next programmatic move, e.g. maximize). Flipping this on
  // one tick later, after that calibration already happened, avoids the whole class.
  const [mounted, setMounted] = useState(false)

  // Adjust transient animation flags synchronously during render in response to the
  // `minimized` prop flipping — see https://react.dev/reference/react/useState#storing-information-from-previous-renders.
  // Only the *clearing* of these flags (timer-driven) happens in an effect below.
  const [prevMinimized, setPrevMinimized] = useState(win.minimized)
  if (win.minimized !== prevMinimized) {
    setPrevMinimized(win.minimized)
    if (win.minimized) {
      setMinimizing(true)
    } else {
      setVisualMinimized(false)
      setRestoring(true)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!justOpened || !mounted) return
    const t = setTimeout(() => setJustOpened(false), APPEAR_MS)
    return () => clearTimeout(t)
  }, [justOpened, mounted])

  useEffect(() => {
    if (!minimizing) return
    const t = setTimeout(() => {
      setMinimizing(false)
      setVisualMinimized(true)
    }, MINIMIZE_MS)
    return () => clearTimeout(t)
  }, [minimizing])

  useEffect(() => {
    if (!restoring) return
    const t = setTimeout(() => setRestoring(false), RESTORE_MS)
    return () => clearTimeout(t)
  }, [restoring])

  if (visualMinimized) return null

  const animClass = minimizing
    ? 'animate-window-minimize'
    : restoring
      ? 'animate-window-restore'
      : justOpened && mounted
        ? 'animate-window-appear'
        : ''

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => closeWindow(win.id), CLOSE_MS)
  }

  const handleDragStart: RndDragCallback = (e) => {
    setIsDragging(true)
    focusWindow(win.id)
    if (win.maximized || win.snap) {
      const { x } = getPointerPosition(e)
      unsnapForDrag(win.id, x)
    }
  }

  const handleDrag: RndDragCallback = (e, data) => {
    moveWindow(win.id, data.x, data.y)
    const { x, y } = getPointerPosition(e)
    setSnapPreview(resolveSnapZone(x, y))

    const dockRect = useWindowStore.getState().dockRect
    if (dockRect) {
      const rect = data.node.getBoundingClientRect()
      setDockAutoHidden(rectsOverlap(rect, dockRect))
    }
  }

  const handleDragStop: RndDragCallback = (e, data) => {
    setIsDragging(false)
    setDockAutoHidden(false)
    moveWindow(win.id, data.x, data.y)
    const { x, y } = getPointerPosition(e)
    const zone = resolveSnapZone(x, y)
    setSnapPreview(null)
    if (zone) applySnap(win.id, zone)
  }

  const handleResizeStop: RndResizeCallback = (_e, _dir, ref, _delta, position) => {
    setIsResizing(false)
    resizeWindow(win.id, {
      x: position.x,
      y: position.y,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    })
  }

  return (
    <Rnd
      position={{ x: win.x, y: win.y }}
      size={{ width: win.width, height: win.height }}
      minWidth={win.minWidth}
      minHeight={win.minHeight}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      cancel="button"
      enableResizing={!win.maximized}
      onMouseDown={() => focusWindow(win.id)}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStart={() => {
        setIsResizing(true)
        focusWindow(win.id)
      }}
      onResizeStop={handleResizeStop}
      style={{ zIndex: win.zIndex }}
      className={cn(
        'flex flex-col overflow-hidden rounded-macos-window border border-macos-border bg-macos-window-background shadow-macos-window backdrop-blur-macos-window',
        win.focused && 'shadow-macos-window-active',
        !isDragging && !isResizing && 'transition-[width,height,transform] duration-200 ease-out',
        closing && 'animate-window-disappear pointer-events-none',
        !closing && animClass,
      )}
    >
      <div
        className="window-titlebar flex h-8 shrink-0 items-center gap-2 border-b border-macos-border bg-black/5 px-3 dark:bg-white/5"
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`Close ${win.title}`}
            onClick={handleClose}
            className="group h-3 w-3 rounded-full bg-[#ff5f57]"
          >
            <span className="block h-full w-full text-center text-[8px] leading-3 text-black/0 group-hover:text-black/40">
              ×
            </span>
          </button>
          <button
            type="button"
            aria-label={`Minimize ${win.title}`}
            onClick={() => minimizeWindow(win.id)}
            className="h-3 w-3 rounded-full bg-[#febc2e]"
          />
          <button
            type="button"
            aria-label={`Maximize ${win.title}`}
            onClick={() => toggleMaximize(win.id)}
            className="h-3 w-3 rounded-full bg-[#28c840]"
          />
        </div>
        <span className="flex-1 truncate text-center text-xs font-medium text-macos-foreground/70">
          {win.title}
        </span>
        <span className="w-[52px]" aria-hidden="true" />
      </div>
      <div className="flex-1 overflow-hidden bg-macos-background text-macos-foreground">
        {Content ? <Content /> : null}
      </div>
    </Rnd>
  )
}
