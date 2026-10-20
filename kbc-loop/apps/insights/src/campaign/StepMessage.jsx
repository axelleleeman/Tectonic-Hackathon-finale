import { MAX_MESSAGE_LENGTH } from '@kbc-loop/shared/engine/campaigns.js'
import { KatePreview } from './KatePreview.jsx'
import { defaultMessage } from '../model.js'

/** Step 2: edit the Kate message next to a live preview of how the customer sees it. */
export function StepMessage({ segment, message, onChange }) {
  const left = MAX_MESSAGE_LENGTH - message.length
  const suggested = defaultMessage(segment)
  return (
    <div className="ins-msg">
      <div className="ins-card ins-pad ins-msg-edit">
        <label htmlFor="kate-msg" className="ins-label">Message from Kate</label>
        <textarea id="kate-msg" className="ins-input" rows={6} maxLength={MAX_MESSAGE_LENGTH} value={message}
          aria-describedby="kate-msg-count" onChange={(e) => onChange(e.target.value)} />
        <div className="ins-row ins-between">
          <span id="kate-msg-count" className={`ins-small ${left < 20 ? 'ins-warn' : 'ins-muted'}`} aria-live="polite">{message.length} / {MAX_MESSAGE_LENGTH}</span>
          <button type="button" className="ins-btn ins-btn-sm ins-ghost" disabled={message === suggested} onClick={() => onChange(suggested)}>Reset</button>
        </div>
        {message.trim().length === 0 && <p className="ins-warn ins-small" role="alert">Message required</p>}
      </div>
      <KatePreview message={message} segment={segment} />
    </div>
  )
}
