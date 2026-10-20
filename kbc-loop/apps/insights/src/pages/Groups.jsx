import { useState } from 'react'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { MIN_GROUP_SIZE } from '@kbc-loop/shared/config/index.js'
import { PageHead } from '../components/PageHead.jsx'
import { Segmented } from '../components/Segmented.jsx'
import { Icon } from '../components/Icon.jsx'
import { ALL, useInsights } from '../useInsights.js'
import { groupMeta, eur } from '../model.js'
import { href } from '../useRoute.js'

const KINDS = [['alle', 'All'], ['herstelling', 'Repairs'], ['herhaalaankoop', 'Repeat purchases']]
const TYPES = [['alle', 'All customers'], ['particulier', 'Private'], ['kmo', 'SME']]

/** All groups in one table, with filters. Rows turn into cards on small screens. */
export function Groups({ state }) {
  const [filter, setFilter] = useState(ALL)
  const { data, loading, error } = useInsights(filter)
  const running = state.campaigns ?? []
  return (
    <>
      <PageHead eyebrow="Groups" title="All groups" />
      <div className="ins-filters">
        <Segmented label="Pattern" name="kind" value={filter.kind} options={KINDS} onChange={(kind) => setFilter({ ...filter, kind })} />
        <Segmented label="Customer type" name="type" value={filter.customerType} options={TYPES} onChange={(customerType) => setFilter({ ...filter, customerType })} />
      </div>
      {error && <p className="ins-muted" role="alert">Could not load groups: {error}</p>}
      {data && (
        <section className="ins-card" aria-busy={loading}>
          <table className="ins-table">
            <caption className="ins-sr">Groups sorted by rental potential per month</caption>
            <thead>
              <tr><th scope="col">Group</th><th scope="col" className="r">Customers</th><th scope="col" className="r">Reachable</th><th scope="col" className="r">Trend</th><th scope="col">Recommended rental</th><th scope="col" className="r">Potential / month</th><th scope="col"><span className="ins-sr">Action</span></th></tr>
            </thead>
            <tbody>
              {data.segments.map((s) => (
                <tr key={s.id}>
                  <th scope="row"><b>{s.label}</b><small>{groupMeta(s)}</small></th>
                  <td className="r ins-num" data-label="Customers">{num(s.customers)}</td>
                  <td className="r ins-num" data-label="Reachable">{num(s.reachable)} <small>{s.consentPct}%</small></td>
                  <td className="r ins-num" data-label="Trend">{s.trendPct > 0 ? '+' : ''}{s.trendPct}%</td>
                  <td data-label="Rental">{s.product.name}<small>{euro(s.product.monthly)} / month · {s.partner}</small></td>
                  <td className="r ins-num" data-label="Potential"><b>{eur(s.monthlyRevenue)}</b></td>
                  <td className="ins-act">
                    {running.includes(s.id)
                      ? <a className="ins-btn ins-btn-sm ins-ghost" href={href.campaign(s.id)} aria-label={`Results: ${s.label}`}><span className="ins-dot ins-dot-live" aria-hidden="true" />Running</a>
                      : <a className="ins-btn ins-btn-sm" href={href.newCampaign(s.id)} aria-label={`Plan campaign: ${s.label}`}>Plan</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.segments.length === 0 && <p className="ins-pad ins-muted">No groups match these filters.</p>}
          {data.hiddenCount > 0 && <p className="ins-fine ins-pad-x"><Icon name="shield" size={14} /> {data.hiddenCount} hidden (under {MIN_GROUP_SIZE} customers)</p>}
        </section>
      )}
    </>
  )
}
