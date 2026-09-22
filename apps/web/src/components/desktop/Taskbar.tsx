import { LayoutGrid } from 'lucide-react'

interface TaskbarProps {
  launcherOpen: boolean
  onToggleLauncher: () => void
}

export function Taskbar({ launcherOpen, onToggleLauncher }: TaskbarProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center justify-center border-t border-macos-border bg-macos-dockBackground px-4 backdrop-blur-xl">
      <button
        type="button"
        aria-label="Open App Launcher"
        aria-pressed={launcherOpen}
        onClick={onToggleLauncher}
        className="flex items-center gap-1.5 rounded-macos-sm px-3 py-1 text-xs font-medium text-macos-foreground/80 transition hover:bg-white/10 hover:text-macos-foreground"
      >
        <LayoutGrid size={14} />
        Launcher
      </button>
    </div>
  )
}
