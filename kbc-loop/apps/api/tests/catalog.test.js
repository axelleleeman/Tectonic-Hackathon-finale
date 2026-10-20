import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { createServer } from '../src/server.js'
import { openCatalog } from '../src/catalog.js'
import { validatePartnerFeed } from '../src/partnerFeed.js'
import { categories, partners, products } from '@kbc-loop/shared/data/index.js'

const EXAMPLE = fileURLToPath(new URL('../data-examples/partner-feed.example.json', import.meta.url))
const SCRIPT = fileURLToPath(new URL('../../../scripts/import-partner-feed.mjs', import.meta.url))
const example = () => JSON.parse(readFileSync(EXAMPLE, 'utf8'))

let app, base, dir
before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'kbc-loop-catalog-'))
  app = createServer({ dbPath: join(dir, 'test.db') })
  const { port } = await app.listen(0, '127.0.0.1')
  base = `http://127.0.0.1:${port}`
})
after(async () => { await app.close(); rmSync(dir, { recursive: true, force: true }) })

test('GET /api/catalog serves the seeded catalogue in the shared data shapes', async () => {
  const res = await fetch(`${base}/api/catalog`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.deepEqual(body.categories, categories)
  assert.deepEqual(body.partners, partners)
  assert.deepEqual(Object.keys(body.partners), Object.keys(partners))
  assert.deepEqual(body.products, products)
})

test('GET /api/catalog/partners/:id returns the partner with its products', async () => {
  const res = await fetch(`${base}/api/catalog/partners/signify`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.id, 'signify')
  assert.equal(body.name, partners.signify.name)
  assert.deepEqual(body.products, products.filter((p) => p.partnerId === 'signify'))
})

test('unknown partner gives 404, invalid id gives 400', async () => {
  assert.equal((await fetch(`${base}/api/catalog/partners/does-not-exist`)).status, 404)
  for (const bad of ['Signify', 'a_b', 'x'.repeat(65), "x'%20OR%201=1", 'signify/products', '']) {
    assert.equal((await fetch(`${base}/api/catalog/partners/${bad}`)).status, 400, bad)
  }
  assert.equal((await fetch(`${base}/api/catalog`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status, 404)
})

test('seeding is idempotent across restarts', () => {
  const path = join(dir, 'seed.db')
  for (let i = 0; i < 2; i++) {
    const db = new DatabaseSync(path)
    openCatalog(db)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM products').get().n, products.length)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM partners').get().n, Object.keys(partners).length)
    db.close()
  }
})

test('the example feed is valid and gets defaults filled in', () => {
  const result = validatePartnerFeed(example())
  assert.equal(result.ok, true, JSON.stringify(result.errors))
  const vacuum = result.feed.products[1]
  assert.equal(vacuum.partnerId, 'greenspin')
  assert.equal(vacuum.insuranceMonthly, 0)
  assert.equal(vacuum.connected, false)
})

test('invalid feeds are rejected with clear errors', () => {
  const cases = [
    [(f) => { f.extra = 1 }, 'extra is not an allowed field'],
    [(f) => { f.partner.id = 'Bad Id' }, 'partner.id must match'],
    [(f) => { f.partner.category = 'weapons' }, 'partner.category must be one of'],
    [(f) => { f.partner.tagline = 'x'.repeat(161) }, 'partner.tagline must be at most 160'],
    [(f) => { f.products[0].script = '<script>' }, 'products[0].script is not an allowed field'],
    [(f) => { f.products[0].monthly = -5 }, 'products[0].monthly must be between'],
    [(f) => { f.products[0].monthly = '17' }, 'products[0].monthly must be a finite number'],
    [(f) => { f.products[0].termMonths = 12.5 }, 'products[0].termMonths must be an integer'],
    [(f) => { delete f.products[0].buyPrice }, 'products[0].buyPrice is required'],
    [(f) => { f.products[0].for = ['everyone'] }, 'products[0].for may only contain'],
    [(f) => { f.products[0].includes = ['x'.repeat(121)] }, 'products[0].includes items must be'],
    [(f) => { f.products[1].id = f.products[0].id }, 'is duplicated'],
    [(f) => { f.products = [] }, 'products must be an array'],
  ]
  for (const [mutate, message] of cases) {
    const feed = example()
    mutate(feed)
    const result = validatePartnerFeed(feed)
    assert.equal(result.ok, false, message)
    assert.ok(result.errors.some((e) => e.includes(message)), `${message} in ${result.errors.join('; ')}`)
  }
  assert.equal(validatePartnerFeed(null).ok, false)
  assert.equal(validatePartnerFeed([]).ok, false)
})

test('import CLI upserts a valid feed and refuses an invalid one without writing', async () => {
  const dbPath = join(dir, 'import.db')
  const out = execFileSync(process.execPath, [SCRIPT, EXAMPLE, '--db', dbPath], { encoding: 'utf8' })
  assert.match(out, /Imported partner "greenspin" with 2 product/)
  // Running it again replaces instead of duplicating
  execFileSync(process.execPath, [SCRIPT, EXAMPLE, '--db', dbPath])

  const badPath = join(dir, 'bad-feed.json')
  const bad = example()
  bad.products[0].monthly = Number.MAX_VALUE
  writeFileSync(badPath, JSON.stringify(bad))
  const rejected = spawnSync(process.execPath, [SCRIPT, badPath, '--db', dbPath], { encoding: 'utf8' })
  assert.equal(rejected.status, 1)
  assert.match(rejected.stderr, /Feed rejected/)

  // A product id owned by another partner is refused and the transaction rolls back
  const steal = example()
  steal.products[0].id = 'lamp-home'
  writeFileSync(badPath, JSON.stringify(steal))
  const stolen = spawnSync(process.execPath, [SCRIPT, badPath, '--db', dbPath], { encoding: 'utf8' })
  assert.equal(stolen.status, 1)
  assert.match(stolen.stderr, /already belongs to partner "signify"/)

  const server = createServer({ dbPath })
  const { port } = await server.listen(0, '127.0.0.1')
  const partner = await (await fetch(`http://127.0.0.1:${port}/api/catalog/partners/greenspin`)).json()
  assert.equal(partner.category, 'toestellen')
  assert.deepEqual(partner.products.map((p) => p.id), ['greenspin-dryer', 'greenspin-vacuum'])
  const all = await (await fetch(`http://127.0.0.1:${port}/api/catalog`)).json()
  assert.equal(all.products.length, products.length + 2)
  assert.equal(Object.keys(all.partners).at(-1), 'greenspin')
  await server.close()
})
