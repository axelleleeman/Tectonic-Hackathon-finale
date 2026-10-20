import { useRef, useState } from 'react'

const TABS = [
  { id: 'home', label: 'Your home' },
  { id: 'impact', label: 'Your impact' },
]

/**
 * Segmented switch between the two start-screen modules (ARIA tabs, arrow keys / Home / End move between tabs).
 * Both panels stay mounted so each keeps its state; the inactive one is hidden.
 */
export function HomeTabs({ panels }) {
  const [active, setActive] = useState('home')
  const refs = useRef({})
  const onKey = (e) => {
    const i = TABS.findIndex((t) => t.id === active)
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    const tab = TABS[(next + TABS.length) % TABS.length]
    setActive(tab.id)
    refs.current[tab.id]?.focus()
  }
  return (
    <>
      <div className="lp-seg" role="tablist" aria-label="Start screen" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`lp-tab-${t.id}`} aria-controls={`lp-panel-${t.id}`}
            aria-selected={active === t.id} tabIndex={active === t.id ? 0 : -1}
            ref={(el) => { refs.current[t.id] = el }} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div key={t.id} role="tabpanel" id={`lp-panel-${t.id}`} aria-labelledby={`lp-tab-${t.id}`}
          className="lp-tabpanel" hidden={active !== t.id}>
          {panels[t.id]}
        </div>
      ))}
    </>
  )
}
