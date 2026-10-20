import { useMemo } from 'react'
import { useLoop } from './state/useLoop.js'
import { bindActions } from './state/actions.js'
import { useAutoplay } from './hooks/useAutoplay.js'
import { demoScript } from './presenter/demoScript.js'
import { PresenterPanel } from './presenter/PresenterPanel.jsx'
import { PhoneFrame } from './components/phone/PhoneFrame.jsx'
import { AppBar } from './components/phone/AppBar.jsx'
import { TabBar } from './components/phone/TabBar.jsx'
import { Home } from './screens/Home.jsx'
import { MyKbc } from './screens/MyKbc.jsx'
import { Shop } from './screens/Shop.jsx'
import { Category } from './screens/Category.jsx'
import { Product } from './screens/Product.jsx'
import { Done } from './screens/Done.jsx'
import { Repair } from './screens/Repair.jsx'
import { KateSheet } from './screens/KateSheet.jsx'
import { PartnerDashboard } from './dashboards/PartnerDashboard.jsx'
import { KbcDashboard } from './dashboards/KbcDashboard.jsx'

// Per scherm: titel in de appbar, terug-bestemming en actief tabblad.
const SCREENS = {
  home: { title: '', tab: 'home' },
  mykbc: { title: 'Mijn KBC', tab: 'mykbc' },
  shop: { brand: true, tab: 'shop' },
  category: { brand: true, tab: 'shop', back: () => 'shop' },
  product: { brand: true, tab: 'shop', back: (a) => (a.categoryId ? 'category' : a.signalId ? 'home' : 'shop') },
  done: { brand: true, tab: 'mykbc', back: () => 'mykbc' },
  repair: { title: 'Herstelling', tab: 'mykbc', back: () => 'mykbc' },
}

export default function App() {
  const loop = useLoop()
  const { state, dispatch, customer, items, signals, coins, activeSignal, activeItem } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)

  const meta = SCREENS[state.screen]
  const shared = { customer, items, signals, actions }

  const screen = {
    home: () => <Home {...shared} consent={state.consent} />,
    mykbc: () => <MyKbc {...shared} coins={coins} />,
    shop: () => <Shop {...shared} />,
    category: () => <Category {...shared} categoryId={state.active.categoryId} />,
    product: () => <Product customer={customer} productId={state.active.productId} signal={activeSignal} actions={actions} />,
    done: () => <Done productId={state.active.productId} actions={actions} />,
    repair: () => activeItem && <Repair item={activeItem} actions={actions} />,
  }[state.screen]

  return (
    <div className="stage">
      <PresenterPanel state={state} items={items} actions={actions} autoplay={autoplay} />

      {state.view === 'partner' && <PartnerDashboard state={state} />}
      {state.view === 'kbc' && <KbcDashboard state={state} />}
      {state.view === 'klant' && (
        <PhoneFrame
          header={<AppBar title={meta.title} brand={meta.brand} avatar={customer.avatar} onKate={actions.openKate}
            onBack={meta.back && (() => actions.navigate(meta.back(state.active)))} />}
          footer={<TabBar active={meta.tab} onSelect={(id) => actions.navigate(id)} />}
          overlay={state.kateOpen && <KateSheet {...shared} />}
        >
          {screen()}
        </PhoneFrame>
      )}
    </div>
  )
}
