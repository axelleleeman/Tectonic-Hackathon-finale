import { productById, partnerOf } from '../../engine/catalog.js'
import { issuesFor } from '../../data/index.js'
import { COINS, TECHNICIAN_SLOT } from '../../config/index.js'

export function Repair({ item, actions }) {
  const p = productById(item.productId)
  const partner = partnerOf(p)
  const r = item.repair

  if (!r) {
    return (
      <>
        <h2>Wat is er mis met je {p.name.toLowerCase()}?</h2>
        <p className="sub-intro">{partner.name} krijgt je melding meteen. Herstel is inbegrepen in je abonnement.</p>
        {issuesFor(p.id).map((issue) => (
          <button key={issue} className="option" onClick={() => actions.reportDefect(item.key, issue)}>{issue}<span>›</span></button>
        ))}
      </>
    )
  }

  const steps = [
    r.preventive ? 'Slijtage gemeld door het toestel zelf' : 'Defect gemeld',
    `${partner.name} plant een technieker in · ${TECHNICIAN_SLOT}`,
    'Hersteld & getest',
  ]
  const done = r.step === 3

  return (
    <>
      <h2>{done ? 'Hersteld!' : 'Herstelling loopt'}</h2>
      <p className="sub-intro">{p.icon} {p.name} · “{r.issue}”</p>
      <p className="fine">Live status van {partner.short}, rechtstreeks in KBC Mobile.</p>
      <ol className="timeline">
        {steps.map((s, n) => <li key={s} className={n < r.step ? 'on' : ''}>{s}</li>)}
      </ol>
      {!done && (
        <button className="primary" onClick={() => actions.advanceRepair(item.key)}>
          {r.step === 1 ? 'Volgende: technieker ingepland' : 'Volgende: technieker herstelt'}
        </button>
      )}
      {done && (
        <>
          <div className="saving">♻ Hersteld in plaats van vervangen. Kost voor jou: <b>€ 0</b>. +{COINS.repair} Kate Coins omdat je liet herstellen.</div>
          <button className="primary" onClick={() => actions.closeRepair(item.key)}>Terug naar Mijn KBC</button>
        </>
      )}
    </>
  )
}
