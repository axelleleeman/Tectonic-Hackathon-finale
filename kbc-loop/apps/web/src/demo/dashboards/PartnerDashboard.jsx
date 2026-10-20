import { useMemo, useState } from 'react'
import { num } from '@kbc-loop/shared/engine/format.js'
import { ProductImage } from '@kbc-loop/web-ui/components/ProductImage.jsx'
import { LoopIcon } from '../../loop/LoopIcon.jsx'
import { updatedLabel } from '../../loop/partnerStatus.js'
import { TICKET_FLOW, kpiTrend, partnerFleet, partnerKpis, partnerList, partnerTickets, profileOf, secondLifeSplit } from './partnerTickets.js'
import '../../loop/loop.css'
import './partner.css'

const STATUS_TEXT = { new: 'New', ...Object.fromEntries(TICKET_FLOW.map((f) => [f.status, f.label])) }
const flowIndex = (status) => TICKET_FLOW.findIndex((f) => f.status === status)
/** Two-letter monogram: the capitals of a CamelCase name (WashCycle → WC), else its first two letters. */
const initials = (name) => {
  const caps = name.replace(/\(.*?\)/g, '').match(/[A-Z]/g) ?? []
  return caps.length >= 2 ? caps.slice(0, 2).join('') : name.slice(0, 2).toUpperCase()
}

/** Mini trend bars (decorative: the tile states its figure in text). */
function TrendBars({ values }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const lo = min - (max - min || max || 1) * 0.6
  return (
    <span className="pt-trend" aria-hidden="true">
      {values.map((v, i) => <span key={i} style={{ height: `${Math.max(12, ((v - lo) / (max - lo || 1)) * 100)}%` }} />)}
    </span>
  )
}

function Kpi({ value, label, hint, trend }) {
  return (
    <div className="pt-kpi">
      <span className="pt-kpi-label">{label}</span>
      <b className="lp-num">{value}</b>
      {trend && <TrendBars values={trend} />}
      {hint && <small>{hint}</small>}
    </div>
  )
}

/** One open repair: product photo, customer (first name only), issue, note, photo flag and the status stepper. */
function Ticket({ ticket, busy, onStatus }) {
  const at = flowIndex(ticket.status)
  const done = ticket.status === 'repaired'
  const updated = updatedLabel(ticket.updatedOn)
  return (
    <li className={`lp-card pt-ticket ${done ? 'pt-ticket-done' : ''}`}>
      <ProductImage product={ticket.productId} className="pt-ticket-img" style={{ width: 112, height: 84 }} />
      <div className="pt-ticket-body">
        <div className="pt-ticket-head">
          <div className="lp-min0">
            <h3>{ticket.product}</h3>
            <span className="pt-sub"><b>{ticket.firstName}</b>{ticket.preventive ? ' · reported by the device' : ''}</span>
          </div>
          <span className={`pt-badge ${done ? 'pt-badge-done' : ticket.status === 'new' ? 'pt-badge-new' : ''}`}>{STATUS_TEXT[ticket.status] ?? 'New'}</span>
        </div>
        <p className="pt-issue">“{ticket.issue}”</p>
        {(ticket.note || ticket.photo) && (
          <p className="pt-meta">
            {ticket.note && <>Note: {ticket.note}</>}
            {ticket.note && ticket.photo && ' · '}
            {ticket.photo && <span className="pt-photo">Photo attached</span>}
          </p>
        )}
        <ol className="pt-flow" aria-label={`Update status for ${ticket.firstName}'s ${ticket.product}`}>
          {TICKET_FLOW.map((f, n) => {
            const past = n <= at
            const next = n === at + 1
            return (
              <li key={f.status} className={`pt-step ${past ? 'pt-past' : ''} ${next ? 'pt-next' : ''}`}>
                <button type="button" disabled={busy || past} onClick={() => onStatus(ticket, f.status)}
                  aria-label={past ? `${f.action} (done)` : f.action}>
                  <span className="pt-step-dot" aria-hidden="true">{past ? <LoopIcon name="check" size={14} /> : n + 1}</span>
                  <span className="pt-step-l">{f.action}</span>
                </button>
              </li>
            )
          })}
        </ol>
        {(updated || done) && (
          <small className="pt-updated">
            {updated && <>Updated {updated}</>}
            {updated && done && ' · '}
            {done && 'Waiting for the customer to close the repair'}
          </small>
        )}
      </div>
    </li>
  )
}

/** Products this partner has out with customers, with photo and count. */
function Fleet({ fleet, total }) {
  if (fleet.length === 0) return null
  return (
    <section className="pt-section" aria-labelledby="pt-fleet-h">
      <div className="pt-list-head"><h2 id="pt-fleet-h">Products in the field</h2><span className="pt-sub">{num(total)} units with customers</span></div>
      <ul className="pt-fleet">
        {fleet.map((f) => (
          <li key={f.id} className="lp-card pt-fleet-card">
            <ProductImage product={f.product} style={{ width: '100%', height: 120 }} rounded={false} />
            <div className="pt-fleet-body">
              <h3>{f.product.name}</h3>
              <p className="pt-fleet-n"><b className="lp-num">{num(f.count)}</b> in use{f.live > 0 && <span className="pt-sub"> · {num(f.live)} in this demo</span>}</p>
              <span className="pt-share" aria-hidden="true"><span style={{ width: `${total ? Math.max(3, (f.count / total) * 100) : 0}%` }} /></span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** What happens to returned units: refurbished, parts, recycled, as one stacked bar with the figures in text. */
function SecondLife({ total, split, profile }) {
  return (
    <section className="pt-section" aria-labelledby="pt-sl-h">
      <div className="pt-list-head"><h2 id="pt-sl-h">Second life</h2><span className="pt-sub">{num(total)} returned units</span></div>
      <div className="lp-card pt-sl">
        <span className="pt-sl-bar" aria-hidden="true">
          {split.map((s) => <span key={s.id} className={`pt-sl-${s.id}`} style={{ flex: Math.max(s.count, 0.0001) }} />)}
        </span>
        <ul className="pt-sl-list">
          {split.map((s) => (
            <li key={s.id}><span className={`pt-sl-key pt-sl-${s.id}`} aria-hidden="true" /><b className="lp-num">{num(s.count)}</b><span>{s.label}</span></li>
          ))}
        </ul>
        {profile?.co2PerUnitKg > 0 && (
          <p className="pt-sub pt-sl-note"><LoopIcon name="leaf" size={16} />About {num(Math.round((split[0].count * profile.co2PerUnitKg) / 1000))} t CO₂ avoided by giving units a second life (illustrative).</p>
        )}
      </div>
    </section>
  )
}

/**
 * Partner portal content: navy header, KPIs, the live ticket list, products in the field and second life.
 * Status changes go through the api (PARTNER_UPDATE_REPAIR), so the customer's web product page and app repair
 * tracker update instantly. Without `dispatch` (embedded in the presentation view) the tickets are read-only.
 */
export function PartnerDashboard({ state, dispatch, partnerId: fixedPartnerId }) {
  const [picked, setPicked] = useState(fixedPartnerId ?? 'washcycle')
  const partnerId = fixedPartnerId ?? picked
  const [busy, setBusy] = useState(null)
  const partner = partnerList.find((p) => p.id === partnerId) ?? partnerList[0]
  const profile = profileOf(partner.id)
  const tickets = useMemo(() => partnerTickets(state, partner.id), [state, partner.id])
  const kpis = useMemo(() => partnerKpis(state, partner.id, tickets), [state, partner.id, tickets])
  const fleet = useMemo(() => partnerFleet(state, partner.id, kpis.inField), [state, partner.id, kpis.inField])
  const split = secondLifeSplit(kpis.secondLife, profile?.refurbishRate)

  const onStatus = async (ticket, status) => {
    if (!dispatch) return
    setBusy(ticket.key)
    try {
      // The reducer moves the customer's 3-step tracker along (and awards Kate Coins on "repaired");
      // closing the repair is left to the customer ("Close repair" / "Back to product").
      await dispatch({ type: 'PARTNER_UPDATE_REPAIR', itemKey: ticket.key, status, customerId: ticket.customerId })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="pt-body">
      <section className="pt-hero pt-navy" aria-labelledby="pt-name">
        <div className="pt-title">
          <span className="pt-avatar" aria-hidden="true">{initials(partner.short ?? partner.name)}</span>
          <div className="lp-min0 pt-title-text">
            <span className="pt-eyebrow">KBC Partner Hub</span>
            <h1 id="pt-name">{partner.name}</h1>
            <p className="pt-highlight">{profile?.highlight ?? partner.tagline}</p>
            {profile && (
              <ul className="pt-chips" aria-label="Partner facts">
                {profile.repairSlaHours > 0 && <li>Repairs within {profile.repairSlaHours} h</li>}
                {profile.technicians > 0 && <li>{num(profile.technicians)} technicians</li>}
                {profile.serviceArea && <li>{profile.serviceArea}</li>}
              </ul>
            )}
          </div>
          {!fixedPartnerId && (
            <label className="pt-pick">
              <span className="pt-eyebrow">Partner</span>
              <select className="lp-select" value={partner.id} onChange={(e) => setPicked(e.target.value)}>
                {partnerList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="pt-kpis">
          <Kpi value={num(kpis.open)} label="Open tickets" hint={`${num(tickets.length)} in the list`} trend={kpis.open > 0 ? kpiTrend(`${partner.id}-open`, kpis.open, 30) : null} />
          <Kpi value={`${num(kpis.avgRepairDays, 1)} days`} label="Avg. repair time" hint={profile?.repairSlaHours ? `Target ${profile.repairSlaHours} h` : null} trend={kpiTrend(`${partner.id}-days`, kpis.avgRepairDays, -18)} />
          <Kpi value={num(kpis.inField)} label="Products in the field" hint="Active contracts" trend={kpiTrend(`${partner.id}-field`, kpis.inField, 22)} />
          <Kpi value={num(kpis.secondLife)} label="Second-life units" hint={profile?.refurbishRate ? `${profile.refurbishRate}% refurbished` : null} trend={kpiTrend(`${partner.id}-sl`, kpis.secondLife, 35)} />
        </div>
      </section>

      <section className="pt-section" aria-labelledby="pt-tickets-h">
        <div className="pt-list-head">
          <h2 id="pt-tickets-h">Repair tickets</h2>
          <span className="pt-live"><span className="pt-live-dot" aria-hidden="true" />Live</span>
        </div>
        {tickets.length === 0
          ? <p className="lp-card pt-empty">No open repairs. New reports from customers appear here instantly.</p>
          : (
            <ul className="pt-tickets" aria-live="polite">
              {tickets.map((t) => <Ticket key={t.key} ticket={t} busy={!dispatch || busy === t.key} onStatus={onStatus} />)}
            </ul>
          )}
      </section>

      <Fleet fleet={fleet} total={kpis.inField} />
      <SecondLife total={kpis.secondLife} split={split} profile={profile} />

      <p className="pt-fine">Customers are shown by first name only. KPIs combine live demo data with fictional pilot figures; trends are illustrative.</p>
    </div>
  )
}

/** Full-page partner portal (#partner) in the KBC LOOP style, light and dark. */
export function PartnerPortal({ loop, theme, onToggleTheme, onBack }) {
  const toLight = theme === 'dark'
  const themeLabel = toLight ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <div className="lp pt" data-theme={theme}>
      <header className="lp-top">
        <div className="lp-top-in">
          <button type="button" className="lp-back" onClick={onBack} aria-label="All KBC apps" title="All KBC apps">
            <LoopIcon name="back" size={18} />
          </button>
          <span className="lp-brand"><span className="lp-mark" aria-hidden="true" /><b>KBC LOOP</b><span className="pt-brand-sub">Partner portal</span></span>
          <div className="lp-right pt-right">
            <button type="button" className="lp-iconbtn" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
              <LoopIcon name={toLight ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="lp-ui lp-wrap">
        {loop.state
          ? <PartnerDashboard state={loop.state} dispatch={loop.dispatch} />
          : <p className="pt-empty">{loop.error ? 'Cannot reach the server, retrying…' : 'Connecting…'}</p>}
      </main>
      {loop.status === 'offline' && <div className="offline-badge">Connection to the server lost, retrying…</div>}
    </div>
  )
}
