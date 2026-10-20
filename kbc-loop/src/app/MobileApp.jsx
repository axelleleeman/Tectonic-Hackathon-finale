import { useMemo } from 'react'
import { useLoop } from '../state/useLoop.js'
import { bindActions } from '../state/actions.js'
import { PhoneFrame } from './phone/PhoneFrame.jsx'
import { AppBar } from './phone/AppBar.jsx'
import { TabBar } from './phone/TabBar.jsx'
import { Fab } from './phone/Fab.jsx'
import { Home } from './screens/Home.jsx'
import { MyKbc } from './screens/MyKbc.jsx'
import { Shop } from './screens/Shop.jsx'
import { Category } from './screens/Category.jsx'
import { Product } from './screens/Product.jsx'
import { Done } from './screens/Done.jsx'
import { Repair } from './screens/Repair.jsx'
import { KateSheet } from './screens/KateSheet.jsx'

// Per scherm: soort kopbalk, titel, terug-bestemming en actief tabblad (zoals in KBC Mobile).
const SCREENS = {
  home: { bar: 'search', placeholder: 'Hoe kan ik je helpen?', tab: 'home' },
  mykbc: { bar: 'title', title: 'Mijn KBC', tab: 'mykbc' },
  shop: { bar: 'title', title: 'Aanbod', tab: 'shop' },
  category: { bar: 'back', title: 'KBC Loop', tab: 'shop', back: () => 'shop' },
  product: { bar: 'back', title: 'KBC Loop', tab: 'shop', back: (a) => (a.categoryId ? 'category' : a.signalId ? 'home' : 'shop') },
  done: { bar: 'back', title: 'KBC Loop', tab: 'mykbc', back: () => 'mykbc' },
  repair: { bar: 'back', title: 'Herstelling', tab: 'mykbc', back: () => 'mykbc' },
}

// De klantenapp (KBC Mobile). Deelt state met de webweergave via useLoop.
export default function MobileApp() {
  const loop = useLoop()
  const { state, dispatch, customer, items, signals, coins, activeSignal, activeItem } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])

  const meta = SCREENS[state.screen]
  const shared = { customer, items, signals, actions }

  const screen = {
    home: () => <Home {...shared} coins={coins} consent={state.consent} />,
    mykbc: () => <MyKbc {...shared} coins={coins} />,
    shop: () => <Shop {...shared} />,
    category: () => <Category {...shared} categoryId={state.active.categoryId} />,
    product: () => <Product customer={customer} productId={state.active.productId} signal={activeSignal} actions={actions} />,
    done: () => <Done productId={state.active.productId} actions={actions} />,
    repair: () => activeItem && <Repair item={activeItem} actions={actions} />,
  }[state.screen]

  return (
    <div className="app-stage">
      <PhoneFrame
        header={<AppBar variant={meta.bar} title={meta.title} placeholder={meta.placeholder} onKate={actions.openKate}
          onBack={meta.back && (() => actions.navigate(meta.back(state.active)))} />}
        footer={<><Fab /><TabBar active={meta.tab} onSelect={(id) => actions.navigate(id)} /></>}
        overlay={state.kateOpen && <KateSheet {...shared} />}
      >
        {screen()}
      </PhoneFrame>
    </div>
  )
}
