import { LoopIcon } from '../LoopIcon.jsx'
import { categoryIcon } from '../model.js'

/** Category filter with product counts (sidebar on desktop, scrollable row on small screens). */
export function CategoryNav({ cats, total, active, onSelect }) {
  return (
    <nav className="lp-side" aria-label="Categories">
      <button type="button" aria-current={active === 'all' ? 'true' : undefined} onClick={() => onSelect('all')}>
        All products<span className="lp-n lp-num">{total}</span>
      </button>
      {cats.map((c) => (
        <button key={c.id} type="button" aria-current={active === c.id ? 'true' : undefined} onClick={() => onSelect(c.id)}>
          <LoopIcon name={categoryIcon(c.id)} size={16} /><span className="lp-side-name">{c.name}</span><span className="lp-n lp-num">{c.count}</span>
        </button>
      ))}
    </nav>
  )
}
