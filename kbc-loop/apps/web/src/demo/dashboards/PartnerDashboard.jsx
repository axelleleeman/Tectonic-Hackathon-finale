import { DashboardShell } from './DashboardShell.jsx'
import { Stat } from '@kbc-loop/web-ui/components/Stat.jsx'
import { partnerStats } from '@kbc-loop/shared/engine/dashboards.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { ServiceChips } from '@kbc-loop/web-ui/components/ServiceChips.jsx'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'

const CONNECTED_VIA = ['partnerHub', 'devPortal', 'webhooks', 'b2bAssetHub', 'm2m'].map(serviceById)

export function PartnerDashboard({ state }) {
  const s = partnerStats('signify', state.items, state.telemetry)
  return (
    <DashboardShell eyebrow="KBC Partner Hub · partner view" title="Philips (Signify)" note="Pilot scenario with fictional figures · updated live by the demo">
      <div className="dash-grid">
        <Stat value={num(s.activeContracts)} label="active Loop contracts" />
        <Stat value={euro(s.monthlyRevenue)} label="recurring revenue / month" tone="good" />
        <Stat value={s.predictedFailures} label="defects predicted by sensors" hint="replaced before failure" />
        <Stat value={`${num(s.lifetimeYears.service, 1)} yrs`} label="fixture lifetime as a service" hint={`vs. ${num(s.lifetimeYears.sold, 1)} yrs when sold`} tone="good" />
        <Stat value={`${s.reusedComponentsPct}%`} label="components reused" />
        <Stat value={s.repairs.length} label="open repairs" />
      </div>

      <h3 className="dash-sub">Repair requests</h3>
      <table className="dash-table">
        <thead><tr><th>Customer</th><th>Issue</th><th>Status</th></tr></thead>
        <tbody>
          {s.repairs.map((r) => (
            <tr key={`${r.customer}-${r.issue}`} className={r.live ? 'live' : ''}>
              <td>{r.customer}{r.live && <span className="live-tag">LIVE</span>}</td><td>{r.issue}</td><td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dash-sub">Connected via existing KBC services</h3>
      <ServiceChips services={CONNECTED_VIA} />

      <div className="dash-why">
        <b>Why does Philips take part?</b>
        <p>Because Philips remains the owner, it earns more from lights that last long and are easy to repair. KBC brings in customers, finances the devices (B2B Asset Financing) and insures them.</p>
      </div>
    </DashboardShell>
  )
}
