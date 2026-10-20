// Contract summary for the borrow flow (simulated; no real signing). Also builds the downloadable text copy.
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { secondLifeMonthly } from '../catalog/secondLife.js'
import { money, date } from '../product/format.js'

export const CANCELLATION = 'Cancel free of charge after the first 12 months, with one month notice. You can also take over the product at its residual value.'
export const INSURANCE = 'Damage and theft insurance via KBC, included in the monthly fee.'

/** Contract terms for a product (or bundle); `refurbished` uses the second-life fee. */
export function contractTerms(product, { refurbished = false } = {}) {
  const monthly = (refurbished && secondLifeMonthly(product)) || product.monthly
  return {
    reference: `KL-${product.id.toUpperCase()}-${TODAY.replaceAll('-', '')}`,
    product: refurbished ? `${product.name} (refurbished unit)` : product.name,
    monthly,
    term: `${product.termMonths} months`,
    included: product.includes ?? [],
    insurance: INSURANCE,
    cancellation: CANCELLATION,
    start: date(TODAY),
  }
}

/** Downloads a plain-text copy of the contract summary (Blob, no external libraries). */
export function downloadContract(terms, partnerName) {
  const lines = [
    'KBC LOOP · Borrow contract (summary)',
    `Reference: ${terms.reference}`,
    '',
    `Product: ${terms.product}`,
    `Partner (owner and repairer): ${partnerName}`,
    `Monthly fee: ${money(terms.monthly)}`,
    `Term: ${terms.term}`,
    `Start date: ${terms.start}`,
    '',
    'Included:',
    ...terms.included.map((x) => `  - ${x}`),
    '',
    `Insurance: ${terms.insurance}`,
    `Cancellation: ${terms.cancellation}`,
    '',
    'Confirmed with KBC Sign (simulated for this concept prototype).',
  ]
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${terms.reference}.txt`
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
