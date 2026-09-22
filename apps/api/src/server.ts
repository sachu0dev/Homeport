import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = Number(process.env.PORT ?? 4000)
const HOST = process.env.HOST ?? '0.0.0.0'
const isProduction = process.env.NODE_ENV === 'production'

const app = Fastify({ logger: true })

if (!isProduction) {
  await app.register(cors, { origin: true })
}

app.get('/api/health', async () => ({ status: 'ok', service: 'homeport-api' }))

if (isProduction) {
  // Packaged layout (see scripts/assemble-package.mjs): server/server.js + web/
  const webDist = process.env.WEB_DIST_PATH ?? path.resolve(__dirname, '../web')
  await app.register(fastifyStatic, {
    root: webDist,
    prefix: '/web-admin/',
  })

  app.setNotFoundHandler((request, reply) => {
    if (request.raw.method === 'GET' && !request.url.startsWith('/api/')) {
      reply.sendFile('index.html')
      return
    }
    reply.code(404).send({ error: 'Not Found' })
  })
}

app.listen({ port: PORT, host: HOST }).catch((error) => {
  app.log.error(error)
  process.exit(1)
})
