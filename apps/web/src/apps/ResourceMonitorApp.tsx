// Dummy metrics — swap for a real polling hook against the API's /metrics endpoint later.
const metrics = [
  { label: 'CPU', value: 34, detail: '4 cores · 2.1 GHz avg' },
  { label: 'Memory', value: 62, detail: '9.9 GB / 16 GB' },
  { label: 'Disk', value: 48, detail: '221 GB / 460 GB' },
  { label: 'Network', value: 12, detail: '3.2 MB/s down · 0.4 MB/s up' },
]

const processes = [
  { name: 'homeport-api', cpu: '3.2%', mem: '84 MB' },
  { name: 'postgres', cpu: '1.1%', mem: '212 MB' },
  { name: 'nginx', cpu: '0.4%', mem: '18 MB' },
  { name: 'docker-proxy', cpu: '0.2%', mem: '9 MB' },
]

function barColor(value: number) {
  if (value >= 80) return 'bg-red-500'
  if (value >= 55) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export function ResourceMonitorApp() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-macos-md border border-macos-border p-3">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-medium text-macos-foreground">{m.label}</span>
              <span className="text-xs text-macos-foreground/50">{m.value}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-macos-foreground/10">
              <div
                className={`h-full rounded-full ${barColor(m.value)}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-macos-foreground/50">{m.detail}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-macos-foreground/50">Processes</p>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-macos-border text-[11px] text-macos-foreground/50">
              <th className="py-1 font-medium">Name</th>
              <th className="py-1 font-medium">CPU</th>
              <th className="py-1 font-medium">Memory</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.name} className="border-b border-macos-border/40">
                <td className="py-1 text-macos-foreground">{p.name}</td>
                <td className="py-1 text-macos-foreground/60">{p.cpu}</td>
                <td className="py-1 text-macos-foreground/60">{p.mem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
