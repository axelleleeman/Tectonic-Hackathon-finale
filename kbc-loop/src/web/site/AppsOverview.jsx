import { Icon } from '../../components/ui/Icon.jsx'

const APPS = [
  { id: 'kbc-mobile', name: ['KBC', 'Mobile'], text: 'Bankier overal met je smartphone of tablet.' },
  { id: 'kbc-touch', name: ['KBC Touch'], text: 'Altijd toegang tot online banking op je pc.' },
  { id: 'kbc-business', name: ['KBC', 'Business'], text: 'Regel je professionele bankzaken waar en wanneer je wilt.' },
  { id: 'bolero', name: ['Bolero'], text: 'Het online beleggingsplatform van KBC voor zelf-beleggers.' },
]

// Tabblad "Overzicht": de bestaande apps (niet klikbaar, grijs) en KBC Loop als nieuwe, klikbare kaart.
export function AppsOverview({ onOpenLoop }) {
  return (
    <div className="apps-grid">
      {APPS.map((a) => (
        <div key={a.id} className="app-card off-card" aria-disabled="true">
          <div className="app-card-head">
            <img className="app-icon" src={`img/site/app-${a.id}.png`} alt="" />
            <b>{a.name.map((l) => <span key={l}>{l}</span>)}</b>
          </div>
          <p>{a.text}</p>
          <span className="app-link">Ontdek deze app</span>
          <div className="app-dl"><small>Download</small><span /><span /></div>
        </div>
      ))}
      <button className="app-card loop-card" onClick={onOpenLoop}>
        <div className="app-card-head">
          <span className="app-icon loop"><Icon name="loop" size={30} /></span>
          <b><span>KBC</span><span>Loop</span></b>
          <em>Nieuw</em>
        </div>
        <p>Lenen in plaats van kopen, met herstel inbegrepen. In KBC Mobile.</p>
        <span className="app-link">Ontdek KBC Loop</span>
      </button>
    </div>
  )
}
