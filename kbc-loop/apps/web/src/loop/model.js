// Pure helpers for the KBC LOOP page: joins the customer's loop items with the shared catalogue.
// No React and no data of its own: everything comes from @kbc-loop/shared.
import { products, partners, categories, issuesFor } from '@kbc-loop/shared/data/index.js'
import { productById, categoryOf, categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { TODAY, TECHNICIAN_SLOT } from '@kbc-loop/shared/config/index.js'

export { issuesFor, TECHNICIAN_SLOT }

// Line icon per product and per category (see LoopIcon.jsx). Unknown ids fall back to the loop icon.
const PRODUCT_ICONS = {
  'lamp-home': 'bulb', 'lamp-shop': 'bulb', solar: 'sun', battery: 'battery', washer: 'wash', fridge: 'fridge',
  coffee: 'coffee', 'coffee-pro': 'coffee', phone: 'phone', laptop: 'laptop', tv: 'tv', ebike: 'bike', cargo: 'bike',
  stroller: 'heart', carseat: 'heart', desk: 'store',
}
const CATEGORY_ICONS = { energie: 'bulb', toestellen: 'wash', elektronica: 'phone', mobiliteit: 'bike', gezin: 'heart', zaak: 'store' }

export const categoryIcon = (categoryId) => CATEGORY_ICONS[categoryId] ?? 'loop'
/** Product icon; products without their own icon use their category's. */
export const productIcon = (productId, categoryId) => PRODUCT_ICONS[productId] ?? categoryIcon(categoryId)

/** Up to two initials for a partner "logo", e.g. "Philips (Signify)" → "PS", "SolarLoop" → "SL". */
export function partnerInitials(name) {
  const words = name.replace(/[()]/g, ' ').split(/\s+/).filter(Boolean)
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  const caps = name.match(/[A-Z]/g) ?? []
  return (caps.length > 1 ? caps.slice(0, 2).join('') : name.slice(0, 2)).toUpperCase()
}

// ---------- Dates (deterministic English formatting, independent of the browser locale) ----------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const parts = (iso) => iso.split('-').map(Number)

export function monthsBetween(fromIso, toIso = TODAY) {
  const [fy, fm] = parts(fromIso)
  const [ty, tm] = parts(toIso)
  return Math.max(0, (ty - fy) * 12 + (tm - fm))
}

/** "2025-03-12" → "12 Mar 2025" */
export function shortDate(iso) {
  const [y, m, d] = parts(iso)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/** Adds whole months to an ISO date (day clamped to the target month's length). */
export function addMonths(iso, n) {
  const [y, m, d] = parts(iso)
  const total = y * 12 + (m - 1) + n
  const ny = Math.floor(total / 12)
  const nm = total % 12
  const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate()
  return `${ny}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`
}

export function duration(months) {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (!y) return m ? `${m} mo` : 'New'
  return m ? `${y} yr ${m} mo` : `${y} yr`
}

// ---------- Per item ----------

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

/** Status shown on cards and in the drawer: Active, Repair step x of 3 or Returned. */
export function statusOf(row) {
  const { item } = row
  if (item.returned) return { label: 'Returned', tone: 'off' }
  if (item.repair) return { label: `Repair step ${item.repair.step} of 3`, tone: item.repair.step >= 3 ? 'ok' : 'warn' }
  return { label: 'Active', tone: 'ok' }
}

export const hasOpenRepair = (row) => Boolean(row.item.repair && row.item.repair.step < 3)

/** All of the customer's items (active and returned), joined with product, partner, category and derived figures. */
export function loopRows(items, customerType) {
  return items
    .map((item) => ({ item, product: productById(item.productId) }))
    .filter((r) => r.product)
    .map(({ item, product }) => {
      const months = monthsBetween(item.since)
      const category = categoryOf(product)
      return {
        item,
        product,
        partner: partners[product.partnerId],
        category,
        icon: productIcon(product.id, category?.id),
        condition: condition(item, product),
        upgrade: item.returned ? null : upgradeFor(product.id, customerType),
        isNew: item.since === TODAY,
        months,
        paid: months * product.monthly,
        endDate: addMonths(item.since, product.termMonths),
      }
    })
}

/**
 * "Your home": one section per category this customer can borrow from (plus any category they own something in).
 * Categories with products come first; inside a section active items precede returned ones.
 */
export function homeSections(rows, customerType) {
  const list = categoriesFor(customerType).map((c) => categories.find((x) => x.id === c.id) ?? c)
  rows.forEach((r) => { if (r.category && !list.some((c) => c.id === r.category.id)) list.push(r.category) })
  const sections = list.map((category) => ({
    category,
    rows: rows.filter((r) => r.category?.id === category.id).sort((a, b) => Number(a.item.returned) - Number(b.item.returned)),
  }))
  return [...sections.filter((s) => s.rows.length), ...sections.filter((s) => !s.rows.length)]
}

// ---------- Catalogue ----------

/** Categories → partners → products for this customer type, sorted (partners by name, products by price). */
export function catalogue(customerType) {
  return categoriesFor(customerType).map((c) => ({
    ...c,
    partners: [...c.partners]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((pa) => ({ ...pa, products: [...pa.products].sort((a, b) => a.monthly - b.monthly || a.name.localeCompare(b.name)) })),
  }))
}

export function matchesQuery(product, partner, query) {
  if (!query) return true
  const hay = `${product.name} ${product.detail} ${partner.name} ${partner.tagline}`.toLowerCase()
  return hay.includes(query.toLowerCase())
}

/** Applies the search query; keeps only partners (and categories) with at least one match. */
export function filterCatalogue(cats, query) {
  return cats.map((c) => {
    const ps = c.partners
      .map((pa) => ({ ...pa, products: pa.products.filter((p) => matchesQuery(p, pa, query)) }))
      .filter((pa) => pa.products.length)
    return { ...c, partners: ps, count: ps.reduce((s, pa) => s + pa.products.length, 0) }
  })
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
