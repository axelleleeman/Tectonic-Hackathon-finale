import { Icon } from '../../components/ui/Icon.jsx'
import { Stat } from '../../components/ui/Stat.jsx'
import { LoopItemCard } from './LoopItemCard.jsx'
import { loopTotals } from '../../engine/impact.js'
import { euro, num } from '../../engine/format.js'
import { serviceById } from '../../engine/integrations.js'

function groupBySection(rows) {
  return rows.reduce((acc, r) => ({ ...acc, [r.section]: [...(acc[r.section] ?? []), r] }), {})
}

export function MyKbc({ customer, items, coins, actions }) {
  const sections = groupBySection([
    { section: 'Rekeningen', name: customer.accountName, sub: customer.iban, value: customer.balance },
    ...customer.myKbc,
  ])
  const t = loopTotals(items)
  const impactId = customer.type === 'kmo' ? 'kubeEsg' : 'ecoWise'

  return (
    <>
      {Object.entries(sections).map(([title, rows]) => (
        <div key={title}>
          <h4>{title}</h4>
          <div className="list-card">
            {rows.map((r) => (
              <div key={r.name} className="row off">
                <div><b>{r.name}</b><small>{r.sub}</small></div>
                {r.value !== undefined ? <span>{euro(r.value, 2)}</span> : <Icon name="chevron" size={18} />}
              </div>
            ))}
          </div>
        </div>
      ))}

      <h4>KBC Loop</h4>
      <div className="tiles">
        <Stat value={t.active} label="in gebruik" />
        <Stat value={t.repairs} label="keer hersteld i.p.v. weggegooid" />
        <Stat value={`${num(t.co2Kg)} kg`} label="CO₂ vermeden" hint={t.co2Kg ? `≈ ${num(t.carKm)} km auto` : null} />
      </div>
      <div className="coins">🪙 <b>{num(coins)} Kate Coins</b> verdiend met herstellen en inleveren</div>
      <div className="list-card">
        <div className="row"><div><b>Bekijk je impact in {serviceById(impactId).name}</b><small>{serviceById(impactId).label}</small></div><Icon name="chevron" size={18} /></div>
      </div>

      {items.length === 0 && <button className="note" onClick={() => actions.navigate('shop')}>{customer.name} leent nog niets via KBC Loop. Ontdek de partners →</button>}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
      {t.active > 0 && <p className="fine">Totaal {euro(t.monthly)}/maand, incl. onderhoud, herstel en verzekering.</p>}
    </>
  )
}
