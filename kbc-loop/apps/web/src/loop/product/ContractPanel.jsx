import { LoopIcon } from '../LoopIcon.jsx'
import { FeeSplit } from '../costs/FeeSplit.jsx'
import { FlowDialog } from './FlowDialog.jsx'
import { ProductHistory } from './ProductHistory.jsx'
import { date, money, months } from './format.js'

/** "Costs & contract": fee split, contract figures, saving, included services and history. */
export function ContractPanel({ row, cost, onClose, onOpenCosts }) {
  const { product, item } = row
  const returned = item.returned
  const facts = [
    ['Paid to date', money(cost.paidToDate)],
    [returned ? 'Returned' : 'Remaining', returned ? date(item.returnedOn) : months(cost.remainingMonths)],
    ['End date', date(cost.endDate)],
    ['Next payment', returned || !cost.nextPaymentDate ? '—' : date(cost.nextPaymentDate)],
  ]
  return (
    <FlowDialog title={returned ? 'Costs & history' : 'Costs & contract'} stepKey="costs" onClose={onClose}
      footer={<button type="button" className="lp-btn lp-primary" onClick={onOpenCosts} data-autofocus>All costs<LoopIcon name="arrow" size={16} /></button>}>
      <section aria-labelledby="pp-split-h">
        <h3 id="pp-split-h" className="pp-h3">Monthly fee</h3>
        <FeeSplit split={cost.split} />
      </section>
      <dl className="pp-facts">
        {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="lp-num">{value}</dd></div>)}
      </dl>
      {cost.savingVsBuying > 0 && (
        <div className="pp-saving"><span>Saving vs buying</span><b className="lp-num">{money(cost.savingVsBuying)}</b></div>
      )}
      <section aria-labelledby="pp-incl-h">
        <h3 id="pp-incl-h" className="pp-h3">Included</h3>
        <ul className="lp-includes">{product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}</ul>
      </section>
      <ProductHistory row={row} endDate={cost.endDate} />
    </FlowDialog>
  )
}
