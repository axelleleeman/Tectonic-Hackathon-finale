// Beveiliging van de api: toegelaten origins, optionele api-sleutel, rate limiting en headers.
import { timingSafeEqual } from 'node:crypto'

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

export const CONTENT_SECURITY_POLICY = "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'"

export const HSTS = { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' }

// De eigen origin (zelfde adres als de api) is altijd toegelaten; andere enkel uit de lijst.
// Verzoeken zonder Origin (de iOS/Android-app, servers) worden toegelaten, maar wel aan de api-sleutel getoetst.
export function originCheck(config) {
  return (req) => {
    const origin = req.headers.origin
    if (!origin) return { ok: true, origin: null }
    const proto = config.trustProxy ? (req.headers['x-forwarded-proto'] ?? 'http') : (req.socket.encrypted ? 'https' : 'http')
    const self = `${proto}://${req.headers.host}`
    const ok = origin === self || config.allowedOrigins.includes(origin)
    return { ok, origin: ok ? origin : null }
  }
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

// Sleutel via "Authorization: Bearer <sleutel>" (http) of subprotocol "key.<sleutel>" (WebSocket).
export function keyCheck(config) {
  return (req) => {
    if (!config.apiKey) return true
    const auth = req.headers.authorization ?? ''
    if (auth.startsWith('Bearer ') && safeEqual(auth.slice(7), config.apiKey)) return true
    const protocols = (req.headers['sec-websocket-protocol'] ?? '').split(',').map((p) => p.trim())
    return protocols.some((p) => p.startsWith('key.') && safeEqual(p.slice(4), config.apiKey))
  }
}

// Eenvoudige rate limiter per ip-adres (vast tijdvenster, in geheugen).
export function rateLimiter({ limit, windowMs }) {
  const hits = new Map()
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [ip, h] of hits) if (now - h.start > windowMs) hits.delete(ip)
  }, windowMs)
  timer.unref()
  return (ip) => {
    const now = Date.now()
    const h = hits.get(ip)
    if (!h || now - h.start > windowMs) { hits.set(ip, { start: now, count: 1 }); return true }
    h.count += 1
    return h.count <= limit
  }
}

// Achter een proxy: neem het adres dat de vertrouwde proxy zelf toevoegde (van rechts geteld),
// niet het eerste, want dat kan de client vervalsen. proxyHops = aantal vertrouwde proxy's (Cloud Run: 1).
export function clientIp(req, trustProxy, proxyHops = 1) {
  if (trustProxy) {
    const chain = String(req.headers['x-forwarded-for'] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    if (chain.length >= proxyHops) return chain[chain.length - proxyHops]
  }
  return req.socket.remoteAddress ?? 'onbekend'
}
