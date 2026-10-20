import { Icon } from '../../components/ui/Icon.jsx'

// Enkel Start, Mijn KBC en KBC Loop zijn klikbaar; de rest van KBC Mobile staat lichtgrijs.
const TABS = [
  { id: 'home', label: 'Start', icon: 'home' },
  { id: 'mykbc', label: 'Mijn KBC', icon: 'wallet' },
  { id: 'shop', label: 'KBC Loop', icon: 'loop', featured: true },
  { id: 'pay', label: 'Betalen', icon: 'transfer', disabled: true },
  { id: 'more', label: 'Meer', icon: 'more', disabled: true },
]

export function TabBar({ active, onSelect }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.id} className={[active === t.id && 'on', t.featured && 'featured'].filter(Boolean).join(' ')}
          disabled={t.disabled} onClick={() => onSelect(t.id)}>
          <span className="tab-icon"><Icon name={t.icon} /></span><span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
