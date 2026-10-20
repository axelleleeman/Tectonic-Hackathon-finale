import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { categoryIcon } from '../model.js'
import { ProductCard } from './ProductCard.jsx'

/** One category of "Your home": the customer's products, or an empty state that links to the catalogue. */
export function CategorySection({ category, rows, flashKey, onOpen, onBrowse }) {
  const { name } = category
  const id = `lp-cat-${category.id}`
  const monthly = rows.filter((r) => !r.item.returned).reduce((s, r) => s + r.product.monthly, 0)

  if (!rows.length) {
    return (
      <section className="lp-catsec lp-catsec-empty" aria-labelledby={id}>
        <span className="lp-ic" aria-hidden="true"><LoopIcon name={categoryIcon(category.id)} /></span>
        <div className="lp-min0">
          <h3 id={id}>{name}</h3>
          <p>Nothing here yet.</p>
        </div>
        <button type="button" className="lp-btn lp-sm" onClick={() => onBrowse(category.id)}>
          Browse {name}<LoopIcon name="arrow" size={16} />
        </button>
      </section>
    )
  }

  return (
    <section className="lp-catsec" aria-labelledby={id}>
      <div className="lp-catsec-head">
        <h3 id={id}><LoopIcon name={categoryIcon(category.id)} size={18} />{name}</h3>
        <span className="lp-num">{euro(monthly)} / month</span>
      </div>
      <div className="lp-pgrid">
        {rows.map((r) => <ProductCard key={r.item.key} row={r} flash={r.item.key === flashKey} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
