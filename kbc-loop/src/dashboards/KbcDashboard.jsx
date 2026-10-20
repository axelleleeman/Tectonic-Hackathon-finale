import { DashboardShell } from './DashboardShell.jsx'
import { Stat } from '../components/ui/Stat.jsx'
import { kbcStats } from '../engine/dashboards.js'
import { euro, num } from '../engine/format.js'
import { integrationMap } from '../engine/integrations.js'

export function KbcDashboard({ state }) {
  const s = kbcStats(state.items)
  const map = integrationMap()
  return (
    <DashboardShell eyebrow="Interne weergave · KBC" title="KBC Loop-portefeuille" note="Pilotscenario met fictieve cijfers · live bijgewerkt door de demo">
      <div className="dash-grid">
        <Stat value={num(s.customers)} label="Loop-klanten" hint={s.newContracts ? `+${s.newContracts} contract(en) in deze demo` : null} />
        <Stat value={euro(s.financedVolume)} label="gefinancierd volume" />
        <Stat value={euro(s.monthlyMargin)} label="terugkerende marge / maand" tone="good" hint="financiering + verzekering + commissie" />
        <Stat value={`${num(s.co2Tons, 1)} t`} label="CO₂ vermeden" tone="good" />
        <Stat value={`${s.conversionPct}%`} label="Kate-inzicht → contract" />
        <Stat value={`${s.insuredPct}%`} label="sluit ook KBC-verzekering af" />
      </div>

      <h3 className="dash-sub">Contracten per categorie</h3>
      {s.byCategory.map((c) => (
        <div key={c.label} className="hbar">
          <span>{c.label}</span>
          <div className="track"><div className="fill loop" style={{ width: `${c.share}%` }} /></div>
          <b>{c.share}%</b>
        </div>
      ))}

      <h3 className="dash-sub">Gebouwd op {map.reusedCount} bestaande KBC-diensten</h3>
      <div className="integration">
        {map.steps.map((st) => (
          <div key={st.step} className="int-row">
            <b>{st.step}</b>
            <div>{st.services.map((sv) => <span key={sv.id} className="int-chip" title={sv.label}>{sv.name}</span>)}</div>
          </div>
        ))}
      </div>
      <p className="fine">Nieuw is enkel de Loop-laag die signalen, financiering, verzekering en circulaire partners samenbrengt.</p>

      <div className="triple">
        <div><b>Klant</b><p>Geen grote aankopen, altijd een werkend product, herstel inbegrepen.</p></div>
        <div><b>Partner</b><p>Kanaal naar miljoenen klanten, voorspelbare omzet, producten komen terug.</p></div>
        <div><b>KBC</b><p>Terugkerende inkomsten, sterkere klantrelatie, meetbare duurzame impact.</p></div>
      </div>
    </DashboardShell>
  )
}
