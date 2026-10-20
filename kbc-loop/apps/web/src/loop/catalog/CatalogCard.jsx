import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { productIcon } from '../model.js'

/** One catalogue product with its monthly price and an "Add" button (opens the borrow dialog). */
export function CatalogCard({ product, categoryId, owned, onAdd }) {
  return (
    <article className="lp-card lp-item">
      <div className="lp-head">
        <div className="lp-ic"><LoopIcon name={productIcon(product.id, categoryId)} /></div>
        <h4 className="lp-min0">{product.name}</h4>
      </div>
      {owned && <span className="lp-owned">In your home</span>}
      <p className="lp-desc">{product.detail}</p>
      <p className="lp-incl"><LoopIcon name="check" /><span>Maintenance, repairs and insurance included · {product.termMonths}-month term</span></p>
      <div className="lp-foot">
        <div className="lp-price"><b>{euro(product.monthly)}</b> <small>/ month</small></div>
        <button type="button" className="lp-btn lp-sm lp-primary" onClick={() => onAdd(product.id)} aria-label={`Add ${product.name}`}>
          <LoopIcon name="plus" size={16} />Add
        </button>
      </div>
    </article>
  )
}
