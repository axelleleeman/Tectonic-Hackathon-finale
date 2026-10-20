import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { greeting } from '../model.js'
import { useCountUp, useReveal } from '../useReveal.js'

/** One key figure: a short label and a big number. With `link` the whole tile opens a detail page. */
function Tile({ label, n, format, tone, link, run, i }) {
  const shown = useCountUp(n, run)
  const value = format(n)
  const body = (
    <>
      <span className="lp-tile-label">{label}</span>
      <b className={`lp-tile-num lp-num ${tone === 'eco' ? 'lp-eco' : ''}`}>
        <span className="lp-sr">{value}</span><span aria-hidden="true">{format(shown)}</span>
      </b>
    </>
  )
  const style = { '--i': i }
  if (!link) return <div className="lp-tile lp-rv" style={style}>{body}</div>
  return (
    <a className="lp-tile lp-tile-link lp-rv" style={style} href={link.href} aria-label={`${label}: ${value}. ${link.label}`}
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
  const [ref, run] = useReveal()
  return (
    <section ref={ref} className="lp-metrics" aria-labelledby="lp-metrics-title">
      <div className="lp-metrics-head">
        <div className="lp-min0">
          <div className="lp-eyebrow">{greeting()}, {customer.name}</div>
          <h2 id="lp-metrics-title">Your impact</h2>
        </div>
      </div>
      <div className="lp-tiles">
        <Tile i={0} run={run} label="Per month" n={totals.monthly} format={euro}
          link={{ href: '#loop/costs', label: 'View cost overview', onClick: onCosts }} />
        <Tile i={1} run={run} label="CO₂ saved" n={totals.co2Kg} format={(v) => `${num(v)} kg`} tone="eco" />
        <Tile i={2} run={run} label="Repairs" n={totals.repairs} format={num} />
        <Tile i={3} run={run} label="Kate Coins" n={coins} format={num} />
      </div>
    </section>
  )
}
