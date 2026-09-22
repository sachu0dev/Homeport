import { Folder, HardDrive, Download, FileText, Star } from 'lucide-react'

const favorites = [
  { label: 'Home', icon: HardDrive },
  { label: 'Documents', icon: FileText },
  { label: 'Downloads', icon: Download },
  { label: 'Starred', icon: Star },
]

// Dummy listing — swap for a real filesystem/API-backed listing later.
const files = [
  { name: 'docker-compose.yml', kind: 'YAML', modified: 'Today, 09:14' },
  { name: 'homeport-config', kind: 'Folder', modified: 'Yesterday' },
  { name: 'backups', kind: 'Folder', modified: 'Sep 18' },
  { name: 'server.log', kind: 'Log file', modified: 'Sep 17' },
  { name: 'nginx.conf', kind: 'Config', modified: 'Sep 16' },
  { name: 'scripts', kind: 'Folder', modified: 'Sep 14' },
  { name: 'ssl-certs', kind: 'Folder', modified: 'Sep 13' },
  { name: 'README.md', kind: 'Markdown', modified: 'Sep 12' },
]

export function FinderApp() {
  return (
    <div className="flex h-full flex-col text-sm">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-40 shrink-0 border-r border-macos-border bg-black/5 p-3 dark:bg-white/5">
          <p className="mb-2 px-1 text-[11px] font-medium text-macos-foreground/50">Favorites</p>
          <ul className="space-y-0.5">
            {favorites.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex cursor-default items-center gap-2 rounded-macos-sm px-2 py-1 text-macos-foreground/80 hover:bg-macos-primary/10"
              >
                <Icon size={14} />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-macos-border text-[11px] text-macos-foreground/50">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Kind</th>
                <th className="px-3 py-2 font-medium">Modified</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name} className="cursor-default hover:bg-macos-primary/10">
                  <td className="flex items-center gap-2 px-3 py-1.5 text-macos-foreground">
                    <Folder size={14} className="text-macos-primary/70" />
                    {file.name}
                  </td>
                  <td className="px-3 py-1.5 text-macos-foreground/60">{file.kind}</td>
                  <td className="px-3 py-1.5 text-macos-foreground/60">{file.modified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="shrink-0 border-t border-macos-border px-3 py-1.5 text-[11px] text-macos-foreground/50">
        {files.length} items
      </div>
    </div>
  )
}
