// React-hook die de reducer koppelt aan afgeleide gegevens (klant, items, signalen).
// App en web delen dezelfde state: elke wijziging gaat naar localStorage, andere tabbladen
// (of de app in een iframe) ontvangen ze via het 'storage'-event.
import { useEffect, useMemo, useReducer, useRef } from 'react'
import { customers } from '../data/index.js'
import { detectSignals } from '../engine/signals.js'
import { createInitialState, loopReducer } from './loopReducer.js'

const STORAGE_KEY = 'kbc-loop-state-v1'
const SYNC = '__SYNC'

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.items) return saved
  } catch { /* geen of ongeldige opslag */ }
  return createInitialState()
}

function syncedReducer(state, action) {
  return action.type === SYNC ? action.state : loopReducer(state, action)
}

export function useLoop() {
  const [state, dispatch] = useReducer(syncedReducer, undefined, loadState)
  const remote = useRef(null)

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        remote.current = JSON.parse(e.newValue)
        dispatch({ type: SYNC, state: remote.current })
      } catch { /* negeer */ }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (state === remote.current) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* opslag geblokkeerd */ }
  }, [state])

  const cid = state.customerId
  const customer = customers.find((c) => c.id === cid)
  const items = state.items[cid]
  const telemetry = state.telemetry[cid]
  const dismissed = state.dismissed[cid]

  const signals = useMemo(
    () => detectSignals(customer, { consent: state.consent, dismissed, items, telemetry }),
    [customer, state.consent, dismissed, items, telemetry],
  )

  return {
    state,
    dispatch,
    customer,
    items,
    signals,
    coins: state.coins[cid],
    activeSignal: signals.find((s) => s.id === state.active.signalId) ?? null,
    activeItem: items.find((i) => i.key === state.active.itemKey) ?? null,
  }
}
