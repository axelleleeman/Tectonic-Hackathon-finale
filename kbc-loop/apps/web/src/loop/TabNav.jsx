import { TABS } from '@kbc-loop/shared/navigation/tabs.js'
import { iconPaths } from '@kbc-loop/shared/ui/iconPaths.js'

function TabIcon({ name, active, outline }) {
  // Same rule as the app: filled icon when active, outline icons (∞) get a bolder stroke instead
  return (
    <svg className="lp-tabicon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill={active && !outline ? 'currentColor' : 'none'} strokeWidth={active && outline ? 2.6 : 1.8}>
      {iconPaths[name].map((d) => <path key={d} d={d} />)}
    </svg>
  )
}

/**
 * The KBC Mobile tab bar, from the same TABS as the app. `variant` = 'top' (header, desktop)
 * or 'bottom' (floating pill bar, mobile). Invest and Business are inactive in the demo.
 */
export function TabNav({ active, onSelect, variant }) {
  return (
    <nav className={`lp-tabnav lp-tabnav-${variant}`} aria-label="Main">
      {TABS.map((t) => {
        const on = active === t.id
        return (
          <button key={t.id} type="button" className={`lp-tabbtn ${on ? 'lp-on' : ''}`}
            aria-current={on ? 'page' : undefined} aria-disabled={t.disabled || undefined}
            title={t.disabled ? `${t.label} is not available in this demo` : undefined}
            onClick={t.disabled ? undefined : () => onSelect(t.id)}>
            <TabIcon name={t.icon} active={on} outline={t.outline} />
            <span>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
