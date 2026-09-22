import type { DockApp } from '@/lib/dock-apps'
import { cn } from '@/lib/utils'

interface AppIconTileProps {
  app: DockApp
  className?: string
}

export function AppIconTile({ app, className }: AppIconTileProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-[22%] shadow-md',
        app.tile,
        className,
      )}
    >
      <img
        src={app.iconSrc}
        alt=""
        className="h-[60%] w-[60%] object-contain drop-shadow-sm"
        draggable={false}
      />
    </div>
  )
}
