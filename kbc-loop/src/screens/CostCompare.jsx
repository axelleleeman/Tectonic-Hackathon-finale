import { costs } from '../engine/pricing.js'
import { euro } from '../engine/format.js'

export function CostCompare({ product }) {
  const { months, buy, borrow, saving } = costs(product)
  const max = Math.max(buy, borrow)
  const rows = [
    { label: 'Kopen', value: buy, note: product.insuranceMonthly ? 'Aankoop + verwachte herstellingen + losse verzekering' : 'Aankoop + verwachte herstellingen' },
    { label: 'Lenen via KBC Loop', value: borrow, note: 'Herstellingen en terugname inbegrepen', loop: true },
  ]
  return (
    <>
      <h4>Over {months / 12} jaar</h4>
      {rows.map((r) => (
        <div key={r.label} className="bar">
          <div className="barhead"><b>{r.label}</b><span>{euro(r.value)}</span></div>
          <div className="track"><div className={`fill ${r.loop ? 'loop' : ''}`} style={{ width: `${(r.value / max) * 100}%` }} /></div>
          <small>{r.note}</small>
        </div>
      ))}
      {saving > 0
        ? <div className="saving">Je bespaart ± <b>{euro(saving)}</b> en hoeft nooit zelf een herstelling te betalen.</div>
        : <div className="note">Lenen kost hier ± {euro(-saving)} meer, maar je hebt altijd een werkend toestel zonder grote uitgave ineens.</div>}
      {product.energySavingMonthly && <div className="saving">Plus ± <b>{euro(product.energySavingMonthly)}/maand</b> lagere energiefactuur.</div>}
    </>
  )
}
