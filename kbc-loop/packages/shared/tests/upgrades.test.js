import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidUpgrade, upgradeOptions, upgradeQuote, MAX_UPGRADE_OPTIONS } from '../src/engine/upgrades.js'
import { categoryOf, productById } from '../src/engine/catalog.js'
import { products } from '../src/data/index.js'
import { COINS } from '../src/config/index.js'

test('upgrade options prefer a better model from the same partner', () => {
  assert.deepEqual(upgradeOptions('phone', 'particulier').map((p) => p.id), ['phone-pro'])
})

test('upgrade options fall back to the same category, sorted by fee', () => {
  const options = upgradeOptions('lamp-home', 'particulier')
  assert.ok(options.length > 0)
  const fees = options.map((p) => p.monthly)
  assert.deepEqual(fees, [...fees].sort((a, b) => a - b))
})

test('every option is pricier, in the same category, visible and at most 3', () => {
  for (const type of ['particulier', 'kmo']) {
    for (const from of products.filter((p) => p.for.includes(type))) {
      const options = upgradeOptions(from.id, type)
      assert.ok(options.length <= MAX_UPGRADE_OPTIONS)
      for (const to of options) {
        assert.ok(to.monthly > from.monthly)
        assert.ok(to.for.includes(type))
        assert.equal(categoryOf(to).id, categoryOf(from).id)
        assert.ok(isValidUpgrade(from.id, to.id, type))
      }
    }
  }
})

test('no options for unknown products, bundles or the priciest product in a category', () => {
  assert.deepEqual(upgradeOptions('nope', 'particulier'), [])
  assert.deepEqual(upgradeOptions('bundle-home', 'particulier'), [])
  assert.deepEqual(upgradeOptions('heat-pump', 'particulier'), [])
})

test('upgrade quote', () => {
  const q = upgradeQuote('phone', 'phone-pro')
  assert.equal(q.monthlyDifference, productById('phone-pro').monthly - productById('phone').monthly)
  assert.equal(q.coinsForReturn, COINS.return)
  assert.match(q.co2Note, /ReFone/)
  assert.equal(upgradeQuote('phone', 'nope'), null)
})
