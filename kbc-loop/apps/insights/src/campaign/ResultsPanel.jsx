import { eur } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { ProductImage } from '@kbc-loop/web-ui/components/ProductImage.jsx'

const pctOf = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0)

/** Hero of the results page: signed contracts as one big number, with revenue, margin and CO₂ beside it. */
export function ResultsHero({ results: r, segment }) {
  const toForecast = pctOf(r.contracts, r.forecast.contracts)
  return (
    <section className="ins-res-hero" aria-label="Campaign outcome">
      <div className="ins-res-main">
        <ProductImage product={segment.productId ?? segment.product} className="ins-res-img" style={{ width: 96, height: 72 }} />
        <div className="ins-min0">
          <p className="ins-kpi-label">Contracts signed</p>
          <p className="ins-res-big ins-num">{num(r.contracts)}</p>
          <div className="ins-progress" role="progressbar" aria-label="Contracts signed compared with the forecast" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, toForecast)}>
            <span style={{ width: `${Math.min(100, toForecast)}%` }} />
          </div>
          <p className="ins-kpi-sub">{toForecast}% of the forecast of {num(r.forecast.contracts)} · {segment.product.name} from {segment.partner}</p>
        </div>
      </div>
      <dl className="ins-res-side">
        <div><dt>Rent per month</dt><dd className="ins-num">{eur(r.monthlyRevenue)}</dd></div>
        <div><dt>KBC margin / month</dt><dd className="ins-num">{eur(r.kbcMarginMonthly)}</dd></div>
        <div className="ins-eco-surface"><dt>CO₂ avoided</dt><dd className="ins-num">{num(r.co2Tons, 1)} t</dd></div>
      </dl>
    </section>
  )
}

/** Funnel from target audience to signed contracts (each stage as a centred bar with its conversion), plus the message sent. */
export function ResultsPanel({ results: r, message }) {
  const funnel = [
    ['reached', 'Reached', r.reached], ['opened', 'Opened', r.opened], ['clicked', 'Clicked through', r.clicked], ['contracts', 'Signed a contract', r.contracts],
  ]
  return (
    <div className="ins-split">
      <section className="ins-card ins-pad" aria-labelledby="funnel-h">
        <h2 id="funnel-h" className="ins-h2">Funnel</h2>
        <p className="ins-chart-cap">Customers per stage, out of {num(r.target)} targeted</p>
        <ol className="ins-funnel">
          {funnel.map(([id, label, value], i) => {
            const conv = i === 0 ? `${num(r.reachedPct)}% of the target audience` : `${pctOf(value, funnel[i - 1][2])}% of ${funnel[i - 1][1].toLowerCase()}`
            return (
              <li key={id}>
                <div className="ins-funnel-top"><span>{label}</span><b className="ins-num">{num(value)}</b></div>
                <span className="ins-funnel-track" aria-hidden="true"><span style={{ width: `${Math.max(2, pctOf(value, r.target))}%` }} /></span>
                <small>{conv}</small>
              </li>
            )
          })}
        </ol>
      </section>
      <section className="ins-card ins-pad" aria-labelledby="msg-h">
        <h2 id="msg-h" className="ins-h2">Message sent</h2>
        <p className="ins-chart-cap">As a tip from Kate in KBC Mobile</p>
        <blockquote className="ins-quote">{message}</blockquote>
      </section>
    </div>
  )
}
