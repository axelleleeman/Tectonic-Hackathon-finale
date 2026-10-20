// Signaalregels. Een nieuwe regel toevoegen = één object toevoegen aan deze lijst.
//
// Elke regel heeft:
//   id            unieke sleutel (ook gebruikt om "niet geïnteresseerd" te onthouden)
//   source        'transacties' of 'toestel' (telemetrie); bepaalt of toestemming nodig is
//   applies(ctx)  geldt de regel voor deze klant?
//   match(ctx)    geeft het bewijs terug (transactie of toestel), of null
//   services      bestaande KBC-diensten die het signaal leveren (data/kbcServices.js)
//   build(ctx, m) tekst en actie voor het Kate-inzicht
import { ENERGY_SPIKE_FACTOR, REPEAT_REPAIR, TODAY } from '../config/index.js'
import { spendSegments } from '../data/spendSegments.js'
import { productById } from './catalog.js'
import { euro, formatDate } from './format.js'

const findTx = (customer, ...categories) => customer.transactions.find((t) => categories.includes(t.category))

const DAY_MS = 24 * 60 * 60 * 1000
const daysAgo = (iso) => (new Date(`${TODAY}T12:00:00`) - new Date(`${iso}T12:00:00`)) / DAY_MS
const ORDINALS = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth']
const ordinal = (n) => ORDINALS[n] ?? `${n}th`
const ordinalShort = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

/**
 * Herhaalde herstellingen van hetzelfde toestel binnen het venster (REPEAT_REPAIR).
 * Geeft het toestel met de meeste herstellingen terug: { productId, repairs (oud → nieuw), total, latest }.
 */
export function repeatedRepairs(customer, borrowedIds = [], { threshold, windowDays } = REPEAT_REPAIR) {
  const recent = customer.transactions.filter((t) => t.category === 'herstelling' && t.appliance && daysAgo(t.date) <= windowDays)
  const byAppliance = new Map()
  for (const t of recent) byAppliance.set(t.appliance, [...(byAppliance.get(t.appliance) ?? []), t])
  let best = null
  for (const [productId, txs] of byAppliance) {
    const product = productById(productId)
    if (!product || !product.for.includes(customer.type) || borrowedIds.includes(productId) || txs.length < threshold) continue
    if (best && best.repairs.length >= txs.length) continue
    const repairs = [...txs].sort((a, b) => a.date.localeCompare(b.date))
    best = { productId, product, repairs, total: repairs.reduce((t, r) => t + Math.abs(r.amount), 0), latest: repairs.at(-1) }
  }
  return best
}

// Kate campaigns (KBC Loop Insights → Kate): which transactions show that a customer belongs to a segment.
// Segments are anonymous aggregates; for the demo a customer matches a segment when one of their own
// transactions shows the same pattern (a repair of the segment's product, or the segment's spending category).
const SEGMENT_CATEGORIES = {
  'seg-phone-repair': ['gsm-herstelling'],
  'seg-kmo-light': ['energie'],
}
export const campaignSignalId = (segmentId) => `campaign-${segmentId}`

/** Evidence (a transaction) that the customer belongs to this segment, or null. */
export function segmentEvidence(customer, segment) {
  if (!segment || segment.customerType !== customer.type) return null
  const categories = SEGMENT_CATEGORIES[segment.id] ?? []
  return customer.transactions.find((t) => categories.includes(t.category) || (t.category === 'herstelling' && t.appliance === segment.productId)) ?? null
}

/** The first running campaign this customer matches (and has not dismissed), with its segment and evidence. */
export function matchingCampaign({ customer, borrowedIds, campaigns = [], campaignDetails = {}, dismissed = [] }) {
  for (const segmentId of campaigns) {
    const details = campaignDetails[segmentId]
    if (details && details.status !== 'running') continue
    if (dismissed.includes(campaignSignalId(segmentId))) continue
    const segment = spendSegments.find((s) => s.id === segmentId)
    if (!segment || borrowedIds.includes(segment.productId) || !productById(segment.productId)) continue
    const tx = segmentEvidence(customer, segment)
    if (tx) return { ...tx, campaign: { segment, message: details?.message ?? '' } }
  }
  return null
}

export const rules = [
  {
    // A Kate campaign started from KBC Loop Insights reaches matching customers who gave consent.
    // The signal id is per campaign (campaign-<segmentId>), so "Not interested" hides only that campaign.
    id: 'campaign',
    source: 'transacties',
    services: ['kateInsights', 'psd2'],
    applies: ({ campaigns }) => campaigns.length > 0,
    match: (ctx) => matchingCampaign(ctx),
    build: (_ctx, tx) => {
      const { segment, message } = tx.campaign
      const product = productById(segment.productId)
      const thing = product.name.toLowerCase()
      const fallback = `Customers like you switch to renting a ${thing}: repairs are always included, for ${euro(product.monthly)} a month.`
      const text = message || fallback
      return {
        id: campaignSignalId(segment.id),
        productId: product.id,
        campaign: { segmentId: segment.id },
        headline: text,
        notification: { title: 'A tip from Kate', body: text },
        reasons: [
          `Payment of ${euro(Math.abs(tx.amount), 2)} to ${tx.merchant} on ${formatDate(tx.date)}.`,
          `KBC noticed this pattern among customers: ${segment.label.toLowerCase()}.`,
          'You gave permission to use your spending for personal suggestions.',
        ],
      }
    },
  },
  {
    // Pitch "Meet Sarah": KBC ziet het patroon nog voor de klant om hulp vraagt.
    id: 'repeat-repair',
    source: 'transacties',
    services: ['kateInsights', 'psd2'],
    applies: () => true,
    match: (ctx) => {
      const found = repeatedRepairs(ctx.customer, ctx.borrowedIds)
      // triggeredBy blijft een transactie (Home markeert die), het patroon gaat mee als extra veld.
      return found ? { ...found.latest, pattern: found } : null
    },
    build: ({ customer }, tx) => {
      const { product, repairs, total } = tx.pattern
      const n = repairs.length
      const thing = product.name.toLowerCase()
      return {
        productId: product.id,
        headline: `${ordinal(n)} repair this year, ${customer.name}? Rent a ${thing} that's always fixed for you.`,
        notification: {
          title: `${ordinal(n)} repair this year, ${customer.name}?`,
          body: `Rent a ${thing} that's always fixed for you: ${euro(product.monthly)} a month, paid from your KBC account.`,
        },
        pattern: {
          label: `${euro(total)} in repairs this year`,
          steps: repairs.map((r, i) => ({ id: r.id, label: i === n - 1 ? `${ordinalShort(n)} repair` : 'Repair', amount: Math.abs(r.amount), date: r.date, latest: i === n - 1 })),
          total,
        },
        reasons: [
          `${n} payments for repairing your ${thing} in the last 12 months: ${repairs.map((r) => euro(Math.abs(r.amount))).join(' + ')} = ${euro(total)}.`,
          `Last one: ${euro(Math.abs(tx.amount))} to ${tx.merchant} on ${formatDate(tx.date)}.`,
          `Renting costs ${euro(product.monthly)} a month. The producer stays the owner and repairs it: no calls, no bill.`,
          'You gave permission to use your spending for personal suggestions.',
        ],
      }
    },
  },
  {
    id: 'phone-repair',
    source: 'transacties',
    services: ['kateInsights', 'psd2'],
    applies: ({ customer, borrowedIds }) => customer.type === 'particulier' && !borrowedIds.includes('phone') && customer.phoneAgeMonths,
    match: ({ customer }) => findTx(customer, 'gsm-herstelling'),
    build: ({ customer }, tx) => ({
      productId: 'phone',
      headline: 'Your phone was just repaired. Why not borrow one that is always repaired for free?',
      reasons: [
        `Payment of ${euro(Math.abs(tx.amount), 2)} to ${tx.merchant} on ${formatDate(tx.date)}.`,
        `Your device is about ${customer.phoneAgeMonths} months old, so the risk of new defects is rising.`,
        'You agreed that your spending may be used for personal suggestions.',
      ],
    }),
  },
  {
    id: 'energy-spike',
    source: 'transacties',
    services: ['kateInsights', 'businessCo2'],
    applies: ({ customer, borrowedIds }) => customer.type === 'kmo' && !borrowedIds.includes('lamp-shop'),
    match: ({ customer }) => {
      const latest = findTx(customer, 'energie')
      return latest && Math.abs(latest.amount) > ENERGY_SPIKE_FACTOR * customer.avgEnergyBill ? latest : null
    },
    build: ({ customer }, tx) => ({
      productId: 'lamp-shop',
      headline: 'Your energy bill has risen sharply. Borrow energy-efficient Philips lighting, with no upfront investment.',
      reasons: [
        `Latest energy bill: ${euro(Math.abs(tx.amount))}, well above your average of ${euro(customer.avgEnergyBill)}.`,
        'Bakeries have long opening hours, so lighting is a large share of their consumption.',
        'You agreed that your business spending may be used for suggestions.',
      ],
    }),
  },
  {
    id: 'new-home',
    source: 'transacties',
    services: ['homeLoan', 'kateInsights'],
    applies: ({ customer, borrowedIds }) => Boolean(customer.homeLoanSince) && borrowedIds.length === 0,
    match: ({ customer }) => findTx(customer, 'notaris', 'verhuis'),
    build: ({ customer }, tx) => ({
      productId: 'bundle-home',
      headline: 'Congratulations on your new home! Furnish it the circular way: lighting, washing machine and fridge in one package.',
      reasons: [
        `Your KBC home loan started on ${formatDate(customer.homeLoanSince)}.`,
        `Payment to ${tx.merchant} on ${formatDate(tx.date)}.`,
        'A new home means many purchases at once; borrowing spreads the cost.',
      ],
    }),
  },
  {
    id: 'device-wear',
    source: 'toestel',
    services: ['partnerHub', 'webhooks'],
    applies: ({ telemetry }) => telemetry,
    match: ({ items }) => items.find((i) => i.productId.startsWith('lamp') && !i.returned && !i.repair) ?? null,
    build: (_ctx, item) => ({
      itemKey: item.key,
      headline: `Your Philips light in the ${item.room ?? 'shop'} is reporting wear. Philips will replace it for free before it fails.`,
      reasons: [
        'The light itself reports a falling light output (−18% in 30 days).',
        'That way it is replaced before you are left in the dark.',
        'Device data only goes to Philips for maintenance. KBC only sees the status of the repair.',
      ],
    }),
  },
]
