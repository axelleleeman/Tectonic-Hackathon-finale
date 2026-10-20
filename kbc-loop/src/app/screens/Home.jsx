import { Icon } from '../../components/ui/Icon.jsx'
import { Amount } from '../../components/ui/Amount.jsx'
import { PREVENTIVE_ISSUE } from '../../data/index.js'
import { loopTotals } from '../../engine/impact.js'

const shortDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`

// "My…"-knoppen van KBC Mobile; MyLoop is nieuw.
const MY_CHIPS = [
  { id: 'loop', label: 'MyLoop', icon: 'loop', isNew: true },
  { id: 'nws', label: 'MyNWS', icon: 'news' },
  { id: 'home', label: 'MyHome', icon: 'house' },
  { id: 'mobility', label: 'MyMobility', icon: 'signpost' },
]

// Extra diensten: KBC Loop staat tussen bestaande diensten.
const EXTRA = [
  { id: 'loop', title: 'KBC Loop', sub: 'Lenen in plaats van kopen', icon: 'loop', isNew: true },
  { id: 'energy', title: 'Energie-inzichten', sub: 'Inzicht krijgen in je energieverbruik', icon: 'chart' },
  { id: 'bike', title: 'Deelfiets', sub: 'Een fiets huren voor een dag', icon: 'signpost' },
]

function AccountCards({ customer, items, coins, onLoop }) {
  const savings = customer.myKbc.find((r) => r.section === 'Rekeningen')
  const t = loopTotals(items)
  return (
    <div className="acc-cards">
      <div className="acc-card">
        <div className="acc-visual coins"><span className="coin-mark">K</span></div>
        <div className="acc-info"><small>Kate Coins</small><Amount value={coins} unit="KTC" /></div>
      </div>
      <div className="acc-card selected">
        <div className="acc-visual blue"><Icon name="wallet" size={40} /></div>
        <div className="acc-info"><small>{customer.fullName.toUpperCase()}</small><Amount value={customer.balance} /></div>
      </div>
      {savings && (
        <div className="acc-card">
          <div className="acc-visual blue light"><Icon name="piggy" size={40} /></div>
          <div className="acc-info"><small>{customer.fullName.toUpperCase()}</small><Amount value={savings.value} /></div>
        </div>
      )}
      <button className="acc-card" onClick={onLoop}>
        <div className="acc-visual loop"><Icon name="loop" size={40} /></div>
        <div className="acc-info"><small>KBC LOOP · {t.active} GELEEND</small><Amount value={t.monthly} unit="EUR/m" /></div>
      </button>
    </div>
  )
}

export function Home({ customer, signals, consent, items, coins, actions }) {
  const hotIds = signals.map((s) => s.triggeredBy.id)
  const openSignal = (s) => (s.itemKey
    ? actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    : actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null }))

  return (
    <>
      <div className="my-chips">
        <span className="my-wallet"><Icon name="wallet" size={18} /></span>
        {MY_CHIPS.map((c) => (
          <button key={c.id} className={`my-chip ${c.isNew ? 'new' : ''}`} aria-disabled={c.id !== 'loop'}
            onClick={() => c.id === 'loop' && actions.navigate('shop')}>
            <Icon name={c.icon} size={16} />{c.label}
          </button>
        ))}
      </div>

      <AccountCards customer={customer} items={items} coins={coins} onLoop={() => actions.navigate('mykbc')} />

      <ul className="tx-plain">
        {customer.transactions.slice(0, 3).map((t) => (
          <li key={t.id} className={hotIds.includes(t.id) ? 'hot' : ''}>
            <small>{shortDate(t.date)}</small>
            <span className="merchant">{t.merchant.toUpperCase()}</span>
            <Amount value={t.amount} />
          </li>
        ))}
      </ul>
      <div className="tx-toggle"><Icon name="up" size={14} /> Verberg betalingen</div>

      <div className="section-head"><h2>Voor jou</h2><span className="head-link">Alle communicatie</span></div>
      {signals.map((s) => {
        const device = s.source === 'toestel'
        return (
          <div key={s.id} className={`tip new ${device ? 'device' : ''}`}>
            <span className="tip-icon"><Icon name={device ? 'sensor' : 'loop'} size={22} /></span>
            <div className="tip-body">
              <b><span className="kate-mark"><Icon name="kate" size={10} /></span>{device ? 'Je lamp laat je weten' : 'Kate tip'}</b>
              <p>{s.headline}</p>
              <button className="tip-link" onClick={() => openSignal(s)}>{s.itemKey ? 'Plan gratis vervanging' : 'Bekijk voorstel'}</button>
            </div>
            {!device && <button className="tip-x" onClick={() => actions.dismissSignal(s.id)} aria-label="Niet interessant"><Icon name="close" size={11} /></button>}
          </div>
        )
      })}
      <div className="tip">
        <span className="tip-icon"><Icon name="doc" size={22} /></span>
        <div className="tip-body">
          <b><span className="kate-mark"><Icon name="kate" size={10} /></span>Kate laat je weten</b>
          <p>{consent ? 'Nieuw in KBC Mobile: MyLoop. Leen in plaats van te kopen, herstel inbegrepen.' : 'Persoonlijke tips staan uit. Kate gebruikt je verrichtingen niet voor voorstellen.'}</p>
          {consent && <button className="tip-link" onClick={() => actions.navigate('shop')}>Ontdek MyLoop</button>}
        </div>
      </div>

      <div className="section-head"><h2>Extra diensten</h2><span className="head-link">Bekijk meer</span></div>
      <div className="extra-card">
        <h3>Onze andere extra diensten</h3>
        {EXTRA.map((e) => (
          <button key={e.id} className="extra-row" aria-disabled={e.id !== 'loop'} onClick={() => e.id === 'loop' && actions.navigate('shop')}>
            <span className="extra-icon"><Icon name={e.icon} size={22} /></span>
            <span className="extra-text"><b>{e.title}{e.isNew && <em className="badge-new">Nieuw</em>}</b><small>{e.sub}</small></span>
            <Icon name="heart" size={22} className="heart" />
          </button>
        ))}
      </div>
    </>
  )
}
