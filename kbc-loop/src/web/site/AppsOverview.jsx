import { Icon } from '../../components/ui/Icon.jsx'

const APPS = [
  { name: 'KBC Mobile', icon: 'wallet', text: 'Bankier overal met je smartphone of tablet.' },
  { name: 'KBC Touch', icon: 'touch', text: 'Altijd toegang tot online banking op je pc.' },
  { name: 'KBC Business', icon: 'briefcase', text: 'Regel je professionele bankzaken waar en wanneer je wilt.' },
  { name: 'Bolero', icon: 'chart', text: 'Het online beleggingsplatform voor zelfbeleggers.' },
]

// Tabblad "Overzicht": de bestaande apps (niet klikbaar) en KBC Loop als nieuwe, klikbare kaart.
export function AppsOverview({ onOpenLoop }) {
  return (
    <div className="apps-grid">
      {APPS.map((a) => (
        <div key={a.name} className="app-card off-card" aria-disabled="true">
          <div className="app-card-head"><span className="app-icon"><Icon name={a.icon} size={30} /></span><b>{a.name}</b></div>
          <p>{a.text}</p>
          <span className="off-link">Ontdek deze app</span>
        </div>
      ))}
      <button className="app-card loop-card" onClick={onOpenLoop}>
        <div className="app-card-head"><span className="app-icon loop"><Icon name="loop" size={30} /></span><b>KBC Loop</b><em>Nieuw</em></div>
        <p>Lenen in plaats van kopen: circulaire partners, herstel inbegrepen, in KBC Mobile.</p>
        <span className="loop-link">Ontdek KBC Loop →</span>
      </button>
    </div>
  )
}
