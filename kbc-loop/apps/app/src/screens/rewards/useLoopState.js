// Reads the live shared state from the api client singleton, for components that are not handed `state`
// as a prop (e.g. the Rewards segment of the Loop tab). Read-only: no extra connection is opened.
import { useSyncExternalStore } from 'react'
import { getClient } from '../../api.js'

const noSubscribe = () => () => {}

function safeClient() {
  try { return getClient() } catch { return null }
}

export function useLoopState() {
  const client = safeClient()
  const snapshot = useSyncExternalStore(client ? client.subscribe : noSubscribe, () => client?.snapshot ?? null)
  return snapshot?.state ?? null
}
