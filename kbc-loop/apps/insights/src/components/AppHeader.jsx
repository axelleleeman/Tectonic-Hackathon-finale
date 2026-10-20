import { Icon } from './Icon.jsx'
import { href } from '../useRoute.js'

const NAV = [['overview', 'Overview', href.overview], ['campaigns', 'Campaigns', href.campaigns], ['groups', 'Groups', href.groups]]

/** Sticky app bar: KBC LOOP Insights brand, main navigation, privacy badge and theme toggle. */
export function AppHeader({ page, theme, onToggleTheme, runningCount }) {
  const toLight = theme === 'dark'
  const themeLabel = toLight ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <header className="ins-top">
      <div className="ins-wrap ins-top-in">
        <a className="ins-brand" href={href.overview} aria-label="KBC LOOP Insights, overview">
          <span className="ins-mark" aria-hidden="true" /><b>KBC LOOP</b><span className="ins-brand-sub">Insights</span>
        </a>
        <nav className="ins-nav" aria-label="Main">
          {NAV.map(([id, label, to]) => (
            <a key={id} href={to} aria-current={page === id ? 'page' : undefined}>
              {label}
              {id === 'campaigns' && runningCount > 0 && <span className="ins-count" aria-label={`, ${runningCount} running`}>{runningCount}</span>}
            </a>
          ))}
        </nav>
        <div className="ins-top-right">
          <span className="ins-privacy"><Icon name="shield" size={16} />Anonymised</span>
          <button type="button" className="ins-iconbtn" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
            <Icon name={toLight ? 'sun' : 'moon'} size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
