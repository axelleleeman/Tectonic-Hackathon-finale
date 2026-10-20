import { carKmEquivalent } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { greeting } from '../model.js'
import { LoopOrnament } from './LoopOrnament.jsx'

function Tile({ label, value, caption, icon, tone, size = 'sm', link }) {
  return (
    <div className={`lp-tile lp-tile-${size}`}>
      {icon && <span className={`lp-tile-ic lp-tone-${tone}`} aria-hidden="true">{icon}</span>}
      <div className="lp-min0">
        <div className="lp-tile-label">{label}</div>
        <b className={`lp-tile-num lp-num ${tone === 'eco' ? 'lp-eco' : ''}`}>{value}</b>
        {caption && <div className="lp-tile-cap">{caption}</div>}
        {link && (
          <a className="lp-tile-link" href={link.href} onClick={(e) => { e.preventDefault(); link.onClick() }}>
            {link.label}<LoopIcon name="arrow" size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * Start-screen metrics. Figures come only from the shared calculations (loopTotals, carKmEquivalent)
 * and `coins` from the state, so web and app always show the same numbers.
 */
export function Metrics({ customer, totals, coins, theme, onCosts }) {
  return (
    <section className="lp-metrics" aria-labelledby="lp-metrics-title">
      <div className="lp-metrics-head">
        <div className="lp-min0">
          <div className="lp-eyebrow">{greeting()}, {customer.name}</div>
          <h1 id="lp-metrics-title">Your impact with KBC LOOP</h1>
          <p>Use instead of own: repairs, upgrades and recycling are taken care of.</p>
        </div>
        <LoopOrnament theme={theme} />
      </div>
      <div className="lp-tiles">
        <Tile size="lg" label="Kate Coins" value={num(coins)} caption="earned by repairing and returning"
          tone="accent" icon={<span className="lp-coin" />} />
        <Tile size="lg" label="CO₂ saved" value={`${num(totals.co2Kg)} kg`} caption={`≈ ${num(carKmEquivalent(totals.co2Kg))} km by car`}
          tone="eco" icon={<LoopIcon name="leaf" size={22} />} />
        <Tile label="Monthly total" value={euro(totals.monthly)} caption="for products in use"
          link={{ href: '#loop/costs', label: 'View cost overview', onClick: onCosts }} />
        <Tile label="Products in use" value={num(totals.active)} />
        <Tile label="Repairs instead of replacements" value={num(totals.repairs)} />
      </div>
    </section>
  )
}
