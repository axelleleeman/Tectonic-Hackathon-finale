// Zet regels om in Kate-inzichten voor één klant.
import { rules as defaultRules } from './rules.js'
import { kateLevelOf } from '../data/dataChoices.js'

// Kate level (state.dataPreferences[customerId].kateLevel): basic = no proactive signals at all (Kate only answers
// questions in the chat); proactive = every signal except partner campaigns; ecosystem = everything incl. campaigns.
const levelAllows = (level, rule) => level === 'ecosystem' || (level === 'proactive' && rule.id !== 'campaign')

/**
 * @param {object} customer
 * @param {{ consent: boolean, dismissed: string[], items: object[], telemetry?: boolean, campaigns?: string[], campaignDetails?: object, kateLevel?: string }} state
 *   campaigns/campaignDetails: running Kate campaigns from KBC Loop Insights (state.campaigns, state.campaignDetails)
 *   kateLevel: 'basic' | 'proactive' | 'ecosystem' (unknown or missing → 'proactive')
 * @returns {Array<{ id, source, triggeredBy, headline, reasons, productId?, itemKey? }>}
 */
export function detectSignals(customer, { consent, dismissed, items, telemetry = false, campaigns = [], campaignDetails = {}, kateLevel }, rules = defaultRules) {
  const level = kateLevelOf(kateLevel)
  const ctx = {
    customer,
    items,
    telemetry,
    dismissed,
    campaigns: Array.isArray(campaigns) ? campaigns : [],
    campaignDetails: campaignDetails ?? {},
    borrowedIds: items.filter((i) => !i.returned).map((i) => i.productId),
  }
  return rules
    // Transactiedata gebruiken we enkel met toestemming; toesteldata hoort bij het onderhoudscontract.
    .filter((r) => levelAllows(level, r) && (r.source !== 'transacties' || consent) && !dismissed.includes(r.id) && r.applies(ctx))
    .map((r) => {
      const evidence = r.match(ctx)
      return evidence ? { id: r.id, source: r.source, services: r.services ?? [], triggeredBy: evidence, ...r.build(ctx, evidence) } : null
    })
    .filter(Boolean)
}
