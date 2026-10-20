import { Icon } from '../../components/ui/Icon.jsx'
import { KateAvatar } from '../../components/ui/KateAvatar.jsx'
import { euro, formatDate } from '../../engine/format.js'
import { PREVENTIVE_ISSUE } from '../../data/index.js'

const EXTRA_SERVICES = [['Parkeren', 'parking'], ['Treintickets', 'train'], ['Bioscoop', 'ticket']]

export function Home({ customer, signals, consent, items, actions }) {
  const hotIds = signals.map((s) => s.triggeredBy.id)
  const activeCount = items.filter((i) => !i.returned).length

  const openSignal = (s) => (s.itemKey
    ? actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null }))

  return (
    <>
      <h1 className="greeting">Dag {customer.name}</h1>

      <section className="account">
        <div className="acc-top">
          <div><b>{customer.accountName}</b><small>{customer.iban}</small></div>
          <span className="acc-bal">{euro(customer.balance, 2)}</span>
        </div>
        <ul className="tx">
          {customer.transactions.slice(0, 3).map((t) => (
            <li key={t.id} className={hotIds.includes(t.id) ? 'hot' : ''}>
              <div><b>{t.merchant}</b><small>{formatDate(t.date)}</small></div>
              <span className={t.amount > 0 ? 'pos' : ''}>{t.amount > 0 ? '+' : ''}{euro(t.amount, 2)}</span>
            </li>
          ))}
        </ul>
        <div className="acc-more off" aria-disabled="true">Alle verrichtingen <Icon name="chevron" size={16} /></div>
      </section>

      <h4>Kate inzichten</h4>
      {signals.map((s) => (
        <div key={s.id} className={`insight ${s.source === 'toestel' ? 'device' : ''}`}>
          {s.source !== 'toestel' && (
            <button className="insight-x" onClick={() => actions.dismissSignal(s.id)} aria-label="Niet interessant"><Icon name="close" size={16} /></button>
          )}
          <div className="insight-head">
            {s.source === 'toestel' ? <span className="sensor"><Icon name="sensor" size={16} /></span> : <KateAvatar />}
            <small>{s.source === 'toestel' ? 'Melding van je toestel · KBC Loop' : 'Kate · KBC Loop'}</small>
          </div>
          <strong>{s.headline}</strong>
          <button className="btn-secondary" onClick={() => openSignal(s)}>{s.itemKey ? 'Plan gratis vervanging' : 'Bekijk voorstel'}</button>
        </div>
      ))}
      {signals.length === 0 && (
        <div className="insight muted">
          {consent ? 'Geen nieuwe inzichten. Kate laat het je weten als er iets is.' : 'Persoonlijke inzichten staan uit. Kate gebruikt je verrichtingen niet voor voorstellen.'}
        </div>
      )}

      <h4>Extra diensten</h4>
      <div className="services">
        <button className="service featured" onClick={() => actions.navigate('shop')}>
          <span className="svc-icon loop"><Icon name="loop" /></span><b>KBC Loop</b><em>Nieuw</em>
        </button>
        {EXTRA_SERVICES.map(([label, icon]) => (
          <div key={label} className="service off" aria-disabled="true"><span className="svc-icon"><Icon name={icon} /></span><b>{label}</b></div>
        ))}
      </div>
      {activeCount > 0 && <p className="fine center">Je leent {activeCount} product{activeCount > 1 ? 'en' : ''} via KBC Loop · bekijk in Mijn KBC</p>}
    </>
  )
}
