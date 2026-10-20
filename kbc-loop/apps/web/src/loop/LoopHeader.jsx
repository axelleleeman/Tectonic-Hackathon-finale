import { num } from '@kbc-loop/shared/engine/format.js'
import { Kate } from '@kbc-loop/web-ui/kate/index.js'
import { LoopIcon } from './LoopIcon.jsx'

/**
 * Sticky full-width app bar: round back button (all KBC apps), brand, Kate ("How can I help?"), Kate Coins, theme toggle and initials.
 * Over the start-screen hero (`overHero`) it is transparent with light text. There is no tab bar on the web; adding a product lives on the start screen ("Add a product").
 */
export function LoopHeader({ onBack, onHome, coins, avatar, theme, onToggleTheme, kate, overHero = false }) {
  const toLight = theme === 'dark'
  const themeLabel = toLight ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <header className={`lp-top ${overHero ? 'lp-top-over' : ''}`}>
      <div className="lp-top-in">
        <button type="button" className="lp-back" onClick={onBack} aria-label="All KBC apps" title="All KBC apps">
          <LoopIcon name="back" size={18} />
        </button>
        <a className="lp-brand" href="#loop" aria-label="KBC LOOP home" onClick={(e) => { e.preventDefault(); onHome() }}>
          <span className="lp-mark" aria-hidden="true" /><b>KBC LOOP</b>
        </a>
        <div className="lp-kate-slot">
          <Kate appearance="search" tone={theme === 'dark' || overHero ? 'dark' : 'light'} {...kate} />
        </div>
        <div className="lp-right">
          <div className="lp-coins" title="Kate Coins"><span className="lp-coin" aria-hidden="true" /><b className="lp-num">{num(coins)}</b><span className="lp-sr"> Kate Coins</span></div>
          <button type="button" className="lp-iconbtn" onClick={onToggleTheme} aria-label={themeLabel} title={themeLabel}>
            <LoopIcon name={toLight ? 'sun' : 'moon'} size={18} />
          </button>
          <span className="lp-avatar" aria-hidden="true">{avatar}</span>
        </div>
      </div>
    </header>
  )
}
