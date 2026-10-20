import { Icon } from '../ui/Icon.jsx'

export function AppBar({ title, avatar, onBack, onKate }) {
  return (
    <header className="appbar">
      {onBack
        ? <button className="icon-btn" onClick={onBack} aria-label="Terug"><Icon name="back" /></button>
        : <span className="avatar">{avatar}</span>}
      <div className="appbar-title">{title}</div>
      <button className="kate-btn" onClick={onKate} aria-label="Open Kate"><span>K</span></button>
    </header>
  )
}
