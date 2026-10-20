import { partnerInitials } from '../model.js'
import { CatalogCard } from './CatalogCard.jsx'

/** A partner's catalogue inside a category: initials "logo", name (tagline on hover) and its products. */
export function PartnerGroup({ partner, categoryId, ownedIds, onAdd, onOpen, onPartner }) {
  const id = `lp-pa-${categoryId}-${partner.id}`
  return (
    <section className="lp-partnergrp" aria-labelledby={id}>
      <header className="lp-pahead" title={partner.tagline}>
        <span className="lp-palogo" aria-hidden="true">{partnerInitials(partner.name)}</span>
        <h3 id={id}><a href={`#loop/partner/${partner.id}`} className="lp-cardlink" onClick={(e) => { e.preventDefault(); onPartner(partner.id) }}>{partner.name}</a></h3>
        <span className="lp-n lp-num">{partner.products.length}</span>
      </header>
      <div className="lp-grid">
        {partner.products.map((p) => (
          <CatalogCard key={p.id} product={p} partnerName={partner.name} owned={ownedIds.has(p.id)} onAdd={onAdd} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
