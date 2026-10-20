import { useMemo } from 'react'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { date, money } from '../product/format.js'
import { FeeSplit } from './FeeSplit.jsx'
import { CategoryBars } from './CategoryBars.jsx'
import { CostItemList } from './CostItemList.jsx'
import { UpcomingPayments } from './UpcomingPayments.jsx'
import '../product/product.css'
import './costs.css'

const sumSplit = (list) => list.reduce((s, c) => ({
  partner: s.partner + c.split.partner, insurance: s.insurance + c.split.insurance, kbc: s.kbc + c.split.kbc,
}), { partner: 0, insurance: 0, kbc: 0 })

function Stat({ label, value, hint, tone }) {
  return (
    <div className="cp-stat">
      <dt>{label}</dt>
      <dd className={`lp-num ${tone === 'eco' ? 'lp-eco' : ''}`}>{value}{hint && <small>{hint}</small>}</dd>
    </div>
  )
}

/** Cost overview (#loop/costs): monthly total, payments, saving vs buying, categories, products and the fee split. */
export function CostsPage({ loop, onOpenProduct, onBack }) {
  const { items = [] } = loop
  const overview = useMemo(() => costOverview(items), [items])
  const running = overview.items.filter((c) => c.status !== 'returned' && c.remainingMonths > 0)
  const split = sumSplit(running)
  const next = overview.upcoming[0]

  return (
    <main className="lp-wrap lp-main cp">
      <nav className="pp-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><button type="button" className="pp-crumb-back" onClick={onBack}><LoopIcon name="back" size={16} />Your home</button></li>
          <li aria-current="page">Costs</li>
        </ol>
      </nav>
      <header className="cp-head">
        <h1>Costs</h1>
      </header>

      <section className="cp-hero lp-card" aria-label="Summary">
        <div className="cp-total">
          <span className="lp-eyebrow">Per month</span>
          <b className="lp-num">{money(overview.monthlyTotal)}</b>
          <small>{running.length} {running.length === 1 ? 'product' : 'products'}</small>
        </div>
        <dl className="cp-stats">
          <Stat label="Next payment" value={overview.nextPaymentDate ? date(overview.nextPaymentDate) : '—'} hint={next && overview.nextPaymentDate ? money(next.amount) : null} />
          <Stat label="Paid to date" value={money(overview.paidToDate)} />
          <Stat label="Saving vs buying" value={money(overview.savingVsBuying)} tone="eco" />
        </dl>
      </section>

      {!overview.items.length ? (
        <div className="lp-card pp-pad cp-section">
          <p className="pp-q">No products yet</p>
        </div>
      ) : (
        <>
          <div className="cp-grid cp-section">
            <section className="lp-card pp-pad" aria-labelledby="cp-cat-title">
              <h2 id="cp-cat-title" className="cp-h2">By category</h2>
              {overview.byCategory.length
                ? <CategoryBars rows={overview.byCategory} />
                : <p className="pp-hint">—</p>}
            </section>
            <section className="lp-card pp-pad" aria-labelledby="cp-split-title">
              <h2 id="cp-split-title" className="cp-h2">Fee split</h2>
              <FeeSplit split={split} />
            </section>
          </div>

          <section className="cp-section" aria-labelledby="cp-items-title">
            <div className="pp-sechead"><h2 id="cp-items-title">Products</h2></div>
            <CostItemList items={overview.items} onOpenProduct={onOpenProduct} />
          </section>

          <section className="cp-section" aria-labelledby="cp-pay-title">
            <div className="pp-sechead"><h2 id="cp-pay-title">Upcoming payments</h2></div>
            <div className="lp-card cp-table-card"><UpcomingPayments upcoming={overview.upcoming} /></div>
          </section>
        </>
      )}
    </main>
  )
}
