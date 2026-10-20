// Starts the KBC Loop API (settings: see config.js).
import { createServer } from './server.js'
import { loadConfig } from './config.js'

const config = loadConfig()
const app = createServer(config)
const { port } = await app.listen(config.port, config.host)

console.log(`KBC Loop API on http://${config.host}:${port}`)
console.log(`  database: ${config.dbPath}`)
console.log(`  allowed origins: ${config.allowedOrigins.join(', ')}`)
if (!config.apiKey && config.host !== '127.0.0.1' && config.host !== 'localhost') {
  console.warn('  Warning: the API is reachable on the network without API_KEY. Set API_KEY to protect requests.')
}

// Graceful shutdown: stop accepting connections, close WebSocket clients (1001), finish in-flight
// requests, close the database. A second signal, or a shutdown that hangs for 10 s, exits immediately.
let shuttingDown = false
function shutdown(signal) {
  if (shuttingDown) process.exit(1)
  shuttingDown = true
  console.log(`${signal} received, shutting down`)
  setTimeout(() => { console.error('Shutdown timed out, exiting'); process.exit(1) }, 10_000).unref()
  app.close().then(() => process.exit(0), (err) => { console.error(err); process.exit(1) })
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => shutdown(signal))
