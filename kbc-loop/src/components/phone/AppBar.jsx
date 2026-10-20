import { Icon } from '../ui/Icon.jsx'
import { KbcLogo } from '../ui/KbcLogo.jsx'

export function AppBar({ title, brand, avatar, onBack, onKate }) {
  return (
    <header className="appbar">
      {onBack
        ? <button className="icon-btn" onClick={onBack} aria-label="Terug"><Icon name="back" /></button>
        : <span className="avatar">{avatar}</span>}
      <div className="appbar-title">{brand ? <span className="appbar-brand"><KbcLogo height={22} /> Loop</span> : title}</div>
      <button className="kate-btn" onClick={onKate} aria-label="Open Kate"><span>K</span></button>
    </header>
  )
}
