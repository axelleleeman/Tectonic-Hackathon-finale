import { DashboardShell } from './DashboardShell.jsx'
import { Stat } from '@kbc-loop/web-ui/components/Stat.jsx'
import { kbcStats } from '@kbc-loop/shared/engine/dashboards.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { integrationMap } from '@kbc-loop/shared/engine/integrations.js'
import { insights } from '@kbc-loop/shared/engine/insights.js'

export function KbcDashboard({ state }) {
  const s = kbcStats(state.items)
  const map = integrationMap()
  const campaigns = insights().segments.filter((seg) => state.campaigns.includes(seg.id))
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

      <h3 className="dash-sub">Kate-campagnes vanuit KBC Loop Insights</h3>
      {campaigns.length === 0
        ? <p className="fine">Nog geen campagnes. Start er een in KBC Loop Insights (interne tool).</p>
        : campaigns.map((c) => (
          <div key={c.id} className="int-row"><b>{c.label}</b><div>{c.product.icon} {c.product.name} · {num(c.reachable)} klanten met toestemming · verwacht {euro(c.monthlyRevenue)}/maand <span className="live-tag">LIVE</span></div></div>
        ))}

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
