import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { ProductThumb } from '../product/ProductThumb.jsx'
import { secondLifeMonthly } from './secondLife.js'
import '../modals/borrow.css'

/**
 * One catalogue product: name, partner, monthly price and "Add". The whole card opens the product detail
 * page (onOpen); the name is a link for keyboard and screen-reader users and Add opens the borrow dialog.
 */
export function CatalogCard({ product, partnerName, owned, onAdd, onOpen }) {
  const refurb = secondLifeMonthly(product)
  return (
    <article className="lp-card lp-item lp-item-click" title={product.detail} onClick={(e) => { if (!e.target.closest('button, a')) onOpen(product.id) }}>
      <ProductThumb product={product} />
      <div className="lp-min0 lp-item-text">
        <h4><a href={`#loop/catalog/product/${product.id}`} className="lp-cardlink" onClick={(e) => { e.preventDefault(); onOpen(product.id) }}>{product.name}</a></h4>
        <span className="lp-sub">{partnerName}{owned ? ' · In your home' : ''}</span>
        {refurb && <span className="lp-refurb" title="A refurbished unit is also available">Refurbished · {euro(refurb, 2)} / mo</span>}
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
