import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Static highlighted snippets — swap the tab body for a real editor (CodeMirror/Monaco)
// wired to the filesystem API in a later phase.
const codeTabs = [
  {
    name: 'docker-compose.yml',
    lines: [
      [
        ['key', 'services'],
        ['punct', ':'],
      ],
      [
        ['key', '  api'],
        ['punct', ':'],
      ],
      [
        ['key', '    image'],
        ['punct', ': '],
        ['string', 'homeport/api:latest'],
      ],
      [
        ['key', '    ports'],
        ['punct', ':'],
      ],
      [
        ['punct', '      - '],
        ['string', '"4000:4000"'],
      ],
    ],
  },
  {
    name: 'server.ts',
    lines: [
      [
        ['keyword', 'import'],
        ['plain', ' Fastify '],
        ['keyword', 'from'],
        ['string', " 'fastify'"],
      ],
      [['plain', '']],
      [
        ['keyword', 'const'],
        ['plain', ' app = '],
        ['fn', 'Fastify'],
        ['punct', '()'],
      ],
      [
        ['fn', 'app.listen'],
        ['punct', '({ '],
        ['key', 'port'],
        ['punct', ': '],
        ['number', '4000'],
        ['punct', ' })'],
      ],
    ],
  },
] as const

// .env rows get their own row-based editor (with a mask/reveal toggle) instead of
// token-highlighted lines, since that's how env vars are actually edited.
const envRows = [
  { key: 'DATABASE_URL', value: 'postgres://homeport:••••••@db:5432/homeport', secret: true },
  { key: 'PORT', value: '4000', secret: false },
  { key: 'JWT_SECRET', value: 'a1b2c3d4e5f6', secret: true },
  { key: 'NODE_ENV', value: 'production', secret: false },
]

const tokenColor: Record<string, string> = {
  key: 'text-sky-400',
  keyword: 'text-fuchsia-400',
  string: 'text-emerald-400',
  number: 'text-amber-400',
  fn: 'text-yellow-300',
  punct: 'text-macos-foreground/50',
  plain: 'text-macos-foreground/80',
}

const tabs = [...codeTabs.map((t) => t.name), '.env']

export function CodeEditorApp() {
  const [activeTab, setActiveTab] = useState(0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const isEnvTab = activeTab === codeTabs.length

  return (
    <div className="flex h-full flex-col bg-[#1e1e1e] font-mono text-[13px]">
      <div className="flex border-b border-black/40">
        {tabs.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`border-r border-black/40 px-3 py-1.5 ${
              i === activeTab ? 'bg-[#1e1e1e] text-white' : 'bg-black/20 text-white/50'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {isEnvTab ? (
        <div className="flex-1 overflow-auto p-3">
          <div className="space-y-1.5">
            {envRows.map((row) => (
              <div key={row.key} className="flex items-center gap-2">
                <span className="w-36 shrink-0 text-sky-400">{row.key}</span>
                <span className="text-macos-foreground/40">=</span>
                <input
                  readOnly
                  value={row.secret && !revealed[row.key] ? '•'.repeat(10) : row.value}
                  className="flex-1 bg-transparent text-emerald-400 outline-none"
                />
                {row.secret && (
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => ({ ...r, [row.key]: !r[row.key] }))}
                    className="text-white/40 hover:text-white/80"
                    aria-label={revealed[row.key] ? `Hide ${row.key}` : `Reveal ${row.key}`}
                  >
                    {revealed[row.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/30">
            Read-only preview — wiring to a real .env file comes in a later phase.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-2">
          {codeTabs[activeTab].lines.map((tokens, i) => (
            <div key={i} className="flex">
              <span className="w-8 select-none pr-3 text-right text-white/25">{i + 1}</span>
              <span>
                {tokens.map(([type, text], j) => (
                  <span key={j} className={tokenColor[type] ?? tokenColor.plain}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
