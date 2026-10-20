// Data for the "pattern → insight → Kate" visual of a Kate tip, shared by web (loop/kate/TipFlow.jsx) and app
// (screens/aanbod/KateTips.js). Pure and deterministic: the same signal and customer always give the same output.
//
// The sparkline covers the 12 months up to TODAY for the tip's spending category. Months with real transactions of
// that category use the real amounts; the other months are a stable, seeded filler (seeded by the signal id) so the
// line looks like a normal year without ever changing between renders. The triggering transaction is the highlighted
// point and its value is the real transaction amount.
import { TODAY } from '../config/index.js'
import { productById } from '../engine/catalog.js'
import { euro, formatDate } from '../engine/format.js'

const MONTHS = 12
const INITIALS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

/** FNV-1a hash of a string → 32-bit seed. */
function hash(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Small seeded PRNG (mulberry32): returns a function giving numbers in [0, 1). */
function seeded(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The 12 month keys ('2025-11' … '2026-10') ending in the month of TODAY. */
export function monthKeys(today = TODAY) {
  const [y, m] = today.split('-').map(Number)
  return Array.from({ length: MONTHS }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (MONTHS - 1 - i), 1))
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  })
}

const initialOf = (key) => INITIALS[Number(key.slice(5, 7)) - 1]
const round2 = (n) => Math.round(n * 100) / 100

/** Points → { points, first, last } with each point { key, value, highlight, marked }. */
function withLabels(keys, values, highlight, marked = new Set()) {
  return {
    points: keys.map((key, i) => ({ key, value: values[i], highlight: i === highlight, marked: i !== highlight && marked.has(i) })),
    highlight,
    first: initialOf(keys[0]),
    last: initialOf(keys[keys.length - 1]),
  }
}

/** Does a transaction belong to the same spending pattern as the trigger? */
function samePattern(tx, trigger) {
  if (tx.category !== trigger.category) return false
  return trigger.category !== 'herstelling' || tx.appliance === trigger.appliance
}

function spendSeries(signal, customer, trigger) {
  const keys = monthKeys()
  const amount = Math.abs(trigger.amount)
  const rand = seeded(hash(signal.id))
  const related = (customer?.transactions ?? []).filter((t) => samePattern(t, trigger))
  const real = new Map()
  for (const t of related) {
    const k = t.date.slice(0, 7)
    if (keys.includes(k)) real.set(k, (real.get(k) ?? 0) + Math.abs(t.amount))
  }
  // A typical month: the customer's average for energy, otherwise a small share of the highlighted amount.
  const base = trigger.category === 'energie' && customer?.avgEnergyBill ? customer.avgEnergyBill : amount * 0.16
  const highlight = Math.max(0, keys.indexOf(trigger.date.slice(0, 7)))
  const marked = new Set()
  const values = keys.map((k, i) => {
    const filler = round2(base * (0.7 + 0.6 * rand()))
    if (i === highlight) return amount
    if (real.has(k)) { marked.add(i); return round2(real.get(k)) }
    return filler
  })
  return withLabels(keys, values, highlight, marked)
}

/** Light output in % (device telemetry): stable around 100, then the reported drop of 18% in the last month. */
function deviceSeries(signal, drop = 18) {
  const keys = monthKeys()
  const rand = seeded(hash(signal.id))
  const values = keys.map((_, i) => (i === MONTHS - 1 ? 100 - drop : round2(99 - i * 0.4 - rand() * 1.5)))
  return withLabels(keys, values, MONTHS - 1)
}

/** Estimated condition in %: from 100 down to `condition`, with a small seeded wobble. */
function conditionSeries(id, condition) {
  const keys = monthKeys()
  const rand = seeded(hash(id))
  const values = keys.map((_, i) => (i === MONTHS - 1 ? condition : round2(100 - ((100 - condition) * i) / (MONTHS - 1) + rand() * 1.2)))
  return withLabels(keys, values, MONTHS - 1)
}

function insightOf(signal, customer, trigger, product) {
  const id = signal.id ?? ''
  if (id === 'phone-repair' && customer?.phoneAgeMonths) return `Phone repaired at ${customer.phoneAgeMonths} months`
  if (id === 'repeat-repair' && signal.pattern) return `${signal.pattern.steps.length} repairs this year`
  if (id === 'energy-spike' && trigger && customer?.avgEnergyBill) {
    return `Energy bill +${Math.round((Math.abs(trigger.amount) / customer.avgEnergyBill - 1) * 100)}% vs your average`
  }
  if (id === 'new-home') return 'A new home this month'
  if (id === 'device-wear') return 'Light output −18% in 30 days'
  if (id.startsWith('campaign-')) return 'Same pattern as similar customers'
  if (product) return `Matches ${product.name}`
  return 'Kate noticed a pattern'
}

function lineOf(signal, product) {
  const id = signal.id ?? ''
  if (signal.itemKey) return 'Philips replaces it for free before it fails.'
  if (!product) return signal.headline
  const thing = product.name.toLowerCase()
  if (id === 'phone-repair') return 'Borrow a phone with free repairs included.'
  if (id === 'repeat-repair') return `Rent a ${thing} that is always fixed for you.`
  if (id === 'energy-spike') return 'Borrow efficient LED lighting, with no upfront cost.'
  if (id === 'new-home') return 'Furnish your new home the circular way.'
  return `Borrow a ${thing}, with repairs included.`
}

/**
 * Visual for a Kate signal (engine/signals.js): { kind, series, chip, insight, line, price, summary }.
 * kind: 'spend' (transactions) or 'device' (telemetry). series: { points, highlight, first, last }.
 */
export function tipVisual(signal, customer) {
  const product = signal.productId ? productById(signal.productId) : null
  const trigger = signal.triggeredBy
  const isSpend = signal.source === 'transacties' && trigger && typeof trigger.amount === 'number' && trigger.date
  const series = isSpend ? spendSeries(signal, customer, trigger) : deviceSeries(signal)
  const chip = isSpend ? euro(Math.abs(trigger.amount)) : '−18%'
  const insight = insightOf(signal, customer, isSpend ? trigger : null, product)
  const line = lineOf(signal, product)
  const price = product ? `${euro(product.monthly)} / month` : signal.itemKey ? 'Free' : null
  const pattern = isSpend ? `a payment of ${chip} on ${formatDate(trigger.date)}` : 'the light reports falling output'
  return {
    kind: isSpend ? 'spend' : 'device',
    series,
    chip,
    insight,
    line,
    price,
    summary: `Pattern: ${pattern}. Insight: ${insight}. Kate suggests: ${line}`,
  }
}

/** Visual for a tip derived from a product's estimated condition (web: tips when Kate has little else to say). */
export function conditionVisual({ id, condition, months, line, price = null }) {
  const insight = `In use for ${months} months`
  return {
    kind: 'condition',
    series: conditionSeries(id, condition),
    chip: `${condition}%`,
    insight,
    line,
    price,
    summary: `Pattern: estimated condition dropped to ${condition}%. Insight: ${insight}. Kate suggests: ${line}`,
  }
}
