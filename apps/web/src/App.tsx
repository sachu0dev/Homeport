import { useEffect, useState } from 'react'
import { getHealth } from '@/lib/api-client'

type Status =
  { kind: 'loading' } | { kind: 'ok'; service: string } | { kind: 'error'; message: string }

function App() {
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false

    getHealth()
      .then((health) => {
        if (!cancelled) setStatus({ kind: 'ok', service: health.service })
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setStatus({
            kind: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-macos-background text-macos-foreground">
      <div className="rounded-macos-md border border-macos-border bg-macos-secondary px-8 py-6 text-center shadow-macos-window">
        <h1 className="text-lg font-medium">Homeport</h1>
        <p className="mt-2 text-sm">
          {status.kind === 'loading' && 'Checking backend…'}
          {status.kind === 'ok' && `API OK (${status.service})`}
          {status.kind === 'error' && `API unreachable: ${status.message}`}
        </p>
      </div>
    </div>
  )
}

export default App
