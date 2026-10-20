import { Icon } from '../ui/Icon.jsx'
import { KbcLogo } from '../ui/KbcLogo.jsx'

/** Startscherm: avatar, Kate-zoekbalk en meldingen. Andere schermen: terug, titel, Kate. */
export function AppBar({ title, brand, avatar, onBack, onKate, onAvatar }) {
  if (!onBack) {
    return (
      <header className="appbar home">
        <button className="avatar" onClick={onAvatar} aria-label="Mijn KBC">{avatar}</button>
        <button className="kate-search" onClick={onKate}>
          <span>Hoe kan ik je helpen?</span>
          <b><Icon name="sparkle" size={14} /> Kate</b>
        </button>
        <span className="bell"><Icon name="bell" /><i /></span>
      </header>
    )
  }
  return (
    <header className="appbar">
      <button className="icon-btn" onClick={onBack} aria-label="Terug"><Icon name="back" /></button>
      <div className="appbar-title">{brand ? <span className="appbar-brand"><KbcLogo height={22} /> Loop</span> : title}</div>
      <button className="kate-mini" onClick={onKate} aria-label="Open Kate"><Icon name="sparkle" size={13} /> Kate</button>
    </header>
  )
}
