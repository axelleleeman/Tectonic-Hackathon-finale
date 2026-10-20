import { useMemo, useState } from 'react'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { MIN_GROUP_SIZE } from '@kbc-loop/shared/config/index.js'
import { PageHead } from '../components/PageHead.jsx'
import { Segmented } from '../components/Segmented.jsx'
import { Icon } from '../components/Icon.jsx'
import { ErrorBanner } from '../components/ErrorBanner.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { ALL, useInsights } from '../useInsights.js'
import { groupMeta, eur } from '../model.js'
import { href } from '../useRoute.js'

const KINDS = [['alle', 'All'], ['herstelling', 'Repairs'], ['herhaalaankoop', 'Repeat purchases']]
const TYPES = [['alle', 'All customers'], ['particulier', 'Private'], ['kmo', 'SME']]

/** Sortable columns: [key, header, value getter, numeric] */
const COLUMNS = [
  ['label', 'Group', (s) => s.label, false],
  ['customers', 'Customers', (s) => s.customers, true],
  ['reachable', 'Reachable', (s) => s.reachable, true],
  ['trend', 'Trend', (s) => s.trendPct, true],
  ['rental', 'Recommended rental', (s) => s.product.monthly, true],
  ['potential', 'Potential / month', (s) => s.monthlyRevenue, true],
]
const DEFAULT_SORT = { key: 'potential', dir: 'desc' }

const pct = (n) => `${n > 0 ? '+' : ''}${num(n)}%`

/** All groups in one sortable table, with filters. Rows turn into cards on small screens. */
export function Groups({ state }) {
  const [filter, setFilter] = useState(ALL)
  const [sort, setSort] = useState(DEFAULT_SORT)
  const { data, loading, error } = useInsights(filter)
  const running = state.campaigns ?? []

  const rows = useMemo(() => {
    if (!data) return []
    const [, , get, numeric] = COLUMNS.find(([k]) => k === sort.key)
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...data.segments].sort((a, b) => sign * (numeric ? get(a) - get(b) : get(a).localeCompare(get(b), 'en')))
  }, [data, sort])

  const toggleSort = (key, numeric) => setSort((s) => (s.key === key
    ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
    : { key, dir: numeric ? 'desc' : 'asc' }))
  const sortLabel = COLUMNS.find(([k]) => k === sort.key)[1]

  return (
    <>
      <PageHead eyebrow="Groups" title="All groups">
        Anonymised spending groups with a recommended rental product. Groups under {MIN_GROUP_SIZE} customers are never shown.
      </PageHead>
      <div className="ins-filters">
        <Segmented label="Pattern" name="kind" value={filter.kind} options={KINDS} onChange={(kind) => setFilter({ ...filter, kind })} />
        <Segmented label="Customer type" name="type" value={filter.customerType} options={TYPES} onChange={(customerType) => setFilter({ ...filter, customerType })} />
        <label className="ins-sort-mobile">
          <span className="ins-small ins-muted">Sort by</span>
          <select className="ins-select" value={`${sort.key}:${sort.dir}`} onChange={(e) => { const [key, dir] = e.target.value.split(':'); setSort({ key, dir }) }}>
            {COLUMNS.flatMap(([k, l, , numeric]) => [
              <option key={`${k}d`} value={`${k}:desc`}>{l} {numeric ? '(high to low)' : '(Z to A)'}</option>,
              <option key={`${k}a`} value={`${k}:asc`}>{l} {numeric ? '(low to high)' : '(A to Z)'}</option>,
            ])}
          </select>
        </label>
      </div>

      {error && <ErrorBanner title="Could not load groups">{error}. The table shows the last result that loaded.</ErrorBanner>}

      {!data && !error && (
        <section className="ins-card" aria-busy="true" aria-label="Loading groups">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="ins-skel-row"><Skeleton w="34%" h={16} /><Skeleton w="12%" /><Skeleton w="12%" /><Skeleton w="18%" /><Skeleton w="10%" h={28} /></div>
          ))}
        </section>
      )}

      {data && (
        <section className={`ins-card ins-table-card ${loading ? 'is-loading' : ''}`} aria-busy={loading} aria-label="Groups">
          <table className="ins-table">
            <caption className="ins-sr">Groups, sorted by {sortLabel} ({sort.dir === 'asc' ? 'ascending' : 'descending'})</caption>
            <thead>
              <tr>
                {COLUMNS.map(([k, label, , numeric]) => {
                  const on = sort.key === k
                  return (
                    <th key={k} scope="col" className={numeric && k !== 'rental' ? 'r' : ''} aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                      <button type="button" className={`ins-sort ${on ? 'on' : ''}`} onClick={() => toggleSort(k, numeric)}>
                        {label}<span className={`ins-sort-i ${on ? sort.dir : ''}`} aria-hidden="true" />
                      </button>
                    </th>
                  )
                })}
                <th scope="col"><span className="ins-sr">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <th scope="row"><b>{s.label}</b><small>{groupMeta(s)}</small></th>
                  <td className="r ins-num" data-label="Customers">{num(s.customers)}</td>
                  <td className="r ins-num" data-label="Reachable">{num(s.reachable)} <small>{num(s.consentPct)}%</small></td>
                  <td className={`r ins-num ${s.trendPct > 0 ? 'ins-up' : ''}`} data-label="Trend">{pct(s.trendPct)}</td>
                  <td data-label="Recommended rental">{s.product.name}<small><span className="ins-num">{euro(s.product.monthly)}</span> / month · {s.partner}</small></td>
                  <td className="r ins-num" data-label="Potential / month"><b>{eur(s.monthlyRevenue)}</b></td>
                  <td className="ins-act">
                    {running.includes(s.id)
                      ? <a className="ins-btn ins-btn-sm ins-ghost" href={href.campaign(s.id)} aria-label={`Results: ${s.label}`}><span className="ins-dot ins-dot-live" aria-hidden="true" />Running</a>
                      : <a className="ins-btn ins-btn-sm" href={href.newCampaign(s.id)} aria-label={`Plan campaign: ${s.label}`}>Plan</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="ins-pad ins-empty">
              <p>No groups match these filters.</p>
              <button type="button" className="ins-btn ins-btn-sm" onClick={() => setFilter(ALL)}>Clear filters</button>
            </div>
          )}
          {data.hiddenCount > 0 && <p className="ins-fine ins-pad-x"><Icon name="shield" size={14} /> {num(data.hiddenCount)} hidden (under {MIN_GROUP_SIZE} customers)</p>}
        </section>
      )}
    </>
  )
}
