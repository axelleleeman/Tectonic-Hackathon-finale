import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { createLocalClient } from '../src/localClient.js'
import { createInitialState } from '../src/state/loopReducer.js'
import { insights } from '../src/engine/insights.js'

// Minimal in-memory localStorage; Node's BroadcastChannel is real and works between clients in one process.
function memoryStorage() {
  const data = new Map()
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)) },
    removeItem: (k) => { data.delete(k) },
  }
}

let n = 0
const keys = () => ({ storageKey: `test-state-${++n}`, channel: `test-channel-${n}` })

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage(), configurable: true, writable: true })
})

test('starts with the initial state at version 1 and reports online', async () => {
  const client = createLocalClient(keys())
  assert.equal(client.status, 'online')
  assert.equal(client.snapshot, null)
  await client.start()
  assert.equal(client.snapshot.version, 1)
  assert.deepEqual(client.snapshot.state, createInitialState())
  client.close()
})

test('dispatch applies the reducer, bumps the version and returns the api shape', async () => {
  const client = createLocalClient(keys())
  await client.start()
  const seen = []
  client.subscribe((s) => seen.push(s.version))
  const res = await client.dispatch({ type: 'SET_VIEW', view: 'partner' })
  assert.equal(res.type, 'state')
  assert.equal(res.version, 2)
  assert.equal(res.state.view, 'partner')
  assert.equal(client.snapshot.state.view, 'partner')
  assert.deepEqual(seen, [1, 2])
  client.close()
})

test('unknown actions are rejected like the api (400, bad_request)', async () => {
  const client = createLocalClient(keys())
  await client.start()
  for (const action of [{ type: 'DROP_TABLES' }, null, [], 'RESET']) {
    await assert.rejects(client.dispatch(action), (err) => err.status === 400 && err.code === 'bad_request' && err.message === 'Unknown action type')
  }
  assert.equal(client.snapshot.version, 1)
  client.close()
})

test('state persists in storage and RESET restores the initial state', async () => {
  const opts = keys()
  const a = createLocalClient(opts)
  await a.start()
  await a.dispatch({ type: 'SET_VIEW', view: 'kbc' })
  a.close()

  const b = createLocalClient(opts)
  await b.start()
  assert.equal(b.snapshot.version, 2)
  assert.equal(b.snapshot.state.view, 'kbc')
  const res = await b.dispatch({ type: 'RESET' })
  assert.equal(res.version, 3)
  assert.deepEqual(res.state, createInitialState())
  b.close()
})

test('corrupt stored state is ignored', async () => {
  const opts = keys()
  localStorage.setItem(opts.storageKey, '{"version":"x","state":null}')
  const client = createLocalClient(opts)
  await client.start()
  assert.equal(client.snapshot.version, 1)
  client.close()
})

test('works without localStorage (in memory)', async () => {
  Object.defineProperty(globalThis, 'localStorage', { value: undefined, configurable: true, writable: true })
  const client = createLocalClient(keys())
  await client.start()
  const res = await client.dispatch({ type: 'SET_VIEW', view: 'partner' })
  assert.equal(res.version, 2)
  client.close()
})

test('a change in one client reaches another one on the same channel', async () => {
  const opts = keys()
  const a = createLocalClient(opts)
  const b = createLocalClient(opts)
  await a.start()
  await b.start()
  const updated = new Promise((ok) => b.subscribe((s) => { if (s.version === 2) ok(s) }))
  await a.dispatch({ type: 'SET_VIEW', view: 'partner' })
  const s = await updated
  assert.equal(s.state.view, 'partner')
  // b builds on the newest stored version
  const res = await b.dispatch({ type: 'SET_VIEW', view: 'kbc' })
  assert.equal(res.version, 3)
  a.close()
  b.close()
})

test('insights returns what GET /api/insights returns and validates the filter', async () => {
  const client = createLocalClient(keys())
  await client.start()
  const filter = { kind: 'herstelling', customerType: 'kmo' }
  assert.deepEqual(await client.insights(filter), { ...insights(filter), campaigns: client.snapshot.state.campaigns })
  assert.deepEqual(await client.insights(), { ...insights({ kind: 'alle', customerType: 'alle' }), campaigns: client.snapshot.state.campaigns })
  await assert.rejects(client.insights({ kind: 'nope' }), (err) => err.status === 400 && err.message === 'Invalid filter')
  client.close()
})
