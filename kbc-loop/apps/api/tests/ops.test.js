// Operational behaviour: health/readiness probes, the JSON error format, request ids, logging and shutdown.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer } from '../src/server.js'
import { createLogger, requestId } from '../src/logger.js'
import { createLoopClient } from '@kbc-loop/shared/client.js'

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

async function start(overrides = {}) {
  const app = createServer({ dbPath: ':memory:', ...overrides })
  const { port } = await app.listen(0, '127.0.0.1')
  return { app, base: `http://127.0.0.1:${port}` }
}

const assertError = async (res, status, code) => {
  assert.equal(res.status, status)
  assert.match(res.headers.get('content-type'), /^application\/json/)
  const body = await res.json()
  assert.equal(body.error.code, code)
  assert.equal(typeof body.error.message, 'string')
  assert.ok(body.error.message.length > 0)
}

test('GET /api/health reports liveness without a key', async () => {
  const { app, base } = await start({ apiKey: 'secret-key' })
  const res = await fetch(`${base}/api/health`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.status, 'ok')
  assert.equal(body.version, version)
  assert.equal(typeof body.uptime, 'number')
  await app.close()
})

test('GET /api/ready is 200 when the database answers and 503 when it does not', async () => {
  const { app, base } = await start({ apiKey: 'secret-key' })
  const res = await fetch(`${base}/api/ready`)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { status: 'ready' })
  await app.close()

  const down = createServer({ dbPath: ':memory:' })
  const { port } = await down.listen(0, '127.0.0.1')
  const { DatabaseSync } = await import('node:sqlite')
  const original = DatabaseSync.prototype.prepare
  DatabaseSync.prototype.prepare = () => { throw new Error('disk gone') }
  try {
    await assertError(await fetch(`http://127.0.0.1:${port}/api/ready`), 503, 'unavailable')
  } finally {
    DatabaseSync.prototype.prepare = original
  }
  await down.close()
})

test('every error uses { error: { code, message } } with a stable code', async () => {
  const { app, base } = await start({ apiKey: 'secret-key', allowedOrigins: [] })
  const auth = { authorization: 'Bearer secret-key' }
  const json = { ...auth, 'content-type': 'application/json' }
  await assertError(await fetch(`${base}/api/state`), 401, 'unauthorized')
  await assertError(await fetch(`${base}/api/state`, { headers: { origin: 'https://evil.example' } }), 403, 'forbidden_origin')
  await assertError(await fetch(`${base}/api/nope`, { headers: auth }), 404, 'not_found')
  await assertError(await fetch(`${base}/api/catalog/partners/unknown`, { headers: auth }), 404, 'not_found')
  await assertError(await fetch(`${base}/api/catalog/partners/BAD!`, { headers: auth }), 400, 'bad_request')
  await assertError(await fetch(`${base}/api/actions`, { method: 'POST', headers: json, body: '{nope' }), 400, 'bad_request')
  await assertError(await fetch(`${base}/api/actions`, { method: 'POST', headers: { ...auth, 'content-type': 'text/plain' }, body: '{}' }), 415, 'unsupported_media_type')
  await assertError(await fetch(`${base}/api/actions`, { method: 'POST', headers: json, body: JSON.stringify({ type: 'RESET', junk: 'x'.repeat(20_000) }) }), 413, 'payload_too_large')
  await assertError(await fetch(`${base}/missing`), 404, 'not_found')
  await app.close()
})

test('rate limited requests get code rate_limited', async () => {
  const { app, base } = await start()
  let last
  for (let n = 0; n < 61; n++) {
    last = await fetch(`${base}/api/actions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"type":"OPEN_KATE"}' })
    if (last.status === 429) break
    await last.arrayBuffer()
  }
  await assertError(last, 429, 'rate_limited')
  await app.close()
})

test('the shared client surfaces the error message and code', async () => {
  const { app, base } = await start()
  const client = createLoopClient(base)
  await assert.rejects(client.dispatch({ type: 'DROP_TABLE' }), (err) => {
    assert.equal(err.message, 'Unknown action type')
    assert.equal(err.code, 'bad_request')
    assert.equal(err.status, 400)
    return true
  })
  client.close()
  await app.close()
})

test('X-Request-Id is generated, or echoed when the incoming one is valid', async () => {
  const { app, base } = await start()
  const generated = (await fetch(`${base}/api/health`)).headers.get('x-request-id')
  assert.match(generated, /^[0-9a-f-]{36}$/)
  const echoed = (await fetch(`${base}/api/nope`, { headers: { 'x-request-id': 'trace-ABC-123' } })).headers.get('x-request-id')
  assert.equal(echoed, 'trace-ABC-123')
  for (const bad of ['has space', 'x'.repeat(65), 'semi;colon']) {
    const id = (await fetch(`${base}/api/health`, { headers: { 'x-request-id': bad } })).headers.get('x-request-id')
    assert.notEqual(id, bad)
    assert.match(id, /^[0-9a-f-]{36}$/)
  }
  assert.match(requestId({ headers: { 'x-request-id': ['a', 'b'] } }), /^[0-9a-f-]{36}$/)
  await app.close()
})

test('each request is logged as one JSON line without the query string', async () => {
  const lines = []
  const sink = { write: (l) => lines.push(l) }
  const logger = createLogger('info', { out: sink, err: sink })
  const { app, base } = await start({ logger })
  await (await fetch(`${base}/api/insights?kind=evil&token=secret`, { headers: { 'x-request-id': 'log-test-1' } })).arrayBuffer()
  await new Promise((ok) => setTimeout(ok, 20))
  const entry = lines.map((l) => JSON.parse(l)).find((e) => e.requestId === 'log-test-1')
  assert.ok(entry, 'log line for the request')
  assert.equal(entry.method, 'GET')
  assert.equal(entry.path, '/api/insights')
  assert.equal(entry.status, 400)
  assert.equal(typeof entry.ms, 'number')
  assert.ok(entry.ts)
  assert.ok(!lines.join('').includes('secret'))
  await app.close()

  const silent = []
  createLogger('silent', { out: { write: (l) => silent.push(l) }, err: { write: (l) => silent.push(l) } }).info({ x: 1 })
  assert.equal(silent.length, 0)
})

test('shutdown closes WebSocket clients with code 1001', async () => {
  const { app, base } = await start()
  const ws = new WebSocket(`${base.replace('http', 'ws')}/api/live`, ['kbc-loop'])
  await new Promise((ok) => { ws.onmessage = ok })
  const closed = new Promise((ok) => { ws.onclose = (e) => ok(e.code) })
  await app.close()
  assert.equal(await closed, 1001)
})
