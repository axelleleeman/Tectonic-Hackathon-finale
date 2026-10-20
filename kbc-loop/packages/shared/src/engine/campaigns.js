// Kate campaigns in KBC Loop Insights: audience size, budget, forecast and simulated live results.
// Pure and deterministic: the same segment, campaign settings and date always give the same numbers.
// `segment` is an analysed group from engine/insights.js (with reachable, product, …).
import { EXPECTED_CONVERSION, KBC_MARGIN_RATE } from '../config/index.js'

export const AUDIENCES = ['consented', 'consented-active']
export const MAX_MESSAGE_LENGTH = 280

/** Cost of delivering one Kate insight (€), used to turn a budget into a reach. */
export const COST_PER_CUSTOMER = 0.25
export const BUDGET_STEP = 250
export const MIN_BUDGET = 250

// Share of consented customers that used KBC Mobile in the last 30 days, and how each audience responds.
const ACTIVE_SHARE = 0.6
const RATES = {
  consented: { open: 0.62, click: 0.42, convert: EXPECTED_CONVERSION },
  'consented-active': { open: 0.78, click: 0.48, convert: EXPECTED_CONVERSION * 1.25 },
}
// Days for each step of the funnel to build up (larger = slower): delivery is fast, contracts take longer.
const PACE = { reached: 2, opened: 3, clicked: 4, contracts: 8 }

const DAY_MS = 24 * 60 * 60 * 1000
const toUtc = (iso) => {
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

/** Whole days from `from` to `to` (ISO dates), never negative. */
export function daysBetween(from, to) {
  const diff = Math.round((toUtc(to) - toUtc(from)) / DAY_MS)
  return Number.isFinite(diff) ? Math.max(0, diff) : 0
}

/** ISO date `days` after `iso`. */
export function addDays(iso, days) {
  return new Date(toUtc(iso) + days * DAY_MS).toISOString().slice(0, 10)
}

/** Number of customers in the chosen audience (always consented; optionally only active ones). */
export function audienceSize(segment, audience = 'consented') {
  return audience === 'consented-active' ? Math.round(segment.reachable * ACTIVE_SHARE) : segment.reachable
}

/** Budget that reaches the whole audience, rounded up to the budget step. */
export function suggestedBudget(segment, audience = 'consented') {
  return Math.max(MIN_BUDGET, Math.ceil((audienceSize(segment, audience) * COST_PER_CUSTOMER) / BUDGET_STEP) * BUDGET_STEP)
}

/** Range for the budget slider: from the minimum to a full-reach budget for all consented customers. */
export function budgetRange(segment) {
  return { min: MIN_BUDGET, max: suggestedBudget(segment, 'consented'), step: BUDGET_STEP }
}

/** Customers the campaign will reach: the audience, capped by what the budget pays for. */
export function campaignTarget(segment, { audience = 'consented', budget } = {}) {
  const size = audienceSize(segment, audience)
  const affordable = Number.isFinite(budget) ? Math.floor(Math.max(0, budget) / COST_PER_CUSTOMER) : size
  return Math.min(size, affordable)
}

const outcome = (segment, contracts) => {
  const monthlyRevenue = contracts * segment.product.monthly
  return {
    contracts,
    monthlyRevenue,
    kbcMarginMonthly: Math.round(monthlyRevenue * KBC_MARGIN_RATE),
    co2Tons: (contracts * segment.product.co2Kg) / 1000,
  }
}

/** Expected end result of a campaign with these settings (before it starts). */
export function campaignForecast(segment, settings = {}) {
  const rates = RATES[settings.audience] ?? RATES.consented
  const target = campaignTarget(segment, settings)
  const opened = Math.round(target * rates.open)
  const clicked = Math.round(opened * rates.click)
  return {
    audience: audienceSize(segment, settings.audience),
    target,
    cost: Math.round(target * COST_PER_CUSTOMER),
    opened,
    clicked,
    ...outcome(segment, Math.min(clicked, Math.round(target * rates.convert))),
  }
}

// Share of the final value reached after `days` full days (day 0 = start day).
const progress = (days, pace) => 1 - Math.exp(-(days + 1) / pace)

/**
 * Simulated live results of a campaign on `today` (ISO date).
 * `detail` = state.campaignDetails[segmentId]: { audience, budget, startedOn, status, stoppedOn? }.
 * A stopped campaign is frozen at the day it was stopped (or today when that date is unknown).
 */
export function campaignResults(segment, detail, today) {
  const final = campaignForecast(segment, detail)
  const end = detail.status === 'stopped' && detail.stoppedOn ? detail.stoppedOn : today
  const day = daysBetween(detail.startedOn ?? today, end)
  const at = (key, value = final[key]) => Math.round(value * progress(day, PACE[key]))
  const reached = at('reached', final.target)
  const opened = Math.min(reached, at('opened'))
  const clicked = Math.min(opened, at('clicked'))
  const contracts = Math.min(clicked, at('contracts'))
  return {
    day,
    status: detail.status ?? 'running',
    target: final.target,
    reached,
    reachedPct: final.target ? Math.round((reached / final.target) * 100) : 0,
    opened,
    openRate: reached ? Math.round((opened / reached) * 100) : 0,
    clicked,
    clickRate: opened ? Math.round((clicked / opened) * 100) : 0,
    spent: Math.min(detail.budget ?? final.cost, Math.round(reached * COST_PER_CUSTOMER)),
    forecast: final,
    ...outcome(segment, contracts),
  }
}
