import { eur, signedPct, trendSeries, weightedPct } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { PageHead } from '../components/PageHead.jsx'
import { KpiGrid, KpiTile } from '../components/KpiTile.jsx'
import { BarChart } from '../components/BarChart.jsx'
import { Icon } from '../components/Icon.jsx'
import { TopOpportunities } from './TopOpportunities.jsx'
import { href } from '../useRoute.js'

const CHART_ROWS = 6
const compactEuro = (v) => (v >= 1000 ? `€ ${num(v / 1000, 1)}k` : `€ ${num(v)}`)

/** First screen: navy band with four headline numbers, one chart and the three best opportunities. */
export function Overview({ state, segments, data }) {
  const { totals } = data
  const running = state.campaigns ?? []
  const rest = segments.length - CHART_ROWS
  // Trend per KPI: change in payments vs. last year, weighted by what the KPI measures.
  const trend = (weight) => weightedPct(segments, (s) => s.trendPct, weight)
  const kpis = [
    ['reach', 'Reachable customers', totals.reachable, num(totals.reachable), trend((s) => s.reachable)],
    ['contracts', 'Expected contracts', totals.expectedContracts, num(totals.expectedContracts), trend((s) => s.expectedContracts)],
    ['rent', 'Rent per month', totals.monthlyRevenue, eur(totals.monthlyRevenue), trend((s) => s.monthlyRevenue)],
    ['co2', 'CO₂ avoided', totals.co2Tons, `${num(totals.co2Tons)} t`, trend((s) => s.co2Tons)],
  ]
  return (
    <>
      <PageHead eyebrow="Overview" title="Opportunities"
        below={(
          <KpiGrid label="Potential across all groups">
            {kpis.map(([id, label, value, display, pct]) => (
              <KpiTile key={id} label={label} value={display} trend={trendSeries(id, value, pct)}
                sub={<><b className={pct >= 0 ? 'ins-up' : ''}>{signedPct(pct)}</b> spending pattern vs. last year</>} />
            ))}
          </KpiGrid>
        )}>
        Anonymised spending groups that could rent instead of repairing or buying again, and what a Kate campaign could bring.
      </PageHead>

      {running.length > 0 && (
        <a className="ins-banner" href={href.campaigns}>
          <span className="ins-dot ins-dot-live" aria-hidden="true" />
          <span><b>{running.length} campaign{running.length > 1 ? 's' : ''} running</b></span>
          <Icon name="arrow" />
        </a>
      )}

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
