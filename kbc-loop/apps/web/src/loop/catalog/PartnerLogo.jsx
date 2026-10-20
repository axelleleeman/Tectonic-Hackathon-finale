import { partnerInitials } from '../model.js'

/** Initials "logo" for a partner (no real logos are used in the demo). */
export function PartnerLogo({ name, size = 'md' }) {
  return <span className={`lp-palogo lp-palogo-${size}`} aria-hidden="true">{partnerInitials(name)}</span>
}
