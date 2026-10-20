// Pure helpers for the KBC LOOP page: joins the customer's loop items with the shared catalogue.
// No React and no data of its own: everything comes from @kbc-loop/shared.
import { products, partners, issuesFor } from '@kbc-loop/shared/data/index.js'
import { productById, categoryOf, categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { TODAY, TECHNICIAN_SLOT } from '@kbc-loop/shared/config/index.js'

export { issuesFor, TECHNICIAN_SLOT }

// Line icon per product and per category (see LoopIcon.jsx).
const PRODUCT_ICONS = {
  'lamp-home': 'bulb', 'lamp-shop': 'bulb', solar: 'sun', battery: 'battery', washer: 'wash', fridge: 'fridge',
  coffee: 'coffee', 'coffee-pro': 'coffee', phone: 'phone', laptop: 'laptop', tv: 'tv', ebike: 'bike', cargo: 'bike',
  stroller: 'heart', carseat: 'heart', desk: 'store',
}
const CATEGORY_ICONS = { energie: 'bulb', toestellen: 'wash', elektronica: 'phone', mobiliteit: 'bike', gezin: 'heart', zaak: 'store' }

export const productIcon = (productId) => PRODUCT_ICONS[productId] ?? 'loop'
export const categoryIcon = (categoryId) => CATEGORY_ICONS[categoryId] ?? 'loop'

export function monthsBetween(fromIso, toIso = TODAY) {
  const [fy, fm] = fromIso.split('-').map(Number)
  const [ty, tm] = toIso.split('-').map(Number)
  return Math.max(0, (ty - fy) * 12 + (tm - fm))
}

export function duration(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (!y) return m ? `${m} mo` : 'New'
  return m ? `${y} yr ${m} mo` : `${y} yr`
}

export const monthYear = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

// Estimated condition (0–100) from age relative to the contract term, past repairs and an open fault.
// This is a demo estimate; the api does not track a real condition.
export function condition(item, product) {
  const used = Math.min(1, monthsBetween(item.since) / product.termMonths)
  let value = 100 - Math.round(used * 30) - (item.repairs ?? 0) * 3
  if (item.repair && item.repair.step < 3) value = Math.min(value, 55)
  return Math.max(20, value)
}

export const lifespanUsed = (item, product) => Math.min(100, Math.round((monthsBetween(item.since) / product.termMonths) * 100))

/** Upgrade = a pricier product from the same partner that this customer type may borrow (e.g. e-bike → cargo bike). */
export function upgradeFor(productId, customerType) {
  const current = products.find((p) => p.id === productId)
  if (!current) return null
  return products
    .filter((p) => p.partnerId === current.partnerId && p.id !== current.id && p.for.includes(customerType) && p.monthly > current.monthly)
    .sort((a, b) => a.monthly - b.monthly)[0] ?? null
}

/** The customer's active (not returned) items, joined with product, partner and category. */
export function homeItems(items, customerType) {
  return items
    .filter((i) => !i.returned)
    .map((item) => {
      const product = productById(item.productId)
      return {
        item,
        product,
        partner: partners[product.partnerId],
        category: categoryOf(product),
        icon: productIcon(product.id),
        condition: condition(item, product),
        upgrade: upgradeFor(product.id, customerType),
        isNew: item.since === TODAY,
      }
    })
}

/** Groups rows by category, in the order they first appear. */
export function groupByCategory(rows) {
  const groups = new Map()
  rows.forEach((r) => {
    const g = groups.get(r.category.id) ?? { category: r.category, rows: [] }
    g.rows.push(r)
    groups.set(r.category.id, g)
  })
  return [...groups.values()]
}

export function marketCategories(customerType) {
  return categoriesFor(customerType).map((c) => ({
    ...c,
    products: c.partners.flatMap((pa) => pa.products.map((p) => ({ ...p, partner: pa }))),
  }))
}

export function matchesQuery(product, query) {
  if (!query) return true
  const hay = `${product.name} ${product.detail} ${product.partner.name} ${product.partner.tagline}`.toLowerCase()
  return hay.includes(query.toLowerCase())
}

// Coin history derived from the shared state (the api keeps no separate history).
export function coinFeed(rows, allItems, COINS) {
  const feed = []
  allItems.forEach((i) => {
    const p = productById(i.productId)
    if (i.returned) feed.push({ key: `${i.key}-ret`, label: `Returned: ${p.name}`, amount: COINS.return })
  })
  rows.forEach((r) => {
    if (r.item.repair?.step === 3) feed.push({ key: `${r.item.key}-rep`, label: `Repaired: ${r.product.name}`, amount: COINS.repair })
  })
  return feed.reverse()
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export const REPAIR_STEPS = (partnerName, preventive) => [
  preventive ? 'Wear reported by the device itself' : 'Fault reported',
  `${partnerName} schedules a technician · ${TECHNICIAN_SLOT}`,
  'Repaired and tested',
]
