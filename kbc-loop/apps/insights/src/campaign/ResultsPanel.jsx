import { eur } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { KpiGrid, KpiTile } from '../components/KpiTile.jsx'
import { BarChart } from '../components/BarChart.jsx'

/** Results dashboard: six tiles (funnel + outcome), the funnel as one chart, and the message that was sent. */
export function ResultsPanel({ results: r, message }) {
  const funnel = [
    ['reached', 'Reached', r.reached], ['opened', 'Opened', r.opened], ['clicked', 'Clicked through', r.clicked], ['contracts', 'Signed a contract', r.contracts],
  ]
  return (
    <>
      <KpiGrid cols={3} label="Campaign results">
        <KpiTile size="md" label="Reached" value={num(r.reached)} progress={r.reachedPct} sub={`${r.reachedPct}% of ${num(r.target)}`} />
        <KpiTile size="md" label="Opened" value={num(r.opened)} sub={`${r.openRate}%`} />
        <KpiTile size="md" label="Clicked through" value={num(r.clicked)} sub={`${r.clickRate}%`} />
        <KpiTile size="md" label="Contracts" value={num(r.contracts)} sub={`forecast ${num(r.forecast.contracts)}`} />
        <KpiTile size="md" label="Rent per month" value={eur(r.monthlyRevenue)} sub={`${eur(r.kbcMarginMonthly)} KBC margin`} />
        <KpiTile size="md" label="CO₂ avoided" value={`${num(r.co2Tons, 1)} t`} />
      </KpiGrid>

      <div className="ins-split">
        <section className="ins-card ins-pad">
          <BarChart title="Funnel" caption={`Customers per stage, out of ${num(r.target)} targeted`} valueHeader="Customers"
            formatTick={(v) => num(v)}
            rows={funnel.map(([id, label, value], i) => ({
              id, label, value, display: num(value),
              detail: i === 0 ? `${num(r.reachedPct)}% of the target audience` : `${num(funnel[i - 1][2] ? Math.round((value / funnel[i - 1][2]) * 100) : 0)}% of ${funnel[i - 1][1].toLowerCase()}`,
            }))} />
        </section>
        <section className="ins-card ins-pad" aria-labelledby="msg-h">
          <h2 id="msg-h" className="ins-h2">Message sent</h2>
          <blockquote className="ins-quote">{message}</blockquote>
        </section>
      </div>
    </>
  )
}
