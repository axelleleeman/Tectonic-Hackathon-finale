import { test } from 'node:test'
import assert from 'node:assert/strict'
import { products, bundles, partners, categories, customers, spendSegments, issuesFor, PREVENTIVE_ISSUE } from '../src/data/index.js'
import { categoriesFor } from '../src/engine/catalog.js'
import { costs } from '../src/engine/pricing.js'

const CUSTOMER_TYPES = ['particulier', 'kmo']
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

test('every category has at least one partner with 4 or more products for each customer type it serves', () => {
  for (const c of categories) {
    for (const type of c.for) {
      const cat = categoriesFor(type).find((x) => x.id === c.id)
      assert.ok(cat, `${c.id} is not visible for ${type}`)
      const best = Math.max(...cat.partners.map((pa) => pa.products.length))
      assert.ok(best >= 4, `${c.id} (${type}): largest partner catalogue has only ${best} products`)
    }
  }
})

test('every product has the fields used by pricing and impact', () => {
  for (const p of products) {
    for (const key of ['monthly', 'buyPrice', 'expectedRepairs', 'insuranceMonthly', 'termMonths', 'co2Kg']) {
      assert.equal(typeof p[key], 'number', `${p.id}.${key}`)
      assert.ok(p[key] >= 0, `${p.id}.${key} is negative`)
    }
    assert.ok(p.monthly > 0 && p.buyPrice > 0 && p.termMonths > 0 && p.co2Kg > 0, p.id)
    for (const key of ['name', 'detail', 'icon']) assert.ok(typeof p[key] === 'string' && p[key].length > 0, `${p.id}.${key}`)
    assert.ok(!p.detail.endsWith('.'), `${p.id}.detail should not end with a full stop`)
    assert.ok(Array.isArray(p.includes) && p.includes.length >= 3 && p.includes.length <= 6, `${p.id}.includes`)
    assert.ok(Array.isArray(p.for) && p.for.length > 0 && p.for.every((t) => CUSTOMER_TYPES.includes(t)), `${p.id}.for`)
    assert.equal(typeof p.connected, 'boolean', `${p.id}.connected`)
    if ('energySavingMonthly' in p) assert.ok(p.energySavingMonthly > 0, `${p.id}.energySavingMonthly`)
  }
})

test('rent over the term stays plausible compared with buying', () => {
  for (const p of products) {
    const { buy, borrow } = costs(p)
    const ratio = borrow / buy
    // Short-use gear (baby items, kids' bikes) goes to the next family, so rent can be well below buying;
    // a car seat with free size swaps replaces several purchases, so rent can be slightly above one.
    assert.ok(ratio >= 0.35 && ratio <= 1.15, `${p.id}: rent ${borrow} vs buy ${buy} (ratio ${ratio.toFixed(2)})`)
  }
})

test('no duplicate ids and new ids are kebab-case', () => {
  const ids = [...products.map((p) => p.id), ...bundles.map((b) => b.id)]
  assert.equal(new Set(ids).size, ids.length, 'duplicate product or bundle id')
  for (const id of ids) assert.match(id, KEBAB)
  assert.equal(new Set(categories.map((c) => c.id)).size, categories.length, 'duplicate category id')
  for (const [key, pa] of Object.entries(partners)) assert.equal(pa.id, key)
  assert.equal(new Set(customers.map((c) => c.id)).size, customers.length, 'duplicate customer id')
  assert.equal(new Set(spendSegments.map((s) => s.id)).size, spendSegments.length, 'duplicate segment id')
})

test('every product, bundle and segment points to existing data', () => {
  const categoryIds = categories.map((c) => c.id)
  for (const p of products) assert.ok(partners[p.partnerId], `${p.id} → ${p.partnerId}`)
  for (const pa of Object.values(partners)) {
    assert.ok(categoryIds.includes(pa.category), `${pa.id} → ${pa.category}`)
    assert.ok(products.some((p) => p.partnerId === pa.id), `${pa.id} has no products`)
    assert.ok(pa.tagline && !pa.tagline.endsWith('.'), `${pa.id}.tagline`)
  }
  for (const b of bundles) for (const id of b.items) assert.ok(products.some((p) => p.id === id), `${b.id} → ${id}`)
  for (const s of spendSegments) assert.ok(products.some((p) => p.id === s.productId), `${s.id} → ${s.productId}`)
  for (const c of customers) for (const b of c.borrowed) assert.ok(products.some((p) => p.id === b.productId), `${c.id} → ${b.productId}`)
})

test('ids referenced by the persisted demo database still exist', () => {
  const legacy = ['lamp-home', 'lamp-shop', 'solar', 'battery', 'washer', 'fridge', 'coffee', 'phone', 'laptop', 'tv',
    'ebike', 'cargo', 'stroller', 'carseat', 'desk', 'coffee-pro']
  for (const id of legacy) assert.ok(products.some((p) => p.id === id), id)
  assert.deepEqual(categories.map((c) => c.id), ['energie', 'toestellen', 'elektronica', 'mobiliteit', 'gezin', 'zaak'])
})

test('repair issues are in English and every product has at least 3 options', () => {
  for (const p of products) assert.ok(issuesFor(p.id).length >= 3, p.id)
  assert.deepEqual(issuesFor('lamp-home').slice(0, 1), ['Light flickers'])
  assert.deepEqual(issuesFor('unknown-product'), ['No longer works', 'Makes an unusual noise', 'Something else'])
  assert.match(PREVENTIVE_ISSUE, /^Preventive/)
})

test('business customers get a broad catalogue', () => {
  const kmo = categoriesFor('kmo')
  const count = kmo.reduce((s, c) => s + c.productCount, 0)
  assert.ok(count >= 25, `only ${count} business products`)
  for (const id of ['energie', 'toestellen', 'elektronica', 'mobiliteit', 'zaak']) assert.ok(kmo.some((c) => c.id === id), id)
})
