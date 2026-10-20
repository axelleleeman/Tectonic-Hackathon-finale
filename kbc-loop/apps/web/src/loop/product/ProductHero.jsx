import { StatusPill } from '../home/parts.jsx'
import { ProductThumb } from './ProductThumb.jsx'
import { date, money } from './format.js'

/** Large product illustration with name, partner, status and the four key facts. */
export function ProductHero({ row, cost }) {
  const { product, partner, category, item } = row
  const facts = [
    ['Monthly fee', item.returned ? '—' : money(product.monthly), item.returned ? null : 'All-in'],
    ['Since', date(item.since)],
    [item.returned ? 'Returned on' : 'Ends on', item.returned ? date(item.returnedOn) : date(cost.endDate)],
    ['Paid to date', money(cost.paidToDate)],
  ]
  return (
    <section className="pp-hero lp-card" aria-labelledby="pp-name">
      <div className="pp-hero-art"><ProductThumb product={product} size="hero" /></div>
      <div className="pp-hero-main">
        <div className="pp-hero-top">
          {category && <span className="lp-tag">{category.name}</span>}
          <StatusPill row={row} />
        </div>
        <h1 id="pp-name" className="pp-title" tabIndex={-1}>{product.name}</h1>
        <p className="pp-partner">by <b>{partner.name}</b> · {product.detail}</p>
        <dl className="pp-keyfacts">
          {facts.map(([label, value, hint]) => (
            <div key={label}><dt>{label}</dt><dd className="lp-num">{value}{hint && <small>{hint}</small>}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  )
}
