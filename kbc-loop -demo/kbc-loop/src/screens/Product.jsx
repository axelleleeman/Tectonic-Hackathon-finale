import { useState } from 'react'
import { Photo } from '../components/ui/Photo.jsx'
import { CostCompare } from './CostCompare.jsx'
import { ServiceChips } from '../components/ui/ServiceChips.jsx'
import { productServices, servicesForSignal } from '../engine/integrations.js'
import { productById, partnerNames, categoryOf } from '../engine/catalog.js'
import { carKmEquivalent } from '../engine/impact.js'
import { categoryPhoto } from '../data/index.js'
import { euro, num } from '../engine/format.js'

export function Product({ customer, productId, signal, actions }) {
  const [why, setWhy] = useState(false)
  const p = productById(productId)
  const cat = categoryOf(p)
  const partner = partnerNames(p)

  return (
    <>
      <Photo className="product-hero" src={categoryPhoto(cat.id)} tint={cat.tint} icon={p.icon} />
      <span className="pill">{partner}</span>
      <h2>{p.icon} {p.name}</h2>
      <p className="partner">{p.detail}</p>
      <div className="price"><strong>{euro(p.monthly)}</strong> / maand · {p.termMonths / 12} jaar</div>

      <ul className="checks">{p.includes.map((i) => <li key={i}>{i}</li>)}</ul>

      {signal && (
        <>
          <button className="why" onClick={() => setWhy(!why)} aria-expanded={why}>ⓘ Waarom zie ik dit? {why ? '▴' : '▾'}</button>
          {why && (
            <div className="whybox">
              <ul>{signal.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              <p className="based-on">Gebaseerd op:</p>
              <ServiceChips services={servicesForSignal(signal)} />
              <p>We delen geen gegevens met {partner} tot jij beslist.</p>
            </div>
          )}
        </>
      )}

      <CostCompare product={p} />
      <div className="saving">♻ ± <b>{num(p.co2Kg)} kg CO₂</b> vermeden (≈ {num(carKmEquivalent(p.co2Kg))} km met de auto) doordat het product hersteld en hergebruikt wordt.</div>

      <div className="kbc-box">
        <b>Achter de schermen geregeld door KBC</b>
        <ServiceChips services={productServices(p, customer.type)} withRole />
      </div>

      <button className="primary" onClick={() => actions.borrow(p.id)}>Leen via KBC Loop</button>
      {signal && <button className="link" onClick={() => { actions.dismissSignal(signal.id); actions.navigate('home') }}>Niet geïnteresseerd, toon dit niet meer</button>}
      <p className="fine">Indicatieve bedragen. Opzegbaar na 12 maanden; je kan het product ook overnemen.</p>
    </>
  )
}
