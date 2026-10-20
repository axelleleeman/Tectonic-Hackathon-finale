import { eur } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { href } from '../useRoute.js'
import { Icon } from '../components/Icon.jsx'

/** The three groups with the highest potential, each leading into the campaign flow. */
export function TopOpportunities({ segments, running }) {
  const top = segments.filter((s) => !running.includes(s.id)).slice(0, 3)
  return (
    <section className="ins-card ins-pad" aria-labelledby="top-h">
      <h2 id="top-h" className="ins-h2">Top opportunities</h2>
      {top.length === 0 && <p className="ins-muted">Every group already has a campaign.</p>}
      <ol className="ins-opps">
        {top.map((s, n) => (
          <li key={s.id} className="ins-opp">
            <span className="ins-opp-n" aria-hidden="true">{n + 1}</span>
            <div className="ins-min0">
              <h3>{s.label}</h3>
              <p className="ins-opp-nums"><span><b className="ins-num">{num(s.reachable)}</b> reachable</span><span><b className="ins-num">{eur(s.monthlyRevenue)}</b> / month</span></p>
            </div>
            <a className="ins-btn ins-btn-sm" href={href.newCampaign(s.id)} aria-label={`Plan campaign: ${s.label}`}>Plan<Icon name="chev" size={16} /></a>
          </li>
        ))}
      </ol>
    </section>
  )
}
