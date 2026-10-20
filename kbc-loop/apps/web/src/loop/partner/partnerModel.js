// Pure helpers for the partner tiles and partner pages: joins partners with their profile, category and
// the products a customer type can borrow. No React and no data of its own.
import { partners, categories, partnerProfile } from '@kbc-loop/shared/data/index.js'
import { catalogFor, productById } from '@kbc-loop/shared/engine/catalog.js'

const byPrice = (a, b) => a.monthly - b.monthly || a.name.localeCompare(b.name)

/** Products of one partner that this customer type can borrow, cheapest first. */
export const partnerProducts = (partnerId, customerType) => catalogFor(customerType).filter((p) => p.partnerId === partnerId).sort(byPrice)

/** Every partner with category, profile and product count for this customer type; partners with products first. */
export function partnerSummaries(customerType) {
  return Object.values(partners)
    .map((pa) => ({
      ...pa,
      category: categories.find((c) => c.id === pa.category) ?? null,
      profile: partnerProfile(pa.id),
      count: partnerProducts(pa.id, customerType).length,
    }))
    .sort((a, b) => Number(b.count > 0) - Number(a.count > 0) || a.name.localeCompare(b.name))
}

/** Partner with profile and category, or null for an unknown id. */
export function partnerDetail(partnerId) {
  const pa = Object.hasOwn(partners, partnerId) ? partners[partnerId] : null
  if (!pa) return null
  return { ...pa, category: categories.find((c) => c.id === pa.category) ?? null, profile: partnerProfile(pa.id) }
}

/** Open repair tickets for a partner across all customers in the live state (a count only: anonymised). */
export function openTickets(state, partnerId) {
  const all = Object.values(state?.items ?? {}).flat()
  return all.filter((i) => i && !i.returned && i.repair && i.repair.step < 3 && productById(i.productId)?.partnerId === partnerId).length
}
