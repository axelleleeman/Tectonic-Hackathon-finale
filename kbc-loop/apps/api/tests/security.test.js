import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.js'
import { createLoopClient, checkApiUrl } from '@kbc-loop/shared/client.js'

async function start(overrides = {}) {
  const app = createServer({ dbPath: ':memory:', ...overrides })
  const { port } = await app.listen(0, '127.0.0.1')
  return { app, base: `http://127.0.0.1:${port}` }
}

test('foreign websites are refused, allowed origins get CORS', async () => {
  const { app, base } = await start({ allowedOrigins: ['http://localhost:5173'] })
  const evil = await fetch(`${base}/api/state`, { headers: { origin: 'https://evil.example' } })
  assert.equal(evil.status, 403)
  assert.equal(evil.headers.get('access-control-allow-origin'), null)
  const ok = await fetch(`${base}/api/state`, { headers: { origin: 'http://localhost:5173' } })
  assert.equal(ok.status, 200)
  assert.equal(ok.headers.get('access-control-allow-origin'), 'http://localhost:5173')
  assert.equal(ok.headers.get('x-content-type-options'), 'nosniff')
  await app.close()
})

test('with API_KEY a key is required (http and websocket)', async () => {
  const { app, base } = await start({ apiKey: 'geheim123' })
  assert.equal((await fetch(`${base}/api/health`)).status, 200)
  assert.equal((await fetch(`${base}/api/state`)).status, 401)
  assert.equal((await fetch(`${base}/api/state`, { headers: { authorization: 'Bearer fout' } })).status, 401)
  const good = createLoopClient(base, { apiKey: 'geheim123' })
  await good.start()
  assert.ok(good.snapshot.state)
  good.close()
  const refused = await new Promise((ok) => {
    const ws = new WebSocket(`${base.replace('http', 'ws')}/api/live`, ['kbc-loop'])
    ws.onopen = () => ok(false)
    ws.onerror = () => ok(true)
  })
  assert.ok(refused)
  await app.close()
})

test('actions require JSON and a valid type', async () => {
  const { app, base } = await start()
  const text = await fetch(`${base}/api/actions`, { method: 'POST', body: '{"type":"RESET"}', headers: { 'content-type': 'text/plain' } })
  assert.equal(text.status, 415)
  const arr = await fetch(`${base}/api/actions`, { method: 'POST', body: '[]', headers: { 'content-type': 'application/json' } })
  assert.equal(arr.status, 400)
  await app.close()
})

test('rate limiting on write actions', async () => {
  const { app, base } = await start()
  const codes = []
  for (let n = 0; n < 65; n++) {
    const r = await fetch(`${base}/api/actions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"type":"OPEN_KATE"}' })
    codes.push(r.status)
  }
  assert.ok(codes.includes(429))
  await app.close()
})

test('client refuses unencrypted connections outside localhost', () => {
  assert.throws(() => checkApiUrl('http://api.example.com'), /Insecure connection/)
  assert.throws(() => checkApiUrl('ftp://localhost'), /Insecure connection/)
  assert.ok(checkApiUrl('https://api.example.com'))
  assert.ok(checkApiUrl('http://localhost:4000'))
  assert.ok(checkApiUrl('http://192.168.1.20:4000', { allowInsecure: true }))
})

test('behind a proxy, the address added by the proxy counts, not a spoofed one', async () => {
  const { clientIp } = await import('../src/security.js')
  const req = { headers: { 'x-forwarded-for': '6.6.6.6, 203.0.113.9' }, socket: { remoteAddress: '10.0.0.1' } }
  assert.equal(clientIp(req, true, 1), '203.0.113.9')
  assert.equal(clientIp(req, false, 1), '10.0.0.1')
})
