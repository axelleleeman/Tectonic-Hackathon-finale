import { num } from '@kbc-loop/shared/engine/format.js'
import { eur } from '../model.js'

/** Potential per month (insight groups) and active contracts (live) per category, as share bars. */
export function CategoryBreakdown({ rows }) {
  const total = rows.reduce((s, r) => s + r.potential, 0) || 1
  return (
    <section className="ins-card ins-pad" aria-labelledby="cat-h">
      <h2 id="cat-h" className="ins-h2">By category</h2>
      <p className="ins-chart-cap">Share of the monthly potential, with active contracts in the live portfolio</p>
      <ul className="ins-cats">
        {rows.map((r) => {
          const share = Math.round((r.potential / total) * 100)
          return (
            <li key={r.id}>
              <div className="ins-cat-top">
                <span className="ins-cat-label">{r.label}</span>
                <span className="ins-num ins-cat-val"><b>{eur(r.potential)}</b> <small>{share}%</small></span>
              </div>
              <span className="ins-cat-track" aria-hidden="true"><span style={{ width: `${Math.max(share, r.potential ? 2 : 0)}%` }} /></span>
              <small className="ins-cat-sub ins-num">{num(r.groups)} group{r.groups === 1 ? '' : 's'} · {num(r.active)} active contract{r.active === 1 ? '' : 's'}</small>
            </li>
          )
        })}
      </ul>
      <details className="ins-chart-table">
        <summary>Show as table</summary>
        <table className="ins-table ins-table-plain">
          <caption className="ins-sr">Potential and active contracts by category</caption>
          <thead><tr><th scope="col">Category</th><th scope="col" className="r">Potential / month</th><th scope="col" className="r">Share</th><th scope="col" className="r">Active contracts</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}><th scope="row">{r.label}</th><td className="r ins-num">{eur(r.potential)}</td><td className="r ins-num">{Math.round((r.potential / total) * 100)}%</td><td className="r ins-num">{num(r.active)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  )
}
