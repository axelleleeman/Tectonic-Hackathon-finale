import { useState } from 'react'
import { downloadImpactCard } from './shareCard.js'

const SHARE = ['M4 12v7.5h16V12', 'M12 3.5v11M7.5 8 12 3.5 16.5 8']

/** "Share my impact": downloads a designed PNG card with the customer's impact figures. */
export function ShareImpact({ name, totals, coins }) {
  const [busy, setBusy] = useState(false)
  const onClick = async () => {
    setBusy(true)
    try { await downloadImpactCard({ name, totals, coins }) } finally { setBusy(false) }
  }
  return (
    <button type="button" className="lp-btn lp-share" onClick={onClick} disabled={busy}>
      <svg className="lp-i" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {SHARE.map((d) => <path key={d} d={d} />)}
      </svg>
      Share my impact
    </button>
  )
}
