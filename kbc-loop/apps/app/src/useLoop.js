// Leest de gedeelde state live uit de api-client en stuurt acties naar de api.
// Geen eigen kopie van de state: wat getoond wordt is altijd de laatste versie van de server.
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { derive } from '@kbc-loop/shared/state/derive.js'
import { getClient } from './api.js'

const RETRY_MS = 3000
const noSubscribe = () => () => {}

export function useLoop() {
  const [setup] = useState(() => {
    try { return { client: getClient(), error: null } } catch (error) { return { client: null, error } }
  })
  const { client } = setup
  const [startError, setStartError] = useState(setup.error)
  const [actionError, setActionError] = useState(null)

  const snapshot = useSyncExternalStore(
    client ? client.subscribe : noSubscribe,
    () => client?.snapshot ?? null,
  )
  const status = useSyncExternalStore(
    client ? client.onStatus : noSubscribe,
    () => client?.status ?? 'offline',
  )

  // Eerste verbinding; bij een fout opnieuw proberen tot de api bereikbaar is.
  useEffect(() => {
    if (!client || snapshot) return undefined
    let alive = true
    let timer = null
    const attempt = () => {
      client.start()
        .then(() => alive && setStartError(null))
        .catch((err) => {
          if (!alive) return
          setStartError(err)
          timer = setTimeout(attempt, RETRY_MS)
        })
    }
    attempt()
    return () => { alive = false; clearTimeout(timer) }
  }, [client, snapshot])

  // Foutmelding van een mislukte actie na een paar seconden weer verbergen.
  useEffect(() => {
    if (!actionError) return undefined
    const t = setTimeout(() => setActionError(null), 4000)
    return () => clearTimeout(t)
  }, [actionError])

  const dispatch = useCallback((action) => {
    if (!client) return
    client.dispatch(action).catch((err) => setActionError(err.message || 'Actie mislukt'))
  }, [client])

  const derived = useMemo(() => (snapshot ? derive(snapshot.state) : null), [snapshot])

  return {
    state: snapshot?.state ?? null,
    ...derived,
    dispatch,
    status,
    error: snapshot ? null : startError,
    fatal: !client,
    actionError,
  }
}
