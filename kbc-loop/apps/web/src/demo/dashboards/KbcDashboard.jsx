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
    <DashboardShell eyebrow="Internal view · KBC" title="KBC Loop portfolio" note="Pilot scenario with fictional figures · updated live by the demo">
      <div className="dash-grid">
        <Stat value={num(s.customers)} label="Loop customers" hint={s.newContracts ? `+${s.newContracts} contract(s) in this demo` : null} />
        <Stat value={euro(s.financedVolume)} label="financed volume" />
        <Stat value={euro(s.monthlyMargin)} label="recurring margin / month" tone="good" hint="financing + insurance + commission" />
        <Stat value={`${num(s.co2Tons, 1)} t`} label="CO₂ avoided" tone="good" />
        <Stat value={`${s.conversionPct}%`} label="Kate insight → contract" />
        <Stat value={`${s.insuredPct}%`} label="also take out KBC insurance" />
      </div>

      <h3 className="dash-sub">Kate campaigns from KBC Loop Insights</h3>
      {campaigns.length === 0
        ? <p className="fine">No campaigns yet. Start one in KBC Loop Insights (internal tool).</p>
        : campaigns.map((c) => (
          <div key={c.id} className="int-row"><b>{c.label}</b><div>{c.product.icon} {c.product.name} · {num(c.reachable)} customers with consent · expected {euro(c.monthlyRevenue)}/month <span className="live-tag">LIVE</span></div></div>
        ))}

      <h3 className="dash-sub">Contracts per category</h3>
      {s.byCategory.map((c) => (
        <div key={c.label} className="hbar">
          <span>{c.label}</span>
          <div className="track"><div className="fill loop" style={{ width: `${c.share}%` }} /></div>
          <b>{c.share}%</b>
        </div>
      ))}

      <h3 className="dash-sub">Built on {map.reusedCount} existing KBC services</h3>
      <div className="integration">
        {map.steps.map((st) => (
          <div key={st.step} className="int-row">
            <b>{st.step}</b>
            <div>{st.services.map((sv) => <span key={sv.id} className="int-chip" title={sv.label}>{sv.name}</span>)}</div>
          </div>
        ))}
      </div>
      <p className="fine">The only new part is the Loop layer that brings together signals, financing, insurance and circular partners.</p>

      <div className="triple">
        <div><b>Customer</b><p>No large purchases, always a working product, repairs included.</p></div>
        <div><b>Partner</b><p>A channel to millions of customers, predictable revenue, products come back.</p></div>
        <div><b>KBC</b><p>Recurring income, a stronger customer relationship, measurable sustainable impact.</p></div>
      </div>
    </DashboardShell>
  )
}
