import { Icon } from '../../components/ui/Icon.jsx'
import { customers } from '../../data/index.js'

const VIEWS = [['klant', 'Klant'], ['partner', 'Philips'], ['kbc', 'KBC']]
const FLOW = [
  ['home', 'Kate-inzicht (signaal)'], ['shop', 'KBC Loop: categorieën'], ['category', 'Partners'], ['product', 'Voorstel'],
  ['done', 'Geleend'], ['mykbc', 'Mijn KBC'], ['repair', 'Defect → herstel'],
]

export function PresenterPanel({ state, items, actions, autoplay }) {
  const hasConnected = items.some((i) => i.productId.startsWith('lamp') && !i.returned)
  return (
    <aside className="presenter">
      <div className="brand"><span className="logo"><Icon name="loop" size={24} /></span> KBC Loop</div>
      <p className="pitch">Lenen in plaats van kopen, in KBC Mobile. Partners zoals Philips blijven eigenaar en komen herstellen als iets kapot gaat. KBC brengt klant en partner samen en regelt financiering en verzekering.</p>

      <button className={`play ${autoplay.playing ? 'on' : ''}`} onClick={autoplay.playing ? autoplay.stop : autoplay.start}>
        <Icon name={autoplay.playing ? 'stop' : 'play'} size={18} />
        {autoplay.playing ? 'Stop presentatie' : 'Speel demo af (± 45 s)'}
      </button>
      {autoplay.playing && (
        <div className="caption">
          <div className="caption-bar"><span style={{ width: `${autoplay.progress * 100}%` }} /></div>
          {autoplay.caption}
        </div>
      )}

      <a className="ghost wide" href="app.html" target="_blank" rel="noreferrer">Open de klantenapp apart (gsm) ↗</a>
      <a className="ghost wide" href="kbc.html" target="_blank" rel="noreferrer">Open KBC Loop Insights (intern) ↗</a>

      <h3>Perspectief</h3>
      <div className="seg three">
        {VIEWS.map(([id, label]) => (
          <button key={id} className={state.view === id ? 'on' : ''} onClick={() => actions.setView(id)}>{label}</button>
        ))}
      </div>

      <h3>Klant</h3>
      <div className="persona-list">
        {customers.map((c) => (
          <button key={c.id} className={c.id === state.customerId && state.view === 'klant' ? 'on' : ''} onClick={() => actions.switchCustomer(c.id)}>
            <b>{c.name}</b><small>{c.persona}</small>
          </button>
        ))}
      </div>

      <h3>Simuleer</h3>
      <button className="ghost wide" disabled={!hasConnected} onClick={actions.triggerTelemetry}>
        <Icon name="sensor" size={16} /> Lamp meldt slijtage (IoT)
      </button>
      <label className="toggle">
        <input type="checkbox" checked={state.consent} onChange={(e) => actions.setConsent(e.target.checked)} />
        <span>Toestemming voor persoonlijke voorstellen</span>
      </label>

      <h3>Flow</h3>
      <ol className="flow">
        {FLOW.map(([k, l]) => <li key={k} className={state.view === 'klant' && state.screen === k ? 'on' : ''}>{l}</li>)}
      </ol>
      <button className="ghost" onClick={actions.reset}>↺ Demo resetten</button>
      <p className="fine">Conceptprototype voor de Tectonic Hackathon, geen officiële KBC-app. Fictieve klanten en indicatieve bedragen. Philips is een voorbeeldpartner; andere partners zijn fictief.</p>
    </aside>
  )
}
