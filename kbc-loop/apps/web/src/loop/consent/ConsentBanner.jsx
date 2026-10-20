import { LoopIcon } from '../LoopIcon.jsx'
import './consent.css'

/** Calm prompt shown until the customer has saved their data choices. */
export function ConsentBanner({ preferences, onReview }) {
  if (!preferences || preferences.completedOn) return null
  return (
    <section className="cs-banner lp-card" aria-labelledby="cs-banner-h">
      <span className="cs-banner-icon" aria-hidden="true"><LoopIcon name="shield" size={18} /></span>
      <div className="cs-banner-text">
        <b id="cs-banner-h">Complete your profile</b>
        <small>Choose what happens with your data.</small>
      </div>
      <button type="button" className="lp-btn lp-sm" onClick={onReview}>Review</button>
    </section>
  )
}
