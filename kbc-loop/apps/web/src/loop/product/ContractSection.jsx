import { forwardRef } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { FeeSplit } from '../costs/FeeSplit.jsx'
import { date, money, months } from './format.js'

/** "Costs & contract": where the fee goes, what has been paid, what is left and what is included. */
export const ContractSection = forwardRef(function ContractSection({ row, cost, onOpenCosts }, ref) {
  const { product, item } = row
  const returned = item.returned
  const facts = [
    ['Monthly fee', returned ? 'Stopped' : money(cost.monthly || product.monthly)],
    ['Paid to date', money(cost.paidToDate), `${months(cost.monthsActive)} × ${money(product.monthly)}`],
    ['Contract term', months(cost.termMonths)],
    [returned ? 'Returned on' : 'Remaining', returned ? date(item.returnedOn) : months(cost.remainingMonths)],
    ['End date', date(cost.endDate)],
    ['Next payment', returned || !cost.nextPaymentDate ? '—' : date(cost.nextPaymentDate)],
  ]
  return (
    <section className="pp-section pp-contract" aria-labelledby="pp-contract-title">
      <div className="pp-sechead">
        <h2 id="pp-contract-title" ref={ref} tabIndex={-1}>Costs & contract</h2>
        <button type="button" className="lp-btn lp-sm" onClick={onOpenCosts}>Open full cost overview<LoopIcon name="arrow" size={14} /></button>
      </div>
      <div className="pp-contract-grid">
        <div className="lp-card pp-pad">
          <h3 className="pp-h3">Where your {money(product.monthly)} goes</h3>
          <FeeSplit split={cost.split} showText />
        </div>
        <div className="lp-card pp-pad">
          <h3 className="pp-h3">Contract</h3>
          <dl className="pp-facts">
            {facts.map(([label, value, hint]) => (
              <div key={label}><dt>{label}</dt><dd className="lp-num">{value}{hint && <small>{hint}</small>}</dd></div>
            ))}
          </dl>
          {cost.savingVsBuying > 0 && (
            <p className="pp-saving"><LoopIcon name="leaf" size={18} />
              <span>You save <b>{money(cost.savingVsBuying)}</b> over the term compared to buying it ({money(cost.buyEquivalent)} incl. repairs and insurance).</span>
            </p>
          )}
        </div>
        <div className="lp-card pp-pad pp-included">
          <h3 className="pp-h3">Included services</h3>
          <ul className="lp-includes">{product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}</ul>
        </div>
      </div>
    </section>
  )
})
