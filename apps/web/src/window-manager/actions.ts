import { useShallow } from 'zustand/react/shallow'
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { useWindowStore } from './store'
import { SNAP_EDGE_THRESHOLD, TOPBAR_HEIGHT } from './layout'
import type { SnapZone } from './types'

type PointerEventLike =
  ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement> | MouseEvent | TouchEvent

/** react-rnd's drag/resize callbacks fire with either a mouse or touch event — normalize both. */
export function getPointerPosition(e: PointerEventLike): { x: number; y: number } {
  if ('clientX' in e) return { x: e.clientX, y: e.clientY }
  const touch = e.touches[0] ?? e.changedTouches[0]
  return { x: touch?.clientX ?? 0, y: touch?.clientY ?? 0 }
}

/** Bound action functions — grouped with useShallow so consumers don't re-render on state changes. */
export function useWindowActions() {
  return useWindowStore(
    useShallow((s) => ({
      openWindow: s.openWindow,
      closeWindow: s.closeWindow,
      focusWindow: s.focusWindow,
      minimizeWindow: s.minimizeWindow,
      restoreWindow: s.restoreWindow,
      toggleMaximize: s.toggleMaximize,
      moveWindow: s.moveWindow,
      resizeWindow: s.resizeWindow,
      applySnap: s.applySnap,
      unsnapForDrag: s.unsnapForDrag,
      setWorkArea: s.setWorkArea,
      setDockRect: s.setDockRect,
      setDockAutoHidden: s.setDockAutoHidden,
      setSnapPreview: s.setSnapPreview,
    })),
  )
}

export function useWindows() {
  return useWindowStore((s) => s.windows)
}

export function useIsAppOpen(appId: string) {
  return useWindowStore((s) => s.windows.some((w) => w.appId === appId && !w.minimized))
}

export function useHasAppWindow(appId: string) {
  return useWindowStore((s) => s.windows.some((w) => w.appId === appId))
}

/**
 * Resolve which snap zone a pointer position is over, using viewport-space
 * coordinates (not window-relative) so the hit test stays correct regardless
 * of where the dragged window currently is.
 */
export function resolveSnapZone(clientX: number, clientY: number): SnapZone | null {
  if (clientY <= TOPBAR_HEIGHT + SNAP_EDGE_THRESHOLD) return 'full'
  if (clientX <= SNAP_EDGE_THRESHOLD) return 'left'
  if (clientX >= window.innerWidth - SNAP_EDGE_THRESHOLD) return 'right'
  return null
}
