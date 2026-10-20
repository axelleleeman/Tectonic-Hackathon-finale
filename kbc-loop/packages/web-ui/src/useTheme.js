// Light/dark theme shared by the KBC LOOP web pages (same approach as apps/web/src/loop/useTheme.js).
// Follows prefers-color-scheme until the user picks one; the choice is kept in localStorage
// (wrapped in try/catch: storage can be blocked or unavailable).
import { useCallback, useEffect, useState } from 'react'

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored(key) {
  try {
    const v = window.localStorage.getItem(key)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

/** { theme: 'light' | 'dark', toggle }. `key` is the localStorage key for the user's choice. */
export function useTheme(key = 'kbc-loop-theme') {
  const [stored, setStored] = useState(() => readStored(key))
  const [system, setSystem] = useState(() => (query().matches ? 'dark' : 'light'))

  useEffect(() => {
    const mq = query()
    const onChange = (e) => setSystem(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = stored ?? system
  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setStored(next)
    try { window.localStorage.setItem(key, next) } catch { /* not persisted; still applied for this visit */ }
  }, [theme, key])

  return { theme, toggle }
}
