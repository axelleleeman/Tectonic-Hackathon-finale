// Live updates via WebSocket op /api/live. Controleert origin en (optionele) api-sleutel bij het verbinden.
import { WebSocketServer } from 'ws'

export function liveUpdates(server, { checkOrigin, checkKey, current }) {
  const wss = new WebSocketServer({
    server,
    path: '/api/live',
    maxPayload: 1024,
    verifyClient: ({ req }, done) => {
      if (!checkOrigin(req).ok) return done(false, 403, 'Origin not allowed')
      if (!checkKey(req)) return done(false, 401, 'Invalid key')
      return done(true)
    },
    handleProtocols: (protocols) => (protocols.has('kbc-loop') ? 'kbc-loop' : false),
  })

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'state', ...current() }))
    ws.on('message', () => ws.close(1003, 'Read only')) // clients sturen acties via POST, niet via de socket
  })

  return {
    broadcast(snapshot) {
      const msg = JSON.stringify({ type: 'state', ...snapshot })
      for (const client of wss.clients) if (client.readyState === 1) client.send(msg)
    },
    // Graceful: tell clients the server is going away (1001) so they reconnect elsewhere/later,
    // and terminate any socket that has not finished the closing handshake within graceMs.
    close(graceMs = 1000) {
      for (const c of wss.clients) c.close(1001, 'Server shutting down')
      return new Promise((ok) => {
        const timer = setTimeout(() => { wss.clients.forEach((c) => c.terminate()); ok() }, graceMs)
        timer.unref()
        wss.close(() => { clearTimeout(timer); ok() })
      })
    },
  }
}
