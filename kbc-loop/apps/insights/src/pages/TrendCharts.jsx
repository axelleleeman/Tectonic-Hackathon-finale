import { num } from '@kbc-loop/shared/engine/format.js'
import { LineChart } from '../components/LineChart.jsx'
import { illustrativeTrend } from '../portfolio.js'
import { eur } from '../model.js'

const compactEuro = (v) => (v >= 1000 ? `€ ${num(v / 1000, 0)}k` : `€ ${num(v)}`)
const compactNum = (v) => (v >= 1000 ? `${num(v / 1000, 1)}k` : num(v))

/** Two small multiples (own scale each, no dual axis): recurring revenue and active contracts. */
export function TrendCharts({ p }) {
  return (
    <section className="ins-card ins-pad" aria-labelledby="trend-h">
      <div className="ins-section-head ins-row ins-between">
        <div>
          <h2 id="trend-h" className="ins-h2">12-month trend</h2>
          <p className="ins-chart-cap">Ends at today&apos;s live figures</p>
        </div>
        <span className="ins-tag">Illustrative trend</span>
      </div>
      <div className="ins-trends">
        <LineChart title="Monthly recurring revenue" points={illustrativeTrend('mrr', p.mrr, 140)} format={eur} formatTick={compactEuro} />
        <LineChart title="Active contracts" tone="navy" points={illustrativeTrend('contracts', p.activeContracts, 120)} format={num} formatTick={compactNum} />
      </div>
      <p className="ins-fine">Illustrative: the earlier months are modelled from the current figures, not historical bookings.</p>
    </section>
  )
}
