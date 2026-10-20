import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { illustrationFor, illustrationTypeFor, illustrations, illustrationTypes, productLabel } from '../src/ui/illustrations/index.js'
import { photoKeyFor, photoKeys, PHOTO_BY_TYPE, PHOTO_BY_PRODUCT } from '../src/ui/photos/index.js'
import { products, bundles } from '../src/data/index.js'

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const paint = (v, gradientIds) => v === 'none' || HEX.test(v) || (/^url\(#(.+)\)$/.test(v) && gradientIds.has(v.slice(5, -1)))

test('every catalogue product and bundle resolves to an illustration', () => {
  for (const p of [...products, ...bundles]) {
    const spec = illustrationFor(p)
    assert.ok(spec?.shapes?.length, p.id)
    assert.equal(illustrationFor(p.id), spec, `${p.id} by id`)
    assert.equal(productLabel(p.id), p.name)
  }
})

test('specific products map to the expected type', () => {
  const expected = { washer: 'washer', dryer: 'dryer', 'washer-dryer': 'washer', dishwasher: 'dishwasher', 'phone-booth': 'phone-booth',
    'bike-trailer': 'bike-trailer', 'kids-bike': 'kids-bike', cargo: 'cargo-bike', 'heat-pump': 'heat-pump', 'lamp-parking': 'outdoor-light',
    'fridge-display': 'display-counter', 'meeting-display': 'tv', 'meeting-room': 'meeting-table', 'bundle-home': 'bundle' }
  for (const [id, type] of Object.entries(expected)) assert.equal(illustrationTypeFor(id), type, id)
})

test('unknown products fall back by name, category and finally generic', () => {
  assert.equal(illustrationTypeFor({ id: 'x1', name: 'Refurbished tablet XL' }), 'tablet')
  assert.equal(illustrationTypeFor({ id: 'x2', name: 'Something new', partnerId: 'pedalpool' }), 'ebike')
  assert.equal(illustrationTypeFor({ id: 'x3', name: 'Mystery' }), 'generic')
  assert.equal(illustrationTypeFor('does-not-exist'), 'generic')
  assert.equal(illustrationTypeFor(null), 'generic')
})

test('every spec has a valid viewBox, shapes and colours', () => {
  assert.ok(illustrationTypes.length >= 30)
  for (const type of illustrationTypes) {
    const spec = illustrations[type]
    assert.match(spec.viewBox, /^0 0 \d+ \d+$/, type)
    assert.equal(spec.background.length, 2, type)
    for (const c of spec.background) assert.match(c, HEX, `${type} background`)
    const ids = new Set((spec.gradients ?? []).map((g) => g.id))
    for (const g of spec.gradients ?? []) {
      assert.ok(g.stops.length >= 2, `${type}/${g.id}`)
      for (const [offset, color] of g.stops) {
        assert.ok(offset >= 0 && offset <= 1, `${type}/${g.id}`)
        assert.match(color, HEX, `${type}/${g.id}`)
      }
    }
    assert.ok(spec.shapes.length >= 1 && spec.shapes.length <= 40, `${type}: ${spec.shapes.length} shapes`)
    for (const s of spec.shapes) {
      assert.ok(typeof s.d === 'string' && /^M/.test(s.d) && !s.d.includes('NaN'), `${type} path`)
      assert.ok(paint(s.fill, ids), `${type} fill ${s.fill}`)
      if (s.stroke) assert.ok(paint(s.stroke, ids), `${type} stroke ${s.stroke}`)
    }
  }
})

test('photo mapping only points at photos that exist', () => {
  const dir = join(import.meta.dirname, '../src/ui/photos')
  for (const key of [...Object.values(PHOTO_BY_TYPE), ...Object.values(PHOTO_BY_PRODUCT)]) assert.ok(photoKeys.includes(key), key)
  for (const key of photoKeys) assert.ok(existsSync(join(dir, `${key}.jpg`)), key)
  for (const p of products) {
    const key = photoKeyFor(p)
    if (key) assert.ok(photoKeys.includes(key), p.id)
  }
  assert.equal(photoKeyFor('washer'), 'washer')
  assert.equal(photoKeyFor('desk'), 'workspace')
  assert.equal(photoKeyFor('dryer'), null)
})
