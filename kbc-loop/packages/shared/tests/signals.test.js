import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectSignals } from '../src/engine/signals.js'
import { customers } from '../src/data/index.js'

const lotte = customers.find((c) => c.id === 'lotte')
const jonas = customers.find((c) => c.id === 'jonas')
const peeters = customers.find((c) => c.id === 'peeters')
const lamp = { key: 'lotte-0', productId: 'lamp-home', repairs: 0, repair: null, returned: false, room: 'kitchen' }
const base = { consent: true, dismissed: [], items: [] }

test('gsm-herstelling geeft een voorstel om een gsm te lenen', () => {
  const [s] = detectSignals(lotte, { ...base, items: [lamp] })
  assert.equal(s.id, 'phone-repair')
  assert.equal(s.productId, 'phone')
  assert.equal(s.triggeredBy.category, 'gsm-herstelling')
})

test('zonder toestemming geen voorstellen op basis van transacties', () => {
  assert.deepEqual(detectSignals(lotte, { ...base, consent: false }), [])
})

test('toestelmeldingen werken ook zonder transactietoestemming', () => {
  const ids = detectSignals(lotte, { ...base, consent: false, items: [lamp], telemetry: true }).map((s) => s.id)
  assert.deepEqual(ids, ['device-wear'])
})

test('geen toestelmelding voor een lamp die al in herstelling is', () => {
  const busy = { ...lamp, repair: { step: 2 } }
  assert.ok(!detectSignals(lotte, { ...base, items: [busy], telemetry: true }).some((s) => s.id === 'device-wear'))
})

test('weggeklikt voorstel komt niet terug', () => {
  assert.deepEqual(detectSignals(lotte, { ...base, dismissed: ['phone-repair'] }), [])
})

test('geen gsm-voorstel als de klant al een gsm leent', () => {
  const phone = { key: 'x', productId: 'phone', repairs: 0, repair: null, returned: false }
  assert.ok(!detectSignals(lotte, { ...base, items: [phone] }).some((s) => s.id === 'phone-repair'))
})

test('energiepiek bij kmo stelt Light as a Service voor', () => {
  const [s] = detectSignals(peeters, base)
  assert.equal(s.productId, 'lamp-shop')
})

test('nieuwe woning stelt het startpakket voor', () => {
  const [s] = detectSignals(jonas, base)
  assert.equal(s.productId, 'bundle-home')
})

const sarah = customers.find((c) => c.id === 'sarah')

test('derde herstelling van hetzelfde toestel stelt voor om het te lenen', () => {
  const [s] = detectSignals(sarah, base)
  assert.equal(s.id, 'repeat-repair')
  assert.equal(s.productId, 'washer')
  assert.equal(s.pattern.total, 240)
  assert.deepEqual(s.pattern.steps.map((x) => x.amount), [85, 70, 85])
  assert.equal(s.triggeredBy.id, 's2')
  assert.match(s.notification.title, /^Third repair this year, Sarah\?/)
})

test('twee herstellingen is nog geen patroon', () => {
  const two = { ...sarah, transactions: sarah.transactions.filter((t) => t.id !== 's5') }
  assert.ok(!detectSignals(two, base).some((s) => s.id === 'repeat-repair'))
})

test('geen herstelvoorstel als de klant het toestel al leent', () => {
  const washer = { key: 'x', productId: 'washer', repairs: 0, repair: null, returned: false }
  assert.ok(!detectSignals(sarah, { ...base, items: [washer] }).some((s) => s.id === 'repeat-repair'))
})
