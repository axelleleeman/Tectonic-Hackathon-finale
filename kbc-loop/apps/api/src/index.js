// Start de KBC Loop-api (instellingen: zie config.js).
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

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => app.close().then(() => process.exit(0)))
