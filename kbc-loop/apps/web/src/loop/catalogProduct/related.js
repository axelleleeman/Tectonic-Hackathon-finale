// Pure helpers for the catalogue product page: the product (validated against this customer's catalogue),
// more products from the same partner and similar products from other partners in the same category.
import { partners } from '@kbc-loop/shared/data/index.js'
import { catalogFor } from '@kbc-loop/shared/engine/catalog.js'

const LIMIT = 4

/** The product if this customer type can borrow it, otherwise null. */
export const catalogueProduct = (productId, customerType) => catalogFor(customerType).find((p) => p.id === productId) ?? null

/** Other products of the same partner, closest in price first. */
export function moreFromPartner(product, customerType) {
  return catalogFor(customerType)
    .filter((p) => p.partnerId === product.partnerId && p.id !== product.id)
    .sort((a, b) => Math.abs(a.monthly - product.monthly) - Math.abs(b.monthly - product.monthly))
    .slice(0, LIMIT)
}

/** Products in the same category from other partners, closest in price first. */
export function similarProducts(product, customerType) {
  const category = partners[product.partnerId]?.category
  return catalogFor(customerType)
    .filter((p) => p.partnerId !== product.partnerId && partners[p.partnerId]?.category === category)
    .sort((a, b) => Math.abs(a.monthly - product.monthly) - Math.abs(b.monthly - product.monthly))
    .slice(0, LIMIT)
}
