import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { duration, shortDate } from '../model.js'
import { ConditionBar, StatusPill } from './parts.jsx'

/** One product the customer has (active or returned). The whole card links to its product page. */
export function ProductCard({ row, flash, onOpen }) {
  const { item, product, partner } = row
  return (
    <a href={`#loop/product/${encodeURIComponent(item.key)}`} data-item={item.key}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onOpen(item.key) }}
      className={`lp-card lp-pcard ${item.returned ? 'lp-returned' : ''} ${flash ? 'lp-flash' : ''}`}>
      <span className="lp-pcard-head">
        <span className="lp-ic"><LoopIcon name={row.icon} /></span>
        <span className="lp-min0">
          <b className="lp-pname">{product.name}</b>
          <span className="lp-sub">{partner.name}{item.room ? ` · ${item.room}` : ''}</span>
        </span>
        <span className="lp-fee lp-num">{euro(product.monthly)}<small> / month</small></span>
      </span>
      <span className="lp-pcard-status">
        <StatusPill row={row} />
        {row.upgrade && !item.repair && <span className="lp-tag">Upgrade available</span>}
        {row.isNew && !item.returned && <span className="lp-tag">New · delivery scheduled</span>}
      </span>
      <span className="lp-pfacts">
        <span><small>Since</small>{shortDate(item.since)}</span>
        <span><small>Time in use</small>{item.returned ? '—' : duration(row.months)}</span>
        <span><small>Condition</small>{item.returned ? '—' : <ConditionBar value={row.condition} />}</span>
        <span><small>CO₂ saved</small><em className="lp-eco">{num(product.co2Kg)} kg</em></span>
      </span>
      <LoopIcon name="chev" className="lp-chev lp-pcard-chev" />
    </a>
  )
}
