import { useWindowStore } from '@/window-manager/store'

export function SnapPreview() {
  const snapPreview = useWindowStore((s) => s.snapPreview)
  if (!snapPreview) return null

  const style =
    snapPreview === 'full'
      ? { inset: 0 }
      : snapPreview === 'left'
        ? { top: 0, bottom: 0, left: 0, width: '50%' }
        : { top: 0, bottom: 0, right: 0, width: '50%' }

  return (
    <div
      className="pointer-events-none absolute z-[5] m-1.5 animate-window-appear rounded-macos-lg border-2 border-macos-primary bg-macos-primary/20"
      style={style}
    />
  )
}
