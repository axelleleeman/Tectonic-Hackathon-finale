import { useMemo } from 'react'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { money } from '../product/format.js'

const MAX = 5

/** Top categories by monthly fee; anything past the fifth is grouped as "Other". */
function topCategories(byCategory) {
  if (byCategory.length <= MAX) return byCategory
  const head = byCategory.slice(0, MAX - 1)
  const rest = byCategory.slice(MAX - 1)
  const monthly = Math.round(rest.reduce((s, c) => s + c.monthly, 0) * 100) / 100
  const share = Math.round(rest.reduce((s, c) => s + c.share, 0) * 10) / 10
  return [...head, { categoryId: 'other', name: 'Other', monthly, share }]
}

/** Compact cost card for "Your impact": monthly total, one stacked bar per category and a legend. */
export function CostSnapshot({ items, onCosts, i = 0 }) {
  const o = useMemo(() => costOverview(items), [items])
  const cats = topCategories(o.byCategory)
  const open = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault(); onCosts?.()
  }
  return (
    <section className="lp-cs lp-rv" style={{ '--i': i }} aria-labelledby="lp-cs-title">
      <header className="lp-cs-head">
        <div>
          <h3 id="lp-cs-title" className="lp-cs-title">Costs</h3>
          <b className="lp-cs-total lp-num">{money(o.monthlyTotal)}<span> / month</span></b>
        </div>
        <a className="lp-cs-link" href="#loop/costs" onClick={open}>View all<LoopIcon name="arrow" size={14} /></a>
      </header>
      {cats.length ? (
        <>
          <div className="lp-cs-bar" aria-hidden="true">
            {cats.map((c, n) => <span key={c.categoryId ?? n} className={`lp-cs-c${n}`} style={{ flexGrow: c.monthly }} />)}
          </div>
          <ul className="lp-cs-legend">
            {cats.map((c, n) => (
              <li key={c.categoryId ?? n}>
                <span className={`lp-cs-dot lp-cs-c${n}`} aria-hidden="true" />
                <span className="lp-cs-name">{c.name}</span>
                <span className="lp-cs-amt lp-num">{money(c.monthly)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : <p className="lp-cs-empty">No running products yet.</p>}
      {o.savingVsBuying > 0 && (
        <p className="lp-cs-save">Saving vs buying <b className="lp-eco lp-num">{money(o.savingVsBuying)}</b></p>
      )}
    </section>
  )
}
