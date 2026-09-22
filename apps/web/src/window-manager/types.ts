export type SnapZone = 'left' | 'right' | 'full'

export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}

export interface WindowInstance {
  id: string
  appId: string
  title: string
  x: number
  y: number
  width: number
  height: number
  minWidth: number
  minHeight: number
  minimized: boolean
  maximized: boolean
  snap: SnapZone | null
  focused: boolean
  zIndex: number
  /** Bounds to restore to when un-maximizing / un-snapping. */
  prevBounds: Bounds | null
}
