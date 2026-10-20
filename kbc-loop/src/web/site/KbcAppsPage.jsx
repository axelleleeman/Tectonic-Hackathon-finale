import { Icon } from '../../components/ui/Icon.jsx'
import pageTop from '../../assets/site/page-top.png'
import pageApps from '../../assets/site/page-apps.png'

// De pagina "Alle apps van KBC" is een pixel-exacte screenshot (2878 px breed = 1439 css-px op retina).
// Enkel KBC Loop is echte, klikbare HTML; die ligt op exacte plaatsen bovenop de afbeelding.
const W = 2878
const TOP_H = 1110 // page-top.png: kop, hero, kruimelpad en tabbladen
const APPS_H = 629 // page-apps.png: de vier app-kaarten

const box = (h, x, y, w, hh) => ({
  left: `${(x / W) * 100}%`, top: `${(y / h) * 100}%`,
  ...(w ? { width: `${(w / W) * 100}%` } : {}), ...(hh ? { height: `${(hh / h) * 100}%` } : {}),
})

export function KbcAppsTop({ onLoop, onOverview, onOpenLoop }) {
  return (
    <div className="shot">
      <img src={pageTop} alt="KBC – Alle apps van KBC op een rijtje" draggable="false" />
      {/* lichtgrijs waas over wat niet klikbaar is: menu bovenaan, kruimelpad en de andere tabbladen */}
      <div className="wash" style={box(TOP_H, 0, 0, W, 288)} />
      <div className="wash" style={box(TOP_H, 0, 830, W, 186)} />
      <div className="wash" style={box(TOP_H, 200, 1016, W - 200, 82)} />

      <button className="shot-hit" style={box(TOP_H, 40, 1030, 160, 76)} onClick={onOverview} aria-label="Overzicht" />
      {onLoop && <div className="shot-cover" style={box(TOP_H, 44, 1102, 150, 4)} />}

      <button className={`shot-tab ${onLoop ? 'on' : ''}`} style={box(TOP_H, 699, 1020, 0, 86)} onClick={onOpenLoop}>
        KBC Loop <em>Nieuw</em>
      </button>
    </div>
  )
}

export function KbcAppsGrid({ onOpenLoop }) {
  return (
    <div className="shot">
      <img className="faded" src={pageApps} alt="KBC Mobile, KBC Touch, KBC Business en Bolero" draggable="false" />
      <button className="shot-card" style={box(APPS_H, 2420, 143, 400)} onClick={onOpenLoop}>
        <span className="shot-card-head">
          <span className="shot-card-icon"><Icon name="loop" size={28} /></span>
          <b><span>KBC</span><span>Loop</span></b>
          <em>Nieuw</em>
        </span>
        <span className="shot-card-text">Lenen in plaats van kopen, met herstel inbegrepen.</span>
        <span className="shot-card-link">Ontdek deze app</span>
      </button>
    </div>
  )
}
