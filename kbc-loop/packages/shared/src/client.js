// Client voor de KBC Loop-api, gedeeld door web en app (iOS, Android en web).
// Haalt de state op, stuurt acties naar de server en ontvangt live updates via WebSocket.
// Gebruikt enkel fetch en WebSocket, die zowel in browsers als in React Native bestaan.

//
// Veiligheid: buiten localhost is enkel https/wss toegelaten. Gewone http (bv. naar je laptop vanop een gsm
// op hetzelfde wifi) kan alleen met allowInsecure, en dat zetten web en app enkel in ontwikkelmodus aan.

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]']

export function checkApiUrl(baseUrl, { allowInsecure = false } = {}) {
  const url = new URL(baseUrl)
  if (url.protocol === 'https:') return url
  if (url.protocol === 'http:' && (LOCAL_HOSTS.includes(url.hostname) || allowInsecure)) return url
  throw new Error(`Onveilige verbinding geweigerd: ${url.origin}. Gebruik https.`)
}

export function createLoopClient(baseUrl, { apiKey = null, allowInsecure = false } = {}) {
  checkApiUrl(baseUrl, { allowInsecure })
  const api = baseUrl.replace(/\/$/, '')
  const authHeaders = apiKey ? { authorization: `Bearer ${apiKey}` } : {}
  const listeners = new Set()
  const statusListeners = new Set()
  let current = null
  let status = 'connecting' // 'connecting' | 'online' | 'offline'
  let socket = null
  let started = null
  let closed = false
  let retries = 0

  const setStatus = (next) => {
    if (next === status) return
    status = next
    statusListeners.forEach((fn) => fn(status))
  }

  // Enkel nieuwere versies doorlaten: een antwoord op een POST en dezelfde update via WebSocket
  // mogen elkaar niet overschrijven.
  const accept = (snapshot) => {
    if (!snapshot?.state || (current && snapshot.version <= current.version)) return
    current = snapshot
    listeners.forEach((fn) => fn(current))
  }

  async function request(path, options = {}) {
    const res = await fetch(`${api}${path}`, { ...options, headers: { 'content-type': 'application/json', ...authHeaders, ...options.headers } })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error ?? `KBC Loop-api antwoordde ${res.status}`)
    return body
  }

  function connect() {
    if (closed) return
    socket = new WebSocket(`${api.replace(/^http/, 'ws')}/api/live`, apiKey ? ['kbc-loop', `key.${apiKey}`] : ['kbc-loop'])
    socket.onopen = () => { retries = 0; setStatus('online') }
    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'state') accept(msg)
      } catch { /* onbekend bericht negeren */ }
    }
    socket.onclose = () => {
      if (closed) return
      setStatus('offline')
      setTimeout(connect, Math.min(5000, 500 * 2 ** retries++))
    }
    // Eén keer sluiten: in Node 22.22+ vuurt close() opnieuw onerror af, wat anders een oneindige lus gaf.
    const ws = socket
    let closing = false
    socket.onerror = () => { if (closing) return; closing = true; ws.close() }
  }

  return {
    get snapshot() { return current },
    get status() { return status },

    // Eén keer starten; volgende oproepen geven dezelfde belofte terug.
    start() {
      started ??= request('/api/state')
        .then((snapshot) => { accept(snapshot); connect() })
        .catch((err) => { started = null; setStatus('offline'); throw err })
      return started
    },

    async dispatch(action) {
      const snapshot = await request('/api/actions', { method: 'POST', body: JSON.stringify(action) })
      accept(snapshot)
      return snapshot
    },

    insights(filter = {}) {
      return request(`/api/insights?${new URLSearchParams(filter)}`)
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
      socket?.close()
    },
  }
}
