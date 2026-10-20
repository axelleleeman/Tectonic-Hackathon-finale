import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectSignals } from '../src/engine/signals.js'
import { customers } from '../src/data/index.js'

const lotte = customers.find((c) => c.id === 'lotte')
const jonas = customers.find((c) => c.id === 'jonas')
const peeters = customers.find((c) => c.id === 'peeters')
const lamp = { key: 'lotte-0', productId: 'lamp-home', repairs: 0, repair: null, returned: false, room: 'kitchen' }
const base = { consent: true, dismissed: [], items: [] }

test('a phone repair leads to a suggestion to borrow a phone', () => {
  const [s] = detectSignals(lotte, { ...base, items: [lamp] })
  assert.equal(s.id, 'phone-repair')
  assert.equal(s.productId, 'phone')
  assert.equal(s.triggeredBy.category, 'gsm-herstelling')
})

test('without consent there are no transaction-based suggestions', () => {
  assert.deepEqual(detectSignals(lotte, { ...base, consent: false }), [])
})

test('device alerts also work without transaction consent', () => {
  const ids = detectSignals(lotte, { ...base, consent: false, items: [lamp], telemetry: true }).map((s) => s.id)
  assert.deepEqual(ids, ['device-wear'])
})

test('no device alert for a light that is already being repaired', () => {
  const busy = { ...lamp, repair: { step: 2 } }
  assert.ok(!detectSignals(lotte, { ...base, items: [busy], telemetry: true }).some((s) => s.id === 'device-wear'))
})

test('a dismissed suggestion does not come back', () => {
  assert.ok(!detectSignals(lotte, { ...base, dismissed: ['phone-repair'] }).some((s) => s.id === 'phone-repair'))
})

test('no phone suggestion if the customer already borrows a phone', () => {
  const phone = { key: 'x', productId: 'phone', repairs: 0, repair: null, returned: false }
  assert.ok(!detectSignals(lotte, { ...base, items: [phone] }).some((s) => s.id === 'phone-repair'))
})

test('an energy spike at an SME suggests Light as a Service', () => {
  const [s] = detectSignals(peeters, base)
  assert.equal(s.productId, 'lamp-shop')
})

test('a new home suggests the starter package', () => {
  const [s] = detectSignals(jonas, base)
  assert.equal(s.productId, 'bundle-home')
})

const sarah = customers.find((c) => c.id === 'sarah')

test('a third repair of the same device suggests borrowing it', () => {
  const [s] = detectSignals(sarah, base)
  assert.equal(s.id, 'repeat-repair')
  assert.equal(s.productId, 'washer')
  assert.equal(s.pattern.total, 240)
  assert.deepEqual(s.pattern.steps.map((x) => x.amount), [85, 70, 85])
  assert.equal(s.triggeredBy.id, 's2')
  assert.match(s.notification.title, /^Third repair this year, Sarah\?/)
})

test('two repairs are not yet a pattern', () => {
  const two = { ...sarah, transactions: sarah.transactions.filter((t) => t.id !== 's5') }
  assert.ok(!detectSignals(two, base).some((s) => s.id === 'repeat-repair'))
})

test('no repair suggestion if the customer already borrows the device', () => {
  const washer = { key: 'x', productId: 'washer', repairs: 0, repair: null, returned: false }
  assert.ok(!detectSignals(sarah, { ...base, items: [washer] }).some((s) => s.id === 'repeat-repair'))
})

test('a high energy bill plus an old dryer suggests renting an efficient heat-pump dryer', () => {
  const s = detectSignals(lotte, base).find((x) => x.id === 'energy-appliance')
  assert.ok(s)
  assert.equal(s.productId, 'dryer')
  assert.equal(s.triggeredBy.amount, -228)
  const borrowing = { key: 'd', productId: 'dryer', repairs: 0, repair: null, returned: false }
  assert.ok(!detectSignals(lotte, { ...base, items: [borrowing] }).some((x) => x.id === 'energy-appliance'))
})
