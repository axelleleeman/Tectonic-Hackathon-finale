import { euro } from '@kbc-loop/shared/engine/format.js'
import { statusOf } from '../model.js'
import { ProductThumb } from '../product/ProductThumb.jsx'

/**
 * One product the customer has (active or returned): thumbnail, name, partner, monthly fee and one status dot.
 * Details (since, time in use, condition, CO₂) live on the product page; the whole card links there.
 */
export function ProductCard({ row, flash, onOpen }) {
  const { item, product, partner } = row
  const { label, tone } = statusOf(row)
  return (
    <a href={`#loop/product/${encodeURIComponent(item.key)}`} data-item={item.key}
      aria-label={`${product.name}, ${partner.name}, ${label}`}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onOpen(item.key) }}
      className={`lp-card lp-pcard ${item.returned ? 'lp-returned' : ''} ${flash ? 'lp-flash' : ''}`}>
      <ProductThumb product={product} />
      <span className="lp-min0 lp-pcard-text">
        <b className="lp-pname">{product.name}</b>
        <span className="lp-sub">{partner.name}</span>
      </span>
      <span className="lp-pcard-end">
        <span className="lp-fee lp-num">{item.returned ? '—' : euro(product.monthly)}</span>
        <span className={`lp-dot lp-st-${tone}`} title={label} aria-hidden="true" />
      </span>
    </a>
  )
}
