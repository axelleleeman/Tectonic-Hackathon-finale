import { eur } from '../model.js'
import { num } from '@kbc-loop/shared/engine/format.js'

/** Expected end result for the current settings, in one compact row. */
export function ForecastStrip({ forecast: f }) {
  return (
    <section className="ins-forecast" aria-label="Expected result">
      <p className="ins-eyebrow">Expected result</p>
      <dl>
        <div><dt>Reached</dt><dd className="ins-num">{num(f.target)}</dd></div>
        <div><dt>Contracts</dt><dd className="ins-num">{num(f.contracts)}</dd></div>
        <div><dt>Rent / month</dt><dd className="ins-num">{eur(f.monthlyRevenue)}</dd></div>
        <div className="ins-eco-surface"><dt>CO₂ avoided</dt><dd className="ins-num">{num(f.co2Tons, 1)} t</dd></div>
      </dl>
    </section>
  )
}
