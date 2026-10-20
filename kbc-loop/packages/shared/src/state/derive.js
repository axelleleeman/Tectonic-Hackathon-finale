// Afgeleide gegevens uit de gedeelde state (huidige klant, items, signalen …).
// Zonder React, zodat web, app en api dezelfde logica gebruiken.
import { customers } from '../data/index.js'
import { detectSignals } from '../engine/signals.js'

export function derive(state) {
  const cid = state.customerId
  const customer = customers.find((c) => c.id === cid) ?? customers[0]
  const items = state.items[customer.id] ?? []
  const signals = detectSignals(customer, {
    consent: state.consent,
    dismissed: state.dismissed[customer.id] ?? [],
    items,
    telemetry: state.telemetry[customer.id] ?? false,
  })
  return {
    customer,
    items,
    signals,
    coins: state.coins[customer.id] ?? 0,
    activeSignal: signals.find((s) => s.id === state.active.signalId) ?? null,
    activeItem: items.find((i) => i.key === state.active.itemKey) ?? null,
  }
}
