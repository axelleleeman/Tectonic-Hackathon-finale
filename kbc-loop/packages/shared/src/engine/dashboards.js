// Cijfers voor het partner- en KBC-dashboard: pilotbasis + live demo-acties.
import { customers, partnerPilot, kbcPilot } from '../data/index.js'
import { KBC_MARGIN_RATE, TODAY } from '../config/index.js'
import { productById } from './catalog.js'

function allItems(itemsByCustomer) {
  return Object.entries(itemsByCustomer).flatMap(([cid, items]) => {
    const customer = customers.find((c) => c.id === cid)
    return items.map((i) => ({ ...i, customer, product: productById(i.productId) }))
  })
}

/** Nieuwe items = alles wat tijdens de demo is bijgekomen (initiële items zitten al in de pilotbasis). */
const isNew = (i) => i.since >= TODAY

export function partnerStats(partnerId, itemsByCustomer, telemetryByCustomer) {
  const base = partnerPilot[partnerId]
  const mine = allItems(itemsByCustomer).filter((i) => i.product.partnerId === partnerId)
  const fresh = mine.filter(isNew)
  const liveRepairs = mine
    .filter((i) => i.repair && i.repair.step < 3)
    .map((i) => ({ customer: i.customer.fullName, issue: i.repair.issue, status: i.repair.step === 1 ? 'New · to be scheduled' : 'Scheduled', live: true }))
  const liveAlerts = Object.values(telemetryByCustomer).filter(Boolean).length
  return {
    activeContracts: base.activeContracts + fresh.length,
    monthlyRevenue: base.monthlyRevenue + fresh.reduce((s, i) => s + i.product.monthly, 0),
    predictedFailures: base.predictedFailures + liveAlerts,
    lifetimeYears: base.lifetimeYears,
    reusedComponentsPct: base.reusedComponentsPct,
    repairs: [...liveRepairs, ...base.openRepairs],
  }
}

export function kbcStats(itemsByCustomer) {
  const fresh = allItems(itemsByCustomer).filter(isNew)
  const newCustomers = new Set(fresh.map((i) => i.customer.id)).size
  const monthlyFees = kbcPilot.monthlyFees + fresh.reduce((s, i) => s + i.product.monthly, 0)
  return {
    customers: kbcPilot.customers + newCustomers,
    financedVolume: kbcPilot.financedVolume + fresh.reduce((s, i) => s + i.product.buyPrice, 0),
    monthlyMargin: Math.round(monthlyFees * KBC_MARGIN_RATE),
    co2Tons: kbcPilot.co2Tons + fresh.reduce((s, i) => s + i.product.co2Kg, 0) / 1000,
    partners: kbcPilot.partners,
    conversionPct: kbcPilot.conversionPct,
    insuredPct: kbcPilot.insuredPct,
    byCategory: kbcPilot.byCategory,
    newContracts: fresh.length,
  }
}
