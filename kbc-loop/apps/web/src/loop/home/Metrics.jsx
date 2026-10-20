import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { greeting } from '../model.js'

/** One key figure: a short label and a big number. With `link` the whole tile opens a detail page. */
function Tile({ label, value, tone, link }) {
  const body = (
    <>
      <span className="lp-tile-label">{label}</span>
      <b className={`lp-tile-num lp-num ${tone === 'eco' ? 'lp-eco' : ''}`}>{value}</b>
    </>
  )
  if (!link) return <div className="lp-tile">{body}</div>
  return (
    <a className="lp-tile lp-tile-link" href={link.href} aria-label={`${label}: ${value}. ${link.label}`}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); link.onClick() }}>
      {body}
      <LoopIcon name="arrow" size={16} className="lp-tile-arrow" />
    </a>
  )
}

/**
 * Start-screen metrics: four equal tiles with a big number and a short label.
 * Figures come only from the shared calculations (loopTotals) and `coins` from the state,
 * so web and app always show the same numbers.
 */
export function Metrics({ customer, totals, coins, onCosts }) {
  return (
    <section className="lp-metrics" aria-labelledby="lp-metrics-title">
      <div className="lp-metrics-head">
        <div className="lp-min0">
          <div className="lp-eyebrow">{greeting()}, {customer.name}</div>
          <h2 id="lp-metrics-title">Your impact</h2>
        </div>
      </div>
      <div className="lp-tiles">
        <Tile label="Per month" value={euro(totals.monthly)}
          link={{ href: '#loop/costs', label: 'View cost overview', onClick: onCosts }} />
        <Tile label="CO₂ saved" value={`${num(totals.co2Kg)} kg`} tone="eco" />
        <Tile label="Repairs" value={num(totals.repairs)} />
        <Tile label="Kate Coins" value={num(coins)} />
      </div>
    </section>
  )
}
