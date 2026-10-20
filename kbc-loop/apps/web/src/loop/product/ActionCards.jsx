import { COINS } from '@kbc-loop/shared/config/index.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { money } from './format.js'

/** Receipt icon for "Costs & contract" (same 24×24 line style as LoopIcon). */
function ReceiptIcon() {
  return (
    <svg className="lp-i" width={24} height={24} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" /><path d="M9 7.5h6M9 11.5h6M9 15.5h3.5" />
    </svg>
  )
}

/** The four large actions on a product page (2 × 2, one column on phones). */
export function ActionCards({ row, upgradeCount, cost, onOpen }) {
  const { repair } = row.item
  const cards = [
    repair
      ? { id: 'report', icon: 'wrench', title: 'Track your repair', text: repair.step >= 3 ? 'Repaired · close the repair to finish' : `Repair step ${repair.step} of 3 · “${repair.issue}”`, tone: 'warn' }
      : { id: 'report', icon: 'wrench', title: 'Report a problem', text: 'A technician visit or a replacement, at no cost' },
    { id: 'upgrade', icon: 'up', title: 'Upgrade', text: upgradeCount ? `${upgradeCount} newer ${upgradeCount === 1 ? 'model' : 'models'} available` : 'No newer model yet · see the options' },
    { id: 'return', icon: 'loop', title: 'Return', text: `Free pickup · +${COINS.return} Kate Coins` },
    { id: 'costs', icon: 'receipt', title: 'Costs & contract', text: `${money(cost.paidToDate)} paid · ${cost.remainingMonths} months to go` },
  ]
  return (
    <section className="pp-section" aria-labelledby="pp-actions-title">
      <h2 id="pp-actions-title" className="lp-sr">What do you want to do?</h2>
      <div className="pp-actions">
        {cards.map((c) => (
          <button key={c.id} type="button" className={`pp-action ${c.tone ? `pp-action-${c.tone}` : ''}`} onClick={() => onOpen(c.id)} data-action={c.id}>
            <span className="pp-action-ic">{c.icon === 'receipt' ? <ReceiptIcon /> : <LoopIcon name={c.icon} size={24} />}</span>
            <span className="lp-min0">
              <b>{c.title}</b>
              <small>{c.text}</small>
            </span>
            <LoopIcon name="chev" className="pp-action-chev" />
          </button>
        ))}
      </div>
    </section>
  )
}
