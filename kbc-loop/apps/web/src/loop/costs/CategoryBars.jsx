import { categoryIcon } from '../model.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { money } from '../product/format.js'

/** Horizontal bars per category; the amount and share are always written out next to the bar. */
export function CategoryBars({ rows }) {
  const max = Math.max(...rows.map((r) => r.monthly), 0)
  return (
    <ul className="cp-bars">
      {rows.map((r) => (
        <li key={r.categoryId}>
          <span className="cp-bar-label"><LoopIcon name={categoryIcon(r.categoryId)} size={16} />{r.name}</span>
          <span className="cp-bar-track" aria-hidden="true"><span className="cp-bar-fill" style={{ width: `${max ? (r.monthly / max) * 100 : 0}%` }} /></span>
          <span className="cp-bar-val lp-num"><b>{money(r.monthly)}</b><small>{Math.round(r.share)}%</small></span>
        </li>
      ))}
    </ul>
  )
}
