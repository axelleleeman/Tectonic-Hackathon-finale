import { useEffect, useId, useRef } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { useDialog } from '../dialog.js'

/** Step indicator: "Issue · Details · Photo · Review"; done steps get a check, the current one aria-current. */
export function Steps({ labels, current }) {
  if (current < 0) return null
  return (
    <ol className="pp-steps" aria-label={`Step ${current + 1} of ${labels.length}`}>
      {labels.map((label, n) => (
        <li key={label} className={n < current ? 'pp-done' : n === current ? 'pp-now' : ''} aria-current={n === current ? 'step' : undefined}>
          <span className="pp-dot">{n < current ? <LoopIcon name="check" size={12} /> : n + 1}</span>
          <span className="pp-step-name">{label}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * Modal for the multi-step flows. Escape and a click on the backdrop close it, Tab stays inside, focus moves
 * to the new step whenever `stepKey` changes and returns to the opener on close.
 */
export function FlowDialog({ title, stepKey, onClose, children, footer }) {
  const { ref, onKeyDown } = useDialog()
  const titleId = useId()
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const opener = useRef(document.activeElement)
  const first = useRef(true)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      closeRef.current()
    }
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const back = opener.current
    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = prev
      const target = back && document.contains(back) ? back : document.querySelector('.pp-title')
      target?.focus?.({ preventScroll: true })
    }
  }, [])

  // On a new step: focus its autofocus target, or else the dialog body (skipped on open: useDialog handles that)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const el = ref.current
    if (!el) return
    const target = el.querySelector('[data-autofocus]') ?? el.querySelector('.pp-dbody')
    target?.focus({ preventScroll: true })
    el.querySelector('.pp-dbody')?.scrollTo?.(0, 0)
  }, [stepKey, ref])

  return (
    <div className="pp-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="pp-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} onKeyDown={onKeyDown}>
        <div className="pp-dhead">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="lp-x" aria-label="Close" onClick={onClose}><LoopIcon name="x" /></button>
        </div>
        <div className="pp-dbody" tabIndex={-1}>{children}</div>
        {footer && <div className="pp-dfoot">{footer}</div>}
      </div>
    </div>
  )
}

/** Confirmation block shown when a flow succeeded. */
export function Success({ title, children, coins }) {
  return (
    <div className="pp-success">
      <div className="pp-success-ic"><LoopIcon name="check" size={28} /></div>
      <h3>{title}</h3>
      {children}
      {coins ? <p className="pp-coins-earned"><span className="lp-coin" aria-hidden="true" />+{coins} Kate Coins</p> : null}
    </div>
  )
}
