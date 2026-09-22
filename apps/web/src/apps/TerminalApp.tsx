import { useState, type FormEvent } from 'react'

const seedLines = [
  '$ homeport status',
  'All services running (4/4)',
  '$ docker ps --format "table {{.Names}}\\t{{.Status}}"',
  'homeport-api     Up 2 hours',
  'homeport-db      Up 2 hours',
  '$ df -h /',
  '/dev/sda1   460G   221G   239G   48%   /',
  '$ uptime',
  '08:03:14 up 2 days, 4:12, load average: 0.42, 0.38, 0.31',
]

// Local-only echo — swap the submit handler for a real PTY/websocket session later.
export function TerminalApp() {
  const [lines, setLines] = useState<string[]>(seedLines)
  const [input, setInput] = useState('')

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!input.trim()) return
    setLines((current) => [...current, `$ ${input}`, `command not found: ${input.split(' ')[0]}`])
    setInput('')
  }

  return (
    <div className="flex h-full flex-col bg-[#1a1a1a] p-3 font-mono text-[13px] text-emerald-400">
      <div className="flex-1 space-y-0.5 overflow-auto">
        {lines.map((line, i) => (
          <p key={i} className={line.startsWith('$') ? 'text-white' : 'text-emerald-400'}>
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-1.5 pt-1">
        <span className="text-white">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
          className="flex-1 bg-transparent text-white outline-none"
        />
      </form>
    </div>
  )
}
