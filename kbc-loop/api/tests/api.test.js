import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from '../src/server.js'
import { createLoopClient } from '@kbc-loop/shared/client.js'

let app, base, dir
before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'kbc-loop-'))
  app = createServer({ dbPath: join(dir, 'test.db') })
  const { port } = await app.listen(0, '127.0.0.1')
  base = `http://127.0.0.1:${port}`
})
after(async () => { await app.close(); rmSync(dir, { recursive: true, force: true }) })

const post = (body) => fetch(`${base}/api/actions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

test('state ophalen en een actie toepassen verhoogt de versie', async () => {
  const s1 = await (await fetch(`${base}/api/state`)).json()
  const res = await post({ type: 'BORROW', productId: 'phone' })
  assert.equal(res.status, 200)
  const s2 = await res.json()
  assert.equal(s2.version, s1.version + 1)
  assert.equal(s2.state.screen, 'done')
})

test('onbekende of kapotte acties worden geweigerd', async () => {
  assert.equal((await post({ type: 'DROP_TABLE' })).status, 400)
  const bad = await fetch(`${base}/api/actions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{nope' })
  assert.equal(bad.status, 400)
  const big = await post({ type: 'RESET', junk: 'x'.repeat(20_000) })
  assert.equal(big.status, 413)
})

test('insights komen uit de api en respecteren de filter', async () => {
  const r = await (await fetch(`${base}/api/insights?customerType=kmo`)).json()
  assert.ok(r.segments.length > 0 && r.segments.every((s) => s.customerType === 'kmo'))
  assert.equal((await fetch(`${base}/api/insights?kind=evil`)).status, 400)
})

test('twee clients (web en app) zien elkaars acties live via WebSocket', async () => {
  const web = createLoopClient(base)
  const app2 = createLoopClient(base)
  await Promise.all([web.start(), app2.start()])
  const seen = new Promise((ok) => app2.subscribe((snap) => { if (snap.state.campaigns.includes('seg-phone-repair')) ok(snap) }))
  await web.dispatch({ type: 'TOGGLE_CAMPAIGN', segmentId: 'seg-phone-repair' })
  const snap = await seen
  assert.ok(snap.state.campaigns.includes('seg-phone-repair'))
  web.close(); app2.close()
})

test('state blijft bewaard in de database na herstart', async () => {
  const path = join(dir, 'persist.db')
  const a = createServer({ dbPath: path })
  const { port } = await a.listen(0, '127.0.0.1')
  await fetch(`http://127.0.0.1:${port}/api/actions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'SET_CONSENT', value: false }) })
  await a.close()
  const b = createServer({ dbPath: path })
  const { port: p2 } = await b.listen(0, '127.0.0.1')
  const s = await (await fetch(`http://127.0.0.1:${p2}/api/state`)).json()
  assert.equal(s.state.consent, false)
  const log = await (await fetch(`http://127.0.0.1:${p2}/api/actions/recent`)).json()
  assert.equal(log.actions[0].type, 'SET_CONSENT')
  await b.close()
})
