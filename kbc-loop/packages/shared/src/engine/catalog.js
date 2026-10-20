// Lookup functions for products, bundles and partners.
import { products, bundles, partners, categories } from '../data/index.js'
import { BUNDLE_DISCOUNT } from '../config/index.js'

const sum = (list, key) => list.reduce((s, x) => s + (x[key] ?? 0), 0)

function resolveBundle(b) {
  const parts = b.items.map((id) => products.find((p) => p.id === id))
  return {
    ...b,
    isBundle: true,
    parts,
    partnerIds: [...new Set(parts.map((p) => p.partnerId))],
    monthly: Math.round(sum(parts, 'monthly') * (1 - BUNDLE_DISCOUNT)),
    buyPrice: sum(parts, 'buyPrice'),
    expectedRepairs: sum(parts, 'expectedRepairs'),
    co2Kg: sum(parts, 'co2Kg'),
    includes: [
      `${Math.round(BUNDLE_DISCOUNT * 100)}% bundle discount`,
      ...parts.map((p) => `${p.icon} ${p.name}, repairs included`),
      'One monthly fee, one point of contact in KBC Mobile',
    ],
  }
}

export function productById(id) {
  const product = products.find((p) => p.id === id)
  if (product) return { ...product, partnerIds: [product.partnerId] }
  const bundle = bundles.find((b) => b.id === id)
  return bundle ? resolveBundle(bundle) : null
}

/** When borrowed, a bundle is split into its individual products. */
export function expandProduct(id) {
  const p = productById(id)
  return p?.isBundle ? p.items : p ? [p.id] : []
}

export function partnerNames(product) {
  return product.partnerIds.map((id) => partners[id].name).join(', ')
}

export function partnerOf(product) {
  return partners[product.partnerId ?? product.partnerIds[0]]
}

export function catalogFor(customerType) {
  return products.filter((p) => p.for.includes(customerType))
}

export function categoryOf(product) {
  const partner = partners[product.partnerId ?? product.partnerIds[0]]
  return categories.find((c) => c.id === partner.category)
}

/** Categories with their partners and products, filtered by customer type. */
export function categoriesFor(customerType) {
  return categories
    .filter((c) => c.for.includes(customerType))
    .map((c) => {
      const partnerList = Object.values(partners)
        .filter((pa) => pa.category === c.id)
        .map((pa) => ({ ...pa, products: products.filter((p) => p.partnerId === pa.id && p.for.includes(customerType)) }))
        .filter((pa) => pa.products.length > 0)
      return { ...c, partners: partnerList, productCount: partnerList.reduce((s, pa) => s + pa.products.length, 0) }
    })
    .filter((c) => c.partners.length > 0)
}
