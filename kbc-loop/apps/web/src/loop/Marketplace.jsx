import { useMemo, useState } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from './LoopIcon.jsx'
import { categoryIcon, marketCategories, matchesQuery, productIcon } from './model.js'

// Marketplace: the shared catalogue for the current customer's type.
export function Marketplace({ customerType, ownedIds, searchRef, onAdd }) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const cats = useMemo(() => marketCategories(customerType), [customerType])
  const q = query.trim()
  const filtered = cats.map((c) => ({ ...c, items: c.products.filter((p) => matchesQuery(p, q)) }))
  const total = filtered.reduce((s, c) => s + c.items.length, 0)
  const shown = filtered.filter((c) => (cat === 'all' || c.id === cat) && c.items.length)

  return (
    <main className="lp-wrap lp-main lp-market">
      <section className="lp-mkhead">
        <div>
          <div className="lp-eyebrow">Loop · Marketplace</div>
          <h1>Use what you need</h1>
          <p>One monthly price per product. Delivery, maintenance, repairs and KBC Insurance cover are always included.</p>
        </div>
        <label className="lp-search">
          <LoopIcon name="search" />
          <span className="lp-sr">Search products or partners</span>
          <input ref={searchRef} type="search" placeholder="Search products or partners" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </section>
      <div className="lp-mk">
        <nav className="lp-side" aria-label="Categories">
          <button type="button" aria-current={cat === 'all' ? 'true' : undefined} onClick={() => setCat('all')}>
            All products<span className="lp-n lp-num">{total}</span>
          </button>
          {filtered.map((c) => (
            <button key={c.id} type="button" aria-current={cat === c.id ? 'true' : undefined} onClick={() => setCat(c.id)}>
              <LoopIcon name={categoryIcon(c.id)} size={16} />{c.name}<span className="lp-n lp-num">{c.items.length}</span>
            </button>
          ))}
        </nav>
        <div>
          {shown.length === 0 && <div className="lp-card lp-empty">No products match “{q}”.</div>}
          {shown.map((c) => (
            <section key={c.id} className="lp-section" aria-labelledby={`lp-sec-${c.id}`}>
              <h2 className="lp-sechead" id={`lp-sec-${c.id}`}>{c.name}</h2>
              <div className="lp-grid">
                {c.items.map((p) => {
                  const owned = ownedIds.has(p.id)
                  return (
                    <article key={p.id} className="lp-card lp-item">
                      <div className="lp-head">
                        <div className="lp-ic"><LoopIcon name={productIcon(p.id)} /></div>
                        <div className="lp-min0"><div className="lp-partner">{p.partner.name}</div><h3>{p.name}</h3></div>
                        {owned && <span className="lp-owned">In your home</span>}
                      </div>
                      <p className="lp-desc">{p.detail}. {p.partner.tagline}.</p>
                      <p className="lp-incl"><LoopIcon name="check" /><span>Maintenance, repairs and insurance included · {p.termMonths}-month term</span></p>
                      <div className="lp-foot">
                        <div className="lp-price"><b>{euro(p.monthly)}</b> <small>/ month</small></div>
                        <button type="button" className="lp-btn lp-sm lp-primary" onClick={() => onAdd(p.id)} aria-label={`Add ${p.name}`}>Add</button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <Disclaimer />
    </main>
  )
}

export function Disclaimer() {
  return (
    <p className="lp-disclaimer">
      Concept prototype for the Tectonic Hackathon, not an official KBC website or app. Partners, products and prices are fictional examples;
      Philips (Signify) is an example partner, not an existing partnership.
    </p>
  )
}
