// Structured logging: one JSON line per request on stdout, errors on stderr.
// LOG_LEVEL: 'silent' | 'error' | 'info' (default 'info'; tests use 'silent').
import { randomUUID } from 'node:crypto'

const LEVELS = { silent: 0, error: 1, info: 2 }
const REQUEST_ID = /^[A-Za-z0-9-]{1,64}$/

// Accept a well-formed incoming X-Request-Id (for tracing through a proxy), otherwise generate one.
export function requestId(req) {
  const incoming = req.headers['x-request-id']
  return typeof incoming === 'string' && REQUEST_ID.test(incoming) ? incoming : randomUUID()
}

export function createLogger(level = 'info', { out = process.stdout, err = process.stderr } = {}) {
  const threshold = LEVELS[level] ?? LEVELS.info
  const write = (stream, entry) => stream.write(`${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`)
  return {
    info: (entry) => { if (threshold >= LEVELS.info) write(out, { level: 'info', ...entry }) },
    error: (entry) => { if (threshold >= LEVELS.error) write(err, { level: 'error', ...entry }) },
  }
}

// Logs one line when the response has finished (or the connection closed early).
// The path is logged without its query string, so filter values or tokens never end up in logs.
export function logRequest(logger, req, res, id) {
  const start = process.hrtime.bigint()
  let done = false
  const finish = () => {
    if (done) return
    done = true
    let path = '/'
    try { path = new URL(req.url, 'http://localhost').pathname } catch { /* malformed url: keep '/' */ }
    logger.info({
      requestId: id,
      method: req.method,
      path,
      status: res.statusCode,
      ms: Math.round(Number(process.hrtime.bigint() - start) / 1e5) / 10,
    })
  }
  res.once('finish', finish)
  res.once('close', finish)
}
