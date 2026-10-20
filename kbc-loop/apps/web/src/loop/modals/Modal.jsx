import { LoopIcon } from '../LoopIcon.jsx'
import { useDialog } from '../dialog.js'

/** Centred dialog. Escape and focus restore are handled in LoopPage (top layer closes first). */
export function Modal({ title, onClose, children }) {
  const { ref, onKeyDown } = useDialog()
  return (
    <div className="lp-mscrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lp-modal" role="dialog" aria-modal="true" aria-labelledby="lp-modal-title" ref={ref} onKeyDown={onKeyDown}>
        <div className="lp-mhead">
          <h2 id="lp-modal-title">{title}</h2>
          <button type="button" className="lp-x" aria-label="Close" onClick={onClose}><LoopIcon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/** Confirmation step shown after an action succeeded. */
export function Done({ title, text, plus, onDone }) {
  return (
    <>
      <div className="lp-done">
        <div className="lp-big"><LoopIcon name="check" /></div>
        <h3>{title}</h3>
        <p>{text}</p>
        {plus && <p className="lp-plus">{plus}</p>}
      </div>
      <div className="lp-mfoot"><button type="button" className="lp-btn lp-primary" onClick={onDone} data-autofocus>Done</button></div>
    </>
  )
}

/** Simple message with one OK button (e.g. nothing to act on). */
export function Notice({ title, text, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="lp-mtext">{text}</p>
      <div className="lp-mfoot"><button type="button" className="lp-btn lp-primary" onClick={onClose}>OK</button></div>
    </Modal>
  )
}

/** Lets the customer choose which product an action applies to (when opened without a product, e.g. from Kate). */
export function ItemPicker({ rows, value, onChange }) {
  if (rows.length < 2) return null
  return (
    <>
      <label className="lp-lab" htmlFor="lp-pick">Product</label>
      <select id="lp-pick" className="lp-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {rows.map((r) => <option key={r.item.key} value={r.item.key}>{r.product.name} · {r.partner.short}</option>)}
      </select>
    </>
  )
}
