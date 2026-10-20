import { useEffect, useState } from 'react'

// Short confirmation at the bottom of the screen. `toast` = { id, text }; a new id shows it again.
export function Toast({ toast }) {
  const [visibleId, setVisibleId] = useState(null)

  useEffect(() => {
    if (!toast) return undefined
    setVisibleId(toast.id)
    const t = setTimeout(() => setVisibleId(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const show = toast && visibleId === toast.id
  return <div className={`lp-toast ${show ? 'lp-show' : ''}`} role="status" aria-live="polite">{show ? toast.text : ''}</div>
}
