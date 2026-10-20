// All demo state and actions in one place. Pure (no side effects), so it is easy to test.
// The api applies actions sent by clients, so every action payload is validated here:
// an invalid action returns the state unchanged (same object).
import { customers, spendSegments } from '../data/index.js'
import { COINS, MIN_GROUP_SIZE, TODAY } from '../config/index.js'
import { expandProduct, productById } from '../engine/catalog.js'
import { isValidUpgrade } from '../engine/upgrades.js'
import { rewardById } from '../data/rewards.js'
import { DEFAULT_KATE_LEVEL, KATE_LEVEL_IDS } from '../data/dataChoices.js'

export { KATE_LEVELS, KATE_LEVEL_IDS, DEFAULT_KATE_LEVEL } from '../data/dataChoices.js'

// Allowed values; anything else is ignored so the shared state never breaks.
export const VIEWS = ['klant', 'partner', 'kbc']
export const SCREENS = ['home', 'mykbc', 'shop', 'category', 'product', 'done', 'repair', 'item', 'costs', 'rewards', 'inbox', 'consent', 'partner']
export const ACTION_TYPES = [
  'RESET', 'SET_VIEW', 'SWITCH_CUSTOMER', 'SET_CONSENT', 'NAVIGATE', 'OPEN_KATE', 'CLOSE_KATE', 'DISMISS_SIGNAL',
  'BORROW', 'REPORT_DEFECT', 'ADVANCE_REPAIR', 'CLOSE_REPAIR', 'RETURN_ITEM', 'UPGRADE_ITEM', 'TRIGGER_TELEMETRY',
  'TOGGLE_CAMPAIGN', 'START_CAMPAIGN', 'STOP_CAMPAIGN', 'REDEEM_REWARD', 'MARK_NOTIFICATIONS_READ', 'PARTNER_UPDATE_REPAIR',
  'SET_DATA_PREFERENCES',
]

export const MAX_ISSUE_LENGTH = 120
export const MAX_NOTE_LENGTH = 200
const MAX_ID_LENGTH = 64
export const MAX_NOTIFICATION_IDS = 100

// Repair status reported by a partner, and the repair step (1–3) it corresponds to
export const PARTNER_REPAIR_STATUSES = ['scheduled', 'on-the-way', 'in-progress', 'repaired']
// Step 2 ("technician visit") is reached once the technician is at work, not while on the way.
const PARTNER_STATUS_STEP = { scheduled: 1, 'on-the-way': 1, 'in-progress': 2, repaired: 3 }

// Kate campaigns started from KBC Loop Insights
export const CAMPAIGN_AUDIENCES = ['consented', 'consented-active']
export const MAX_CAMPAIGN_BUDGET = 100_000
export const MAX_CAMPAIGN_MESSAGE_LENGTH = 280

// Data preferences a customer chooses on the consent screen. kateTips mirrors state.consent.
// kateLevel ('basic' | 'proactive' | 'ecosystem') sets how far Kate goes on her own (see engine/signals.js).
export const DATA_PREFERENCE_KEYS = ['kateTips', 'insights', 'partners', 'telemetry']
/** Privacy by default: only Kate tips follow the existing consent; everything else is off. */
export const defaultDataPreferences = (consent = false) =>
  ({ kateTips: Boolean(consent), insights: false, partners: false, telemetry: false, kateLevel: DEFAULT_KATE_LEVEL, completedOn: null })

const ACTIVE_KEYS = ['productId', 'signalId', 'itemKey', 'categoryId', 'partnerId']
const isId = (v) => typeof v === 'string' && v.length > 0 && v.length <= MAX_ID_LENGTH
const pickActive = (active) => (active && typeof active === 'object' && !Array.isArray(active)
  ? Object.fromEntries(Object.entries(active).filter(([k, v]) => ACTIVE_KEYS.includes(k) && (v === null || isId(v))))
  : {})

/** Trimmed string of at most `max` characters, or null when it is not a non-empty string. */
const cleanText = (v, max) => {
  if (typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t || null
}

const perCustomer = (fn) => Object.fromEntries(customers.map((c) => [c.id, fn(c)]))

export function createInitialState() {
  return {
    view: 'klant', // 'klant' (customer) | 'partner' | 'kbc'
    customerId: customers[0].id,
    consent: true,
    screen: 'home',
    active: { productId: null, signalId: null, itemKey: null, categoryId: null },
    kateOpen: false,
    seq: 0,
    items: perCustomer((c) => c.borrowed.map((b, n) => ({ ...b, key: `${c.id}-${n}`, repair: null, returned: false }))),
    dismissed: perCustomer(() => []),
    coins: perCustomer((c) => c.coins ?? 0),
    telemetry: perCustomer(() => false),
    campaigns: [], // ids of KBC Loop Insights groups with a running Kate campaign
    campaignDetails: {}, // { [segmentId]: { segmentId, audience, budget, message, channel, startedOn, status } }
    redemptions: perCustomer(() => []), // [{ id, rewardId, on }]
    readNotifications: perCustomer(() => []), // ids of notifications the customer has seen
    dataPreferences: perCustomer(() => defaultDataPreferences(true)), // { kateTips, insights, partners, telemetry, completedOn }
  }
}

// Helpers that only touch the current customer (tolerant of older persisted state without that customer)
const forCustomerId = (state, cid, key, fn, empty) => ({ ...state, [key]: { ...state[key], [cid]: fn(state[key]?.[cid] ?? empty) } })
const forCustomer = (state, key, fn, empty) => forCustomerId(state, state.customerId, key, fn, empty)
const itemsOf = (state, cid = state.customerId) => state.items?.[cid] ?? []
const findItem = (state, itemKey, cid = state.customerId) => (isId(itemKey) ? itemsOf(state, cid).find((i) => i.key === itemKey) : undefined)
const updateItem = (state, itemKey, fn, cid = state.customerId) =>
  forCustomerId(state, cid, 'items', (items) => items.map((i) => (i.key === itemKey ? fn(i) : i)), [])
const addCoins = (state, n, cid = state.customerId) => forCustomerId(state, cid, 'coins', (c) => c + n, 0)
const customerType = (state) => customers.find((c) => c.id === state.customerId)?.type
const home = { screen: 'home', active: { productId: null, signalId: null, itemKey: null, categoryId: null }, kateOpen: false }

const newItem = (state, n, productId, extra = {}) => ({
  key: `${state.customerId}-new-${state.seq + n}`, productId, since: TODAY, repairs: 0, repair: null, returned: false, ...extra,
})
/** A segment can get a campaign when it exists and is large enough to be shown (anonymity). */
const campaignSegment = (segmentId) => (isId(segmentId) ? spendSegments.find((s) => s.id === segmentId && s.customers >= MIN_GROUP_SIZE) : undefined)

/** Validated campaign details, or null when a field is invalid. Missing (or null) fields get defaults; the budget is clamped. */
function campaignDetails(segmentId, fields = {}) {
  const audience = fields.audience ?? 'consented'
  const budget = fields.budget ?? 0
  const message = fields.message ?? ''
  if (!CAMPAIGN_AUDIENCES.includes(audience)) return null
  if (typeof budget !== 'number' || !Number.isFinite(budget)) return null
  if (typeof message !== 'string') return null
  return {
    segmentId,
    audience,
    budget: Math.round(Math.min(MAX_CAMPAIGN_BUDGET, Math.max(0, budget)) * 100) / 100,
    message: message.trim().slice(0, MAX_CAMPAIGN_MESSAGE_LENGTH),
    channel: 'kate',
    startedOn: TODAY,
    status: 'running',
  }
}

function startCampaign(state, segmentId, fields) {
  if (!campaignSegment(segmentId)) return state
  const details = campaignDetails(segmentId, fields)
  if (!details) return state
  const campaigns = state.campaigns.includes(segmentId) ? state.campaigns : [...state.campaigns, segmentId]
  return { ...state, campaigns, campaignDetails: { ...state.campaignDetails, [segmentId]: details } }
}

function stopCampaign(state, segmentId) {
  if (!state.campaigns.includes(segmentId)) return state
  const all = state.campaignDetails ?? {}
  const details = all[segmentId] ? { ...all[segmentId], status: 'stopped' } : null
  return {
    ...state,
    campaigns: state.campaigns.filter((id) => id !== segmentId),
    campaignDetails: details ? { ...all, [segmentId]: details } : all,
  }
}

/** Repair reaches step 3: count it, reward the customer and clear a preventive device alert. */
function completeRepair(state, item, cid) {
  let next = updateItem(state, item.key, (i) => ({ ...i, repairs: (i.repairs ?? 0) + 1 }), cid)
  next = addCoins(next, COINS.repair, cid)
  if (item.repair.preventive) next = forCustomerId(next, cid, 'telemetry', () => false, false)
  return next
}

function redeemReward(state, rewardId) {
  const reward = isId(rewardId) ? rewardById(rewardId) : undefined
  const cid = state.customerId
  if (!reward || (state.coins?.[cid] ?? 0) < reward.cost) return state
  const redemption = { id: `${cid}-r-${state.seq}`, rewardId: reward.id, on: TODAY }
  const next = forCustomer({ ...state, seq: state.seq + 1 }, 'redemptions', (r) => [...r, redemption], [])
  return addCoins(next, -reward.cost)
}

function markNotificationsRead(state, ids) {
  if (!Array.isArray(ids) || ids.length > MAX_NOTIFICATION_IDS || !ids.every(isId)) return state
  const read = state.readNotifications?.[state.customerId] ?? []
  const fresh = [...new Set(ids)].filter((id) => !read.includes(id))
  if (!fresh.length) return state
  // keep the list bounded so a long-running demo cannot grow it without limit
  return forCustomer(state, 'readNotifications', (r) => [...r, ...fresh].slice(-500), [])
}

/** A partner reports progress on a customer's repair (the customer need not be the active one). */
function partnerUpdateRepair(state, { customerId, itemKey, status }) {
  const cid = customerId ?? state.customerId
  if (!customers.some((c) => c.id === cid) || !PARTNER_REPAIR_STATUSES.includes(status)) return state
  const item = findItem(state, itemKey, cid)
  if (!item?.repair || item.returned) return state
  const step = Math.max(item.repair.step, PARTNER_STATUS_STEP[status]) // a repair never moves backwards
  const next = updateItem(state, item.key, (i) => ({ ...i, repair: { ...i.repair, step, partnerStatus: status, updatedOn: TODAY } }), cid)
  return step === 3 && item.repair.step < 3 ? completeRepair(next, item, cid) : next
}

const returned = (i) => ({ ...i, returned: true, repair: null, returnedOn: TODAY })

const validPreference = ([k, v]) => (k === 'kateLevel' ? KATE_LEVEL_IDS.includes(v) : DATA_PREFERENCE_KEYS.includes(k) && typeof v === 'boolean')

/** Only known keys with valid values (booleans, or a known kateLevel); anything else makes the whole action invalid. */
function setDataPreferences(state, prefs) {
  if (!prefs || typeof prefs !== 'object' || Array.isArray(prefs)) return state
  const entries = Object.entries(prefs)
  if (!entries.length || !entries.every(validPreference)) return state
  const next = forCustomer(state, 'dataPreferences', (p) => ({ ...p, ...prefs, completedOn: TODAY }), defaultDataPreferences(state.consent))
  return 'kateTips' in prefs ? { ...next, consent: prefs.kateTips } : next
}

export function loopReducer(state, action) {
  switch (action?.type) {
    case 'RESET':
      return createInitialState()

    case 'SET_VIEW':
      if (!VIEWS.includes(action.view)) return state
      return { ...state, view: action.view, kateOpen: false }

    case 'SWITCH_CUSTOMER':
      if (!customers.some((c) => c.id === action.customerId)) return state
      return { ...state, ...home, view: 'klant', customerId: action.customerId }

    case 'SET_CONSENT': {
      const consent = Boolean(action.value)
      const next = forCustomer(state, 'dataPreferences', (p) => ({ ...p, kateTips: consent }), defaultDataPreferences(state.consent))
      return { ...next, consent }
    }

    case 'SET_DATA_PREFERENCES':
      return setDataPreferences(state, action.preferences)

    case 'NAVIGATE':
      if (!SCREENS.includes(action.screen)) return state
      return { ...state, screen: action.screen, active: { ...state.active, ...pickActive(action.active) }, kateOpen: false, view: 'klant' }

    case 'OPEN_KATE':
      return { ...state, kateOpen: true }

    case 'CLOSE_KATE':
      return { ...state, kateOpen: false }

    case 'DISMISS_SIGNAL':
      if (!isId(action.signalId)) return state
      return forCustomer(state, 'dismissed', (d) => (d.includes(action.signalId) ? d : [...d, action.signalId]), [])

    case 'BORROW': {
      if (!isId(action.productId) || !productById(action.productId)) return state
      const ids = expandProduct(action.productId)
      const newItems = ids.map((productId, n) => newItem(state, n, productId))
      const next = forCustomer({ ...state, seq: state.seq + ids.length }, 'items', (items) => [...items, ...newItems], [])
      return { ...next, screen: 'done', active: { ...state.active, productId: action.productId } }
    }

    case 'REPORT_DEFECT': {
      const item = findItem(state, action.itemKey)
      const issue = cleanText(action.issue, MAX_ISSUE_LENGTH)
      if (!item || item.returned || !issue) return state
      const preventive = action.preventive === true
      const repair = {
        issue,
        step: preventive ? 2 : 1, // preventive: the partner schedules the visit right away
        preventive,
        note: cleanText(action.note, MAX_NOTE_LENGTH),
        photo: action.photo === true,
      }
      const next = updateItem(state, item.key, (i) => ({ ...i, repair }))
      return { ...next, screen: 'repair', active: { ...state.active, itemKey: item.key }, kateOpen: false, view: 'klant' }
    }

    case 'ADVANCE_REPAIR': {
      const item = findItem(state, action.itemKey)
      if (!item?.repair || item.repair.step >= 3) return state
      const step = item.repair.step + 1
      const next = updateItem(state, item.key, (i) => ({ ...i, repair: { ...i.repair, step } }))
      return step === 3 ? completeRepair(next, item, state.customerId) : next
    }

    case 'CLOSE_REPAIR': {
      const item = findItem(state, action.itemKey)
      if (!item) return state
      return { ...updateItem(state, item.key, (i) => ({ ...i, repair: null })), screen: 'mykbc', view: 'klant' }
    }

    case 'RETURN_ITEM': {
      const item = findItem(state, action.itemKey)
      if (!item || item.returned) return state
      return addCoins(updateItem(state, item.key, returned), COINS.return)
    }

    case 'UPGRADE_ITEM': {
      const item = findItem(state, action.itemKey)
      if (!item || item.returned || !isId(action.productId)) return state
      if (!isValidUpgrade(item.productId, action.productId, customerType(state))) return state
      const upgraded = newItem(state, 0, action.productId, { upgradedFrom: item.key })
      let next = updateItem({ ...state, seq: state.seq + 1 }, item.key, returned)
      next = forCustomer(next, 'items', (items) => [...items, upgraded], [])
      return { ...addCoins(next, COINS.return), screen: 'item', active: { ...state.active, itemKey: upgraded.key, productId: action.productId }, kateOpen: false, view: 'klant' }
    }

    case 'TRIGGER_TELEMETRY':
      return { ...forCustomer(state, 'telemetry', () => true, false), ...home, view: 'klant' }

    case 'TOGGLE_CAMPAIGN': // backwards compatible: start with default details, or stop
      return state.campaigns.includes(action.segmentId) ? stopCampaign(state, action.segmentId) : startCampaign(state, action.segmentId)

    case 'START_CAMPAIGN':
      return startCampaign(state, action.segmentId, { audience: action.audience, budget: action.budget, message: action.message })

    case 'STOP_CAMPAIGN':
      return stopCampaign(state, action.segmentId)

    case 'REDEEM_REWARD':
      return redeemReward(state, action.rewardId)

    case 'MARK_NOTIFICATIONS_READ':
      return markNotificationsRead(state, action.ids)

    case 'PARTNER_UPDATE_REPAIR':
      return partnerUpdateRepair(state, action)

    default:
      return state
  }
}
