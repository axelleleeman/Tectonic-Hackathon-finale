// The conversation with Kate during one session: messages, suggestions and what a question does.
// Lives only while Kate is open (closing unmounts the screen and with it the conversation).
// The replies come from the shared engine (@kbc-loop/shared/kate); this hook only renders them and
// executes navigation through the shared actions. Navigating closes Kate (see loopReducer).
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  REPLY_BEFORE_ACTION_MS, answerIntent, respond, suggestions, voiceNotAvailableReply,
} from '@kbc-loop/shared/kate/conversation.js'

// Engine screen names → app screens.
const APP_SCREENS = { repair: 'repair', product: 'product', overview: 'shop' }

let nextId = 1
const msg = (from, text) => ({ id: nextId++, from, text })

export function useKateChat({ items, signals, actions }) {
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const add = useCallback((...list) => setMessages((m) => [...m, ...list]), [])
  const kateSays = useCallback((text) => add(msg('kate', text)), [add])

  // Show Kate's short reply first and only then navigate, so it feels like a conversation.
  const handle = ({ reply, action }) => {
    kateSays(reply)
    if (action?.type !== 'navigate') return
    setBusy(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => actions.navigate(APP_SCREENS[action.screen], action.params), REPLY_BEFORE_ACTION_MS)
  }

  const chips = suggestions({ items, signals })

  const choose = (chip) => {
    if (busy || chip.disabled) return
    add(msg('user', chip.label))
    handle(answerIntent(chip.intent, { items, signals }))
  }

  const ask = (text) => {
    const q = text.trim()
    if (!q || busy) return false
    add(msg('user', q))
    handle(respond(q, { items, signals }))
    return true
  }

  return { messages, chips, busy, choose, ask, voice: () => kateSays(voiceNotAvailableReply()) }
}
