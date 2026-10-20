import { euro } from '@kbc-loop/shared/engine/format.js'
import { costs } from '@kbc-loop/shared/engine/pricing.js'
import { splitMonthly } from '@kbc-loop/shared/engine/costs.js'
import { termLabel } from './format.js'

/** Buy vs. borrow over the same term (shared pricing engine) and how the monthly fee is split. */
export function BuyVsBorrow({ product }) {
  const c = costs(product)
  const max = Math.max(c.buy, c.borrow) || 1
  const split = splitMonthly(product)
  const energy = (product.energySavingMonthly ?? 0) * c.months
  const rows = [
    { key: 'buy', label: 'Buy', value: c.buy, note: `Price ${euro(product.buyPrice)} + expected repairs ${euro(product.expectedRepairs)}${product.insuranceMonthly ? ' + separate insurance' : ''}` },
    { key: 'borrow', label: 'Borrow', value: c.borrow, note: `${euro(product.monthly, Number.isInteger(product.monthly) ? 0 : 2)} × ${c.months} months, repairs and take-back included` },
  ]
  return (
    <section className="lp-card cp-panel" aria-labelledby="cp-bvb">
      <h2 className="lp-h2" id="cp-bvb">Buy or borrow?</h2>
      <p className="cp-lead">Total cost over {termLabel(c.months)}.</p>
      <div className="cp-bars">
        {rows.map((r) => (
          <div key={r.key} className={`cp-bar cp-bar-${r.key}`}>
            <div className="cp-bar-head"><span>{r.label}</span><b className="lp-num">{euro(Math.round(r.value))}</b></div>
            <div className="cp-track" aria-hidden="true"><i style={{ width: `${Math.max(4, (r.value / max) * 100)}%` }} /></div>
            <small>{r.note}</small>
          </div>
        ))}
      </div>
      <p className={`cp-verdict ${c.saving >= 0 ? 'cp-good' : ''}`}>
        {c.saving >= 0
          ? `Borrowing saves you about ${euro(Math.round(c.saving))} over the term.`
          : `Buying is about ${euro(Math.round(-c.saving))} cheaper on paper, but repairs beyond the estimate, breakdowns and disposal are then on you.`}
        {energy > 0 && ` On top of that, the lower energy bill saves about ${euro(Math.round(energy))}.`}
      </p>
      <details className="lp-why cp-split">
        <summary>Where does the monthly fee go?</summary>
        <ul>
          <li>Partner (product, repairs, take-back): {euro(split.partner, 2)}</li>
          {split.insurance > 0 && <li>Insurance via KBC: {euro(split.insurance, 2)}</li>}
          <li>KBC (contract, payments, support): {euro(split.kbc, 2)}</li>
        </ul>
      </details>
    </section>
  )
}
