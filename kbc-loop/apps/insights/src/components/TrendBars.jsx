/** Mini trend as bars (decorative; the tile states the trend in text). The last bar is highlighted. */
export function TrendBars({ values }) {
  if (!values?.length) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const lo = min - (max - min || max || 1) * 0.6
  return (
    <span className="ins-trend" aria-hidden="true">
      {values.map((v, i) => <span key={i} style={{ height: `${Math.max(12, ((v - lo) / (max - lo || 1)) * 100)}%` }} />)}
    </span>
  )
}
