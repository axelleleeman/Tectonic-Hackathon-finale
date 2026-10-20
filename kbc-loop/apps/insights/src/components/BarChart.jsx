import { useId } from 'react'

const TICKS = [0, 0.25, 0.5, 0.75, 1]

/**
 * Horizontal bar chart in plain HTML: one series, a value label next to every bar, gridlines and an
 * optional value axis. Each row is focusable and shows its detail as a tooltip on hover and focus.
 * The same figures are available as a real table ("Show as table") for screen readers and copying.
 * Bars grow in on first render (CSS animation, switched off for prefers-reduced-motion).
 * rows: [{ id, label, value, display, detail? }], formatTick: (value) => string
 */
export function BarChart({ title, caption, rows, footer, formatTick, valueHeader = 'Value' }) {
  const uid = useId()
  const max = niceMax(Math.max(...rows.map((r) => r.value), 1))
  return (
    <figure className="ins-chart" aria-labelledby={`${uid}-t`}>
      <figcaption>
        <h2 id={`${uid}-t`} className="ins-h2">{title}</h2>
        {caption && <p className="ins-chart-cap">{caption}</p>}
      </figcaption>
      <ul className="ins-bars" aria-label={title}>
        {rows.map((r) => {
          const pct = (r.value / max) * 100
          const tipId = `${uid}-${r.id}`
          return (
            <li key={r.id} className="ins-bar-row" tabIndex={0} aria-describedby={r.detail ? tipId : undefined}>
              <span className="ins-bar-label">{r.label}</span>
              <span className="ins-bar-track" aria-hidden="true">
                <span className="ins-bar" style={{ width: `${Math.max(1, pct)}%` }} />
              </span>
              <span className="ins-bar-value ins-num">{r.display}</span>
              {r.detail && (
                <span id={tipId} role="tooltip" className="ins-tip" style={{ '--x': `${Math.min(Math.max(pct, 12), 88)}%` }}>
                  <b>{r.label}</b> <span className="ins-num">{r.display}</span><br />{r.detail}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {formatTick && (
        <div className="ins-axis" aria-hidden="true">
          <span />
          <span className="ins-axis-ticks">
            {TICKS.map((t) => <span key={t} className="ins-num" style={{ left: `${t * 100}%` }}>{formatTick(t * max)}</span>)}
          </span>
          <span />
        </div>
      )}
      <details className="ins-chart-table">
        <summary>Show as table</summary>
        <table className="ins-table ins-table-plain">
          <caption className="ins-sr">{title}</caption>
          <thead><tr><th scope="col">Item</th><th scope="col" className="r">{valueHeader}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}><th scope="row">{r.label}{r.detail && <small>{r.detail}</small>}</th><td className="r ins-num">{r.display}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
      {footer}
    </figure>
  )
}

/** Round the scale up to 1, 2, 2.5 or 5 × 10^n so gridlines land on readable values. */
function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(v))
  const step = [1, 2, 2.5, 5, 10].find((m) => m * p >= v)
  return step * p
}
