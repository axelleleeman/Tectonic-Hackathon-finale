// In-browser stand-in for the KBC Loop api, used by the static demo build (demo mode, e.g. on Vercel).
// Same public interface and return shapes as createLoopClient (client.js): start, dispatch, insights,
// subscribe, onStatus, close, snapshot and status. There is no server: the state lives in localStorage
// (per browser) and changes reach other tabs and iframes on the same origin via BroadcastChannel,
// with the `storage` event as a fallback. Without storage (private mode, React Native) it works in memory.
//
// The logic is the same shared code the api uses: loopReducer for actions, engine/insights.js for insights.
import { ACTION_TYPES, createInitialState, loopReducer } from './state/loopReducer.js'
import { insights } from './engine/insights.js'

// Same filter values as GET /api/insights (apps/api/src/server.js).
const KINDS = ['alle', 'herstelling', 'herhaalaankoop']
const CUSTOMER_TYPES = ['alle', 'particulier', 'kmo']

// Same error shape the api client throws: message, status and code from { error: { code, message } }.
function apiError(status, code, message) {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

/** A valid snapshot is { version: positive integer, state: object }; anything else is ignored. */
function validSnapshot(value) {
  return Boolean(value) && typeof value === 'object' && Number.isSafeInteger(value.version) && value.version > 0
    && Boolean(value.state) && typeof value.state === 'object' && !Array.isArray(value.state)
}

// Fill in fields added to createInitialState since the state was stored (as the api does in db.js).
const normalise = ({ version, state }) => ({ type: 'state', version, state: { ...createInitialState(), ...state } })

function getStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null // access can throw when site data is blocked
  }
}

export function createLocalClient({ storageKey = 'kbc-loop-demo-state', channel = 'kbc-loop-demo' } = {}) {
  const storage = getStorage()
  const listeners = new Set()
  const statusListeners = new Set()
  let current = null
  let memory = null // fallback copy when storage is not available
  let started = null
  let closed = false
  let bus = null

  const load = () => {
    try {
      const raw = storage?.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : null
      if (validSnapshot(parsed)) return normalise(parsed)
    } catch { /* corrupt or inaccessible storage: start again */ }
    return memory
  }

  const save = (snapshot) => {
    memory = snapshot
    try { storage?.setItem(storageKey, JSON.stringify(snapshot)) } catch { /* quota or blocked: memory only */ }
  }

  // Only newer versions pass, so a broadcast and the storage event for the same change do not repeat it.
  const accept = (snapshot) => {
    if (!validSnapshot(snapshot) || (current && snapshot.version <= current.version)) return
    current = normalise(snapshot)
    listeners.forEach((fn) => fn(current))
  }

  const onMessage = (event) => { if (!closed && event?.data?.type === 'state') accept(event.data) }
  const onStorage = (event) => {
    if (closed || event.key !== storageKey || !event.newValue) return
    try { accept(JSON.parse(event.newValue)) } catch { /* ignore malformed values */ }
  }

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      bus = new BroadcastChannel(channel)
      bus.onmessage = onMessage
    } catch { bus = null }
  }
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('storage', onStorage)

  return {
    get snapshot() { return current },
    // There is no connection that can drop: always online.
    get status() { return 'online' },

    // Load (or create) the state once; later calls return the same promise.
    start() {
      started ??= Promise.resolve().then(() => {
        let snapshot = load()
        if (!snapshot) {
          snapshot = { version: 1, state: createInitialState() }
          save(snapshot)
        }
        accept(snapshot)
      })
      return started
    },

    async dispatch(action) {
      if (!action || typeof action !== 'object' || Array.isArray(action) || !ACTION_TYPES.includes(action.type)) {
        throw apiError(400, 'bad_request', 'Unknown action type')
      }
      // Build on the newest stored version, which another tab may have written in the meantime.
      const base = [load(), current].filter(Boolean).sort((a, b) => b.version - a.version)[0]
        ?? { version: 0, state: createInitialState() }
      let state
      try { state = loopReducer(base.state, action) } catch {
        throw apiError(400, 'bad_request', `Action ${action.type} could not be applied`)
      }
      const snapshot = { version: base.version + 1, state }
      save(snapshot)
      accept(snapshot)
      try { bus?.postMessage({ type: 'state', ...snapshot }) } catch { /* other tabs still get the storage event */ }
      return { type: 'state', ...snapshot }
    },

    async insights(filter = {}) {
      const kind = filter.kind ?? 'alle'
      const customerType = filter.customerType ?? 'alle'
      if (!KINDS.includes(kind) || !CUSTOMER_TYPES.includes(customerType)) throw apiError(400, 'bad_request', 'Invalid filter')
      const state = current?.state ?? load()?.state ?? createInitialState()
      return { ...insights({ kind, customerType }), campaigns: state.campaigns }
    },

    subscribe(fn) {
      listeners.add(fn)
      if (current) fn(current)
      return () => listeners.delete(fn)
    },

    onStatus(fn) {
      statusListeners.add(fn)
      return () => statusListeners.delete(fn)
    },

    close() {
      closed = true
      bus?.close()
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') window.removeEventListener('storage', onStorage)
    },
  }
}
