import { COINS, TECHNICIAN_SLOT } from '@kbc-loop/shared/config/index.js'
import { LoopIcon } from '../LoopIcon.jsx'

/** The three repair steps with their state. */
function trackerSteps(partnerName, preventive) {
  return [
    { title: preventive ? 'Wear reported by the device' : 'Problem reported', text: 'Logged with your subscription, no cost to you' },
    { title: 'Technician scheduled', text: `${partnerName} visits on ${TECHNICIAN_SLOT}, or brings a replacement` },
    { title: 'Repaired and tested', text: `Back in use · +${COINS.repair} Kate Coins` },
  ]
}

/**
 * Live repair status, straight from the shared state: it moves when the partner (or the presenter) advances it.
 * "Next step (demo)" advances it from here; once repaired, "Close repair" archives it into the history.
 */
export function RepairTracker({ row, busy, onAdvance, onCloseRepair, compact = false }) {
  const { repair } = row.item
  if (!repair) return null
  const steps = trackerSteps(row.partner.name, repair.preventive)
  const done = repair.step >= 3
  return (
    <div className={`pp-tracker ${compact ? 'pp-tracker-compact' : ''}`}>
      <div className="pp-tracker-head">
        <span className={`lp-status ${done ? 'lp-st-ok' : 'lp-st-warn'}`}>{done ? 'Repaired' : `Repair step ${repair.step} of 3`}</span>
        <span className="pp-issue">“{repair.issue}”</span>
      </div>
      {(repair.note || repair.photo) && (
        <p className="pp-tracker-meta">
          {repair.note && <>Your note: {repair.note}</>}
          {repair.note && repair.photo && ' · '}
          {repair.photo && 'Photo added'}
        </p>
      )}
      <ol className="pp-track" aria-label="Repair progress">
        {steps.map((s, n) => {
          const state = n < repair.step ? 'done' : n === repair.step ? 'now' : 'next'
          return (
            <li key={s.title} className={`pp-track-${state}`} aria-current={state === 'now' ? 'step' : undefined}>
              <span className="pp-track-dot">{state === 'done' ? <LoopIcon name="check" size={14} /> : n + 1}</span>
              <span className="lp-min0"><b>{s.title}</b><small>{s.text}</small></span>
              <span className="lp-sr">{state === 'done' ? 'completed' : state === 'now' ? 'in progress' : 'to do'}</span>
            </li>
          )
        })}
      </ol>
      {done && <p className="pp-coins-earned" role="status"><span className="lp-coin" aria-hidden="true" />+{COINS.repair} Kate Coins earned for repairing instead of replacing</p>}
      <div className="pp-row">
        {done
          ? <button type="button" className="lp-btn lp-primary" onClick={onCloseRepair} disabled={busy}>Close repair</button>
          : <button type="button" className="lp-btn" onClick={onAdvance} disabled={busy}>Next step (demo)</button>}
      </div>
    </div>
  )
}
