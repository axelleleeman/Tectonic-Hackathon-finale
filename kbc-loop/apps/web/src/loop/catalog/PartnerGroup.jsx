import { partnerInitials } from '../model.js'
import { CatalogCard } from './CatalogCard.jsx'

/** A partner's catalogue inside a category: initials "logo", name, tagline and its products. */
export function PartnerGroup({ partner, categoryId, ownedIds, onAdd }) {
  const id = `lp-pa-${categoryId}-${partner.id}`
  return (
    <section className="lp-partnergrp" aria-labelledby={id}>
      <header className="lp-pahead">
        <span className="lp-palogo" aria-hidden="true">{partnerInitials(partner.name)}</span>
        <div className="lp-min0">
          <h3 id={id}>{partner.name}</h3>
          <p>{partner.tagline}</p>
        </div>
        <span className="lp-n lp-num">{partner.products.length} {partner.products.length === 1 ? 'product' : 'products'}</span>
      </header>
      <div className="lp-grid">
        {partner.products.map((p) => (
          <CatalogCard key={p.id} product={p} categoryId={categoryId} owned={ownedIds.has(p.id)} onAdd={onAdd} />
        ))}
      </div>
    </section>
  )
}
