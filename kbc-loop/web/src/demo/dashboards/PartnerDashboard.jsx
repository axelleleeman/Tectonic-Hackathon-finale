import { DashboardShell } from './DashboardShell.jsx'
import { Stat } from '../../components/ui/Stat.jsx'
import { partnerStats } from '@kbc-loop/shared/engine/dashboards.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { ServiceChips } from '../../components/ui/ServiceChips.jsx'
import { serviceById } from '@kbc-loop/shared/engine/integrations.js'

const CONNECTED_VIA = ['partnerHub', 'devPortal', 'webhooks', 'b2bAssetHub', 'm2m'].map(serviceById)

export function PartnerDashboard({ state }) {
  const s = partnerStats('signify', state.items, state.telemetry)
  return (
    <DashboardShell eyebrow="KBC Partner Hub · partnerweergave" title="Philips (Signify)" note="Pilotscenario met fictieve cijfers · live bijgewerkt door de demo">
      <div className="dash-grid">
        <Stat value={num(s.activeContracts)} label="actieve Loop-contracten" />
        <Stat value={euro(s.monthlyRevenue)} label="terugkerende omzet / maand" tone="good" />
        <Stat value={s.predictedFailures} label="defecten voorspeld via sensoren" hint="vervangen vóór uitval" />
        <Stat value={`${num(s.lifetimeYears.service, 1)} j`} label="levensduur armatuur als dienst" hint={`vs. ${num(s.lifetimeYears.sold, 1)} j bij verkoop`} tone="good" />
        <Stat value={`${s.reusedComponentsPct}%`} label="componenten hergebruikt" />
        <Stat value={s.repairs.length} label="openstaande herstellingen" />
      </div>

      <h3 className="dash-sub">Herstelaanvragen</h3>
      <table className="dash-table">
        <thead><tr><th>Klant</th><th>Probleem</th><th>Status</th></tr></thead>
        <tbody>
          {s.repairs.map((r) => (
            <tr key={`${r.customer}-${r.issue}`} className={r.live ? 'live' : ''}>
              <td>{r.customer}{r.live && <span className="live-tag">LIVE</span>}</td><td>{r.issue}</td><td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="dash-sub">Aangesloten via bestaande KBC-diensten</h3>
      <ServiceChips services={CONNECTED_VIA} />

      <div className="dash-why">
        <b>Waarom doet Philips mee?</b>
        <p>Omdat Philips eigenaar blijft, verdient het meer aan lampen die lang meegaan en makkelijk te herstellen zijn. KBC brengt klanten aan, financiert de toestellen (B2B Asset Financing) en verzekert ze.</p>
      </div>
    </DashboardShell>
  )
}
