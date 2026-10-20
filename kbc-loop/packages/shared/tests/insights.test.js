import { test } from 'node:test'
import assert from 'node:assert/strict'
import { insights, analyseSegment } from '../src/engine/insights.js'
import { MIN_GROUP_SIZE } from '../src/config/index.js'
import { spendSegments } from '../src/data/index.js'

test('small groups are never shown', () => {
  const r = insights()
  assert.ok(r.segments.every((s) => s.customers >= MIN_GROUP_SIZE))
  assert.equal(r.hiddenCount, spendSegments.filter((s) => s.customers < MIN_GROUP_SIZE).length)
  assert.ok(r.hiddenCount > 0)
})

test('filters by kind and customer type', () => {
  assert.ok(insights({ kind: 'herhaalaankoop' }).segments.every((s) => s.kind === 'herhaalaankoop'))
  assert.ok(insights({ customerType: 'kmo' }).segments.every((s) => s.customerType === 'kmo'))
})

test('sorted by potential and totals add up', () => {
  const { segments, totals } = insights()
  for (let n = 1; n < segments.length; n++) assert.ok(segments[n - 1].monthlyRevenue >= segments[n].monthlyRevenue)
  assert.equal(totals.monthlyRevenue, segments.reduce((t, s) => t + s.monthlyRevenue, 0))
})

test('only customers with consent count as reachable', () => {
  const s = analyseSegment({ id: 'x', kind: 'herstelling', customerType: 'particulier', customers: 1000, costYearly: 400, consentPct: 50, trendPct: 0, productId: 'phone' })
  assert.equal(s.reachable, 500)
  assert.equal(s.rentYearly, s.product.monthly * 12)
  assert.equal(s.savingYearly, 400 - s.rentYearly)
})
