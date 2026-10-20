// Partner portal model: open repair tickets and KPIs for one partner, across all customers in the shared state.
// Live figures are added on top of a small fictional pilot base, so the portal never looks empty.
import * as data from '@kbc-loop/shared/data/index.js'
import { productById } from '@kbc-loop/shared/engine/catalog.js'

/** Partner flow on a ticket, in order (statuses of PARTNER_UPDATE_REPAIR). */
export const TICKET_FLOW = [
  { status: 'scheduled', action: 'Schedule', label: 'Scheduled' },
  { status: 'on-the-way', action: 'On the way', label: 'On the way' },
  { status: 'in-progress', action: 'In progress', label: 'In progress' },
  { status: 'repaired', action: 'Repaired', label: 'Repaired' },
]

const { customers, partners, partnerPilot, products } = data

export const partnerList = Object.values(partners)

/** Partner profile (about, highlight, repairSlaHours, …) when the shared data provides it, otherwise null. */
export const profileOf = (partnerId) => (typeof data.partnerProfile === 'function' ? data.partnerProfile(partnerId) ?? null : null)

// Small deterministic number per partner id (pilot base for partners without pilot figures)
const seed = (id) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7)

function itemsOfPartner(state, partnerId) {
  return Object.entries(state?.items ?? {}).flatMap(([customerId, items]) => {
    const customer = customers.find((c) => c.id === customerId)
    return (items ?? []).map((item) => ({ item, customer, product: productById(item.productId) }))
      .filter((x) => x.customer && x.product?.partnerId === partnerId)
  })
}

/** Status of a ticket: the partner's own status, or derived from the customer's repair step. */
function ticketStatus(repair) {
  if (repair.partnerStatus) return repair.partnerStatus
  return repair.step >= 3 ? 'repaired' : repair.step === 2 ? 'scheduled' : 'new'
}

/** Open tickets (repair set) for this partner, newest customers' tickets first. */
export function partnerTickets(state, partnerId) {
  return itemsOfPartner(state, partnerId)
    .filter(({ item }) => item.repair && !item.returned)
    .map(({ item, customer, product }) => ({
      key: item.key,
      customerId: customer.id,
      firstName: customer.name,
      product: product.name,
      productId: product.id,
      issue: item.repair.issue,
      note: item.repair.note ?? null,
      photo: item.repair.photo === true,
      preventive: item.repair.preventive === true,
      step: item.repair.step ?? 1,
      status: ticketStatus(item.repair),
      updatedOn: item.repair.updatedOn ?? null,
    }))
}

/** KPIs for the partner portal. */
export function partnerKpis(state, partnerId, tickets) {
  const mine = itemsOfPartner(state, partnerId)
  const pilot = partnerPilot[partnerId]
  const s = seed(partnerId)
  const inField = mine.filter(({ item }) => !item.returned).length
  const secondLife = mine.filter(({ item }) => item.returned).length
  return {
    open: tickets.filter((t) => t.status !== 'repaired').length,
    avgRepairDays: Math.round((1.4 + (s % 15) / 10) * 10) / 10,
    inField: (pilot?.activeContracts ?? 120 + (s % 400)) + inField,
    secondLife: 40 + (s % 160) + secondLife,
  }
}

/** Products of this partner that are out with customers: live contracts plus the pilot base, spread deterministically. */
export function partnerFleet(state, partnerId, inFieldTotal) {
  const own = products.filter((p) => p.partnerId === partnerId)
  if (own.length === 0) return []
  const live = itemsOfPartner(state, partnerId).filter(({ item }) => !item.returned)
  const liveCount = (id) => live.filter(({ product }) => product.id === id).length
  const base = Math.max(0, inFieldTotal - live.length)
  const weights = own.map((p) => 2 + (seed(p.id) % 5))
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const shares = weights.map((w) => Math.floor((base * w) / totalWeight))
  shares[weights.indexOf(Math.max(...weights))] += base - shares.reduce((a, b) => a + b, 0)
  return own
    .map((p, i) => ({ id: p.id, product: p, count: shares[i] + liveCount(p.id), live: liveCount(p.id) }))
    .sort((a, b) => b.count - a.count)
}

/** Where returned units go: refurbished and placed again, harvested for parts, or recycled (refurbish rate from the profile when known). */
export function secondLifeSplit(total, refurbishRate) {
  const refurbishedPct = refurbishRate > 0 ? refurbishRate : 60
  const refurbished = Math.round((total * refurbishedPct) / 100)
  const parts = Math.round((total - refurbished) * 0.65)
  return [
    { id: 'refurbished', label: 'Refurbished and placed again', count: refurbished },
    { id: 'parts', label: 'Harvested for spare parts', count: parts },
    { id: 'recycled', label: 'Recycled materials', count: total - refurbished - parts },
  ]
}

/** Deterministic mini trend that ends at `value` (decorative sparkline next to a KPI). */
export function kpiTrend(key, value, pct, n = 8) {
  const h = seed(key)
  const start = value / (1 + pct / 100)
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? value
    : Math.max(0, (start + ((value - start) * i) / (n - 1)) * (1 + (((h * (i + 3)) % 7) - 3) / 100))))
}
