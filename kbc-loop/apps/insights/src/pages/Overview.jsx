import { eur } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { PageHead } from '../components/PageHead.jsx'
import { KpiGrid, KpiTile } from '../components/KpiTile.jsx'
import { BarChart } from '../components/BarChart.jsx'
import { Icon } from '../components/Icon.jsx'
import { TopOpportunities } from './TopOpportunities.jsx'
import { href } from '../useRoute.js'

const CHART_ROWS = 6
const compactEuro = (v) => (v >= 1000 ? `€ ${num(v / 1000, 1)}k` : `€ ${num(v)}`)

/** First screen: four headline numbers, one chart and the three best opportunities. */
export function Overview({ state, segments, data }) {
  const { totals } = data
  const running = state.campaigns ?? []
  const rest = segments.length - CHART_ROWS
  return (
    <>
      <PageHead eyebrow="Overview" title="Opportunities" />

      {running.length > 0 && (
        <a className="ins-banner" href={href.campaigns}>
          <span className="ins-dot ins-dot-live" aria-hidden="true" />
          <span><b>{running.length} campaign{running.length > 1 ? 's' : ''} running</b></span>
          <Icon name="arrow" />
        </a>
      )}

      <KpiGrid label="Potential across all groups">
        <KpiTile label="Reachable customers" value={num(totals.reachable)} />
        <KpiTile label="Expected contracts" value={num(totals.expectedContracts)} />
        <KpiTile label="Rent per month" value={eur(totals.monthlyRevenue)} />
        <KpiTile label="CO₂ avoided" value={`${num(totals.co2Tons)} t`} />
      </KpiGrid>

      <div className="ins-split">
        <section className="ins-card ins-pad">
          <BarChart
            title="Potential per month"
            caption={`Top ${Math.min(CHART_ROWS, segments.length)} groups by monthly rental revenue if every expected contract is signed`}
            valueHeader="Potential / month"
            formatTick={compactEuro}
            rows={segments.slice(0, CHART_ROWS).map((s) => ({
              id: s.id, label: s.label, value: s.monthlyRevenue, display: eur(s.monthlyRevenue),
              detail: `${num(s.reachable)} of ${num(s.customers)} customers reachable · ${s.product.name} from ${s.partner}`,
            }))}
            footer={rest > 0 && <p className="ins-chart-more"><a href={href.groups}>{rest} more group{rest > 1 ? 's' : ''}</a></p>}
          />
        </section>
        <TopOpportunities segments={segments} running={running} />
      </div>

      <p className="ins-center"><a className="ins-btn" href={href.groups}>View all groups<Icon name="arrow" /></a></p>
    </>
  )
}
