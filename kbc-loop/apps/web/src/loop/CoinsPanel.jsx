import { num } from '@kbc-loop/shared/engine/format.js'
import { COINS } from '@kbc-loop/shared/config/index.js'

// Redeeming does not exist in the api (yet): the options are visible but disabled ("coming soon").
const REWARDS = [
  { title: '€5 discount', sub: 'On your next monthly bill', cost: 500 },
  { title: '10% lower premium', sub: 'KBC Insurance, 12 months', cost: 800 },
  { title: 'Plant 10 trees', sub: 'Reforestation project', cost: 300 },
  { title: 'Free upgrade', sub: 'One product of your choice', cost: 2500 },
]

export function CoinsPanel({ coins, feed }) {
  return (
    <aside className="lp-aside" aria-label="Kate Coins">
      <div className="lp-card lp-panel">
        <h3>Kate Coins history <span className="lp-num lp-balance-sm">{num(coins)}</span></h3>
        {feed.length > 0 ? (
          <ul className="lp-feed">
            {feed.slice(0, 4).map((f) => (
              <li key={f.key}><span>{f.label}</span><span className="lp-amt">+{num(f.amount)}</span></li>
            ))}
          </ul>
        ) : <p className="lp-earn">No coins earned yet in this demo.</p>}
        <p className="lp-earn">Earn Kate Coins when a device is repaired (+{COINS.repair}) or when you return it (+{COINS.return}).</p>
      </div>
      <div className="lp-card lp-panel">
        <h3>Redeem <span className="lp-soon">coming soon</span></h3>
        <div className="lp-redeem">
          {REWARDS.map((r) => (
            <button key={r.title} type="button" disabled aria-describedby="lp-redeem-note">
              <span><b>{r.title}</b><small>{r.sub}</small></span><span className="lp-cost lp-num">{num(r.cost)}</span>
            </button>
          ))}
        </div>
        <p className="lp-earn" id="lp-redeem-note">Redeeming coins is coming in a future version.</p>
      </div>
    </aside>
  )
}
