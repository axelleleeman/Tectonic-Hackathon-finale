import { num } from '@kbc-loop/shared/engine/format.js'
import { Kate } from '@kbc-loop/web-ui/kate/index.js'
import { LoopIcon } from './LoopIcon.jsx'
import { TabNav } from './TabNav.jsx'

/**
 * Sticky app bar.
 * Row 1: back to KBC, brand, Kate ("How can I help?"), Kate Coins, theme toggle, "+" (opens Loop) and initials.
 * Row 2 (desktop): the shared KBC Mobile tabs. On narrow widths the tabs move to a floating bottom bar.
 */
export function LoopHeader({ tab, onTab, onBack, onAdd, coins, avatar, theme, onToggleTheme, kate }) {
  const toLight = theme === 'dark'
  const themeLabel = toLight ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <header className="lp-top">
      <div className="lp-wrap lp-top-in">
        <button type="button" className="lp-back" onClick={onBack} aria-label="Back to all KBC apps">
          <LoopIcon name="back" size={16} /><span className="lp-back-long">All KBC apps</span><span className="lp-back-short">KBC</span>
        </button>
        <a className="lp-brand" href="#loop" aria-label="KBC LOOP home" onClick={(e) => { e.preventDefault(); onTab('home') }}>
          <span className="lp-mark" aria-hidden="true" /><b>KBC LOOP</b>
        </a>
        <div className="lp-kate-slot">
          <Kate appearance="search" tone={theme === 'dark' ? 'dark' : 'light'} {...kate} />
        </div>
        <div className="lp-right">
          <div className="lp-coins" title="Kate Coins"><span className="lp-coin" aria-hidden="true" /><b className="lp-num">{num(coins)}</b> Kate Coins</div>
          <button type="button" className="lp-iconbtn" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
            <LoopIcon name={toLight ? 'sun' : 'moon'} size={18} />
          </button>
          <button type="button" className="lp-plus-btn" onClick={onAdd} aria-label="Add a product" title="Add a product"><LoopIcon name="plus" size={18} /></button>
          <span className="lp-avatar" aria-hidden="true">{avatar}</span>
        </div>
      </div>
      <div className="lp-subnav">
        <div className="lp-wrap"><TabNav active={tab} onSelect={onTab} variant="top" /></div>
      </div>
    </header>
  )
}
