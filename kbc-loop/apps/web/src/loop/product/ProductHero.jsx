import { StatusPill } from '../home/parts.jsx'
import { ProductThumb } from './ProductThumb.jsx'
import { date, money } from './format.js'

/** Large product illustration with name, partner, status and the four key facts. */
export function ProductHero({ row, cost }) {
  const { product, partner, item } = row
  const facts = [
    ['Monthly', item.returned ? '—' : money(product.monthly)],
    ['Since', date(item.since)],
    [item.returned ? 'Returned' : 'Ends', item.returned ? date(item.returnedOn) : date(cost.endDate)],
    ['Paid', money(cost.paidToDate)],
  ]
  return (
    <section className="pp-hero" aria-labelledby="pp-name">
      <div className="pp-hero-art"><ProductThumb product={product} size="hero" /></div>
      <div className="pp-hero-main">
        <StatusPill row={row} />
        <h1 id="pp-name" className="pp-title" tabIndex={-1}>{product.name}</h1>
        <p className="pp-partner">{partner.name}</p>
        <dl className="pp-keyfacts">
          {facts.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd className="lp-num">{value}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  )
}
