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

export const rules = [
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
      headline: 'Je gsm kreeg net een herstelling. Leen er een die altijd gratis hersteld wordt?',
      reasons: [
        `Betaling van ${euro(Math.abs(tx.amount), 2)} aan ${tx.merchant} op ${formatDate(tx.date)}.`,
        `Je toestel is ongeveer ${customer.phoneAgeMonths} maanden oud: de kans op nieuwe defecten stijgt.`,
        'Je gaf toestemming om je uitgaven te gebruiken voor persoonlijke voorstellen.',
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
      headline: 'Je energiefactuur is fors gestegen. Leen zuinige verlichting van Philips, zonder investering.',
      reasons: [
        `Laatste energiefactuur: ${euro(Math.abs(tx.amount))}, ruim boven je gemiddelde van ${euro(customer.avgEnergyBill)}.`,
        'Bakkerijen hebben lange openingsuren: verlichting is een groot deel van het verbruik.',
        'Je gaf toestemming om je zakelijke uitgaven te gebruiken voor voorstellen.',
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
      headline: 'Proficiat met je nieuwe huis! Richt het circulair in: verlichting, wasmachine en koelkast in één pakket.',
      reasons: [
        `Je woonkrediet bij KBC startte op ${formatDate(customer.homeLoanSince)}.`,
        `Betaling aan ${tx.merchant} op ${formatDate(tx.date)}.`,
        'Een nieuwe woning betekent veel aankopen tegelijk: lenen spreidt de kost.',
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
      headline: `Je Philips-lamp in de ${item.room ?? 'winkel'} meldt slijtage. Philips vervangt ze gratis, nog voor ze uitvalt.`,
      reasons: [
        'De lamp meldt zelf een dalende lichtopbrengst (−18% in 30 dagen).',
        'Zo wordt ze vervangen voor je in het donker zit.',
        'Toesteldata gaat enkel naar Philips voor onderhoud. KBC ziet alleen de status van de herstelling.',
      ],
    }),
  },
]
