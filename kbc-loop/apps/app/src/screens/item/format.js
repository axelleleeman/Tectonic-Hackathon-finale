// Formatting for the product and cost screens: dates in English ("22 Oct 2026"), amounts in the Belgian
// format of the shared engine ("€ 6", "€ 165,90", "€ 1.234").
import { TECHNICIAN_SLOT, TODAY } from '@kbc-loop/shared/config/index.js'
import { euro } from '@kbc-loop/shared/engine/format.js'

const toDate = (iso) => new Date(`${iso}T12:00:00`)

/** "22 Oct 2026" (or "22 Oct" with withYear: false). */
export function dateText(iso, { withYear = true, weekday = false } = {}) {
  if (!iso) return '–'
  return toDate(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}), ...(weekday ? { weekday: 'short' } : {}),
  })
}

/** "€ 6" for whole amounts, "€ 6,50" otherwise (Belgian format, thousands with a dot). */
export function money(n) {
  const value = Number(n) || 0
  const whole = Math.abs(value % 1) < 0.005 || Math.abs(value % 1) > 0.995
  return `${value < 0 ? '−' : ''}${euro(Math.abs(value), whole ? 0 : 2)}`
}

/** "+ € 4" / "− € 2" / "€ 0" for a monthly difference. */
export function signedMoney(n) {
  if (!n) return '€ 0'
  return `${n > 0 ? '+' : '−'} ${money(Math.abs(n))}`
}

export function addDays(iso, days) {
  const d = toDate(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const today = TODAY

// The shared technician slot was written in Dutch ("do 22 okt, 9–12 u"); show it in English.
export const technicianSlot = /\bokt\b|\bu$/.test(TECHNICIAN_SLOT) ? 'Thu 22 Oct, 9 am – 12 pm' : TECHNICIAN_SLOT

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
