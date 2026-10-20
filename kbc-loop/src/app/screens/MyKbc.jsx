import { Icon } from '../../components/ui/Icon.jsx'
import { Amount } from '../../components/ui/Amount.jsx'
import { Stat } from '../../components/ui/Stat.jsx'
import { LoopItemCard } from './LoopItemCard.jsx'
import { loopTotals } from '../../engine/impact.js'
import { euro, num } from '../../engine/format.js'
import { serviceById } from '../../engine/integrations.js'

const ICONS = { Rekeningen: 'wallet', Kredieten: 'house', Verzekeringen: 'home' }

function SectionHead({ title, onNew, withNew = true }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      {withNew && <button className="new-link" onClick={onNew} aria-disabled={!onNew}><span className="plus"><Icon name="plus" size={14} /></span>Nieuw</button>}
    </div>
  )
}

function Row({ icon, name, sub, value, unit }) {
  return (
    <div className="row-card">
      <span className={`row-icon ${icon}`}>{icon === 'coins' ? <b className="coin-mini">K</b> : <Icon name={icon} size={24} />}</span>
      <div className="row-text"><b>{name}</b><small>{sub}</small></div>
      {value !== undefined ? <Amount value={value} unit={unit} /> : <Icon name="chevron" size={18} />}
    </div>
  )
}

export function MyKbc({ customer, items, coins, actions }) {
  const rows = [
    { section: 'Rekeningen', name: customer.fullName.toUpperCase(), sub: customer.iban, value: customer.balance, icon: 'wallet' },
    ...customer.myKbc.map((r) => (r.section === 'Rekeningen'
      ? { ...r, name: customer.fullName.toUpperCase(), icon: /spaar/i.test(r.name) ? 'piggy' : 'wallet' }
      : r)),
  ]
  const sections = [...new Set(rows.map((r) => r.section))]
  const t = loopTotals(items)
  const impact = serviceById(customer.type === 'kmo' ? 'kubeEsg' : 'ecoWise')

  return (
    <>
      {sections.map((title) => (
        <section key={title}>
          <SectionHead title={title} />
          {rows.filter((r) => r.section === title).map((r) => (
            <Row key={r.name + r.sub} icon={r.icon ?? ICONS[title] ?? 'doc'}
              name={r.name} sub={r.sub} value={r.value} />
          ))}
        </section>
      ))}

      <SectionHead title="Kate Coins" withNew={false} />
      <Row icon="coins" name="Kate Coins" sub="Verdiend met herstellen en inleveren" value={coins} unit="KTC" />

      <SectionHead title="KBC Loop" onNew={() => actions.navigate('shop')} />
      <div className="tiles">
        <Stat value={t.active} label="in gebruik" />
        <Stat value={t.repairs} label="keer hersteld i.p.v. weggegooid" />
        <Stat value={`${num(t.co2Kg)} kg`} label="CO₂ vermeden" hint={t.co2Kg ? `≈ ${num(t.carKm)} km auto` : null} />
      </div>
      {items.length === 0 && (
        <button className="row-card" onClick={() => actions.navigate('shop')}>
          <span className="row-icon loop"><Icon name="loop" size={24} /></span>
          <div className="row-text"><b>Je leent nog niets</b><small>Ontdek de circulaire partners</small></div>
          <Icon name="chevron" size={18} />
        </button>
      )}
      {items.map((i) => <LoopItemCard key={i.key} item={i} actions={actions} />)}
      {t.active > 0 && <p className="fine">Totaal {euro(t.monthly)}/maand, incl. onderhoud, herstel en verzekering.</p>}
      <Row icon="chart" name={`Je impact in ${impact.name}`} sub={impact.label} />
    </>
  )
}
