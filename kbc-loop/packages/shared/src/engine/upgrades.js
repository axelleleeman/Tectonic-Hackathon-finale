// Upgrades: swap a borrowed product for a better one in the same category.
// The old device goes back to the partner (refurbished or recycled), the new one starts today.
import { COINS } from '../config/index.js'
import { catalogFor, categoryOf, partnerOf, productById } from './catalog.js'

export const MAX_UPGRADE_OPTIONS = 3

/**
 * Products the customer can upgrade to: visible for the customer type and with a higher monthly fee
 * (a more capable model). Prefers the same partner (phone → phone pro); only when that partner has no
 * upgrade, other partners in the same category are offered. Sorted by fee, at most 3.
 * @returns {object[]} products (catalogue shape, as productById), [] when there are none
 */
export function upgradeOptions(productId, customerType) {
  const from = productById(productId)
  if (!from || from.isBundle) return []
  const categoryId = categoryOf(from)?.id
  const better = catalogFor(customerType)
    .filter((p) => p.id !== from.id && p.monthly > from.monthly && categoryOf(p)?.id === categoryId)
    .sort((a, b) => a.monthly - b.monthly)
  const samePartner = better.filter((p) => p.partnerId === from.partnerId)
  return (samePartner.length ? samePartner : better)
    .slice(0, MAX_UPGRADE_OPTIONS)
    .map((p) => ({ ...p, partnerIds: [p.partnerId] }))
}

/** True when `toProductId` is one of the upgrade options for `fromProductId`. */
export function isValidUpgrade(fromProductId, toProductId, customerType) {
  return upgradeOptions(fromProductId, customerType).some((p) => p.id === toProductId)
}

/**
 * Figures for the upgrade screen.
 * @returns {{ monthlyDifference: number, coinsForReturn: number, co2Note: string } | null}
 */
export function upgradeQuote(fromProductId, toProductId) {
  const from = productById(fromProductId)
  const to = productById(toProductId)
  if (!from || !to) return null
  const partner = partnerOf(from)?.short ?? 'the partner'
  return {
    monthlyDifference: Math.round((to.monthly - from.monthly) * 100) / 100,
    coinsForReturn: COINS.return,
    co2Note: `Your ${from.name} goes back to ${partner} to be refurbished or recycled, so it never ends up as waste.`,
  }
}
