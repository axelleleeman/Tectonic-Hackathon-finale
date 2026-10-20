// Live updates via WebSocket op /api/live. Controleert origin en (optionele) api-sleutel bij het verbinden.
import { WebSocketServer } from 'ws'

export function liveUpdates(server, { checkOrigin, checkKey, current }) {
  const wss = new WebSocketServer({
    server,
    path: '/api/live',
    maxPayload: 1024,
    verifyClient: ({ req }, done) => {
      if (!checkOrigin(req).ok) return done(false, 403, 'Origin niet toegelaten')
      if (!checkKey(req)) return done(false, 401, 'Ongeldige sleutel')
      return done(true)
    },
    handleProtocols: (protocols) => (protocols.has('kbc-loop') ? 'kbc-loop' : false),
  })

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'state', ...current() }))
    ws.on('message', () => ws.close(1003, 'Enkel lezen')) // clients sturen acties via POST, niet via de socket
  })

  return {
    broadcast(snapshot) {
      const msg = JSON.stringify({ type: 'state', ...snapshot })
      for (const client of wss.clients) if (client.readyState === 1) client.send(msg)
    },
    close() {
      wss.clients.forEach((c) => c.terminate())
      wss.close()
    },
  }
}
