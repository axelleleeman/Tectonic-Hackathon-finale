// React-hook die de reducer koppelt aan afgeleide gegevens (klant, items, signalen).
import { useMemo, useReducer } from 'react'
import { customers } from '../data/index.js'
import { detectSignals } from '../engine/signals.js'
import { createInitialState, loopReducer } from './loopReducer.js'

export function useLoop() {
  const [state, dispatch] = useReducer(loopReducer, undefined, createInitialState)
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
