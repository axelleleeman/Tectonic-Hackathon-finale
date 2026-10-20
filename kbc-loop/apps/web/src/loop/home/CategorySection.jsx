import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { categoryIcon } from '../model.js'
import { ProductCard } from './ProductCard.jsx'
import { useReveal } from '../useReveal.js'

/** One category of "Your home": the customer's products, or a quiet chip that opens the catalogue on it. */
export function CategorySection({ category, rows, flashKey, onOpen, onBrowse }) {
  const { name } = category
  const id = `lp-cat-${category.id}`
  const [ref] = useReveal({ threshold: 0.15 })
  const monthly = rows.filter((r) => !r.item.returned).reduce((s, r) => s + r.product.monthly, 0)

  if (!rows.length) {
    return (
      <button type="button" className="lp-chip" onClick={() => onBrowse(category.id)} aria-label={`Browse ${name}`}>
        <LoopIcon name={categoryIcon(category.id)} size={16} />{name}
      </button>
    )
  }

  return (
    <section className="lp-catsec" aria-labelledby={id}>
      <div className="lp-catsec-head">
        <h3 id={id}>{name}</h3>
        <span className="lp-num">{euro(monthly)} / month</span>
      </div>
      <div ref={ref} className="lp-pgrid">
        {rows.map((r, i) => <ProductCard key={r.item.key} i={i} row={r} flash={r.item.key === flashKey} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
