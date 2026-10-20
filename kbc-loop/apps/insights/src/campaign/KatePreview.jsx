import { euro } from '@kbc-loop/shared/engine/format.js'
import { KateAvatar, KateIcon } from '@kbc-loop/web-ui/kate/KateIcon.jsx'
import '@kbc-loop/web-ui/kate/kate.css'

/** The message exactly as a customer sees it in Kate in KBC Mobile (always the white Kate look). */
export function KatePreview({ message, segment }) {
  return (
    <figure className="ins-phone-wrap">
      <figcaption className="ins-small ins-muted">Preview in KBC Mobile</figcaption>
      <div className="ins-phone">
        <div className="ins-phone-status" aria-hidden="true"><span>9:41</span><span>KBC Mobile</span></div>
        <div className="kate-head ins-phone-head"><p className="kate-title">Kate</p></div>
        <div className="ins-phone-body">
          <div className="kate-intro">
            <span className="kate-today">Today</span>
            <span className="kate-intro-line">A tip from Kate <KateIcon name="sparkle" size={14} filled strokeWidth={0.8} /></span>
          </div>
          <div className="kate-msg kate-msg-kate">
            <KateAvatar />
            <p className="kate-msg-text ins-phone-text">{message.trim() || ' '}</p>
          </div>
          <div className="ins-phone-offer">
            <b>{segment.product.name}</b>
            <span>{euro(segment.product.monthly)} / month · {segment.partner}</span>
          </div>
          <ul className="kate-chips" aria-label="Reply options the customer sees">
            <li><span className="kate-chip">View offer</span></li>
            <li><span className="kate-chip">Not now</span></li>
          </ul>
        </div>
      </div>
    </figure>
  )
}
