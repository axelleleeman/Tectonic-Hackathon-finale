import { useId } from 'react'
import './tipFlow.css'

// Geometry of the sparkline (viewBox units). The desktop variant reserves space on the right for the curve
// that runs from the highlighted point to the insight pill; the phone variant is the chart alone.
const H = 150
const TOP = 34
const BOTTOM = 118
const LEFT = 14
const CHART_R = 286
const WIDE = 360

function points(series) {
  const max = Math.max(...series.points.map((p) => p.value)) * 1.08 || 1
  const step = (CHART_R - LEFT) / (series.points.length - 1)
  return series.points.map((p, i) => ({ ...p, x: LEFT + i * step, y: BOTTOM - (p.value / max) * (BOTTOM - TOP) }))
}

/** Sparkline with the highlighted point, its amount chip and (wide) the connector to the insight. Decorative. */
function Sparkline({ visual, wide }) {
  const uid = useId().replace(/:/g, '')
  const pts = points(visual.series)
  const hi = pts[visual.series.highlight]
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${CHART_R} ${BOTTOM} L${LEFT} ${BOTTOM} Z`
  const chipW = Math.max(48, visual.chip.length * 7.6 + 18)
  const chipX = Math.max(2, Math.min(hi.x - chipW / 2, CHART_R - chipW + 10))
  const chipY = Math.max(2, hi.y - 36)
  const link = `M${hi.x} ${hi.y} C ${hi.x + 44} ${hi.y} ${WIDE - 44} ${H / 2} ${WIDE} ${H / 2}`
  return (
    <svg className={`tf-spark ${wide ? 'tf-wide' : 'tf-narrow'}`} viewBox={`0 0 ${wide ? WIDE : CHART_R + 14} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`a${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4AABEE" stopOpacity=".32" /><stop offset="1" stopColor="#4AABEE" stopOpacity="0" />
        </linearGradient>
        <filter id={`g${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1={LEFT} y1={BOTTOM} x2={CHART_R} y2={BOTTOM} stroke="#FFFFFF" strokeOpacity=".1" />
      <path d={area} fill={`url(#a${uid})`} />
      <path d={line} fill="none" stroke="#4AABEE" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter={`url(#g${uid})`} />
      {pts.filter((p) => p.marked).map((p) => (
        <circle key={p.key} cx={p.x} cy={p.y} r="4.5" fill="#F0A15A" stroke="#0B2A5B" strokeWidth="2" />
      ))}
      {wide && (
        <g fill="none" strokeLinecap="round">
          <path d={link} stroke="#7FC4F4" strokeWidth="2.5" filter={`url(#g${uid})`} />
          <path className="tf-flow" pathLength="1" d={link} stroke="#FFFFFF" strokeWidth="2.5" />
        </g>
      )}
      <rect x={chipX} y={chipY} width={chipW} height="24" rx="12" fill="#4AABEE" fillOpacity=".22" stroke="#4AABEE" />
      <text x={chipX + chipW / 2} y={chipY + 16.5} textAnchor="middle" className="tf-chip">{visual.chip}</text>
      <circle className="tf-pulse" cx={hi.x} cy={hi.y} r="6" fill="#4AABEE" />
      <circle cx={hi.x} cy={hi.y} r="6.5" fill="#FFFFFF" stroke="#4AABEE" strokeWidth="3" />
      <text x={LEFT} y={H - 6} className="tf-axis">{visual.series.first}</text>
      <text x={CHART_R} y={H - 6} textAnchor="end" className="tf-axis">{visual.series.last}</text>
    </svg>
  )
}

/** Horizontal (desktop) or vertical (phone) glowing connector with flowing dashes. Decorative. */
function Connector({ vertical }) {
  const d = vertical ? 'M20 0 C 20 14 20 18 20 32' : 'M0 40 C 24 40 32 40 56 40'
  return (
    <svg className={vertical ? 'tf-con tf-con-v' : 'tf-con tf-con-h'} viewBox={vertical ? '0 0 40 32' : '0 0 56 80'} aria-hidden="true" focusable="false">
      <path d={d} fill="none" stroke="#7FC4F4" strokeWidth="2.5" strokeLinecap="round" />
      <path className="tf-flow" pathLength="1" d={d} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * One Kate tip as "expenditure pattern → data insight → Kate recommendation" (style of public/kate-flow.html).
 * `visual` comes from @kbc-loop/shared/kate/tipVisual.js; `actions` are the CTA buttons; `reasons` fill "Why?".
 */
export function TipFlow({ visual, title, reasons, actions, onDismiss }) {
  const hasChart = Boolean(visual.series)
  return (
    <article className={`tf-card${hasChart ? '' : ' tf-no-chart'}`}>
      <h3 className="tf-sr">{title}</h3>
      <p className="tf-sr">{visual.summary}</p>
      {hasChart && (
        <div className="tf-zone tf-pattern" aria-hidden="true">
          <span className="tf-step">Expenditure pattern</span>
          <Sparkline visual={visual} wide />
          <Sparkline visual={visual} />
        </div>
      )}
      {hasChart && <Connector vertical />}
      <div className="tf-zone tf-insight" aria-hidden="true">
        <span className="tf-step">Data insight</span>
        <span className="tf-pill"><i />{visual.insight}</span>
      </div>
      <Connector />
      <Connector vertical />
      <div className="tf-kate">
        <div className="tf-kate-head"><span className="tf-avatar" aria-hidden="true">K</span><span>Kate</span></div>
        <p className="tf-line">{visual.line}</p>
        {visual.price && <span className="tf-price">{visual.price}</span>}
        <div className="tf-actions">
          {actions}
          <button type="button" className="tf-btn tf-ghost" onClick={onDismiss} aria-label={`Dismiss tip: ${title}`}>Dismiss</button>
        </div>
        {reasons.length > 0 && (
          <details className="tf-why">
            <summary>Why?</summary>
            <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </details>
        )}
      </div>
    </article>
  )
}
