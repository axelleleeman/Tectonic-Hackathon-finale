import { test } from 'node:test'
import assert from 'node:assert/strict'
import { productById, expandProduct, categoriesFor } from '../src/engine/catalog.js'
import { costs } from '../src/engine/pricing.js'
import { loopTotals, carKmEquivalent } from '../src/engine/impact.js'
import { matchIntent } from '../src/engine/kateIntents.js'
import { products, partners } from '../src/data/index.js'

test('elk product verwijst naar een bestaande partner', () => {
  for (const p of products) assert.ok(partners[p.partnerId], `${p.id} → ${p.partnerId}`)
})

test('bundel wordt opgesplitst en krijgt korting', () => {
  const b = productById('bundle-home')
  assert.deepEqual(expandProduct('bundle-home'), ['lamp-home', 'washer', 'fridge'])
  assert.ok(b.monthly < 6 + 15 + 12)
  assert.equal(b.partnerIds.length, 3)
})

test('kosten: kopen telt herstellingen en losse verzekering mee', () => {
  const c = costs(productById('phone'))
  assert.equal(c.buy, 899 + 180 + 9 * 36)
  assert.equal(c.borrow, 29 * 36)
  assert.equal(c.saving, c.buy - c.borrow)
})

test('kmo ziet de categorie "Voor je zaak", particulier niet', () => {
  assert.ok(categoriesFor('kmo').some((c) => c.id === 'zaak'))
  assert.ok(!categoriesFor('particulier').some((c) => c.id === 'zaak'))
})

test('impact telt enkel actieve producten voor het maandbedrag', () => {
  const items = [
    { productId: 'phone', repairs: 1, returned: false },
    { productId: 'washer', repairs: 0, returned: true },
  ]
  const t = loopTotals(items)
  assert.equal(t.active, 1)
  assert.equal(t.monthly, 29)
  assert.equal(t.repairs, 1)
  assert.equal(carKmEquivalent(120), 1000)
})

test('Kate herkent eenvoudige vragen', () => {
  assert.equal(matchIntent('Mijn lamp flikkert'), 'defect')
  assert.equal(matchIntent('Wat leen ik nu?'), 'overview')
  assert.equal(matchIntent('hallo'), null)
})

test('alle gekoppelde KBC-diensten bestaan', async () => {
  const { integrationMap, productServices, servicesForCategory, serviceById } = await import('../src/engine/integrations.js')
  const { categories } = await import('../src/data/index.js')
  const { rules } = await import('../src/engine/rules.js')
  assert.ok(integrationMap().reusedCount >= 20)
  for (const p of products) for (const type of p.for) assert.ok(productServices(productById(p.id), type).length >= 4)
  for (const c of categories) servicesForCategory(c.id)
  for (const r of rules) for (const id of r.services) assert.doesNotThrow(() => serviceById(id), id)
})

test('kmo-verlichting krijgt betalen per gebruik en kantoorverzekering', async () => {
  const { productServices } = await import('../src/engine/integrations.js')
  const ids = productServices(productById('lamp-shop'), 'kmo').map((s) => s.id)
  assert.ok(ids.includes('m2m'))
  assert.ok(ids.includes('officeInsurance'))
  assert.ok(ids.includes('kubeEsg'))
})
