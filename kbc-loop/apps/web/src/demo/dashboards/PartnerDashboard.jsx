import { useMemo, useState } from 'react'
import { num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../../loop/LoopIcon.jsx'
import { updatedLabel } from '../../loop/partnerStatus.js'
import { TICKET_FLOW, partnerKpis, partnerList, partnerTickets } from './partnerTickets.js'
import '../../loop/loop.css'
import './partner.css'

const STATUS_TEXT = { new: 'New', ...Object.fromEntries(TICKET_FLOW.map((f) => [f.status, f.label])) }
const flowIndex = (status) => TICKET_FLOW.findIndex((f) => f.status === status)

function Kpi({ value, label, hint }) {
  return (
    <div className="pt-kpi">
      <b className="lp-num">{value}</b>
      <span>{label}</span>
      {hint && <small>{hint}</small>}
    </div>
  )
}

/** One open repair: customer (first name only), product, issue, note, photo flag and the status buttons. */
function Ticket({ ticket, busy, onStatus }) {
  const at = flowIndex(ticket.status)
  const done = ticket.status === 'repaired'
  const updated = updatedLabel(ticket.updatedOn)
  return (
    <li className={`lp-card pt-ticket ${done ? 'pt-ticket-done' : ''}`}>
      <div className="pt-ticket-head">
        <div className="lp-min0">
          <h3>{ticket.product}</h3>
          <span className="pt-sub">{ticket.firstName}{ticket.preventive ? ' · reported by the device' : ''}</span>
        </div>
        <span className={`lp-status ${done ? '' : ticket.status === 'new' ? 'lp-st-warn' : ''}`}>{STATUS_TEXT[ticket.status] ?? 'New'}</span>
      </div>
      <p className="pt-issue">“{ticket.issue}”</p>
      {(ticket.note || ticket.photo) && (
        <p className="pt-meta">
          {ticket.note && <>Note: {ticket.note}</>}
          {ticket.note && ticket.photo && ' · '}
          {ticket.photo && <span className="pt-photo">Photo attached</span>}
        </p>
      )}
      <div className="pt-flow" role="group" aria-label={`Update status for ${ticket.firstName}'s ${ticket.product}`}>
        {TICKET_FLOW.map((f, n) => {
          const past = n <= at
          const next = n === at + 1
          return (
            <button key={f.status} type="button" disabled={busy || past}
              className={`lp-btn lp-sm ${next ? 'lp-primary' : ''} ${past ? 'pt-past' : ''}`}
              onClick={() => onStatus(ticket, f.status)}>
              {past && <LoopIcon name="check" size={14} />}{f.action}
            </button>
          )
        })}
      </div>
      {(updated || done) && (
        <small className="pt-updated">
          {updated && <>Updated {updated}</>}
          {updated && done && ' · '}
          {done && 'Waiting for the customer to close the repair'}
        </small>
      )}
    </li>
  )
}

/**
 * Partner portal content: KPIs and the live ticket list for one partner. Status changes go through the api
 * (PARTNER_UPDATE_REPAIR), so the customer's web product page and app repair tracker update instantly.
 * Without `dispatch` (embedded in the presentation view) the tickets are read-only.
 */
export function PartnerDashboard({ state, dispatch, partnerId: fixedPartnerId }) {
  const [picked, setPicked] = useState(fixedPartnerId ?? 'washcycle')
  const partnerId = fixedPartnerId ?? picked
  const [busy, setBusy] = useState(null)
  const partner = partnerList.find((p) => p.id === partnerId) ?? partnerList[0]
  const tickets = useMemo(() => partnerTickets(state, partner.id), [state, partner.id])
  const kpis = useMemo(() => partnerKpis(state, partner.id, tickets), [state, partner.id, tickets])

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
      <div className="pt-title">
        <div className="lp-min0">
          <span className="lp-eyebrow">KBC Partner Hub</span>
          <h1>{partner.name}</h1>
          <p className="pt-sub">{partner.tagline}</p>
        </div>
        {!fixedPartnerId && (
          <label className="pt-pick">
            <span className="lp-eyebrow">Partner</span>
            <select className="lp-select" value={partner.id} onChange={(e) => setPicked(e.target.value)}>
              {partnerList.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="pt-kpis">
        <Kpi value={num(kpis.open)} label="Open tickets" />
        <Kpi value={`${num(kpis.avgRepairDays, 1)} days`} label="Avg. repair time" />
        <Kpi value={num(kpis.inField)} label="Products in the field" />
        <Kpi value={num(kpis.secondLife)} label="Second-life units" />
      </div>

      <div className="pt-list-head">
        <h2>Repair tickets</h2>
        <span className="pt-live"><span className="pt-live-dot" aria-hidden="true" />Live</span>
      </div>
      {tickets.length === 0
        ? <p className="lp-card pt-empty">No open repairs. New reports from customers appear here instantly.</p>
        : (
          <ul className="pt-tickets" aria-live="polite">
            {tickets.map((t) => <Ticket key={t.key} ticket={t} busy={!dispatch || busy === t.key} onStatus={onStatus} />)}
          </ul>
        )}
      <p className="pt-fine">Customers are shown by first name only. KPIs combine live demo data with fictional pilot figures.</p>
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
