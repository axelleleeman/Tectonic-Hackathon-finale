import { useMemo } from 'react'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { date, money } from '../product/format.js'
import { FeeSplit } from './FeeSplit.jsx'
import { CategoryBars } from './CategoryBars.jsx'
import { CostItemList } from './CostItemList.jsx'
import { UpcomingPayments } from './UpcomingPayments.jsx'
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
  const { items = [], customer } = loop
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
        <span className="lp-eyebrow">Costs & contracts</span>
        <h1>Your monthly overview</h1>
        <p>One direct debit from KBC covers every product: the device, repairs, insurance and pickup.</p>
      </header>

      <section className="cp-hero lp-card" aria-label="Summary">
        <div className="cp-total">
          <span className="lp-eyebrow">You pay every month</span>
          <b className="lp-num">{money(overview.monthlyTotal)}</b>
          <small>for {running.length} active {running.length === 1 ? 'product' : 'products'} · all-in, cancel monthly</small>
        </div>
        <dl className="cp-stats">
          <Stat label="Next payment" value={overview.nextPaymentDate ? date(overview.nextPaymentDate) : '—'} hint={next && overview.nextPaymentDate ? money(next.amount) : 'Nothing due'} />
          <Stat label="Paid to date" value={money(overview.paidToDate)} hint="Including returned products" />
          <Stat label="Saving vs buying" value={money(overview.savingVsBuying)} hint="Over the full terms, incl. repairs" tone="eco" />
        </dl>
      </section>

      {!overview.items.length ? (
        <div className="lp-card pp-pad cp-section">
          <p className="pp-q">No products yet</p>
          <p className="pp-hint">Once you borrow a product, its monthly fee, contract and payments appear here.</p>
        </div>
      ) : (
        <>
          <div className="cp-grid cp-section">
            <section className="lp-card pp-pad" aria-labelledby="cp-cat-title">
              <h2 id="cp-cat-title" className="cp-h2">By category</h2>
              {overview.byCategory.length
                ? <CategoryBars rows={overview.byCategory} />
                : <p className="pp-hint">No running contracts.</p>}
            </section>
            <section className="lp-card pp-pad" aria-labelledby="cp-split-title">
              <h2 id="cp-split-title" className="cp-h2">Where your money goes</h2>
              <FeeSplit split={split} showText />
              <p className="pp-hint">The partner stays the owner and is paid to keep the device working. KBC Insurance covers damage and theft; KBC finances the contract and handles payments, so you have one point of contact.</p>
            </section>
          </div>

          <section className="cp-section" aria-labelledby="cp-items-title">
            <div className="pp-sechead"><h2 id="cp-items-title">Your products</h2><span className="pp-hint">{overview.items.length} in total</span></div>
            <CostItemList items={overview.items} onOpenProduct={onOpenProduct} />
          </section>

          <section className="cp-section" aria-labelledby="cp-pay-title">
            <div className="pp-sechead"><h2 id="cp-pay-title">Upcoming payments</h2><span className="pp-hint">Next 6 months</span></div>
            <div className="lp-card cp-table-card"><UpcomingPayments upcoming={overview.upcoming} customer={customer} /></div>
          </section>
        </>
      )}
    </main>
  )
}
