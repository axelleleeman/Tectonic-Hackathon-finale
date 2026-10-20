import { useMemo, useState } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { catalogue, filterCatalogue } from '../model.js'
import { CategoryNav } from './CategoryNav.jsx'
import { PartnerGroup } from './PartnerGroup.jsx'
import { HowItWorks } from './HowItWorks.jsx'
import { PartnerStrip } from './PartnerStrip.jsx'

/**
 * Product catalogue (#loop/catalog): the shared catalogue for the customer's type, grouped by category
 * and then by partner. "How borrowing works" and "Our partners" on top; search, category filter with counts.
 * A card opens the product page (onOpen), "Add" the borrow dialog (onAdd), a partner its page (onPartner).
 */
export function Catalog({ customerType, initialCategory, ownedIds, searchRef, onAdd, onOpen, onPartner, onBack }) {
  const cats = useMemo(() => catalogue(customerType), [customerType])
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(() => (cats.some((c) => c.id === initialCategory) ? initialCategory : 'all'))
  const q = query.trim()
  const filtered = useMemo(() => filterCatalogue(cats, q), [cats, q])
  const total = filtered.reduce((s, c) => s + c.count, 0)
  const shown = filtered.filter((c) => (cat === 'all' || c.id === cat) && c.count)
  const selected = cats.find((c) => c.id === cat)

  return (
    <main className="lp-wrap lp-main lp-market">
      <button type="button" className="lp-backlink" onClick={onBack}><LoopIcon name="back" size={16} />Your home</button>
      <section className="lp-mkhead">
        <div className="lp-min0">
          <h1>{selected ? selected.name : 'Add a product'}</h1>
          <p>One monthly price. Repairs and insurance included.</p>
        </div>
        <label className="lp-search">
          <LoopIcon name="search" />
          <span className="lp-sr">Search products or partners</span>
          <input ref={searchRef} type="search" placeholder="Search products or partners" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </section>
      {!q && cat === 'all' && (
        <>
          <HowItWorks />
          <PartnerStrip customerType={customerType} onPartner={onPartner} />
        </>
      )}
      <div className="lp-mk" id="lp-products">
        <CategoryNav cats={filtered} total={total} active={cat} onSelect={setCat} />
        <div className="lp-min0">
          {cats.length === 0 && <div className="lp-card lp-empty">There are no products available for you yet.</div>}
          {cats.length > 0 && shown.length === 0 && (
            <div className="lp-card lp-empty">
              <p>{q ? `No products match “${q}”${selected ? ` in ${selected.name}` : ''}.` : 'No products in this category yet.'}</p>
              {(q || cat !== 'all') && (
                <button type="button" className="lp-btn lp-sm" onClick={() => { setQuery(''); setCat('all') }}>Show all products</button>
              )}
            </div>
          )}
          {shown.map((c) => (
            <section key={c.id} className="lp-section lp-catblock" aria-labelledby={`lp-sec-${c.id}`}>
              <h2 className="lp-sechead" id={`lp-sec-${c.id}`}>
                {c.name}
                <span className="lp-n lp-num">{c.count}</span>
              </h2>
              {c.partners.map((pa) => <PartnerGroup key={pa.id} partner={pa} categoryId={c.id} ownedIds={ownedIds} onAdd={onAdd} onOpen={onOpen} onPartner={onPartner} />)}
            </section>
          ))}
        </div>
      </div>
      <Disclaimer />
    </main>
  )
}
