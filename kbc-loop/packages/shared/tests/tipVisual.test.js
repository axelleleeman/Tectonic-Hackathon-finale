import { test } from 'node:test'
import assert from 'node:assert/strict'
import { detectSignals } from '../src/engine/signals.js'
import { customers } from '../src/data/index.js'
import { conditionVisual, monthKeys, tipVisual } from '../src/kate/tipVisual.js'

const lotte = customers.find((c) => c.id === 'lotte')
const peeters = customers.find((c) => c.id === 'peeters')
const base = { consent: true, dismissed: [], items: [] }
const lamp = { key: 'lotte-0', productId: 'lamp-home', repairs: 0, repair: null, returned: false, room: 'kitchen' }

test('12 months ending in the current month', () => {
  const keys = monthKeys('2026-10-20')
  assert.equal(keys.length, 12)
  assert.equal(keys[0], '2025-11')
  assert.equal(keys[11], '2026-10')
})

test('same input gives the same visual', () => {
  const [s] = detectSignals(lotte, base)
  assert.deepEqual(tipVisual(s, lotte), tipVisual(s, lotte))
})

test('the highlighted point is the real transaction amount', () => {
  const [s] = detectSignals(lotte, base)
  const v = tipVisual(s, lotte)
  assert.equal(v.kind, 'spend')
  assert.equal(v.series.points.length, 12)
  const hi = v.series.points[v.series.highlight]
  assert.ok(hi.highlight)
  assert.equal(hi.value, Math.abs(s.triggeredBy.amount))
  assert.equal(v.series.points.filter((p) => p.highlight).length, 1)
  assert.match(v.insight, /Phone repaired at \d+ months/)
  assert.ok(v.price.includes('/ month'))
})

test('real months of the same category use real amounts (energy)', () => {
  const s = detectSignals(peeters, base).find((x) => x.id === 'energy-spike')
  if (!s) return
  const v = tipVisual(s, peeters)
  const sep = v.series.points.find((p) => p.key === '2026-09')
  assert.equal(sep.value, 702)
  assert.ok(sep.marked)
})

test('a device signal shows the reported drop and a free replacement', () => {
  const s = detectSignals(lotte, { ...base, consent: false, items: [lamp], telemetry: true })[0]
  const v = tipVisual(s, lotte)
  assert.equal(v.kind, 'device')
  assert.equal(v.series.points.at(-1).value, 82)
  assert.equal(v.price, 'Free')
})

test('a condition visual ends at the estimated condition', () => {
  const v = conditionVisual({ id: 'care-x', condition: 72, months: 30, line: 'x' })
  assert.equal(v.series.points.at(-1).value, 72)
  assert.deepEqual(v, conditionVisual({ id: 'care-x', condition: 72, months: 30, line: 'x' }))
})
