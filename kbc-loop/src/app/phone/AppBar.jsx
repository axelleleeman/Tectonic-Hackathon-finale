import { Icon } from '../../components/ui/Icon.jsx'

const RoundButton = ({ icon, label, onClick, dot, className = '' }) => (
  <button className={`round-btn ${className}`} onClick={onClick} aria-label={label} tabIndex={onClick ? 0 : -1}>
    <Icon name={icon} size={20} />{dot && <i className="dot" />}
  </button>
)

/**
 * Kopbalk zoals in KBC Mobile, in drie varianten:
 *  search: tandwiel + Kate-zoekbalk + belletje (Start)
 *  title:  tandwiel + grote titel + belletje + Kate (Mijn KBC, Aanbod)
 *  back:   terug + titel + Kate (detailschermen)
 */
export function AppBar({ variant, title, placeholder, onBack, onKate }) {
  if (variant === 'search') {
    return (
      <header className="appbar search">
        <RoundButton icon="gear" label="Instellingen" />
        <button className="kate-search" onClick={onKate}>
          <Icon name="search" size={18} />
          <span>{placeholder}</span>
          <b><span className="kate-mark"><Icon name="kate" size={11} /></span>Kate</b>
        </button>
        <RoundButton icon="bell" label="Berichten" dot />
      </header>
    )
  }
  return (
    <header className={`appbar ${variant}`}>
      {variant === 'back'
        ? <RoundButton icon="back" label="Terug" onClick={onBack} />
        : <RoundButton icon="gear" label="Instellingen" />}
      <h1 className="appbar-title">{title}</h1>
      {variant === 'title' && <RoundButton icon="bell" label="Berichten" dot />}
      <RoundButton icon="kate" label="Open Kate" onClick={onKate} className="kate" />
    </header>
  )
}
