/** One large, calm number with a label above and an optional one-line context below. */
export function KpiTile({ label, value, sub, tone, progress, size = 'lg' }) {
  return (
    <div className={`ins-kpi ins-kpi-${size} ${tone ? `ins-tone-${tone}` : ''}`}>
      <p className="ins-kpi-label">{label}</p>
      <p className="ins-kpi-value ins-num">{value}</p>
      {progress != null && (
        <div className="ins-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
      )}
      {sub && <p className="ins-kpi-sub">{sub}</p>}
    </div>
  )
}

export function KpiGrid({ children, cols = 4, label }) {
  return <section className={`ins-kpis ins-kpis-${cols}`} aria-label={label}>{children}</section>
}
