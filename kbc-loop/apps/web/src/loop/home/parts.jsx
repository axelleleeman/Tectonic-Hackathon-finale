import { statusOf } from '../model.js'

/** Status pill: Active, Repair step x of 3 or Returned. */
export function StatusPill({ row }) {
  const { label, tone } = statusOf(row)
  return <span className={`lp-status lp-st-${tone}`}>{label}</span>
}

/** Small condition bar with its percentage. */
export function ConditionBar({ value }) {
  return (
    <span className="lp-cond">
      <span className="lp-mini" aria-hidden="true"><i className={value < 75 ? 'lp-mid' : ''} style={{ width: `${value}%` }} /></span>
      <span className="lp-num">{value}%</span>
    </span>
  )
}
