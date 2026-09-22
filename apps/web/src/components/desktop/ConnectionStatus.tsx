import { useEffect, useState } from 'react'
import { getHealth } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type Status = { kind: 'checking' } | { kind: 'ok' } | { kind: 'error' }

export function ConnectionStatus() {
  const [status, setStatus] = useState<Status>({ kind: 'checking' })

  useEffect(() => {
    let cancelled = false
    getHealth()
      .then(() => {
        if (!cancelled) setStatus({ kind: 'ok' })
      })
      .catch(() => {
        if (!cancelled) setStatus({ kind: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const label =
    status.kind === 'checking'
      ? 'Checking backend connection…'
      : status.kind === 'ok'
        ? 'Backend connected'
        : 'Backend unreachable'

  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className={cn(
        'inline-block h-2 w-2 rounded-full transition-colors',
        status.kind === 'ok' && 'bg-emerald-500',
        status.kind === 'error' && 'bg-red-500',
        status.kind === 'checking' && 'bg-macos-muted',
      )}
    />
  )
}
