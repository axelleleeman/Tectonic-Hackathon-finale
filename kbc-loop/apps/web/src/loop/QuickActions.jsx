import { LoopIcon } from './LoopIcon.jsx'

export function QuickActions({ onDefect, onUpgrade, onMarket, onImpact }) {
  const list = [
    { icon: 'wrench', title: 'Report a fault', sub: 'Repaired at no cost', go: onDefect },
    { icon: 'up', title: 'Upgrade or return', sub: 'Old device gets a second life', go: onUpgrade },
    { icon: 'store', title: 'Add a product', sub: 'Browse the marketplace', go: onMarket },
    { icon: 'leaf', title: 'View your impact', sub: 'Linear vs. circular', go: onImpact },
  ]
  return (
    <>
      <h2 className="lp-h2">Quick actions</h2>
      <div className="lp-quick">
        {list.map((q) => (
          <button key={q.title} type="button" className="lp-q" onClick={q.go}>
            <span className="lp-qi"><LoopIcon name={q.icon} /></span>
            <span><b>{q.title}</b><small>{q.sub}</small></span>
            <LoopIcon name="chev" className="lp-chev" />
          </button>
        ))}
      </div>
    </>
  )
}
