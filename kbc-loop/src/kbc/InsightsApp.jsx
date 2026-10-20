import { useMemo, useState } from 'react'
import { useLoop } from '../state/useLoop.js'
import { bindActions } from '../state/actions.js'
import { insights } from '../engine/insights.js'
import { euro, num } from '../engine/format.js'
import { MIN_GROUP_SIZE } from '../config/index.js'
import { Icon } from '../components/ui/Icon.jsx'
import { Stat } from '../components/ui/Stat.jsx'

const KINDS = [['alle', 'Alles'], ['herstelling', 'Herstellingen'], ['herhaalaankoop', 'Herhaalaankopen']]
const TYPES = [['alle', 'Alle klanten'], ['particulier', 'Particulieren'], ['kmo', 'Kmo’s']]
const FLOW = [
  ['Betalingen', 'KBC-rekeningen en PSD2'],
  ['Categoriseren', 'per type handelaar (hersteller, elektrozaak …)'],
  ['Anonimiseren', `enkel groepen ≥ ${MIN_GROUP_SIZE} klanten`],
  ['Aanbevelen', 'passend huurproduct van een Loop-partner'],
  ['Kate-inzicht', 'enkel bij klanten met toestemming'],
]

// Interne KBC-weergave: geanonimiseerde uitgavenpatronen en aanbevolen huurproducten.
// Deelt state met app en web: een gestarte campagne verschijnt ook in het KBC-dashboard.
export default function InsightsApp() {
  const { state, dispatch } = useLoop()
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const [filter, setFilter] = useState({ kind: 'alle', customerType: 'alle' })
  const { segments, hiddenCount, totals } = useMemo(() => insights(filter), [filter])
  const [selectedId, setSelectedId] = useState(null)
  const selected = segments.find((s) => s.id === selectedId) ?? segments[0]

  return (
    <div className="ins">
      <header className="ins-head">
        <span className="logo"><Icon name="loop" size={22} /></span>
        <div><b>KBC Loop Insights</b><small>Interne tool voor KBC-medewerkers</small></div>
        <span className="ins-badge">Geanonimiseerd · geen individuele klanten</span>
      </header>

      <main className="ins-main">
        <section className="ins-flow">
          {FLOW.map(([t, d], n) => (
            <div key={t} className="ins-step"><span>{n + 1}</span><b>{t}</b><small>{d}</small></div>
          ))}
        </section>

        <div className="ins-filters">
          <div className="seg">{KINDS.map(([id, l]) => <button key={id} className={filter.kind === id ? 'on' : ''} onClick={() => setFilter({ ...filter, kind: id })}>{l}</button>)}</div>
          <div className="seg">{TYPES.map(([id, l]) => <button key={id} className={filter.customerType === id ? 'on' : ''} onClick={() => setFilter({ ...filter, customerType: id })}>{l}</button>)}</div>
        </div>

        <div className="dash-grid ins-stats">
          <Stat value={num(totals.customers)} label="klanten met een herkend patroon" />
          <Stat value={num(totals.reachable)} label="bereikbaar (gaven toestemming)" />
          <Stat value={num(totals.expectedContracts)} label="verwachte Loop-contracten" />
          <Stat value={euro(totals.monthlyRevenue)} label="huur per maand voor partners" tone="good" />
          <Stat value={euro(totals.kbcMarginMonthly)} label="KBC-marge per maand" tone="good" />
          <Stat value={`${num(totals.co2Tons)} t`} label="CO₂ vermeden" tone="good" />
        </div>

        <div className="ins-grid">
          <section className="ins-card">
            <h3>Wat kopen en herstellen klanten vaak?</h3>
            <table className="dash-table ins-table">
              <thead><tr><th>Patroon in betalingen</th><th>Klanten</th><th>Kost/jaar nu</th><th>Trend</th><th>Aanbevolen huur</th><th>Potentieel/maand</th></tr></thead>
              <tbody>
                {segments.map((s) => (
                  <tr key={s.id} className={s.id === selected?.id ? 'sel' : ''} onClick={() => setSelectedId(s.id)}>
                    <td><b>{s.label}</b><small>{s.kind === 'herstelling' ? 'Herstelling' : 'Herhaalaankoop'} · {s.customerType === 'kmo' ? 'kmo' : 'particulier'}</small></td>
                    <td>{num(s.customers)}</td>
                    <td>{euro(s.costYearly)}</td>
                    <td className={s.trendPct > 0 ? 'up' : 'down'}>{s.trendPct > 0 ? '+' : ''}{s.trendPct}%</td>
                    <td>{s.product.icon} {s.product.name}<small>{euro(s.product.monthly)}/maand · {s.partner}</small></td>
                    <td><b>{euro(s.monthlyRevenue)}</b>{state.campaigns.includes(s.id) && <span className="live-tag">CAMPAGNE</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hiddenCount > 0 && <p className="fine">{hiddenCount} groep{hiddenCount > 1 ? 'en' : ''} verborgen: minder dan {MIN_GROUP_SIZE} klanten, dus niet anoniem genoeg.</p>}
          </section>

          {selected && <Recommendation s={selected} active={state.campaigns.includes(selected.id)} onToggle={() => actions.toggleCampaign(selected.id)} />}
        </div>

        <p className="fine center">Conceptprototype voor de Tectonic Hackathon. Fictieve, geaggregeerde cijfers; geen echte klantdata.</p>
      </main>
    </div>
  )
}

function Recommendation({ s, active, onToggle }) {
  const saves = s.savingYearly > 0
  return (
    <aside className="ins-card ins-reco">
      <span className="dash-eyebrow">Aanbeveling</span>
      <h3>{s.label}</h3>
      <p className="ins-pattern"><b>Herkend aan:</b> {s.pattern}<br /><b>Betalingen aan:</b> {s.merchants}</p>

      <div className="ins-offer">
        <span className="ins-offer-icon">{s.product.icon}</span>
        <div><b>Bied {s.product.name} aan via {s.partner}</b><small>{euro(s.product.monthly)}/maand · herstel, onderhoud en verzekering inbegrepen</small></div>
      </div>

      <div className="ins-compare">
        <div><small>Nu per klant per jaar</small><b>{euro(s.costYearly)}</b><em>aankoop + herstellingen</em></div>
        <div><small>Met KBC Loop</small><b>{euro(s.rentYearly)}</b><em>alles inbegrepen</em></div>
        <div className={saves ? 'good' : ''}><small>{saves ? 'Klant bespaart' : 'Meerkost klant'}</small><b>{euro(Math.abs(s.savingYearly))}</b><em>per jaar</em></div>
      </div>

      <ul className="ins-facts">
        <li><b>{num(s.reachable)}</b> van {num(s.customers)} klanten gaven toestemming ({s.consentPct}%)</li>
        <li>Verwacht <b>{num(s.expectedContracts)}</b> contracten → <b>{euro(s.monthlyRevenue)}</b>/maand huur, <b>{euro(s.kbcMarginMonthly)}</b> KBC-marge</li>
        <li><b>{num(s.co2Tons, 1)} t</b> CO₂ vermeden</li>
      </ul>

      <div className="ins-kate">
        <small>Voorbeeld Kate-inzicht in KBC Mobile</small>
        <p>Je betaalde dit jaar al een paar keer voor “{s.label.toLowerCase()}”. Leen een {s.product.name.toLowerCase()} bij {s.partner}: herstel altijd inbegrepen.</p>
      </div>

      <button className={`play ${active ? 'on' : ''}`} onClick={onToggle}>
        {active ? 'Campagne loopt · stoppen' : 'Start campagne via Kate'}
      </button>
      <p className="fine">Kate toont het voorstel enkel aan klanten met toestemming. KBC-medewerkers zien nooit wie in een groep zit.</p>
    </aside>
  )
}
