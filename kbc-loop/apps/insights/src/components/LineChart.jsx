import { useId } from 'react'

const W = 600
const H = 200
const TICKS = [0, 0.5, 1]

/** Round the scale up to 1, 2, 2.5 or 5 × 10^n so gridlines land on readable values. */
function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(v || 1))
  return [1, 2, 2.5, 5, 10].find((m) => m * p >= v) * p
}

/**
 * Single-series line chart: the SVG only draws the line, area and gridlines (stretched to the card),
 * while axis labels and the end marker are HTML so text stays crisp at every width.
 * Text alternatives: a summary in aria-label and the full series as a table under "Show as table".
 * points: [{ label: { short, long }, value }], format: value → display text, formatTick: value → axis text
 */
export function LineChart({ title, caption, points, format, formatTick = format, tone = 'accent', note }) {
  const uid = useId()
  const max = niceMax(Math.max(...points.map((p) => p.value)) * 1.05)
  const x = (i) => (i / (points.length - 1)) * W
  const y = (v) => H - (v / max) * H
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const first = points[0]
  const last = points[points.length - 1]
  const change = first.value ? Math.round(((last.value - first.value) / first.value) * 100) : 0
  const summary = `${title}: from ${format(first.value)} in ${first.label.long} to ${format(last.value)} in ${last.label.long} (${change > 0 ? '+' : ''}${change}%).`
  return (
    <figure className={`ins-line ins-line-${tone}`} aria-labelledby={`${uid}-t`}>
      <figcaption>
        <h3 id={`${uid}-t`} className="ins-line-title">{title}</h3>
        <p className="ins-line-now"><b className="ins-num">{format(last.value)}</b> <span className={change >= 0 ? 'ins-up' : ''}>{change > 0 ? '+' : ''}{change}% in 12 months</span></p>
        {caption && <p className="ins-chart-cap">{caption}</p>}
      </figcaption>
      <div className="ins-line-plot">
        <div className="ins-line-y" aria-hidden="true">
          {TICKS.map((t) => <span key={t} className="ins-num" style={{ bottom: `${t * 100}%` }}>{formatTick(t * max)}</span>)}
        </div>
        <div className="ins-line-area">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={summary}>
            {TICKS.map((t) => <line key={t} x1="0" x2={W} y1={y(t * max)} y2={y(t * max)} className="ins-line-grid" vectorEffect="non-scaling-stroke" />)}
            <path d={`${line} L${W},${H} L0,${H} Z`} className="ins-line-fill" />
            <path d={line} className="ins-line-stroke" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="ins-line-dot" aria-hidden="true" style={{ left: '100%', top: `${(y(last.value) / H) * 100}%` }} />
        </div>
        <div className="ins-line-x" aria-hidden="true">
          {points.map((p, i) => <span key={p.label.long} className={i % 3 === 2 || i === points.length - 1 ? '' : 'ins-line-x-minor'}>{p.label.short}</span>)}
        </div>
      </div>
      {note && <p className="ins-fine">{note}</p>}
      <details className="ins-chart-table">
        <summary>Show as table</summary>
        <table className="ins-table ins-table-plain">
          <caption className="ins-sr">{title} per month</caption>
          <thead><tr><th scope="col">Month</th><th scope="col" className="r">{title}</th></tr></thead>
          <tbody>{points.map((p) => <tr key={p.label.long}><th scope="row">{p.label.long}</th><td className="r ins-num">{format(p.value)}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  )
}
