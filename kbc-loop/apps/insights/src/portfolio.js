// Portfolio figures for the management cockpit (no React): pilot baseline from the shared data plus
// the live shared state (items, repairs, Kate Coins). Everything is deterministic, so every render,
// screenshot and demo run shows the same numbers for the same state.
import { kbcPilot, partnerPilot, partners } from '@kbc-loop/shared/data/index.js'
import { partnerProfile } from '@kbc-loop/shared/data/partnerProfiles.js'
import { categories } from '@kbc-loop/shared/data/categories.js'
import { productById, categoryOf } from '@kbc-loop/shared/engine/catalog.js'
import { kbcStats } from '@kbc-loop/shared/engine/dashboards.js'
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { trendSeries } from './model.js'

/** Every live item with its product, across all demo customers. Unknown products are skipped. */
export function liveItems(state) {
  return Object.entries(state.items ?? {}).flatMap(([customerId, items]) => (items ?? [])
    .map((i) => ({ ...i, customerId, product: productById(i.productId) }))
    .filter((i) => i.product))
}

const isOpenRepair = (i) => Boolean(i.repair) && !i.returned && (i.repair.step ?? 1) < 3

/** Headline portfolio: pilot baseline plus whatever happened live in the demo. */
export function portfolio(state) {
  const items = liveItems(state)
  const active = items.filter((i) => !i.returned)
  const fresh = items.filter((i) => i.since >= TODAY)
  const kbc = kbcStats(state.items ?? {})
  const mrr = kbcPilot.monthlyFees + fresh.reduce((s, i) => s + i.product.monthly, 0)
  // Average fee of the products in use converts revenue into an (illustrative) number of active contracts.
  const avgFee = active.length ? active.reduce((s, i) => s + i.product.monthly, 0) / active.length : 30
  return {
    customers: kbc.customers,
    productsInUse: active.length,
    returned: items.length - active.length,
    mrr,
    activeContracts: Math.round(mrr / avgFee),
    openRepairs: items.filter(isOpenRepair).length,
    repairsClosed: items.reduce((s, i) => s + (i.repairs ?? 0), 0),
    coinsIssued: Object.values(state.coins ?? {}).reduce((s, n) => s + (n ?? 0), 0),
    co2Tons: kbc.co2Tons,
    newContracts: kbc.newContracts,
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Labels of the last `n` months, ending with the current month of the demo clock. */
export function monthLabels(n = 12, today = TODAY) {
  const [y, m] = today.split('-').map(Number)
  return Array.from({ length: n }, (_, i) => {
    const k = m - 1 - (n - 1 - i)
    const month = ((k % 12) + 12) % 12
    const year = y + Math.floor(k / 12)
    return { short: MONTHS[month], long: `${MONTHS[month]} ${year}` }
  })
}

/** Illustrative 12-month trend that ends at today's value and starts `growthPct` % lower. */
export function illustrativeTrend(seed, value, growthPct, n = 12) {
  const labels = monthLabels(n)
  return trendSeries(seed, value, growthPct, n).map((v, i) => ({ label: labels[i], value: Math.round(v) }))
}

/** Potential (from the insight groups) and active contracts (live state) per category. */
export function byCategory(segments, state) {
  const rows = categories.map((c) => ({ id: c.id, label: c.name, potential: 0, groups: 0, active: 0 }))
  const find = (product) => rows.find((r) => r.id === categoryOf(product)?.id)
  for (const s of segments) {
    const product = productById(s.productId ?? s.product?.id)
    const row = product && find(product)
    if (row) { row.potential += s.monthlyRevenue; row.groups += 1 }
  }
  for (const i of liveItems(state)) {
    const row = !i.returned && find(i.product)
    if (row) row.active += 1
  }
  return rows.filter((r) => r.potential > 0 || r.active > 0).sort((a, b) => b.potential - a.potential)
}

/**
 * Partner performance: products in the field and open repairs from the live state (plus the pilot
 * baseline where one exists), repair time and refurbish rate from the partner profile, and the
 * contracts the insight groups expect for that partner.
 */
export function partnerRows(segments, state) {
  const items = liveItems(state)
  const ids = new Set([
    ...items.map((i) => i.product.partnerId ?? i.product.partnerIds?.[0]),
    ...segments.map((s) => s.product?.partnerId),
  ].filter((id) => partners[id]))
  return [...ids].map((id) => {
    const mine = items.filter((i) => (i.product.partnerId ?? i.product.partnerIds?.[0]) === id)
    const pilot = partnerPilot[id]
    const profile = partnerProfile(id)
    const category = categories.find((c) => c.id === partners[id].category)
    return {
      id,
      name: partners[id].name,
      category: category?.name ?? '',
      inField: mine.filter((i) => !i.returned).length + (pilot?.activeContracts ?? 0),
      openRepairs: mine.filter(isOpenRepair).length + (pilot?.openRepairs?.length ?? 0),
      repairHours: profile.repairSlaHours,
      refurbishRate: profile.refurbishRate,
      potential: segments.filter((s) => s.product?.partnerId === id).reduce((sum, s) => sum + s.expectedContracts, 0),
    }
  })
}
