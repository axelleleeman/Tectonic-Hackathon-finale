import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { ProductThumb } from '../product/ProductThumb.jsx'
import { money } from '../product/format.js'

const STATUS = { active: ['Active', 'ok'], repair: ['In repair', 'warn'], returned: ['Returned', 'off'] }

/** Every product with its monthly fee; a row opens that product's page. */
export function CostItemList({ items, onOpenProduct }) {
  return (
    <ul className="cp-items">
      {items.map((c) => {
        const product = productById(c.productId)
        const [label, tone] = STATUS[c.status] ?? STATUS.active
        const returned = c.status === 'returned'
        return (
          <li key={c.itemKey}>
            <button type="button" className={`cp-item ${returned ? 'cp-item-off' : ''}`} onClick={() => onOpenProduct(c.itemKey)}>
              {product && <ProductThumb product={product} size="md" />}
              <span className="lp-min0 cp-item-name">
                <b>{c.name}</b>
                {tone !== 'ok' ? <small><span className={`lp-status lp-st-${tone}`}>{label}</span></small> : <small>{c.partnerName}</small>}
              </span>
              <span className="cp-item-fee lp-num">{returned ? '—' : money(c.monthly)}{!returned && <small>/ month</small>}</span>
              <LoopIcon name="chev" className="cp-item-chev" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
