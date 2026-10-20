// Real product photos (Unsplash License, see CREDITS.md), one per product type. Pure data: this file
// only decides WHICH photo a product gets. The image files themselves are imported in assets.js, so
// Node (tests, api) can use this module without an image loader.
// Products without a photo fall back to their illustration (../illustrations).
import { illustrationTypeFor, findProduct } from '../illustrations/index.js'

/** Photo key per illustration type. */
export const PHOTO_BY_TYPE = {
  phone: 'phone',
  laptop: 'laptop',
  tv: 'tv',
  washer: 'washer',
  fridge: 'fridge',
  'coffee-machine': 'coffee',
  'coffee-pro': 'coffee',
  'solar-panels': 'solar-panels',
  ebike: 'ebike',
  'cargo-bike': 'cargo-bike',
  'ev-charger': 'ev-charger',
  stroller: 'stroller',
  'office-chair': 'office-chair',
  lamp: 'lamp',
  desk: 'desk',
}

/** Photo key per product id, where a product deserves a different photo than its type. */
export const PHOTO_BY_PRODUCT = {
  desk: 'workspace', // "Office fit-out": a complete workstation rather than a single desk
}

/** Every photo key that has an image file in this folder (`<key>.jpg`). */
export const photoKeys = ['cargo-bike', 'coffee', 'desk', 'ebike', 'ev-charger', 'fridge', 'lamp', 'laptop', 'office-chair', 'phone', 'solar-panels', 'stroller', 'tv', 'washer', 'workspace']

/** Photo key for a product (object or id), or null when it should show its illustration. */
export function photoKeyFor(productOrId) {
  const product = typeof productOrId === 'string' ? (findProduct(productOrId) ?? { id: productOrId }) : (productOrId ?? {})
  if (product.photo === false) return null
  if (product.id && PHOTO_BY_PRODUCT[product.id]) return PHOTO_BY_PRODUCT[product.id]
  return PHOTO_BY_TYPE[illustrationTypeFor(product)] ?? null
}
