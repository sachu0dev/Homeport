import { useState } from 'react'
import { DesktopIcon } from '@sylonikse/macos-ui'
import { desktopIcons } from '@/lib/apps'

export function DesktopIcons() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="absolute left-4 top-14 z-10 flex flex-col gap-2">
      {desktopIcons.map((app) => (
        <DesktopIcon
          key={app.id}
          icon={app.icon}
          label={app.label}
          color="white"
          selected={selectedId === app.id}
          onClick={() => setSelectedId((current) => (current === app.id ? null : app.id))}
        />
      ))}
    </div>
  )
}
