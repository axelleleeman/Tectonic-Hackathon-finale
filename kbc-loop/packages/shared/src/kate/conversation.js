// Kate's conversation engine: pure functions, no React and no side effects.
// The app and the web render the replies and execute the returned action descriptors themselves.
import { detectIntent } from './intents.js'
import { CHIP_LABELS, KATE_TEXT } from './texts.js'

/** How long a UI shows Kate's short reply before executing a navigation action. */
export const REPLY_BEFORE_ACTION_MS = 600

/**
 * @typedef {{ type: 'navigate', screen: 'repair' | 'product' | 'overview', params: object }} KateAction
 * @typedef {{ reply: string, action?: KateAction }} KateResponse
 * @typedef {{ id: string, label: string, intent?: string, disabled?: boolean }} KateChip
 */

/** The first borrowed item that can still be sent for repair, and the first signal with a product tip. */
export function conversationContext({ items = [], signals = [] } = {}) {
  return {
    fixable: items.find((i) => !i.returned && !i.repair) ?? null,
    tip: signals.find((s) => s.productId) ?? null,
  }
}

export function greeting(customer) {
  const name = customer?.name ? ` ${customer.name}` : ''
  return `Hi${name}. 👋 Kate here, how can I help?`
}

export const voiceNotAvailableReply = () => KATE_TEXT.noVoice
export const capabilitiesReply = () => KATE_TEXT.capabilities
export const unknownReply = () => KATE_TEXT.unknown

/** Suggestion chips below Kate's greeting. "Call KBC Live" is shown but not interactive in the demo. */
export function suggestions({ items, signals } = {}) {
  const { fixable, tip } = conversationContext({ items, signals })
  return [
    { id: 'call-live', label: CHIP_LABELS.callLive, disabled: true },
    { id: 'capabilities', label: CHIP_LABELS.capabilities, intent: 'capabilities' },
    fixable && { id: 'defect', label: CHIP_LABELS.defect, intent: 'defect' },
    tip && { id: 'tip', label: CHIP_LABELS.tip, intent: 'tip' },
    { id: 'overview', label: CHIP_LABELS.overview, intent: 'overview' },
  ].filter(Boolean)
}

const navigate = (screen, params = {}) => ({ type: 'navigate', screen, params })

const answers = {
  capabilities: () => ({ reply: KATE_TEXT.capabilities }),
  defect: ({ fixable }) => (fixable
    ? { reply: KATE_TEXT.openingRepair, action: navigate('repair', { itemKey: fixable.key }) }
    : { reply: KATE_TEXT.nothingToRepair }),
  tip: ({ tip }) => (tip
    ? { reply: KATE_TEXT.tipFound, action: navigate('product', { productId: tip.productId, signalId: tip.id }) }
    : { reply: KATE_TEXT.noTip }),
  overview: () => ({ reply: KATE_TEXT.overview, action: navigate('overview') }),
}

/**
 * Kate's answer to a known intent (e.g. from a suggestion chip).
 * @returns {KateResponse}
 */
export function answerIntent(intent, { items, signals } = {}) {
  const answer = answers[intent]
  return answer ? answer(conversationContext({ items, signals })) : { reply: KATE_TEXT.unknown }
}

/**
 * Kate's answer to a typed question. Returns null for empty input.
 * @param {string} input
 * @param {{ items?: object[], signals?: object[] }} context
 * @returns {KateResponse | null}
 */
export function respond(input, context = {}) {
  if (!String(input ?? '').trim()) return null
  const intent = detectIntent(input)
  return intent ? answerIntent(intent, context) : { reply: KATE_TEXT.unknown }
}
