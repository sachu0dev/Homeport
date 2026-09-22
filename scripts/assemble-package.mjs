import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, 'package')

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

await cp(path.join(root, 'apps/api/dist'), path.join(outDir, 'server'), { recursive: true })
await cp(path.join(root, 'apps/api/package.json'), path.join(outDir, 'package.json'))
await cp(path.join(root, 'apps/web/dist'), path.join(outDir, 'web'), { recursive: true })
await cp(path.join(root, 'install.sh'), path.join(outDir, 'install.sh'))

console.log(`Package assembled at ${path.relative(process.cwd(), outDir)}/`)
console.log('  server/  -> compiled Fastify API')
console.log('  web/     -> compiled frontend static build')
console.log('  install.sh')
