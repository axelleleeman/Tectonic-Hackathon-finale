// Strict validation of a partner product feed (JSON), used by scripts/import-partner-feed.mjs.
// A feed describes one partner and its full catalogue, with the same fields as
// packages/shared/src/data/partners.js and products.js (products get partnerId from the feed's partner):
//
//   {
//     "partner":  { "id", "name", "short"?, "tagline", "category" },
//     "products": [{ "id", "name", "detail", "icon", "for", "monthly", "buyPrice", "termMonths", "co2Kg",
//                    "includes", "expectedRepairs"?, "insuranceMonthly"?, "energySavingMonthly"?,
//                    "connected"?, "payPerUse"? }]
//   }
//
// Unknown fields, wrong types, out-of-range numbers and too-long strings are rejected. validatePartnerFeed
// returns { ok: true, feed } with a normalised feed (defaults filled in), or { ok: false, errors }.
import { categories } from '@kbc-loop/shared/data/categories.js'
import { PARTNER_ID } from './catalog.js'

export const MAX_FEED_BYTES = 512 * 1024
export const MAX_PRODUCTS = 500
const CUSTOMER_TYPES = ['particulier', 'kmo']
const CATEGORY_IDS = categories.map((c) => c.id)

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

// Field rules: kind + limits. `optional` fields get `default` when missing.
const PARTNER_FIELDS = {
  id: { kind: 'id' },
  name: { kind: 'string', max: 80 },
  short: { kind: 'string', max: 40, optional: true },
  tagline: { kind: 'string', max: 160 },
  category: { kind: 'enum', values: CATEGORY_IDS },
}

const PRODUCT_FIELDS = {
  id: { kind: 'id' },
  name: { kind: 'string', max: 80 },
  detail: { kind: 'string', max: 160 },
  icon: { kind: 'string', max: 8 },
  for: { kind: 'enumList', values: CUSTOMER_TYPES },
  monthly: { kind: 'number', min: 0.01, max: 100_000 },
  buyPrice: { kind: 'number', min: 0, max: 10_000_000 },
  termMonths: { kind: 'integer', min: 1, max: 240 },
  co2Kg: { kind: 'number', min: 0, max: 1_000_000 },
  includes: { kind: 'stringList', max: 120, maxItems: 12 },
  expectedRepairs: { kind: 'number', min: 0, max: 10_000_000, optional: true, default: 0 },
  insuranceMonthly: { kind: 'number', min: 0, max: 100_000, optional: true, default: 0 },
  energySavingMonthly: { kind: 'number', min: 0, max: 100_000, optional: true },
  connected: { kind: 'boolean', optional: true, default: false },
  payPerUse: { kind: 'boolean', optional: true },
}

function checkValue(rule, v) {
  switch (rule.kind) {
    case 'id': return typeof v === 'string' && PARTNER_ID.test(v) ? null : 'must match /^[a-z0-9-]{1,64}$/'
    case 'string':
      if (typeof v !== 'string' || v.trim() === '') return 'must be a non-empty string'
      return v.length > rule.max ? `must be at most ${rule.max} characters` : null
    case 'enum': return rule.values.includes(v) ? null : `must be one of ${rule.values.join(', ')}`
    case 'enumList':
      if (!Array.isArray(v) || v.length === 0) return 'must be a non-empty array'
      if (new Set(v).size !== v.length) return 'must not contain duplicates'
      return v.every((x) => rule.values.includes(x)) ? null : `may only contain ${rule.values.join(', ')}`
    case 'stringList':
      if (!Array.isArray(v) || v.length === 0 || v.length > rule.maxItems) return `must be an array of 1 to ${rule.maxItems} strings`
      return v.every((x) => typeof x === 'string' && x.trim() !== '' && x.length <= rule.max) ? null : `items must be non-empty strings of at most ${rule.max} characters`
    case 'number':
    case 'integer':
      if (typeof v !== 'number' || !Number.isFinite(v)) return 'must be a finite number'
      if (rule.kind === 'integer' && !Number.isInteger(v)) return 'must be an integer'
      return v < rule.min || v > rule.max ? `must be between ${rule.min} and ${rule.max}` : null
    case 'boolean': return typeof v === 'boolean' ? null : 'must be true or false'
    default: return 'has an unknown rule'
  }
}

function checkObject(obj, fields, path, errors) {
  if (!isObject(obj)) { errors.push(`${path} must be an object`); return null }
  const out = {}
  for (const key of Object.keys(obj)) if (!Object.hasOwn(fields, key)) errors.push(`${path}.${key} is not an allowed field`)
  for (const [key, rule] of Object.entries(fields)) {
    if (obj[key] === undefined) {
      if (!rule.optional) errors.push(`${path}.${key} is required`)
      else if (rule.default !== undefined) out[key] = rule.default
      continue
    }
    const problem = checkValue(rule, obj[key])
    if (problem) errors.push(`${path}.${key} ${problem}`)
    else out[key] = Array.isArray(obj[key]) ? [...obj[key]] : obj[key]
  }
  return out
}

export function validatePartnerFeed(input) {
  const errors = []
  if (!isObject(input)) return { ok: false, errors: ['feed must be a JSON object'] }
  for (const key of Object.keys(input)) if (key !== 'partner' && key !== 'products') errors.push(`${key} is not an allowed field`)

  const partner = checkObject(input.partner, PARTNER_FIELDS, 'partner', errors)
  if (partner && partner.short === undefined && typeof partner.name === 'string') partner.short = partner.name.slice(0, 40)

  const products = []
  if (!Array.isArray(input.products) || input.products.length === 0 || input.products.length > MAX_PRODUCTS) {
    errors.push(`products must be an array of 1 to ${MAX_PRODUCTS} products`)
  } else {
    const seen = new Set()
    input.products.forEach((raw, i) => {
      const product = checkObject(raw, PRODUCT_FIELDS, `products[${i}]`, errors)
      if (!product) return
      if (seen.has(product.id)) errors.push(`products[${i}].id "${product.id}" is duplicated`)
      seen.add(product.id)
      // Same field order as the shared data, with partnerId taken from the feed's partner
      const { id, ...rest } = product
      products.push({ id, partnerId: partner?.id, ...rest })
    })
  }

  return errors.length ? { ok: false, errors } : { ok: true, feed: { partner, products } }
}
