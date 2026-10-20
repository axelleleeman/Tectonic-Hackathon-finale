import { LoopIcon } from '../LoopIcon.jsx'

/** Receipt icon for "Costs & contract" (same 24×24 line style as LoopIcon). */
function ReceiptIcon() {
  return (
    <svg className="lp-i" width={26} height={26} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" /><path d="M9 7.5h6M9 11.5h6M9 15.5h3.5" />
    </svg>
  )
}

/** Four large tiles: icon + a short label. Details live one click further, in the dialogs. */
export function ActionCards({ row, onOpen }) {
  const { repair, returned } = row.item
  const cards = returned
    ? [
      { id: 'costs', icon: 'receipt', title: 'Costs & history' },
      { id: 'catalog', icon: 'plus', title: 'Find something new' },
    ]
    : [
      repair ? { id: 'report', icon: 'wrench', title: 'Track repair', badge: `${Math.min(repair.step, 3)}/3` } : { id: 'report', icon: 'wrench', title: 'Report a problem' },
      { id: 'upgrade', icon: 'up', title: 'Upgrade' },
      { id: 'return', icon: 'loop', title: 'Return' },
      { id: 'costs', icon: 'receipt', title: 'Costs & contract' },
    ]
  return (
    <nav className="pp-actions" aria-label="Actions">
      {cards.map((c) => (
        <button key={c.id} type="button" className="pp-action" onClick={() => onOpen(c.id)} data-action={c.id}>
          <span className="pp-action-ic">{c.icon === 'receipt' ? <ReceiptIcon /> : <LoopIcon name={c.icon} size={26} />}</span>
          <b>{c.title}</b>
          {c.badge && <span className="pp-badge" aria-label={`step ${c.badge}`}>{c.badge}</span>}
        </button>
      ))}
    </nav>
  )
}
