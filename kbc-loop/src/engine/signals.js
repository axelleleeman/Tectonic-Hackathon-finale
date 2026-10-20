// Zet regels om in Kate-inzichten voor één klant.
import { rules as defaultRules } from './rules.js'

/**
 * @param {object} customer
 * @param {{ consent: boolean, dismissed: string[], items: object[], telemetry?: boolean }} state
 * @returns {Array<{ id, source, triggeredBy, headline, reasons, productId?, itemKey? }>}
 */
export function detectSignals(customer, { consent, dismissed, items, telemetry = false }, rules = defaultRules) {
  const ctx = {
    customer,
    items,
    telemetry,
    borrowedIds: items.filter((i) => !i.returned).map((i) => i.productId),
  }
  return rules
    // Transactiedata gebruiken we enkel met toestemming; toesteldata hoort bij het onderhoudscontract.
    .filter((r) => (r.source !== 'transacties' || consent) && !dismissed.includes(r.id) && r.applies(ctx))
    .map((r) => {
      const evidence = r.match(ctx)
      return evidence ? { id: r.id, source: r.source, services: r.services ?? [], triggeredBy: evidence, ...r.build(ctx, evidence) } : null
    })
    .filter(Boolean)
}
