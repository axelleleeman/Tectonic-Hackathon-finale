// Small display helpers for the product and cost pages (English, locale-independent dates).
import { euro } from '@kbc-loop/shared/engine/format.js'
import { TODAY } from '@kbc-loop/shared/config/index.js'
import { shortDate } from '../model.js'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Euro amount; cents only when the amount has them. */
export const money = (n) => euro(n ?? 0, Number.isInteger(Math.round((n ?? 0) * 100) / 100) ? 0 : 2)

/** Signed difference, e.g. "+ €4" or "− €2". */
export const signedMoney = (n) => (n > 0 ? `+ ${money(n)}` : n < 0 ? `− ${money(-n)}` : 'No change')

export const date = (iso) => (iso ? shortDate(iso) : '—')

const toUtc = (iso) => new Date(`${iso}T12:00:00Z`)

/** "2026-10-22" → "Thu 22 Oct" */
export function dayLabel(iso) {
  const d = toUtc(iso)
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

export function addDays(iso, n) {
  const d = toUtc(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The next `count` weekdays, starting `from` days after today (fictional pickup and visit slots). */
export function nextWeekdays(count, from = 2, today = TODAY) {
  const out = []
  for (let n = from; out.length < count; n += 1) {
    const iso = addDays(today, n)
    const day = toUtc(iso).getUTCDay()
    if (day !== 0 && day !== 6) out.push(iso)
  }
  return out
}

export const months = (n) => `${n} ${n === 1 ? 'month' : 'months'}`

export const percent = (share) => `${Math.round((share ?? 0) * 100)}%`
