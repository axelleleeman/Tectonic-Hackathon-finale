/** Placeholder blocks shown while data loads. Decorative: the surrounding region carries aria-busy. */
export function Skeleton({ w = '100%', h = 14, className = '' }) {
  return <span className={`ins-skel ${className}`} style={{ width: w, height: h }} aria-hidden="true" />
}

/** Skeleton for the overview: four KPI tiles and two cards. */
export function PageSkeleton() {
  return (
    <div className="ins-skel-page" aria-hidden="true">
      <Skeleton w="120px" h={14} />
      <Skeleton w="280px" h={34} className="ins-skel-title" />
      <div className="ins-kpis ins-kpis-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="ins-kpi"><Skeleton w="60%" /><Skeleton w="45%" h={32} /></div>)}
      </div>
      <div className="ins-split">
        <div className="ins-card ins-pad ins-stack">{[90, 75, 60, 48, 36, 28].map((w) => <Skeleton key={w} w={`${w}%`} h={12} />)}</div>
        <div className="ins-card ins-pad ins-stack">{[0, 1, 2].map((i) => <Skeleton key={i} h={44} />)}</div>
      </div>
    </div>
  )
}
