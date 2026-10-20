import { Icon } from '../components/ui/Icon.jsx'
import { Amount } from '../components/ui/Amount.jsx'
import { PREVENTIVE_ISSUE } from '../data/index.js'
import { loopTotals } from '../engine/impact.js'
import { euro } from '../engine/format.js'

const shortDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

// "My…"-knoppen zoals in KBC Mobile; MyLoop is nieuw.
const MY_CHIPS = [
  { id: 'loop', label: 'MyLoop', icon: 'loop', isNew: true },
  { id: 'home', label: 'MyHome', icon: 'house' },
  { id: 'mobility', label: 'MyMobility', icon: 'bike' },
  { id: 'news', label: 'MyNews', icon: 'news' },
]

function AccountCards({ customer, items, onLoop }) {
  const savings = customer.myKbc.find((r) => r.section === 'Rekeningen')
  const t = loopTotals(items)
  return (
    <div className="acc-cards">
      <div className="acc-card">
        <div className="acc-visual blue"><Icon name="wallet" size={34} /></div>
        <div className="acc-info"><small>{customer.accountName}</small><Amount value={customer.balance} /></div>
      </div>
      {savings && (
        <div className="acc-card">
          <div className="acc-visual navy"><Icon name="piggy" size={34} /></div>
          <div className="acc-info"><small>{savings.name}</small><Amount value={savings.value} /></div>
        </div>
      )}
      <button className="acc-card" onClick={onLoop}>
        <div className="acc-visual loop"><Icon name="loop" size={34} /></div>
        <div className="acc-info"><small>KBC Loop · {t.active} geleend</small><b>{euro(t.monthly)}<span>/maand</span></b></div>
      </button>
    </div>
  )
}

export function Home({ customer, signals, consent, items, actions }) {
  const hotIds = signals.map((s) => s.triggeredBy.id)

  const openSignal = (s) => (s.itemKey
    ? actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null }))

  return (
    <>
      <div className="my-chips">
        <span className="scan"><Icon name="scan" size={18} /></span>
        {MY_CHIPS.map((c) => (
          <button key={c.id} className={`my-chip ${c.isNew ? 'new' : ''}`} disabled={c.id !== 'loop'}
            onClick={() => c.id === 'loop' && actions.navigate('shop')}>
            <Icon name={c.icon} size={15} />{c.label}
          </button>
        ))}
      </div>

      <AccountCards customer={customer} items={items} onLoop={() => actions.navigate('mykbc')} />

      <ul className="tx-plain">
        {customer.transactions.slice(0, 3).map((t) => (
          <li key={t.id} className={hotIds.includes(t.id) ? 'hot' : ''}>
            <small>{shortDate(t.date)}</small>
            <span className="merchant">{t.merchant}</span>
            <Amount value={t.amount} />
          </li>
        ))}
      </ul>
      <div className="tx-toggle"><Icon name="chevron" size={12} /> Verberg verrichtingen</div>

      <h4 className="section">Voor jou</h4>
      {signals.map((s) => {
        const device = s.source === 'toestel'
        return (
          <div key={s.id} className={`tip ${device ? 'device' : ''}`}>
            <span className="tip-icon">{device ? <Icon name="sensor" size={18} /> : <Icon name="loop" size={18} />}</span>
            <div className="tip-body">
              <b><Icon name="sparkle" size={11} /> {device ? 'Melding van je lamp' : 'Kate tip · KBC Loop'}</b>
              <p>{s.headline}</p>
              <button className="tip-link" onClick={() => openSignal(s)}>{s.itemKey ? 'Plan gratis vervanging' : 'Bekijk voorstel'} ›</button>
            </div>
            {!device && <button className="tip-x" onClick={() => actions.dismissSignal(s.id)} aria-label="Niet interessant"><Icon name="close" size={12} /></button>}
          </div>
        )
      })}
      <div className="tip">
        <span className="tip-icon"><Icon name="sparkle" size={18} /></span>
        <div className="tip-body">
          <b><Icon name="sparkle" size={11} /> Kate helpt je verder</b>
          <p>{consent ? 'Ontdek MyLoop: leen in plaats van te kopen, herstel inbegrepen.' : 'Persoonlijke tips staan uit. Kate gebruikt je verrichtingen niet voor voorstellen.'}</p>
          {consent && <button className="tip-link" onClick={() => actions.navigate('shop')}>Naar MyLoop ›</button>}
        </div>
      </div>
    </>
  )
}
