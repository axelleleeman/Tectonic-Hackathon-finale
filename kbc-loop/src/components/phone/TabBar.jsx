import { Icon } from '../ui/Icon.jsx'

const TABS = [
  { id: 'home', label: 'Start', icon: 'home' },
  { id: 'mykbc', label: 'Mijn KBC', icon: 'wallet' },
  { id: 'pay', label: 'Betalen', icon: 'transfer', disabled: true },
  { id: 'shop', label: 'Loop', icon: 'loop' },
  { id: 'more', label: 'Meer', icon: 'more', disabled: true },
]

export function TabBar({ active, onSelect }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.id} className={active === t.id ? 'on' : ''} disabled={t.disabled} onClick={() => onSelect(t.id)}>
          <Icon name={t.icon} /><span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
