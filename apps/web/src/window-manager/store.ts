import { create } from 'zustand'
import type { Bounds, SnapZone, WindowInstance } from './types'
import {
  CASCADE_MAX_STEPS,
  CASCADE_OFFSET,
  DOCK_RESERVE,
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
} from './layout'

interface OpenWindowOptions {
  appId: string
  title: string
  width: number
  height: number
  minWidth?: number
  minHeight?: number
}

interface WindowManagerState {
  windows: WindowInstance[]
  nextZIndex: number
  workArea: { width: number; height: number }
  dockRect: Bounds | null
  dockAutoHidden: boolean
  snapPreview: SnapZone | null

  setWorkArea: (size: { width: number; height: number }) => void
  setDockRect: (rect: Bounds | null) => void
  setDockAutoHidden: (hidden: boolean) => void
  setSnapPreview: (zone: SnapZone | null) => void

  openWindow: (options: OpenWindowOptions) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  moveWindow: (id: string, x: number, y: number) => void
  resizeWindow: (id: string, bounds: Bounds) => void
  applySnap: (id: string, zone: SnapZone) => void
  /** Called when the user starts dragging a maximized/snapped window's title bar. */
  unsnapForDrag: (id: string, pointerX: number) => void
}

function fullBounds(workArea: { width: number; height: number }): Bounds {
  return { x: 0, y: 0, width: workArea.width, height: workArea.height }
}

function halfBounds(workArea: { width: number; height: number }, side: 'left' | 'right'): Bounds {
  const width = Math.round(workArea.width / 2)
  return {
    x: side === 'left' ? 0 : workArea.width - width,
    y: 0,
    width,
    height: workArea.height,
  }
}

export const useWindowStore = create<WindowManagerState>((set, get) => ({
  windows: [],
  nextZIndex: 10,
  workArea: { width: 0, height: 0 },
  dockRect: null,
  dockAutoHidden: false,
  snapPreview: null,

  setWorkArea: (size) => set({ workArea: size }),
  setDockRect: (rect) => set({ dockRect: rect }),
  setDockAutoHidden: (hidden) => set({ dockAutoHidden: hidden }),
  setSnapPreview: (zone) => set({ snapPreview: zone }),

  openWindow: ({ appId, title, width, height, minWidth, minHeight }) => {
    const existing = get().windows.find((w) => w.appId === appId)
    if (existing) {
      if (existing.minimized) get().restoreWindow(existing.id)
      else get().focusWindow(existing.id)
      return
    }

    const { workArea, nextZIndex, windows } = get()
    const openCount = windows.length
    const step = openCount % CASCADE_MAX_STEPS
    const w = Math.min(width, Math.max(workArea.width - 40, MIN_WINDOW_WIDTH))
    const h = Math.min(height, Math.max(workArea.height - DOCK_RESERVE, MIN_WINDOW_HEIGHT))
    const maxX = Math.max(workArea.width - w, 0)
    const maxY = Math.max(workArea.height - h - 24, 0)
    const x = Math.min(60 + step * CASCADE_OFFSET, maxX)
    const y = Math.min(40 + step * CASCADE_OFFSET, maxY)

    const instance: WindowInstance = {
      id: crypto.randomUUID(),
      appId,
      title,
      x,
      y,
      width: w,
      height: h,
      minWidth: minWidth ?? MIN_WINDOW_WIDTH,
      minHeight: minHeight ?? MIN_WINDOW_HEIGHT,
      minimized: false,
      maximized: false,
      snap: null,
      focused: true,
      zIndex: nextZIndex,
      prevBounds: null,
    }

    set({
      windows: [...windows.map((w2) => ({ ...w2, focused: false })), instance],
      nextZIndex: nextZIndex + 1,
    })
  },

  closeWindow: (id) => {
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) }))
  },

  focusWindow: (id) => {
    const { nextZIndex } = get()
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, focused: true, zIndex: nextZIndex } : { ...w, focused: false },
      ),
      nextZIndex: nextZIndex + 1,
    }))
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true, focused: false } : w,
      ),
    }))
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, minimized: false } : w)),
    }))
    get().focusWindow(id)
  },

  toggleMaximize: (id) => {
    const { workArea } = get()
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w
        if (w.maximized || w.snap) {
          const restored = w.prevBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height }
          return { ...w, ...restored, maximized: false, snap: null, prevBounds: null }
        }
        return {
          ...w,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          ...fullBounds(workArea),
          maximized: true,
          snap: null,
        }
      }),
    }))
    get().focusWindow(id)
  },

  moveWindow: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }))
  },

  resizeWindow: (id, bounds) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, ...bounds } : w)),
    }))
  },

  applySnap: (id, zone) => {
    const { workArea } = get()
    const bounds = zone === 'full' ? fullBounds(workArea) : halfBounds(workArea, zone)
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w
        const prevBounds = w.prevBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height }
        return {
          ...w,
          ...bounds,
          maximized: zone === 'full',
          snap: zone === 'full' ? null : zone,
          prevBounds,
        }
      }),
    }))
  },

  unsnapForDrag: (id, pointerX) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id || (!w.maximized && !w.snap)) return w
        const restored = w.prevBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height }
        const centeredX = Math.max(0, pointerX - restored.width / 2)
        return {
          ...w,
          ...restored,
          x: centeredX,
          y: 0,
          maximized: false,
          snap: null,
          prevBounds: null,
        }
      }),
    }))
  },
}))
