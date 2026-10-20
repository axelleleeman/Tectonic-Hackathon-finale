import { partners } from '@kbc-loop/shared/data/index.js'
import { CatalogCard } from '../catalog/CatalogCard.jsx'

/** A titled grid of catalogue cards (used for "More from …", "Similar products" and a partner's products). */
export function ProductGrid({ id, title, products, ownedIds, onAdd, onOpen, action }) {
  if (!products.length) return null
  return (
    <section className="lp-section" aria-labelledby={id}>
      <h2 className="lp-sechead" id={id}>{title}{action}</h2>
      <div className="lp-grid">
        {products.map((p) => (
          <CatalogCard key={p.id} product={p} partnerName={partners[p.partnerId]?.name ?? ''} owned={ownedIds.has(p.id)} onAdd={onAdd} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
