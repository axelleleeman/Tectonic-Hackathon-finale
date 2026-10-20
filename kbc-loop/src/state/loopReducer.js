// Alle demo-state en acties op één plek. Puur (geen side effects), dus makkelijk te testen.
import { customers } from '../data/index.js'
import { COINS, TODAY } from '../config/index.js'
import { expandProduct } from '../engine/catalog.js'

const perCustomer = (fn) => Object.fromEntries(customers.map((c) => [c.id, fn(c)]))

export function createInitialState() {
  return {
    view: 'klant', // 'klant' | 'partner' | 'kbc'
    customerId: customers[0].id,
    consent: true,
    screen: 'home',
    active: { productId: null, signalId: null, itemKey: null, categoryId: null },
    kateOpen: false,
    seq: 0,
    items: perCustomer((c) => c.borrowed.map((b, n) => ({ ...b, key: `${c.id}-${n}`, repair: null, returned: false }))),
    dismissed: perCustomer(() => []),
    coins: perCustomer(() => 0),
    telemetry: perCustomer(() => false),
    campaigns: [], // groepen uit KBC Loop Insights waarvoor een Kate-campagne loopt
  }
}

// Helpers die enkel de huidige klant aanpassen
const forCustomer = (state, key, fn) => ({ ...state, [key]: { ...state[key], [state.customerId]: fn(state[key][state.customerId]) } })
const updateItem = (state, itemKey, fn) => forCustomer(state, 'items', (items) => items.map((i) => (i.key === itemKey ? fn(i) : i)))
const addCoins = (state, n) => forCustomer(state, 'coins', (c) => c + n)
const home = { screen: 'home', active: { productId: null, signalId: null, itemKey: null, categoryId: null }, kateOpen: false }

export function loopReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return createInitialState()

    case 'SET_VIEW':
      return { ...state, view: action.view, kateOpen: false }

    case 'SWITCH_CUSTOMER':
      return { ...state, ...home, view: 'klant', customerId: action.customerId }

    case 'SET_CONSENT':
      return { ...state, consent: action.value }

    case 'NAVIGATE':
      return { ...state, screen: action.screen, active: { ...state.active, ...action.active }, kateOpen: false, view: 'klant' }

    case 'OPEN_KATE':
      return { ...state, kateOpen: true }

    case 'CLOSE_KATE':
      return { ...state, kateOpen: false }

    case 'DISMISS_SIGNAL':
      return forCustomer(state, 'dismissed', (d) => [...d, action.signalId])

    case 'BORROW': {
      const ids = expandProduct(action.productId)
      const seq = state.seq + ids.length
      const newItems = ids.map((productId, n) => ({
        key: `${state.customerId}-new-${state.seq + n}`, productId, since: TODAY, repairs: 0, repair: null, returned: false,
      }))
      return { ...forCustomer({ ...state, seq }, 'items', (items) => [...items, ...newItems]), screen: 'done', active: { ...state.active, productId: action.productId } }
    }

    case 'REPORT_DEFECT': {
      const step = action.preventive ? 2 : 1 // preventief: Philips plant meteen in
      const next = updateItem(state, action.itemKey, (i) => ({ ...i, repair: { issue: action.issue, step, preventive: Boolean(action.preventive) } }))
      return { ...next, screen: 'repair', active: { ...state.active, itemKey: action.itemKey }, kateOpen: false, view: 'klant' }
    }

    case 'ADVANCE_REPAIR': {
      const item = state.items[state.customerId].find((i) => i.key === action.itemKey)
      if (!item?.repair || item.repair.step >= 3) return state
      const step = item.repair.step + 1
      let next = updateItem(state, action.itemKey, (i) => ({ ...i, repair: { ...i.repair, step }, repairs: step === 3 ? i.repairs + 1 : i.repairs }))
      if (step === 3) {
        next = addCoins(next, COINS.repair)
        if (item.repair.preventive) next = forCustomer(next, 'telemetry', () => false)
      }
      return next
    }

    case 'CLOSE_REPAIR':
      return { ...updateItem(state, action.itemKey, (i) => ({ ...i, repair: null })), screen: 'mykbc', view: 'klant' }

    case 'RETURN_ITEM':
      return addCoins(updateItem(state, action.itemKey, (i) => ({ ...i, returned: true, repair: null })), COINS.return)

    case 'TRIGGER_TELEMETRY':
      return { ...forCustomer(state, 'telemetry', () => true), ...home, view: 'klant' }

    case 'TOGGLE_CAMPAIGN': {
      const on = state.campaigns.includes(action.segmentId)
      return { ...state, campaigns: on ? state.campaigns.filter((id) => id !== action.segmentId) : [...state.campaigns, action.segmentId] }
    }

    default:
      return state
  }
}
