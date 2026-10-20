import { Icon } from '../../components/ui/Icon.jsx'

// De vijf tabbladen van KBC Mobile. KBC Loop zit onder "Aanbod"; Beleggen en Zakelijk doen niets in de demo.
const TABS = [
  { id: 'home', label: 'Start', icon: 'wallet' },
  { id: 'mykbc', label: 'Mijn KBC', icon: 'list' },
  { id: 'invest', label: 'Beleggen', icon: 'piggy', disabled: true },
  { id: 'business', label: 'Zakelijk', icon: 'briefcase', disabled: true },
  { id: 'shop', label: 'Aanbod', icon: 'layers' },
]

export function TabBar({ active, onSelect }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.id} className={active === t.id ? 'on' : ''} aria-disabled={t.disabled}
          onClick={() => !t.disabled && onSelect(t.id)}>
          <Icon name={t.icon} size={22} /><span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
