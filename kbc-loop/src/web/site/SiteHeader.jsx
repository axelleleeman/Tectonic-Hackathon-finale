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
        <div className="site-search"><span>Zoeken...</span><Icon name="search" size={18} /></div>
        <span className="off-link site-contact"><Icon name="phone" size={17} /> Contact</span>
        <span className="off-link site-lang">NL <Icon name="down" size={13} /></span>
      </div>
      <div className="site-main">
        <img className="site-logo" src="img/site/kbc-logo.png" alt="KBC" />
        <nav className="site-menu">
          {MENU.map((m) => <span key={m} className="off-link">{m} <Icon name="down" size={15} /></span>)}
        </nav>
        <span className="site-btn green">Open een zichtrekening</span>
        <span className="site-btn blue">Aanmelden</span>
      </div>
    </header>
  )
}
