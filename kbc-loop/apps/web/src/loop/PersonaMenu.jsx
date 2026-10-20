import { useEffect, useRef, useState } from 'react'
import { customers } from '@kbc-loop/shared/data/index.js'
import { LoopIcon } from './LoopIcon.jsx'

// Personas offered in the demo: one private customer and one business customer.
const PERSONAS = ['lotte', 'peeters']
const TYPE_LABEL = { particulier: 'Private', kmo: 'Business' }

/**
 * Avatar button in the app bar with a small menu to switch between the private and the business persona.
 * Closes on Escape, on an outside click and after a choice; focus returns to the avatar.
 */
export function PersonaMenu({ customer, onSwitch, onConsent, consentDone }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const options = customers.filter((c) => PERSONAS.includes(c.id))

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); btnRef.current?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    rootRef.current?.querySelector('[aria-checked="true"]')?.focus()
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const choose = (id) => {
    setOpen(false)
    btnRef.current?.focus()
    if (id !== customer.id) onSwitch(id)
  }

  return (
    <div className="lp-persona" ref={rootRef}>
      <button type="button" ref={btnRef} className="lp-avatar" aria-haspopup="menu" aria-expanded={open}
        aria-label={`Signed in as ${customer.fullName}. Switch customer`} title="Switch customer" onClick={() => setOpen((o) => !o)}>
        {customer.avatar}
      </button>
      {open && (
        <div className="lp-pmenu" role="menu" aria-label="Switch customer">
          <p className="lp-pmenu-head">Demo customer</p>
          {options.map((c) => (
            <button key={c.id} type="button" role="menuitemradio" aria-checked={c.id === customer.id} className="lp-pitem" onClick={() => choose(c.id)}>
              <span className="lp-pitem-av" aria-hidden="true">{c.avatar}</span>
              <span className="lp-min0">
                <b>{c.fullName}</b>
                <small>{TYPE_LABEL[c.type] ?? c.type}</small>
              </span>
              {c.id === customer.id && <LoopIcon name="check" size={16} />}
            </button>
          ))}
          {onConsent && (
            <button type="button" role="menuitem" className="lp-pitem" onClick={() => { setOpen(false); onConsent() }}>
              <span className="lp-pitem-av" aria-hidden="true"><LoopIcon name="shield" size={16} /></span>
              <span className="lp-min0">
                <b>Your data</b>
                <small>{consentDone ? 'Review your choices' : 'Complete your profile'}</small>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
