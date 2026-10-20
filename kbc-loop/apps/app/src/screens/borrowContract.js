// Borrow contract (simulated KBC Sign) and the second-life offer for the app; same terms as the web.
// Second life: products the partner regularly gets back in good condition are also offered as a refurbished
// unit at 25% off. Borrowing still uses the normal product id; the contract mentions the refurbished unit.
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { dateText } from './item/format.js'

const SECOND_LIFE_IDS = new Set(['washer', 'dishwasher', 'fridge', 'coffee', 'phone', 'tablet', 'laptop', 'monitor', 'tv', 'ebike', 'stroller', 'cot', 'desk', 'chairs-ergo'])
export const SIGN_DELAY_MS = 1200

/** Monthly fee for a refurbished unit, or null when the product has no second-life offer. */
export function secondLifeMonthly(product) {
  if (!product || !SECOND_LIFE_IDS.has(product.id)) return null
  return Math.round(product.monthly * 0.75 * 100) / 100
}

export function contractTerms(product, { refurbished = false } = {}) {
  const monthly = (refurbished && secondLifeMonthly(product)) || product.monthly
  return {
    productId: product.id,
    reference: `KL-${product.id.toUpperCase()}-${TODAY.replaceAll('-', '')}`,
    product: refurbished ? `${product.name} (refurbished unit)` : product.name,
    refurbished,
    monthly,
    term: `${product.termMonths} months`,
    included: product.includes ?? [],
    insurance: 'Damage and theft insurance via KBC, included in the monthly fee.',
    cancellation: 'Cancel free of charge after the first 12 months, with one month notice. You can also take over the product at its residual value.',
    start: dateText(TODAY),
  }
}

// The contract confirmed last in this session, so the confirmation screen can show and share it.
let lastContract = null
export const rememberContract = (terms) => { lastContract = terms }
export const contractFor = (productId) => (lastContract?.productId === productId ? lastContract : null)
