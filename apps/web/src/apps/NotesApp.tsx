import { useState } from 'react'

// Local-only dummy notes — swap for API-backed notes later.
const seedNotes = [
  {
    id: '1',
    title: 'Homelab TODO',
    body: 'Set up backups for the media server.\nRotate SSH keys.',
  },
  { id: '2', title: 'Server passwords', body: 'Stored in the vault, not here.' },
  { id: '3', title: 'Ideas', body: 'Add a dashboard widget for uptime.' },
]

export function NotesApp() {
  const [notes] = useState(seedNotes)
  const [selectedId, setSelectedId] = useState(seedNotes[0].id)
  const selected = notes.find((n) => n.id === selectedId) ?? notes[0]

  return (
    <div className="flex h-full text-sm">
      <div className="w-44 shrink-0 overflow-auto border-r border-macos-border bg-black/5 dark:bg-white/5">
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => setSelectedId(note.id)}
            className={`block w-full border-b border-macos-border/50 px-3 py-2 text-left ${
              note.id === selectedId ? 'bg-macos-primary/15' : 'hover:bg-macos-primary/10'
            }`}
          >
            <p className="truncate font-medium text-macos-foreground">{note.title}</p>
            <p className="truncate text-xs text-macos-foreground/50">{note.body.split('\n')[0]}</p>
          </button>
        ))}
      </div>
      <div className="flex-1 p-4">
        <p className="mb-2 font-semibold text-macos-foreground">{selected.title}</p>
        <textarea
          key={selected.id}
          defaultValue={selected.body}
          className="h-[calc(100%-2rem)] w-full resize-none bg-transparent text-macos-foreground/90 outline-none"
        />
      </div>
    </div>
  )
}
