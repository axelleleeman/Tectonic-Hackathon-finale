import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from './LoopIcon.jsx'
import { duration, groupByCategory, monthsBetween } from './model.js'

export function StatusLabel({ row }) {
  const { item, isNew, upgrade } = row
  if (item.repair) {
    return item.repair.step >= 3
      ? <span className="lp-status">Repaired</span>
      : <span className="lp-status lp-warn">Repair · step {item.repair.step}/3</span>
  }
  if (isNew) return <span className="lp-status lp-info">New · delivery scheduled</span>
  if (upgrade) return <span className="lp-status lp-info">Upgrade available</span>
  return <span className="lp-status">Active</span>
}

export function ConditionBar({ value }) {
  return (
    <span className="lp-cond">
      <span className="lp-mini"><i className={value < 75 ? 'lp-mid' : ''} style={{ width: `${value}%` }} /></span>{value}%
    </span>
  )
}

// Products in your home, grouped by category.
export function HomeTable({ rows, flashKey, onOpen, onMarket }) {
  if (!rows.length) {
    return (
      <div className="lp-card lp-empty">
        <p>You are not borrowing anything through KBC LOOP yet.</p>
        <button type="button" className="lp-btn lp-primary lp-sm" onClick={onMarket}><LoopIcon name="store" size={16} />Go to the marketplace</button>
      </div>
    )
  }
  return (
    <div className="lp-card lp-table">
      <div className="lp-thead" aria-hidden="true">
        <span>Product</span><span>In use</span><span>Condition</span>
        <span>Status</span><span className="lp-r">Monthly</span><span aria-hidden="true" />
      </div>
      {groupByCategory(rows).map(({ category, rows: list }) => (
        <div key={category.id}>
          <h3 className="lp-group">
            {category.name}
            <span className="lp-num">{euro(list.reduce((s, r) => s + r.product.monthly, 0))} / month</span>
          </h3>
          {list.map((r) => (
            <button key={r.item.key} type="button" data-item={r.item.key} className={`lp-row ${r.item.key === flashKey ? 'lp-flash' : ''}`}
              onClick={() => onOpen(r.item.key)}>
              <span className="lp-prod">
                <span className="lp-ic"><LoopIcon name={r.icon} /></span>
                <span className="lp-min0">
                  <b className="lp-pname">{r.product.name}</b>
                  <span className="lp-sub">{r.product.detail} · {r.partner.short}{r.item.room ? ` · ${r.item.room}` : ''}</span>
                </span>
              </span>
              <span className="lp-v lp-c-use">{duration(monthsBetween(r.item.since))}</span>
              <span className="lp-c-cond"><ConditionBar value={r.condition} /></span>
              <span className="lp-c-stat"><StatusLabel row={r} /></span>
              <span className="lp-fee lp-r">{euro(r.product.monthly)}</span>
              <LoopIcon name="chev" className="lp-chev" />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
