import { euro, formatDate, num } from '@kbc-loop/shared/engine/format.js'
import { campaignResults } from '@kbc-loop/shared/engine/campaigns.js'
import { PageHead } from '../components/PageHead.jsx'
import { StatusPill } from '../components/StatusPill.jsx'
import { Icon } from '../components/Icon.jsx'
import { AUDIENCE_LABEL, TODAY, campaignList, resolveDetail, eur } from '../model.js'
import { href } from '../useRoute.js'

/** Running and stopped Kate campaigns, each linking to its results. */
export function Campaigns({ state, segments }) {
  const { running, stopped } = campaignList(state)
  const byId = (id) => segments.find((s) => s.id === id)
  const card = (id, isRunning) => {
    const s = byId(id)
    if (!s) return null
    const d = resolveDetail(s, state.campaignDetails?.[id], isRunning)
    const r = campaignResults(s, d, TODAY)
    return (
      <li key={id}>
        <a className="ins-card ins-camp" href={href.campaign(id)}>
          <div className="ins-camp-head">
            <StatusPill status={d.status} />
            <span className="ins-muted ins-small">Since {formatDate(d.startedOn)}</span>
          </div>
          <h3>{s.label}</h3>
          <p className="ins-muted ins-small">{AUDIENCE_LABEL[d.audience]} · budget {euro(d.budget)}</p>
          <dl className="ins-camp-nums">
            <div><dt>Reached</dt><dd className="ins-num">{num(r.reached)}</dd></div>
            <div><dt>Contracts</dt><dd className="ins-num">{num(r.contracts)}</dd></div>
            <div><dt>Revenue / month</dt><dd className="ins-num">{eur(r.monthlyRevenue)}</dd></div>
          </dl>
          <span className="ins-camp-link">View results<Icon name="arrow" size={16} /></span>
        </a>
      </li>
    )
  }
  return (
    <>
      <PageHead eyebrow="Campaigns" title="Kate campaigns"
        actions={<a className="ins-btn ins-primary" href={href.newCampaign()}><Icon name="plus" />New campaign</a>} />

      <section aria-labelledby="run-h" className="ins-section">
        <h2 id="run-h" className="ins-h2">Running <span className="ins-muted">({running.length})</span></h2>
        {running.length === 0
          ? <div className="ins-card ins-pad ins-empty"><p>No campaigns yet</p><a className="ins-btn ins-primary" href={href.newCampaign()}>New campaign</a></div>
          : <ul className="ins-camps">{running.map((id) => card(id, true))}</ul>}
      </section>

      {stopped.length > 0 && (
        <section aria-labelledby="stop-h" className="ins-section">
          <h2 id="stop-h" className="ins-h2">Stopped <span className="ins-muted">({stopped.length})</span></h2>
          <ul className="ins-camps">{stopped.map((id) => card(id, false))}</ul>
        </section>
      )}
    </>
  )
}
