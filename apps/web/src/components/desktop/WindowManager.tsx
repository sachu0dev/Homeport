import { useEffect, useRef } from 'react'
import { Window } from './Window'
import { SnapPreview } from './SnapPreview'
import { useWindows } from '@/window-manager/actions'
import { useWindowStore } from '@/window-manager/store'
import { TOPBAR_HEIGHT } from '@/window-manager/layout'

export function WindowManager() {
  const windows = useWindows()
  const setWorkArea = useWindowStore((s) => s.setWorkArea)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setWorkArea({ width: el.clientWidth, height: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [setWorkArea])

  return (
    <div ref={containerRef} className="absolute inset-x-0 bottom-0" style={{ top: TOPBAR_HEIGHT }}>
      <SnapPreview />
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </div>
  )
}
