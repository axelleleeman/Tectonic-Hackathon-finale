// Second-life (refurbished) offer: products the partner regularly gets back in good condition are also
// offered as a refurbished unit at 25% off the monthly fee. Deterministic, client-side only: borrowing still
// uses the normal product id; the refurbished unit is mentioned in the contract and the confirmation.
const SECOND_LIFE_IDS = new Set(['washer', 'dishwasher', 'fridge', 'coffee', 'phone', 'tablet', 'laptop', 'monitor', 'tv', 'ebike', 'stroller', 'cot', 'desk', 'chairs-ergo'])
export const SECOND_LIFE_DISCOUNT = 0.25

/** Monthly fee for a refurbished unit, or null when the product has no second-life offer. */
export function secondLifeMonthly(product) {
  if (!product || !SECOND_LIFE_IDS.has(product.id)) return null
  return Math.round(product.monthly * (1 - SECOND_LIFE_DISCOUNT) * 100) / 100
}
