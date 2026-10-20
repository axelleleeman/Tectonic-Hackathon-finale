// React hook around the shared Kate engine (@kbc-loop/shared/kate): messages, suggestions and busy state.
// The engine returns plain action descriptors; this hook executes them through `onNavigate(screen, params)`
// after showing Kate's short reply, so it feels like a conversation. It never changes the shared state itself.
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  REPLY_BEFORE_ACTION_MS, answerIntent, respond, suggestions, voiceNotAvailableReply,
} from '@kbc-loop/shared/kate/conversation.js'

let nextId = 1
const msg = (from, text) => ({ id: nextId++, from, text })

/**
 * @param {{ items?: object[], signals?: object[], onNavigate: (screen: 'repair' | 'product' | 'overview', params: object) => void }} options
 */
export function useKateConversation({ items = [], signals = [], onNavigate }) {
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)
  const navigate = useRef(onNavigate)
  useEffect(() => { navigate.current = onNavigate }, [onNavigate])
  useEffect(() => () => clearTimeout(timer.current), [])

  const add = useCallback((...list) => setMessages((m) => [...m, ...list]), [])

  const handle = ({ reply, action }) => {
    add(msg('kate', reply))
    if (action?.type !== 'navigate') return
    setBusy(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setBusy(false)
      navigate.current?.(action.screen, action.params)
    }, REPLY_BEFORE_ACTION_MS)
  }

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

  const voice = () => add(msg('kate', voiceNotAvailableReply()))

  return { messages, chips: suggestions({ items, signals }), busy, choose, ask, voice }
}
