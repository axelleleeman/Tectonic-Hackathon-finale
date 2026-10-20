// Labels and small helpers for the Insights UI (no React).
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { MAX_MESSAGE_LENGTH, addDays, suggestedBudget } from '@kbc-loop/shared/engine/campaigns.js'

export const KIND_LABEL = { herstelling: 'Repairs', herhaalaankoop: 'Repeat purchases' }
export const TYPE_LABEL = { particulier: 'Private', kmo: 'SME' }
export const AUDIENCE_LABEL = { consented: 'All consented customers', 'consented-active': 'Consented and active in KBC Mobile' }

/** Whole euros: monthly sums of products with cents are shown rounded. */
export const eur = (n) => euro(Math.round(n))
const article = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a')

export const groupMeta = (s) => `${KIND_LABEL[s.kind] ?? s.kind} · ${TYPE_LABEL[s.customerType] ?? s.customerType}`

/** Suggested Kate message for a group, as the customer would read it (max 280 characters). */
export function defaultMessage(s) {
  const text = `You paid for "${s.label.toLowerCase()}" a few times this year. With KBC Loop you can rent ${article(s.product.name)} ${s.product.name.toLowerCase()} from ${s.partner} for ${euro(s.product.monthly)} a month, with repairs, maintenance and insurance included.`
  return text.slice(0, MAX_MESSAGE_LENGTH)
}

/** Fresh wizard settings for a group. */
export function draftFor(s) {
  return { segmentId: s.id, audience: 'consented', budget: suggestedBudget(s, 'consented'), message: defaultMessage(s) }
}

/**
 * Campaign details with sensible values, also for campaigns started via the older TOGGLE_CAMPAIGN
 * (no budget or message) or before campaignDetails existed.
 */
export function resolveDetail(s, detail, running) {
  const audience = detail?.audience ?? 'consented'
  return {
    segmentId: s.id,
    channel: 'kate',
    startedOn: detail?.startedOn ?? TODAY,
    status: running ? 'running' : (detail?.status ?? 'stopped'),
    audience,
    budget: detail?.budget > 0 ? detail.budget : suggestedBudget(s, audience),
    message: detail?.message || defaultMessage(s),
  }
}

/** Campaigns in state: running ones (state.campaigns) first, then stopped ones from campaignDetails. */
export function campaignList(state) {
  const running = state.campaigns ?? []
  const stopped = Object.values(state.campaignDetails ?? {})
    .filter((d) => d?.status === 'stopped' && !running.includes(d.segmentId))
    .map((d) => d.segmentId)
  return { running, stopped }
}

/** Demo clock: results are shown for the start day, or fast-forwarded to preview how a campaign develops. */
export const SIM_DAYS = [[0, 'Today'], [7, 'In 1 week'], [30, 'In 1 month']]
export const simDate = (offset) => addDays(TODAY, offset)
export { TODAY }
