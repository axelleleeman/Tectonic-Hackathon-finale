const W = 96
const H = 28

/** Decorative mini line (the surrounding cell states the figure in text). */
export function Sparkline({ values, tone = 'accent' }) {
  if (!values?.length) return null
  const max = Math.max(...values, 1)
  const x = (i) => (values.length > 1 ? (i / (values.length - 1)) * W : W)
  const y = (v) => H - 2 - (v / max) * (H - 4)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <svg className={`ins-spark ins-spark-${tone}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={`${d} L${W},${H} L0,${H} Z`} className="ins-spark-fill" />
      <path d={d} className="ins-spark-line" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
