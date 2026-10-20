import { TrendBars } from './TrendBars.jsx'

/** One large, calm number with a label above, an optional mini trend and a one-line context below. */
export function KpiTile({ label, value, sub, tone, progress, trend, size = 'lg' }) {
  return (
    <div className={`ins-kpi ins-kpi-${size} ${tone ? `ins-tone-${tone}` : ''}`}>
      <p className="ins-kpi-label">{label}</p>
      <div className="ins-kpi-main">
        <p className="ins-kpi-value ins-num">{value}</p>
        <TrendBars values={trend} />
      </div>
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
