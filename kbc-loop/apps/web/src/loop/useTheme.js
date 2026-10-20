// Light/dark theme for the KBC LOOP page. Follows prefers-color-scheme until the user picks one;
// the choice is kept in localStorage (wrapped in try/catch: storage can be blocked or unavailable).
import { useCallback, useEffect, useState } from 'react'

const KEY = 'kbc-loop-theme'
const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored() {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function useTheme() {
  const [stored, setStored] = useState(readStored)
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
    try { window.localStorage.setItem(KEY, next) } catch { /* not persisted; still applied for this visit */ }
  }, [theme])

  return { theme, toggle }
}
