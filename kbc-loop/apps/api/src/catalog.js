// Partner catalogue in SQLite: tables `partners` and `products`, seeded from the shared data
// (packages/shared/src/data) when empty, so the api can serve the catalogue and real partners can
// later deliver their own product feed (scripts/import-partner-feed.mjs).
//
// Responses keep the same shapes as the shared data (partners keyed by id, products as an array),
// so web and app can switch from the bundled data to GET /api/catalog without other changes.
// All SQL is parameterised. The only write path is importPartnerFeed, used by the CLI (not over HTTP).
import { categories } from '@kbc-loop/shared/data/categories.js'
import { partners as seedPartners } from '@kbc-loop/shared/data/partners.js'
import { products as seedProducts } from '@kbc-loop/shared/data/products.js'

export const PARTNER_ID = /^[a-z0-9-]{1,64}$/

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS partners (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    short TEXT NOT NULL,
    tagline TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('seed', 'feed')),
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS products_partner ON products (partner_id, sort_order);
`

function transaction(db, fn) {
  db.exec('BEGIN IMMEDIATE')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

const toPartner = (row) => ({ id: row.id, category: row.category, name: row.name, short: row.short, tagline: row.tagline })

// db: a node:sqlite DatabaseSync. Creates the tables and seeds them once (idempotent).
export function openCatalog(db) {
  db.exec('PRAGMA foreign_keys = ON')
  db.exec(SCHEMA)

  const countPartners = db.prepare('SELECT COUNT(*) AS n FROM partners')
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS n FROM partners')
  const upsertPartner = db.prepare(`INSERT INTO partners (id, category, name, short, tagline, sort_order, source, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET category = excluded.category, name = excluded.name, short = excluded.short,
      tagline = excluded.tagline, source = excluded.source, updated_at = excluded.updated_at`)
  const partnerOrder = db.prepare('SELECT sort_order FROM partners WHERE id = ?')
  const insertProduct = db.prepare('INSERT INTO products (id, partner_id, sort_order, data, updated_at) VALUES (?, ?, ?, ?, ?)')
  const deleteProducts = db.prepare('DELETE FROM products WHERE partner_id = ?')
  const productOwner = db.prepare('SELECT partner_id FROM products WHERE id = ?')
  const selectPartners = db.prepare('SELECT id, category, name, short, tagline FROM partners ORDER BY sort_order, id')
  const selectPartner = db.prepare('SELECT id, category, name, short, tagline FROM partners WHERE id = ?')
  const selectProducts = db.prepare(`SELECT p.data FROM products p JOIN partners pa ON pa.id = p.partner_id
    ORDER BY pa.sort_order, p.sort_order, p.id`)
  const selectPartnerProducts = db.prepare('SELECT data FROM products WHERE partner_id = ? ORDER BY sort_order, id')

  if (countPartners.get().n === 0) {
    transaction(db, () => {
      const now = new Date().toISOString()
      Object.values(seedPartners).forEach((p, i) => upsertPartner.run(p.id, p.category, p.name, p.short, p.tagline, i, 'seed', now))
      seedProducts.forEach((p, i) => insertProduct.run(p.id, p.partnerId, i, JSON.stringify(p), now))
    })
  }

  return {
    // { categories, partners, products } in the shapes of packages/shared/src/data
    catalog() {
      const partners = Object.fromEntries(selectPartners.all().map((r) => [r.id, toPartner(r)]))
      const products = selectProducts.all().map((r) => JSON.parse(r.data))
      return { categories, partners, products }
    },

    // Partner with its products, or null when unknown
    partner(id) {
      if (typeof id !== 'string' || !PARTNER_ID.test(id)) return null
      const row = selectPartner.get(id)
      if (!row) return null
      return { ...toPartner(row), products: selectPartnerProducts.all(id).map((r) => JSON.parse(r.data)) }
    },

    // Upserts a validated feed (see partnerFeed.js) in one transaction: the feed is the partner's full
    // catalogue, so its previous products are replaced. Product ids owned by another partner are refused.
    importPartnerFeed(feed) {
      return transaction(db, () => {
        const now = new Date().toISOString()
        const { partner } = feed
        for (const p of feed.products) {
          const owner = productOwner.get(p.id)?.partner_id
          if (owner && owner !== partner.id) throw new Error(`Product id "${p.id}" already belongs to partner "${owner}"`)
        }
        const order = partnerOrder.get(partner.id)?.sort_order ?? maxOrder.get().n + 1
        upsertPartner.run(partner.id, partner.category, partner.name, partner.short, partner.tagline, order, 'feed', now)
        deleteProducts.run(partner.id)
        feed.products.forEach((p, i) => insertProduct.run(p.id, partner.id, i, JSON.stringify(p), now))
        return { partnerId: partner.id, products: feed.products.length }
      })
    },
  }
}
