/**
 * Horizontal bar chart in plain HTML: one series, values written out as text next to each bar,
 * so it reads the same for screen readers and in high-contrast modes. Bars are decorative.
 * rows: [{ id, label, value, display, detail? }]
 */
export function BarChart({ title, caption, rows, footer }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <figure className="ins-chart">
      <figcaption>
        <h2 className="ins-h2">{title}</h2>
        {caption && <p className="ins-chart-cap">{caption}</p>}
      </figcaption>
      <ul className="ins-bars">
        {rows.map((r) => (
          <li key={r.id} className="ins-bar-row" title={r.detail}>
            <span className="ins-bar-label">{r.label}</span>
            <span className="ins-bar-track" aria-hidden="true"><span className="ins-bar" style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%` }} /></span>
            <span className="ins-bar-value ins-num">{r.display}</span>
          </li>
        ))}
      </ul>
      {footer}
    </figure>
  )
}
