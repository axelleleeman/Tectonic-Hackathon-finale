import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  addDays, audienceSize, budgetRange, campaignForecast, campaignResults, campaignTarget, daysBetween, suggestedBudget,
} from '../src/engine/campaigns.js'
import { analyseSegment } from '../src/engine/insights.js'
import { spendSegments } from '../src/data/index.js'

const seg = analyseSegment(spendSegments.find((s) => s.id === 'seg-phone-repair'))
const START = '2026-10-20'
const detail = (extra = {}) => ({ segmentId: seg.id, audience: 'consented', budget: suggestedBudget(seg), message: 'Hi', channel: 'kate', startedOn: START, status: 'running', ...extra })

test('date helpers', () => {
  assert.equal(daysBetween(START, START), 0)
  assert.equal(daysBetween(START, '2026-10-27'), 7)
  assert.equal(daysBetween('2026-10-27', START), 0)
  assert.equal(addDays(START, 12), '2026-11-01')
})

test('audience and budget', () => {
  assert.equal(audienceSize(seg, 'consented'), seg.reachable)
  assert.ok(audienceSize(seg, 'consented-active') < seg.reachable)
  const range = budgetRange(seg)
  assert.equal(range.max, suggestedBudget(seg, 'consented'))
  assert.equal(range.max % range.step, 0)
  assert.equal(campaignTarget(seg, { audience: 'consented', budget: range.max }), seg.reachable)
  assert.equal(campaignTarget(seg, { audience: 'consented', budget: 500 }), 2000)
})

test('forecast is a narrowing funnel', () => {
  for (const audience of ['consented', 'consented-active']) {
    const f = campaignForecast(seg, { audience, budget: suggestedBudget(seg, audience) })
    assert.ok(f.target >= f.opened && f.opened >= f.clicked && f.clicked >= f.contracts && f.contracts > 0)
    assert.equal(f.monthlyRevenue, f.contracts * seg.product.monthly)
  }
})

test('results are deterministic and grow over time towards the forecast', () => {
  const d = detail()
  assert.deepEqual(campaignResults(seg, d, '2026-10-25'), campaignResults(seg, d, '2026-10-25'))
  let prev = null
  for (const day of [0, 1, 3, 7, 14, 30, 90]) {
    const r = campaignResults(seg, d, addDays(START, day))
    assert.equal(r.day, day)
    assert.ok(r.reached >= r.opened && r.opened >= r.clicked && r.clicked >= r.contracts)
    assert.ok(r.reached <= r.target && r.contracts <= r.forecast.contracts)
    assert.ok(r.spent <= d.budget)
    if (prev) for (const k of ['reached', 'opened', 'clicked', 'contracts', 'monthlyRevenue']) assert.ok(r[k] >= prev[k], `${k} on day ${day}`)
    prev = r
  }
  assert.ok(prev.reachedPct >= 99)
  assert.ok(campaignResults(seg, d, START).reached > 0, 'something happens on the start day')
})

test('a stopped campaign is frozen at the stop date', () => {
  const stopped = detail({ status: 'stopped', stoppedOn: '2026-10-23' })
  assert.deepEqual(campaignResults(seg, stopped, '2026-12-01'), campaignResults(seg, stopped, '2026-10-23'))
  assert.equal(campaignResults(seg, stopped, '2026-12-01').status, 'stopped')
})

test('a smaller budget reaches fewer customers', () => {
  const full = campaignResults(seg, detail(), addDays(START, 30))
  const small = campaignResults(seg, detail({ budget: 500 }), addDays(START, 30))
  assert.ok(small.target < full.target && small.contracts < full.contracts)
})
