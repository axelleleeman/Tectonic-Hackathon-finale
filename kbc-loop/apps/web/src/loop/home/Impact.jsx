import { num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { useCountUp, useReveal } from '../useReveal.js'
import { CostSnapshot } from './CostSnapshot.jsx'
import { ShareImpact } from '../share/ShareImpact.jsx'

/** A big counted-up figure; the final value is always available to screen readers. */
function Count({ n, format, run }) {
  const shown = useCountUp(n, run)
  return <><span className="lp-sr">{format(n)}</span><span aria-hidden="true">{format(shown)}</span></>
}

/** One of the two hero figures: a very large number, a label and one quiet line. */
function Hero({ label, n, unit, note, tone, run, i, onOpen, openLabel }) {
  const open = onOpen ? {
    role: 'button', tabIndex: 0, 'aria-label': `${label}: ${num(n)}. ${openLabel}`, onClick: onOpen,
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } },
  } : {}
  return (
    <div className={`lp-imp-hero lp-rv ${tone ? `lp-imp-${tone}` : ''} ${onOpen ? 'lp-imp-hero-btn' : ''}`} style={{ '--i': i }} {...open}>
      <span className="lp-imp-label">{label}</span>
      <b className="lp-imp-num lp-num">
        <Count n={n} format={num} run={run} />{unit && <span className="lp-imp-unit">{unit}</span>}
      </b>
      <p className="lp-imp-note">{note}</p>
    </div>
  )
}

/** A compact secondary figure; with `link` the whole tile opens a detail page. */
function Small({ label, n, format, link, run, i }) {
  const body = (
    <>
      <span className="lp-tile-label">{label}</span>
      <b className="lp-imp-small lp-num"><Count n={n} format={format} run={run} /></b>
    </>
  )
  const style = { '--i': i }
  if (!link) return <div className="lp-tile lp-rv" style={style}>{body}</div>
  return (
    <a className="lp-tile lp-tile-link lp-rv" style={style} href={link.href} aria-label={`${label}: ${format(n)}. ${link.label}`}
      onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); link.onClick() }}>
      {body}
      <LoopIcon name="arrow" size={16} className="lp-tile-arrow" />
    </a>
  )
}

/**
 * "Your impact": CO₂ saved and Kate Coins as two big figures, then a compact cost card and a row of secondary figures.
 * Figures come only from the shared calculations (loopTotals) and `coins` from the state,
 * so web and app always show the same numbers.
 */
export function Impact({ items, totals, coins, onCosts, onRewards, name }) {
  const [ref, run] = useReveal({ threshold: 0.15 })
  return (
    <section ref={ref} className="lp-impact" aria-label="Your impact">
      <div className="lp-imp-heroes">
        <Hero i={0} run={run} label="CO₂ saved" n={totals.co2Kg} unit="kg" tone="eco"
          note={`About ${num(totals.carKm)} km less driving by car`} />
        <Hero i={1} run={run} label="Kate Coins" n={coins}
          note="Earned every time you repair or return a product" onOpen={onRewards} openLabel="Open rewards" />
      </div>
      <CostSnapshot i={2} items={items} onCosts={onCosts} />
      <div className="lp-imp-row">
        <Small i={3} run={run} label="Products in use" n={totals.active} format={num} />
        <Small i={4} run={run} label="Repairs" n={totals.repairs} format={num} />
      </div>
      <div className="lp-share-row"><ShareImpact name={name} totals={totals} coins={coins} /></div>
    </section>
  )
}
