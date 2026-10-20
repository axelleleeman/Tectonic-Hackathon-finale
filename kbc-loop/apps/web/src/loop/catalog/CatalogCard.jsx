import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { ProductThumb } from '../product/ProductThumb.jsx'

/** One catalogue product: name, partner, monthly price and "Add" (opens the borrow dialog with the full details). */
export function CatalogCard({ product, partnerName, owned, onAdd }) {
  return (
    <article className="lp-card lp-item" title={product.detail}>
      <ProductThumb product={product} />
      <div className="lp-min0 lp-item-text">
        <h4>{product.name}</h4>
        <span className="lp-sub">{partnerName}{owned ? ' · In your home' : ''}</span>
      </div>
      <div className="lp-item-end">
        <span className="lp-price lp-num"><b>{euro(product.monthly)}</b><small> / mo</small></span>
        <button type="button" className="lp-btn lp-sm" onClick={() => onAdd(product.id)} aria-label={`Add ${product.name}, ${euro(product.monthly)} per month`}>
          <LoopIcon name="plus" size={14} />Add
        </button>
      </div>
    </article>
  )
}
