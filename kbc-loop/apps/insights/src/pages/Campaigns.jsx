import { euro, formatDate, num } from '@kbc-loop/shared/engine/format.js'
import { addDays, campaignResults } from '@kbc-loop/shared/engine/campaigns.js'
import { ProductImage } from '@kbc-loop/web-ui/components/ProductImage.jsx'
import { PageHead } from '../components/PageHead.jsx'
import { StatusPill } from '../components/StatusPill.jsx'
import { Sparkline } from '../components/Sparkline.jsx'
import { Icon } from '../components/Icon.jsx'
import { AUDIENCE_LABEL, TODAY, campaignList, resolveDetail, eur } from '../model.js'
import { href } from '../useRoute.js'

const SPARK_DAYS = 14

/** One row of figures per campaign; the sparkline shows simulated signed contracts over (at least) the first two weeks. */
function campaignRow(s, detail) {
  const r = campaignResults(s, detail, TODAY)
  const lastDay = Math.max(r.day, SPARK_DAYS - 1)
  const spark = Array.from({ length: SPARK_DAYS }, (_, i) => {
    const day = Math.round((i / (SPARK_DAYS - 1)) * lastDay)
    return campaignResults(s, detail, addDays(detail.startedOn, day)).contracts
  })
  const conversion = r.reached ? (r.contracts / r.reached) * 100 : 0
  return { s, d: detail, r, spark, conversion }
}

/** All Kate campaigns as one management list: status, audience, budget, reach, conversion and trend. */
export function Campaigns({ state, segments }) {
  const { running, stopped } = campaignList(state)
  const rows = [...running.map((id) => [id, true]), ...stopped.map((id) => [id, false])]
    .map(([id, isRunning]) => {
      const s = segments.find((x) => x.id === id)
      return s ? campaignRow(s, resolveDetail(s, state.campaignDetails?.[id], isRunning)) : null
    })
    .filter(Boolean)
  const totals = rows.reduce((t, x) => ({ budget: t.budget + x.d.budget, reached: t.reached + x.r.reached, contracts: t.contracts + x.r.contracts, revenue: t.revenue + x.r.monthlyRevenue }), { budget: 0, reached: 0, contracts: 0, revenue: 0 })

  return (
    <>
      <PageHead eyebrow="Campaigns" title="Kate campaigns"
        below={rows.length > 0 && (
          <dl className="ins-hero-figs">
            <div><dt>Running</dt><dd className="ins-num">{num(running.length)}</dd></div>
            <div><dt>Stopped</dt><dd className="ins-num">{num(stopped.length)}</dd></div>
            <div><dt>Total budget</dt><dd className="ins-num">{euro(totals.budget)}</dd></div>
            <div><dt>Reached</dt><dd className="ins-num">{num(totals.reached)}</dd></div>
            <div><dt>Contracts</dt><dd className="ins-num">{num(totals.contracts)}</dd></div>
            <div><dt>Revenue / month</dt><dd className="ins-num">{eur(totals.revenue)}</dd></div>
          </dl>
        )}
        actions={<a className="ins-btn ins-primary" href={href.newCampaign()}><Icon name="plus" />New campaign</a>}>
        Every campaign reaches consenting customers as a tip from Kate in KBC Mobile. Results are simulated from each group&apos;s figures.
      </PageHead>

      {rows.length === 0 ? (
        <section className="ins-card ins-empty-state" aria-labelledby="empty-h">
          <span className="ins-empty-icon" aria-hidden="true"><Icon name="phone" size={28} /></span>
          <h2 id="empty-h" className="ins-h2">No campaigns yet</h2>
          <p className="ins-muted">Pick a spending group, write the Kate message and choose an audience and budget. You see the expected result before anything is sent.</p>
          <div className="ins-row">
            <a className="ins-btn ins-primary" href={href.newCampaign()}><Icon name="plus" />Plan your first campaign</a>
            <a className="ins-btn" href={href.groups}>Browse groups</a>
          </div>
        </section>
      ) : (
        <section className="ins-section" aria-labelledby="camp-h">
          <div className="ins-section-head"><h2 id="camp-h" className="ins-h2">All campaigns <span className="ins-muted ins-num">({num(rows.length)})</span></h2></div>
          <div className="ins-card ins-table-card">
            <table className="ins-table ins-ctable">
              <caption className="ins-sr">Kate campaigns with status, audience, budget, reach, conversion and contracts over the first two weeks</caption>
              <thead>
                <tr>
                  <th scope="col">Campaign</th>
                  <th scope="col">Status</th>
                  <th scope="col">Audience</th>
                  <th scope="col" className="r">Budget</th>
                  <th scope="col" className="r">Reached</th>
                  <th scope="col" className="r">Conversion</th>
                  <th scope="col">Contracts, 2 weeks</th>
                  <th scope="col"><span className="ins-sr">Action</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ s, d, r, spark, conversion }) => (
                  <tr key={s.id}>
                    <th scope="row">
                      <span className="ins-ctable-name">
                        <ProductImage product={s.productId ?? s.product} style={{ width: 48, height: 36 }} className="ins-camp-img" />
                        <span className="ins-min0"><b>{s.label}</b><small>{s.product.name} · {s.partner} · since {formatDate(d.startedOn)}</small></span>
                      </span>
                    </th>
                    <td data-label="Status"><StatusPill status={d.status} /></td>
                    <td data-label="Audience">{AUDIENCE_LABEL[d.audience]}</td>
                    <td className="r ins-num" data-label="Budget">{euro(d.budget)}<small>{euro(r.spent)} spent</small></td>
                    <td className="r ins-num" data-label="Reached">{num(r.reached)}<small>{num(r.reachedPct)}% of target</small></td>
                    <td className="r ins-num" data-label="Conversion">{num(conversion, 1)}%<small>{num(r.contracts)} contracts</small></td>
                    <td data-label="Contracts, 2 weeks">
                      <span className="ins-ctable-spark"><Sparkline values={spark} tone={d.status === 'running' ? 'eco' : 'muted'} /><span className="ins-sr">{num(r.contracts)} contracts after day {num(r.day)}</span></span>
                    </td>
                    <td className="ins-act"><a className="ins-btn ins-btn-sm" href={href.campaign(s.id)} aria-label={`View results: ${s.label}`}>Results<Icon name="chev" size={16} /></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}
