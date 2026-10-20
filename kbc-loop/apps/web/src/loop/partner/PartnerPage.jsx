import { useMemo } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { PartnerLogo } from '../catalog/PartnerLogo.jsx'
import { ProductGrid } from '../catalogProduct/ProductGrid.jsx'
import { co2Label } from '../catalogProduct/format.js'
import { partnerDetail, partnerProducts, openTickets } from './partnerModel.js'
import '../catalog/intro.css'
import '../catalogProduct/catalogProduct.css'

/**
 * Partner page (#loop/partner/<partnerId>): profile, key facts, demo certifications, services, all products
 * for this customer type and the number of open repair tickets in the live state (a count only, anonymised).
 */
export function PartnerPage({ partnerId, customerType, state, rows, onBack, onAdd, onOpen }) {
  const partner = useMemo(() => partnerDetail(partnerId), [partnerId])
  const list = useMemo(() => (partner ? partnerProducts(partner.id, customerType) : []), [partner, customerType])
  const ownedIds = useMemo(() => new Set(rows.filter((r) => !r.item.returned).map((r) => r.product.id)), [rows])

  if (!partner) {
    return (
      <main className="lp-wrap lp-main">
        <button type="button" className="lp-backlink" onClick={onBack}><LoopIcon name="back" size={16} />Catalogue</button>
        <div className="lp-card lp-empty cp-missing">
          <p>This partner is not part of KBC Loop.</p>
          <button type="button" className="lp-btn lp-sm" onClick={onBack}>Browse the catalogue</button>
        </div>
      </main>
    )
  }

  const pr = partner.profile
  const tickets = openTickets(state, partner.id)
  const facts = [
    ['Founded', pr.founded ?? 'Not shown'],
    ['Headquarters', pr.headquarters],
    ['Service area', pr.serviceArea],
    ['Repair response', `${pr.repairSlaHours} h`],
    ['Technicians', pr.technicians],
    ['Units refurbished', `${pr.refurbishRate}%`, true],
    ['CO₂ avoided per unit', co2Label(pr.co2PerUnitKg), true],
  ]

  return (
    <main className="lp-wrap lp-main cp">
      <button type="button" className="lp-backlink" onClick={onBack}><LoopIcon name="back" size={16} />Catalogue</button>

      <header className="pa-head">
        <PartnerLogo name={partner.name} size="lg" />
        <div className="lp-min0">
          <p className="lp-eyebrow">{partner.category?.name} · Circular partner</p>
          <h1>{partner.name}</h1>
          <p className="pa-hl">{pr.highlight}</p>
          <p className="pa-about">{pr.about}</p>
          <p className="pa-about">{partner.tagline}.</p>
        </div>
      </header>

      <div className="pa-grid">
        <section className="lp-card cp-panel" aria-labelledby="pa-facts">
          <h2 className="lp-h2" id="pa-facts">Key facts</h2>
          <dl className="pa-facts">
            {facts.map(([k, v, eco]) => <div key={k} className={eco ? 'pa-fact-eco lp-eco-surface' : undefined}><dt>{k}</dt><dd>{v}</dd></div>)}
            <div><dt>Products for you</dt><dd>{list.length}</dd></div>
          </dl>
          <p className="pa-live" aria-live="polite">
            <span className="pa-dot" aria-hidden="true" />
            <b>{tickets}</b>
            <span>open repair ticket{tickets === 1 ? '' : 's'} right now, across all KBC Loop customers (live, anonymised)</span>
          </p>
        </section>
        <section className="lp-card cp-panel" aria-labelledby="pa-services">
          <h2 className="lp-h2" id="pa-services">Services</h2>
          <ul className="lp-includes">
            {pr.services.map((s) => <li key={s}><LoopIcon name="check" />{s}</li>)}
          </ul>
          {pr.certifications.length > 0 && (
            <>
              <h3 className="cp-sub">Certifications</h3>
              <ul className="pa-certs">{pr.certifications.map((c) => <li key={c}>{c}</li>)}</ul>
            </>
          )}
        </section>
      </div>

      {list.length > 0
        ? <ProductGrid id="pa-products" title={`Products from ${partner.name}`} products={list} ownedIds={ownedIds} onAdd={onAdd} onOpen={onOpen}
            action={<span className="lp-n lp-num">{list.length}</span>} />
        : <div className="lp-card lp-empty">{partner.name} has no products for your customer type yet.</div>}

      <p className="cp-fine">Partner figures and certifications are illustrative demo values, not real company data.
        {partner.id === 'signify' ? ' Philips (Signify) is shown as an example partner, not an existing collaboration.' : ' This partner is fictional.'}</p>
      <Disclaimer />
    </main>
  )
}
