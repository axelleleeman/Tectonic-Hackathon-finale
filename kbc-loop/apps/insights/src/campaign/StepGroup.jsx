import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { groupMeta, eur } from '../model.js'

/** Step 1: choose one group. Cards behave as a radio group (arrow keys move between them). */
export function StepGroup({ segments, running, selectedId, onPick }) {
  return (
    <fieldset className="ins-pick">
      <legend className="ins-sr">Choose a group</legend>
      {segments.map((s) => {
        const busy = running.includes(s.id)
        const on = selectedId === s.id
        return (
          <label key={s.id} className={`ins-card ins-pick-card ${on ? 'on' : ''} ${busy ? 'off' : ''}`}>
            <input type="radio" name="group" value={s.id} checked={on} disabled={busy} onChange={() => onPick(s)} />
            <span className="ins-pick-head">
              <b>{s.label}</b>
              <small>{busy ? 'Running' : groupMeta(s)}</small>
            </span>
            <span className="ins-pick-offer">{s.product.name} · {euro(s.product.monthly)} / month</span>
            <span className="ins-pick-nums">
              <span><b className="ins-num">{num(s.reachable)}</b>reachable</span>
              <span><b className="ins-num">{num(s.expectedContracts)}</b>contracts</span>
              <span><b className="ins-num">{eur(s.monthlyRevenue)}</b>per month</span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
