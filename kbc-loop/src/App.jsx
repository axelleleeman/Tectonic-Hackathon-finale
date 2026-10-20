import { useMemo } from 'react'
import { useLoop } from './state/useLoop.js'
import { bindActions } from './state/actions.js'
import { useAutoplay } from './hooks/useAutoplay.js'
import { demoScript } from './presenter/demoScript.js'
import { PresenterPanel } from './presenter/PresenterPanel.jsx'
import { PhoneFrame } from './components/phone/PhoneFrame.jsx'
import { AppBar } from './components/phone/AppBar.jsx'
import { Fab } from './components/phone/Fab.jsx'
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

// Per scherm: titel in de appbar en terug-bestemming.
const SCREENS = {
  home: { title: '' },
  mykbc: { title: 'Mijn KBC', back: () => 'home' },
  shop: { brand: true, back: () => 'home' },
  category: { brand: true, back: () => 'shop' },
  product: { brand: true, back: (a) => (a.categoryId ? 'category' : a.signalId ? 'home' : 'shop') },
  done: { brand: true, back: () => 'mykbc' },
  repair: { title: 'Herstelling', back: () => 'mykbc' },
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
            onAvatar={() => actions.navigate('mykbc')}
            onBack={meta.back && (() => actions.navigate(meta.back(state.active)))} />}
          footer={<Fab />}
          overlay={state.kateOpen && <KateSheet {...shared} />}
        >
          {screen()}
        </PhoneFrame>
      )}
    </div>
  )
}
