// Start de KBC Loop-api (instellingen: zie config.js).
import { createServer } from './server.js'
import { loadConfig } from './config.js'

const config = loadConfig()
const app = createServer(config)
const { port } = await app.listen(config.port, config.host)

console.log(`KBC Loop-api op http://${config.host}:${port}`)
console.log(`  database: ${config.dbPath}`)
console.log(`  toegelaten websites: ${config.allowedOrigins.join(', ')}`)
if (!config.apiKey && config.host !== '127.0.0.1' && config.host !== 'localhost') {
  console.warn('  Let op: de api is bereikbaar op het netwerk zonder API_KEY. Zet API_KEY om verzoeken af te schermen.')
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => app.close().then(() => process.exit(0)))
