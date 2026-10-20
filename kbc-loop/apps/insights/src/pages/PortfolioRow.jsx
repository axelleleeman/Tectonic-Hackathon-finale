import { num } from '@kbc-loop/shared/engine/format.js'
import { eur } from '../model.js'

/** Compact live portfolio tiles. CO₂ sits on the subtle blue-to-green sustainability surface. */
export function PortfolioRow({ p }) {
  const tiles = [
    ['customers', 'Customers on KBC Loop', num(p.customers), p.newContracts ? `+${num(p.newContracts)} contracts today` : 'Pilot baseline + live'],
    ['mrr', 'Monthly recurring revenue', eur(p.mrr), 'All active contracts'],
    ['products', 'Products in use', num(p.productsInUse), `Demo customers, live · ${num(p.returned)} returned`],
    ['open', 'Open repairs', num(p.openRepairs), p.openRepairs ? 'Waiting for a partner' : 'Nothing waiting'],
    ['closed', 'Repairs closed', num(p.repairsClosed), 'Instead of a new purchase'],
    ['coins', 'Kate Coins issued', num(p.coinsIssued), 'For circular choices'],
    ['co2', 'CO₂ saved', `${num(p.co2Tons, 1)} t`, 'Second life and longer use', 'eco'],
  ]
  return (
    <section className="ins-section" aria-labelledby="pf-h">
      <div className="ins-section-head">
        <h2 id="pf-h" className="ins-h2">Portfolio</h2>
        <p className="ins-chart-cap">Pilot baseline plus live actions from the customer app and partner portal</p>
      </div>
      <ul className="ins-pf">
        {tiles.map(([id, label, value, sub, tone]) => (
          <li key={id} className={`ins-pf-tile ${tone === 'eco' ? 'ins-eco-surface' : ''}`}>
            <span className="ins-pf-label">{label}</span>
            <b className="ins-pf-value ins-num">{value}</b>
            <span className="ins-pf-sub">{sub}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
