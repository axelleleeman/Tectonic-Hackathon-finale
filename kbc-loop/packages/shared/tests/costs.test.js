import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addMonths, costOverview, firstOfNextMonth, itemCosts, monthsBetween, splitMonthly } from '../src/engine/costs.js'
import { costs } from '../src/engine/pricing.js'
import { productById } from '../src/engine/catalog.js'
import { products } from '../src/data/index.js'

const TODAY = '2026-10-20'
const lamp = { key: 'a', productId: 'lamp-home', since: '2025-08-01', repairs: 1, repair: null, returned: false }
const phone = { key: 'b', productId: 'phone', since: '2026-09-25', repairs: 0, repair: { issue: 'x', step: 1 }, returned: false }
const oldTv = { key: 'c', productId: 'tv', since: '2024-01-15', repairs: 0, repair: null, returned: true, returnedOn: '2025-01-15' }

test('date helpers', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28')
  assert.equal(addMonths('2025-08-01', 60), '2030-08-01')
  assert.equal(monthsBetween('2025-08-01', TODAY), 14)
  assert.equal(monthsBetween('2026-09-25', TODAY), 0)
  assert.equal(monthsBetween('2027-01-01', TODAY), 0)
  assert.equal(firstOfNextMonth('2026-12-20'), '2027-01-01')
})

test('the monthly split always adds up to the monthly fee', () => {
  for (const p of products) {
    const s = splitMonthly(p)
    assert.equal(Math.round((s.partner + s.insurance + s.kbc) * 100), Math.round(p.monthly * 100), p.id)
    assert.ok(s.partner >= 0 && s.insurance >= 0 && s.kbc >= 0)
  }
})

test('item costs for an active item', () => {
  const c = itemCosts(lamp, TODAY)
  const pricing = costs(productById('lamp-home'))
  assert.equal(c.monthsActive, 14)
  assert.equal(c.paidToDate, 14 * 6)
  assert.equal(c.endDate, '2030-08-01')
  assert.equal(c.remainingMonths, 60 - 14)
  assert.equal(c.nextPaymentDate, '2026-11-01')
  assert.equal(c.buyEquivalent, pricing.buy)
  assert.equal(c.savingVsBuying, pricing.saving)
  assert.equal(c.status, 'active')
  assert.equal(c.categoryId, 'energie')
  assert.equal(c.partnerName, 'Philips (Signify)')
})

test('item costs for repair, returned, finished and unknown items', () => {
  assert.equal(itemCosts(phone, TODAY).status, 'repair')
  const tv = itemCosts(oldTv, TODAY)
  assert.equal(tv.status, 'returned')
  assert.equal(tv.monthsActive, 12)
  assert.equal(tv.remainingMonths, 0)
  assert.equal(tv.nextPaymentDate, null)
  const finished = itemCosts({ ...lamp, since: '2010-01-01' }, TODAY)
  assert.equal(finished.monthsActive, 60)
  assert.equal(finished.paidToDate, 60 * 6)
  assert.equal(finished.remainingMonths, 0)
  assert.equal(itemCosts({ key: 'x', productId: 'gone', since: TODAY }, TODAY), null)
  assert.equal(itemCosts({ key: 'x', productId: 'phone' }, TODAY), null)
})

test('cost overview totals, categories and upcoming payments', () => {
  const o = costOverview([oldTv, lamp, phone], TODAY)
  const phoneMonthly = productById('phone').monthly
  assert.equal(o.monthlyTotal, 6 + phoneMonthly)
  assert.equal(o.paidToDate, 14 * 6 + 12 * productById('tv').monthly)
  assert.equal(o.nextPaymentDate, '2026-11-01')
  assert.equal(o.savingVsBuying, costs(productById('lamp-home')).saving + costs(productById('phone')).saving)
  assert.deepEqual(o.items.map((i) => i.itemKey), ['a', 'b', 'c'])
  assert.deepEqual(o.byCategory.map((c) => c.categoryId), ['elektronica', 'energie'])
  assert.equal(Math.round(o.byCategory.reduce((s, c) => s + c.share, 0)), 100)
  assert.equal(o.upcoming.length, 6)
  assert.deepEqual(o.upcoming[0], { date: '2026-11-01', amount: 6 + phoneMonthly })
  assert.equal(o.upcoming[5].date, '2027-04-01')
})

test('upcoming payments stop when a contract ends', () => {
  const ending = { ...lamp, since: '2021-12-01' } // ends 2026-12-01
  const o = costOverview([ending], TODAY)
  assert.deepEqual(o.upcoming.map((u) => u.amount), [6, 0, 0, 0, 0, 0])
})

test('empty overview', () => {
  const o = costOverview([], TODAY)
  assert.equal(o.monthlyTotal, 0)
  assert.equal(o.nextPaymentDate, null)
  assert.deepEqual(o.byCategory, [])
  assert.ok(o.upcoming.every((u) => u.amount === 0))
})
