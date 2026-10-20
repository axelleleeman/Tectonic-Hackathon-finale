// Cost overview for borrowed items: what the customer pays, what is left and where the money goes.
// Pure and deterministic: pass `today` (ISO date) for reproducible results. Amounts in EUR.
import { KBC_MARGIN_RATE, TODAY } from '../config/index.js'
import { categoryOf, partnerOf, productById } from './catalog.js'
import { costs } from './pricing.js'

export const UPCOMING_MONTHS = 6

const cents = (n) => Math.round(n * 100)
const euros = (c) => c / 100
const round2 = (n) => euros(cents(n))

// ── Dates (ISO 'YYYY-MM-DD', calculated in UTC) ────────────────────────────────────────────
function parseIso(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''))
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : null
}
const toIso = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10)

/** Date `n` months after `iso`, day clamped to the end of the month. */
export function addMonths(iso, n) {
  const { y, m, d } = parseIso(iso)
  const lastDay = new Date(Date.UTC(y, m - 1 + n + 1, 0)).getUTCDate()
  return toIso(y, m + n, Math.min(d, lastDay))
}

/** Whole months between two ISO dates (0 when `to` is before `from`). */
export function monthsBetween(fromIso, toIso_) {
  const a = parseIso(fromIso)
  const b = parseIso(toIso_)
  if (!a || !b) return 0
  const months = (b.y - a.y) * 12 + (b.m - a.m) - (b.d < a.d ? 1 : 0)
  return Math.max(0, months)
}

/** First day of the month after `iso`. */
export function firstOfNextMonth(iso) {
  const { y, m } = parseIso(iso)
  return toIso(y, m + 1, 1)
}

// ── Per item ───────────────────────────────────────────────────────────────────────────────

/** Monthly fee split into partner, insurance and KBC parts; the parts always add up to `monthly`. */
export function splitMonthly(product) {
  const total = cents(product.monthly)
  const insurance = Math.min(total, cents(product.insuranceMonthly ?? 0))
  const kbc = Math.min(total - insurance, cents(product.monthly * KBC_MARGIN_RATE))
  return { partner: euros(total - insurance - kbc), insurance: euros(insurance), kbc: euros(kbc) }
}

const statusOf = (item) => (item.returned ? 'returned' : item.repair ? 'repair' : 'active')

/**
 * Costs of one borrowed item.
 * @returns {object|null} null when the product no longer exists in the catalogue
 */
export function itemCosts(item, today = TODAY) {
  const product = productById(item?.productId)
  if (!product || product.isBundle || !parseIso(item.since)) return null
  const termMonths = product.termMonths
  const stoppedOn = item.returned && parseIso(item.returnedOn) ? item.returnedOn : today
  const monthsActive = Math.min(monthsBetween(item.since, stoppedOn), termMonths)
  const pricing = costs(product)
  const status = statusOf(item)
  return {
    itemKey: item.key,
    productId: product.id,
    name: product.name,
    partnerName: partnerOf(product)?.name ?? '',
    categoryId: categoryOf(product)?.id ?? null,
    monthly: product.monthly,
    since: item.since,
    monthsActive,
    paidToDate: round2(monthsActive * product.monthly),
    termMonths,
    endDate: addMonths(item.since, termMonths),
    remainingMonths: status === 'returned' ? 0 : termMonths - monthsActive,
    nextPaymentDate: status === 'returned' || monthsActive >= termMonths ? null : firstOfNextMonth(today),
    split: splitMonthly(product),
    buyEquivalent: pricing.buy,
    savingVsBuying: pricing.saving,
    status,
  }
}

// ── Overview ───────────────────────────────────────────────────────────────────────────────

const isPaying = (c) => c.status !== 'returned' && c.remainingMonths > 0

/**
 * Overview of all items of one customer.
 * Totals (monthly, saving, categories, upcoming) only count items that are still running;
 * paidToDate includes returned items.
 */
export function costOverview(items, today = TODAY) {
  const all = (items ?? []).map((i) => itemCosts(i, today)).filter(Boolean)
  const running = all.filter(isPaying)
  const monthlyTotal = euros(running.reduce((s, c) => s + cents(c.monthly), 0))

  const byId = new Map()
  for (const c of running) byId.set(c.categoryId, (byId.get(c.categoryId) ?? 0) + cents(c.monthly))
  const byCategory = [...byId].map(([categoryId, total]) => {
    const name = categoryOf(productById(running.find((c) => c.categoryId === categoryId).productId))?.name ?? ''
    return { categoryId, name, monthly: euros(total), share: monthlyTotal ? Math.round((euros(total) / monthlyTotal) * 1000) / 10 : 0 }
  }).sort((a, b) => b.monthly - a.monthly)

  const nextPaymentDate = firstOfNextMonth(today)
  const upcoming = Array.from({ length: UPCOMING_MONTHS }, (_, n) => {
    const date = addMonths(nextPaymentDate, n)
    const amount = running.filter((c) => date < c.endDate).reduce((s, c) => s + cents(c.monthly), 0)
    return { date, amount: euros(amount) }
  })

  return {
    monthlyTotal,
    paidToDate: euros(all.reduce((s, c) => s + cents(c.paidToDate), 0)),
    nextPaymentDate: running.length ? nextPaymentDate : null,
    savingVsBuying: round2(running.reduce((s, c) => s + c.savingVsBuying, 0)),
    byCategory,
    items: [...all.filter((c) => c.status !== 'returned'), ...all.filter((c) => c.status === 'returned')],
    upcoming,
  }
}
