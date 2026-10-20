// React-hook bovenop de gedeelde api-client: state uit de database, live bijgewerkt via WebSocket.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { derive } from '@kbc-loop/shared/state/derive.js'
import { client } from '../api.js'

export function useLoop() {
  const [snapshot, setSnapshot] = useState(client.snapshot)
  const [status, setStatus] = useState(client.status)
  const [error, setError] = useState(null)

  useEffect(() => {
    const offState = client.subscribe((s) => { setSnapshot(s); setError(null) })
    const offStatus = client.onStatus(setStatus)
    client.start().catch((e) => setError(e.message))
    return () => { offState(); offStatus() }
  }, [])

  const dispatch = useCallback((action) => client.dispatch(action).catch((e) => setError(e.message)), [])
  const derived = useMemo(() => (snapshot ? derive(snapshot.state) : null), [snapshot])

  return { state: snapshot?.state ?? null, ...derived, dispatch, status, error }
}
