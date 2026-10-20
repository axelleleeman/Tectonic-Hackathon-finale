import { carKmEquivalent } from '@kbc-loop/shared/engine/impact.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from './LoopIcon.jsx'

/**
 * Impact card, identical to the app's: Kate Coins and CO₂ saved, plus products in use and repairs.
 * Figures come only from the shared calculations (loopTotals, carKmEquivalent) and `coins` from the state,
 * so web and app always show the same numbers.
 */
export function ImpactCard({ totals, coins }) {
  return (
    <section className="lp-card lp-impact" aria-label="Your impact">
      <div className="lp-impact-figs">
        <div className="lp-fig">
          <span className="lp-fig-ic lp-fig-coin" aria-hidden="true"><span className="lp-coin" /></span>
          <div>
            <div className="lp-fig-label">Kate Coins</div>
            <b className="lp-fig-num lp-num">{num(coins)}</b>
            <div className="lp-fig-cap">earned by repairing and returning</div>
          </div>
        </div>
        <div className="lp-fig">
          <span className="lp-fig-ic lp-fig-leaf" aria-hidden="true"><LoopIcon name="leaf" size={22} /></span>
          <div>
            <div className="lp-fig-label">CO₂ saved</div>
            <b className="lp-fig-num lp-num lp-eco">{num(totals.co2Kg)} kg</b>
            <div className="lp-fig-cap">≈ {num(carKmEquivalent(totals.co2Kg))} km by car</div>
          </div>
        </div>
      </div>
      <p className="lp-impact-line">
        Products in use: <b className="lp-num">{totals.active}</b>
        <span aria-hidden="true"> · </span>
        Repairs instead of replacements: <b className="lp-num">{totals.repairs}</b>
      </p>
    </section>
  )
}
