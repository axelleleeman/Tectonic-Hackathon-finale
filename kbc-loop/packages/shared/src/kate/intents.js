// Recognises simple questions to Kate with keywords (in production this would be a language model).
// English phrases first; the Dutch matchIntent stays as a fallback until the translation pass replaces it.
import { matchIntent } from '../engine/kateIntents.js'

/** Every intent Kate understands. */
export const INTENTS = ['capabilities', 'defect', 'tip', 'overview']

const englishIntents = [
  ['capabilities', /what can you|what do you do|wat kun je|wat kan je|help/i],
  ['defect', /broken|defect|flicker|not working|repair|doesn.t work/i],
  ['overview', /what am i borrowing|what do i borrow|my loop|subscription|overview/i],
  ['tip', /tip|advice|save money|suggest/i],
]

/**
 * @param {string} text the user's question
 * @returns {'capabilities' | 'defect' | 'tip' | 'overview' | null}
 */
export function detectIntent(text) {
  const t = String(text ?? '').trim()
  if (!t) return null
  return englishIntents.find(([, re]) => re.test(t))?.[0] ?? matchIntent(t)
}
