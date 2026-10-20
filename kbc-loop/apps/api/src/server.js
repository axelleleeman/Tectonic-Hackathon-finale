// KBC Loop-api: REST + WebSocket bovenop één SQLite-database.
//
//   GET  /api/health                         status (zonder sleutel)
//   GET  /api/state                          { version, state }
//   POST /api/actions                        { type, ... } → past de actie toe, geeft de nieuwe state terug
//   GET  /api/insights?kind=&customerType=   geanonimiseerde groepen + aanbevelingen (KBC Loop Insights)
//   GET  /api/actions/recent?limit=          laatste acties uit het logboek
//   GET  /api/catalog                        partner catalogue { categories, partners, products } (from the database)
//   GET  /api/catalog/partners/:id           one partner with its products (404 when unknown)
//   WS   /api/live                           { type: 'state', version, state } bij verbinden en elke wijziging
//
// In productie serveert dezelfde server ook de gebouwde web (STATIC_DIR): alles op één (HTTPS-)adres.
import { createServer as createHttpServer } from 'node:http'
import { ACTION_TYPES } from '@kbc-loop/shared/state/loopReducer.js'
import { insights } from '@kbc-loop/shared/engine/insights.js'
import { openDb } from './db.js'
import { PARTNER_ID } from './catalog.js'
import { liveUpdates } from './live.js'
import { staticFiles } from './static.js'
import { HSTS, SECURITY_HEADERS, clientIp, keyCheck, originCheck, rateLimiter } from './security.js'
import { loadConfig } from './config.js'

const MAX_BODY = 16 * 1024
const KINDS = ['alle', 'herstelling', 'herhaalaankoop']
const CUSTOMER_TYPES = ['alle', 'particulier', 'kmo']
const PARTNER_PATH = '/api/catalog/partners/'

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

function readJson(req) {
  if (!String(req.headers['content-type'] ?? '').startsWith('application/json')) {
    return Promise.reject(new HttpError(415, 'Expected application/json'))
  }
  if (Number(req.headers['content-length']) > MAX_BODY) return Promise.reject(new HttpError(413, 'Request too large'))
  return new Promise((ok, fail) => {
    let size = 0
    let tooBig = false
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) tooBig = true
      else chunks.push(c)
    })
    req.on('end', () => {
      if (tooBig) return fail(new HttpError(413, 'Request too large'))
      try { ok(JSON.parse(Buffer.concat(chunks).toString() || '{}')) } catch { fail(new HttpError(400, 'Invalid JSON')) }
    })
    req.on('error', () => fail(new HttpError(400, 'Request aborted')))
  })
}

export function createServer(overrides = {}) {
  const config = { ...loadConfig(), dbPath: ':memory:', ...overrides }
  const db = openDb(config.dbPath)
  const checkOrigin = originCheck(config)
  const checkKey = keyCheck(config)
  const writeLimit = rateLimiter({ limit: 60, windowMs: 60_000 })
  const readLimit = rateLimiter({ limit: 600, windowMs: 60_000 })
  const serveStatic = config.staticDir ? staticFiles(config.staticDir, config.production ? HSTS : {}) : null

  function respond(res, status, body, origin) {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(status === 413 ? { connection: 'close' } : {}),
      ...SECURITY_HEADERS,
      ...(config.production ? HSTS : {}),
      ...(origin ? { 'access-control-allow-origin': origin, vary: 'Origin' } : {}),
    })
    res.end(JSON.stringify(body))
  }

  async function handleApi(req, res, url, origin) {
    const { pathname } = url
    if (pathname === '/api/health' && req.method === 'GET') return respond(res, 200, { ok: true }, origin)
    if (!checkKey(req)) throw new HttpError(401, 'Invalid or missing key')

    const ip = clientIp(req, config.trustProxy, config.proxyHops)
    const write = req.method === 'POST'
    if (!(write ? writeLimit(ip) : readLimit(ip))) throw new HttpError(429, 'Too many requests, please try again shortly')

    if (pathname === '/api/state' && req.method === 'GET') return respond(res, 200, { type: 'state', ...db.read() }, origin)

    if (pathname === '/api/actions' && write) {
      const action = await readJson(req)
      if (!action || typeof action !== 'object' || Array.isArray(action) || !ACTION_TYPES.includes(action.type)) {
        throw new HttpError(400, 'Unknown action')
      }
      let snapshot
      try { snapshot = db.apply(action) } catch { throw new HttpError(400, `Action ${action.type} could not be applied`) }
      live.broadcast(snapshot)
      return respond(res, 200, { type: 'state', ...snapshot }, origin)
    }

    if (pathname === '/api/actions/recent' && req.method === 'GET') {
      const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get('limit'), 10) || 20))
      return respond(res, 200, { actions: db.recentActions(limit) }, origin)
    }

    if (pathname === '/api/insights' && req.method === 'GET') {
      const kind = url.searchParams.get('kind') ?? 'alle'
      const customerType = url.searchParams.get('customerType') ?? 'alle'
      if (!KINDS.includes(kind) || !CUSTOMER_TYPES.includes(customerType)) throw new HttpError(400, 'Invalid filter')
      return respond(res, 200, { ...insights({ kind, customerType }), campaigns: db.read().state.campaigns }, origin)
    }

    if (pathname === '/api/catalog' && req.method === 'GET') return respond(res, 200, db.catalog.catalog(), origin)

    if (pathname.startsWith(PARTNER_PATH) && req.method === 'GET') {
      const id = pathname.slice(PARTNER_PATH.length)
      if (!PARTNER_ID.test(id)) throw new HttpError(400, 'Invalid partner id')
      const partner = db.catalog.partner(id)
      if (!partner) throw new HttpError(404, 'Unknown partner')
      return respond(res, 200, partner, origin)
    }

    throw new HttpError(404, 'Unknown API path')
  }

  const server = createHttpServer(async (req, res) => {
    let origin = null
    try {
      const url = new URL(req.url, 'http://localhost')
      const isApi = url.pathname.startsWith('/api/')
      if (isApi) {
        const check = checkOrigin(req)
        if (!check.ok) throw new HttpError(403, 'Origin not allowed')
        origin = check.origin
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            ...(origin ? { 'access-control-allow-origin': origin, vary: 'Origin' } : {}),
            'access-control-allow-methods': 'GET, POST',
            'access-control-allow-headers': 'content-type, authorization',
            'access-control-max-age': '600',
          })
          return res.end()
        }
        return await handleApi(req, res, url, origin)
      }
      if (serveStatic && (req.method === 'GET' || req.method === 'HEAD')) return await serveStatic(res, url.pathname)
      throw new HttpError(404, 'Not found')
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500
      if (status === 500) console.error(err)
      // Bij een te groot verzoek: eerst antwoorden, dan de verbinding sluiten (rest van de upload niet lezen)
      if (status === 413) res.once('finish', () => req.destroy())
      if (!res.headersSent) respond(res, status, { error: status === 500 ? 'Interne fout' : err.message }, origin)
    }
  })
  server.requestTimeout = 10_000
  server.headersTimeout = 10_000

  const live = liveUpdates(server, { checkOrigin, checkKey, current: () => db.read() })

  return {
    server,
    config,
    listen: (port = config.port, host = config.host) => new Promise((ok) => server.listen(port, host, () => ok(server.address()))),
    close: () => new Promise((ok) => { live.close(); server.close(() => { db.close(); ok() }) }),
  }
}
