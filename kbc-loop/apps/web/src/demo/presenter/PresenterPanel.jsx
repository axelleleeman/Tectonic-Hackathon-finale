import { Icon } from '@kbc-loop/web-ui/components/Icon.jsx'
import { APP_URL, INSIGHTS_URL } from '@kbc-loop/web-ui/api.js'
import { KbcLogo } from '@kbc-loop/web-ui/components/KbcLogo.jsx'
import { customers } from '@kbc-loop/shared/data/index.js'

const VIEWS = [['klant', 'Customer'], ['partner', 'Philips'], ['kbc', 'KBC']]
const FLOW = [
  ['home', 'Kate insight (signal)'], ['shop', 'KBC Loop: categories'], ['category', 'Partners'], ['product', 'Proposal'],
  ['done', 'Borrowed'], ['mykbc', 'My KBC'], ['repair', 'Defect → repair'],
]

export function PresenterPanel({ state, items, actions, autoplay }) {
  const hasConnected = items.some((i) => i.productId.startsWith('lamp') && !i.returned)
  return (
    <aside className="presenter">
      <div className="brand"><KbcLogo height={40} /><span>Loop</span></div>
      <p className="pitch">Borrow instead of buy, in KBC Mobile. Partners such as Philips stay the owner and come to repair anything that breaks. KBC brings customer and partner together and arranges financing and insurance.</p>

      <button className={`play ${autoplay.playing ? 'on' : ''}`} onClick={autoplay.playing ? autoplay.stop : autoplay.start}>
        <Icon name={autoplay.playing ? 'stop' : 'play'} size={18} />
        {autoplay.playing ? 'Stop presentation' : 'Play demo (± 45 s)'}
      </button>
      {autoplay.playing && (
        <div className="caption">
          <div className="caption-bar"><span style={{ width: `${autoplay.progress * 100}%` }} /></div>
          {autoplay.caption}
        </div>
      )}

      <a className="ghost wide" href={APP_URL} target="_blank" rel="noreferrer">Open the customer app separately (phone) ↗</a>
      <a className="ghost wide" href={INSIGHTS_URL} target="_blank" rel="noreferrer">Open KBC Loop Insights (internal) ↗</a>

      <h3>Perspective</h3>
      <div className="seg three">
        {VIEWS.map(([id, label]) => (
          <button key={id} className={state.view === id ? 'on' : ''} onClick={() => actions.setView(id)}>{label}</button>
        ))}
      </div>

      <h3>Customer</h3>
      <div className="persona-list">
        {customers.map((c) => (
          <button key={c.id} className={c.id === state.customerId && state.view === 'klant' ? 'on' : ''} onClick={() => actions.switchCustomer(c.id)}>
            <b>{c.name}</b><small>{c.persona}</small>
          </button>
        ))}
      </div>

      <h3>Simulate</h3>
      <button className="ghost wide" disabled={!hasConnected} onClick={actions.triggerTelemetry}>
        <Icon name="sensor" size={16} /> Light reports wear (IoT)
      </button>
      <label className="toggle">
        <input type="checkbox" checked={state.consent} onChange={(e) => actions.setConsent(e.target.checked)} />
        <span>Consent to personal suggestions</span>
      </label>

      <h3>Flow</h3>
      <ol className="flow">
        {FLOW.map(([k, l]) => <li key={k} className={state.view === 'klant' && state.screen === k ? 'on' : ''}>{l}</li>)}
      </ol>
      <button className="ghost" onClick={actions.reset}>↺ Reset demo</button>
      <p className="fine">Concept prototype for the Tectonic Hackathon, not an official KBC app. Fictional customers and indicative amounts. Philips is an example partner; other partners are fictional.</p>
    </aside>
  )
}
