// The conversation with Kate during one session: messages, suggestions and what a question does.
// Lives only while Kate is open (closing unmounts the screen and with it the conversation).
// Navigation goes through the shared actions; navigating closes Kate (see loopReducer).
import { useCallback, useEffect, useRef, useState } from 'react'
import { matchIntent } from '@kbc-loop/shared/engine/kateIntents.js'

const NAV_DELAY_MS = 600

export const CAPABILITIES = 'In this demo I can help you with KBC Loop:\n• tips based on your spending\n• reporting a defect or requesting a repair\n• showing what you borrow\n• borrowing products'
export const UNKNOWN = 'I don’t understand that yet. Try e.g. “my lamp is flickering” or “what am I borrowing?”.'
export const NO_VOICE = 'Voice input doesn’t work in this demo yet. Feel free to type your question.'

const askedCapabilities = (t) => /what can you|wat kun je|wat kan je|help/i.test(t)

// English phrases until the shared matchIntent (Dutch keywords) is translated.
const englishIntents = [
  ['defect', /broken|defect|flicker|not working|repair/i],
  ['overview', /what am i borrowing|my loop|subscription|overview/i],
  ['tip', /tip|advice|save money|suggest/i],
]
const matchQuestion = (t) => englishIntents.find(([, re]) => re.test(t))?.[0] ?? matchIntent(t)

let nextId = 1
const msg = (from, text) => ({ id: nextId++, from, text })

export function useKateChat({ items, signals, actions }) {
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const fixable = items.find((i) => !i.returned && !i.repair)
  const tip = signals.find((s) => s.productId)

  const add = useCallback((...list) => setMessages((m) => [...m, ...list]), [])
  const kateSays = useCallback((text) => add(msg('kate', text)), [add])

  // Show Kate's short reply first and only then navigate, so it feels like a conversation.
  const goTo = (text, go) => {
    kateSays(text)
    setBusy(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(go, NAV_DELAY_MS)
  }

  const handlers = {
    defect: () => (fixable
      ? goTo('Opening your repair…', () => actions.navigate('repair', { itemKey: fixable.key }))
      : kateSays('You’re not borrowing anything I can have repaired yet.')),
    tip: () => (tip
      ? goTo('I have a tip for you, one moment…', () => actions.navigate('product', { productId: tip.productId, signalId: tip.id }))
      : kateSays('I don’t have a new tip for you right now.')),
    overview: () => goTo('Showing what you borrow with KBC Loop…', () => actions.navigate('mykbc')),
    capabilities: () => kateSays(CAPABILITIES),
  }

  const chips = [
    { label: '📞 Call KBC Live', disabled: true },
    { label: 'What can you do?', intent: 'capabilities' },
    fixable && { label: 'Something is broken', intent: 'defect' },
    tip && { label: 'Do you have a tip for me?', intent: 'tip' },
    { label: 'What am I borrowing with KBC Loop?', intent: 'overview' },
  ].filter(Boolean)

  const choose = (chip) => {
    if (busy || chip.disabled) return
    add(msg('user', chip.label))
    handlers[chip.intent]()
  }

  const ask = (text) => {
    const q = text.trim()
    if (!q || busy) return false
    add(msg('user', q))
    const intent = askedCapabilities(q) ? 'capabilities' : matchQuestion(q)
    if (intent) handlers[intent]()
    else kateSays(UNKNOWN)
    return true
  }

  return { messages, chips, busy, choose, ask, voice: () => kateSays(NO_VOICE) }
}
