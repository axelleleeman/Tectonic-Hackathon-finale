import { useMemo } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { ProductThumb } from '../product/ProductThumb.jsx'
import { PartnerLogo } from '../catalog/PartnerLogo.jsx'
import { secondLifeMonthly, SECOND_LIFE_DISCOUNT } from '../catalog/secondLife.js'
import { partnerDetail } from '../partner/partnerModel.js'
import { catalogueProduct, moreFromPartner, similarProducts } from './related.js'
import { BuyVsBorrow } from './BuyVsBorrow.jsx'
import { ProductGrid } from './ProductGrid.jsx'
import { termLabel, co2Label } from './format.js'
import '../catalog/intro.css'
import './catalogProduct.css'

const ALWAYS = ['Repairs by the partner, no extra cost', 'Insurance via KBC', 'Take-back and reuse at the end of the term', 'One monthly payment from your KBC account']
const money = (n) => euro(n, Number.isInteger(n) ? 0 : 2)

/**
 * Catalogue product page (#loop/catalog/product/<productId>): photo, price and term, buy vs. borrow,
 * what's included, CO₂, refurbished option, "Borrow", then more from the partner and similar products.
 * The id is validated against the catalogue for this customer type.
 */
export function CatalogProductPage({ productId, customerType, rows, onBack, onAdd, onOpen, onPartner, onOwned }) {
  const product = useMemo(() => catalogueProduct(productId, customerType), [productId, customerType])
  const ownedIds = useMemo(() => new Set(rows.filter((r) => !r.item.returned).map((r) => r.product.id)), [rows])

  if (!product) {
    return (
      <main className="lp-wrap lp-main">
        <button type="button" className="lp-backlink" onClick={onBack}><LoopIcon name="back" size={16} />Catalogue</button>
        <div className="lp-card lp-empty cp-missing">
          <p>This product is not in your catalogue.</p>
          <button type="button" className="lp-btn lp-sm" onClick={onBack}>Browse the catalogue</button>
        </div>
      </main>
    )
  }

  const partner = partnerDetail(product.partnerId)
  const owned = rows.find((r) => r.product.id === product.id && !r.item.returned)
  const refurb = secondLifeMonthly(product)
  const more = moreFromPartner(product, customerType)
  const similar = similarProducts(product, customerType)
  const goPartner = (e) => { e?.preventDefault(); onPartner(partner.id) }

  return (
    <main className="lp-wrap lp-main cp">
      <button type="button" className="lp-backlink" onClick={onBack}><LoopIcon name="back" size={16} />Catalogue</button>

      <section className="cp-hero">
        <div className="cp-art"><ProductThumb product={product} size="hero" /></div>
        <div className="cp-info lp-min0">
          <p className="lp-eyebrow">{partner.category?.name} · <a href={`#loop/partner/${partner.id}`} className="cp-plink" onClick={goPartner}>{partner.name}</a></p>
          <h1>{product.name}</h1>
          <p className="cp-detail">{product.detail}</p>
          {owned && (
            <p className="cp-owned">
              <span className="lp-tag">In your home</span>
              <button type="button" className="cp-textbtn" onClick={() => onOwned(owned.item.key)}>View your {product.name}<LoopIcon name="chev" size={14} /></button>
            </p>
          )}
          <p className="cp-price lp-num"><b>{money(product.monthly)}</b> / month <span>· {termLabel(product.termMonths)} term</span></p>
          {refurb && (
            <p className="cp-refurb"><LoopIcon name="leaf" size={14} />Refurbished unit available for {money(refurb)} / month ({Math.round(SECOND_LIFE_DISCOUNT * 100)}% less). You choose in the next step.</p>
          )}
          <div className="cp-actions">
            <button type="button" className="lp-btn lp-primary" onClick={() => onAdd(product.id)}><LoopIcon name="plus" size={16} />Borrow</button>
            <a href={`#loop/partner/${partner.id}`} className="lp-btn" onClick={goPartner}>About {partner.short}</a>
          </div>
          <ul className="cp-facts">
            <li><LoopIcon name="leaf" size={16} /><span><b>{co2Label(product.co2Kg)} CO₂</b> avoided over the term</span></li>
            <li><LoopIcon name="wrench" size={16} /><span><b>{partner.profile.repairSlaHours} h</b> repair response*</span></li>
            {product.connected && <li><LoopIcon name="bulb" size={16} /><span><b>Connected:</b> reports wear itself</span></li>}
            {product.payPerUse && <li><LoopIcon name="arrow" size={16} /><span><b>Pay per use</b> option</span></li>}
          </ul>
        </div>
      </section>

      <div className="cp-cols">
        <BuyVsBorrow product={product} />
        <section className="lp-card cp-panel" aria-labelledby="cp-inc">
          <h2 className="lp-h2" id="cp-inc">What’s included</h2>
          <ul className="lp-includes">
            {product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}
          </ul>
          <h3 className="cp-sub">Always with KBC Loop</h3>
          <ul className="lp-includes">
            {ALWAYS.map((x) => <li key={x}><LoopIcon name="shield" />{x}</li>)}
          </ul>
        </section>
      </div>

      <section className="lp-card cp-partner" aria-labelledby="cp-pa">
        <PartnerLogo name={partner.name} />
        <div className="lp-min0">
          <h2 className="lp-h2" id="cp-pa">Owner and repairer: {partner.name}</h2>
          <p>{partner.profile.highlight}. {partner.profile.serviceArea} · {partner.profile.refurbishRate}% of returned units refurbished*</p>
        </div>
        <a href={`#loop/partner/${partner.id}`} className="lp-btn lp-sm" onClick={goPartner}>Partner page</a>
      </section>

      <ProductGrid id="cp-more" title={`More from ${partner.name}`} products={more} ownedIds={ownedIds} onAdd={onAdd} onOpen={onOpen} />
      <ProductGrid id="cp-similar" title="Similar products" products={similar} ownedIds={ownedIds} onAdd={onAdd} onOpen={onOpen} />

      <p className="cp-fine">* Partner figures are illustrative demo values. Prices and CO₂ savings are indicative.</p>
      <Disclaimer />
    </main>
  )
}
