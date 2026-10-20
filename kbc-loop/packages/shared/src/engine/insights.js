// Logic for KBC Loop Insights: anonymised groups → recommendation of a rental product.
import { spendSegments } from '../data/index.js'
import { EXPECTED_CONVERSION, KBC_MARGIN_RATE, MIN_GROUP_SIZE } from '../config/index.js'
import { productById, partnerNames } from './catalog.js'

// Enriches one group with the recommended product and the expected result.
export function analyseSegment(seg) {
  const product = productById(seg.productId)
  const rentYearly = product.monthly * 12
  const reachable = Math.round((seg.customers * seg.consentPct) / 100)
  const expectedContracts = Math.round(reachable * EXPECTED_CONVERSION)
  const monthlyRevenue = expectedContracts * product.monthly
  return {
    ...seg,
    product,
    partner: partnerNames(product),
    rentYearly,
    savingYearly: seg.costYearly - rentYearly,
    reachable,
    expectedContracts,
    monthlyRevenue,
    kbcMarginMonthly: Math.round(monthlyRevenue * KBC_MARGIN_RATE),
    co2Tons: (expectedContracts * product.co2Kg) / 1000,
  }
}

// Groups for display: filtered, small groups hidden, sorted by potential.
export function insights({ kind = 'alle', customerType = 'alle' } = {}, segments = spendSegments) {
  const filtered = segments.filter((s) => (kind === 'alle' || s.kind === kind) && (customerType === 'alle' || s.customerType === customerType))
  const visible = filtered.filter((s) => s.customers >= MIN_GROUP_SIZE).map(analyseSegment)
  visible.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
  const sum = (key) => visible.reduce((t, s) => t + s[key], 0)
  return {
    segments: visible,
    hiddenCount: filtered.length - visible.length,
    totals: {
      customers: sum('customers'),
      reachable: sum('reachable'),
      expectedContracts: sum('expectedContracts'),
      monthlyRevenue: sum('monthlyRevenue'),
      kbcMarginMonthly: sum('kbcMarginMonthly'),
      co2Tons: sum('co2Tons'),
    },
  }
}
