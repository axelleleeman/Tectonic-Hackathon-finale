// Anonymised groups from the api (GET /api/insights) for one filter.
import { useEffect, useState } from 'react'
import { client } from '@kbc-loop/web-ui/api.js'

export const ALL = { kind: 'alle', customerType: 'alle' }

export function useInsights(filter = ALL) {
  const { kind, customerType } = filter
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const key = `${kind}|${customerType}`

  useEffect(() => {
    let alive = true
    client.insights({ kind, customerType })
      .then((data) => { if (alive) setResult({ key, data, error: null }) })
      .catch((e) => { if (alive) setResult((r) => ({ ...r, error: e.message })) })
    return () => { alive = false }
  }, [kind, customerType, key])

  return { data: result.data, loading: result.key !== key, error: result.error }
}
