import { Icon } from '../../components/ui/Icon.jsx'

const SEGMENTS = ['Particulieren', 'Ondernemers', 'Private Banking', 'Commercial Banking', 'Jongvolwassenen', 'Alle websites']
const MENU = ['Betalen', 'Sparen', 'Beleggen', 'Lenen', 'Verzekeren', 'MyHome', 'MyMobility']

// Nagebootste websitekop. Niets is klikbaar (lichtgrijs): enkel KBC Loop werkt in deze demo.
export function SiteHeader() {
  return (
    <header className="site-head">
      <div className="site-top">
        <nav className="site-segments">
          {SEGMENTS.map((s, n) => <span key={s} className={`off-link ${n === 0 ? 'current' : ''}`}>{s}</span>)}
        </nav>
        <div className="site-search off-link"><span>Zoeken...</span><Icon name="search" size={18} /></div>
        <span className="off-link site-contact"><Icon name="phone" size={18} /> Contact</span>
        <span className="off-link">NL <Icon name="down" size={14} /></span>
      </div>
      <div className="site-main">
        <span className="site-brand"><span className="logo"><Icon name="loop" size={22} /></span>KBC</span>
        <nav className="site-menu">
          {MENU.map((m) => <span key={m} className="off-link">{m} <Icon name="down" size={16} /></span>)}
        </nav>
        <span className="site-btn off-btn">Open een zichtrekening</span>
        <span className="site-btn off-btn">Aanmelden</span>
      </div>
    </header>
  )
}
