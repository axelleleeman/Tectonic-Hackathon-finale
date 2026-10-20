// De klantenapp (KBC Mobile met KBC Loop). Alle state komt live van de api via useLoop;
// knoppen sturen acties naar de api, die de nieuwe state naar alle schermen (web en app) stuurt.
import { useEffect, useMemo, useRef } from 'react'
import { BackHandler, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { useLoop } from './useLoop.js'
import { SCREENS } from './navigation.js'
import { AppBar } from './phone/AppBar.js'
import { TabBar } from './phone/TabBar.js'
import { Fab } from './phone/Fab.js'
import { Home } from './screens/Home.js'
import { MyKbc } from './screens/MyKbc.js'
import { Shop } from './screens/Shop.js'
import { Category } from './screens/Category.js'
import { Product } from './screens/Product.js'
import { Done } from './screens/Done.js'
import { Repair } from './screens/Repair.js'
import { KateScreen } from './kate/KateScreen.js'
import { Connecting, ConnectionError, OfflineBanner } from './ConnectionScreens.js'

export default function LoopApp() {
  const loop = useLoop()
  const { state, dispatch, customer, items, signals, coins, activeSignal, activeItem, status, error, fatal, actionError } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const scroll = useRef(null)

  const screenId = state?.screen
  const meta = SCREENS[screenId] ?? SCREENS.home
  const goBack = meta.back && state ? () => actions.navigate(meta.back(state.active)) : null

  // Bij een ander scherm terug naar boven scrollen.
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }) }, [screenId, state?.active?.categoryId, state?.active?.productId])

  // Android-terugknop: eerst Kate sluiten, dan naar het vorige scherm.
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (state?.kateOpen) { actions.closeKate(); return true }
      if (goBack) { goBack(); return true }
      return false
    })
    return () => sub.remove()
  }, [state?.kateOpen, goBack, actions])

  if (!state) return error ? <ConnectionError error={error} fatal={fatal} /> : <Connecting />

  const shared = { customer, items, signals, actions }
  const screen = {
    home: () => <Home {...shared} coins={coins} consent={state.consent} />,
    mykbc: () => <MyKbc {...shared} coins={coins} />,
    shop: () => <Shop {...shared} />,
    category: () => <Category {...shared} categoryId={state.active.categoryId} />,
    product: () => <Product customer={customer} productId={state.active.productId} signal={activeSignal} actions={actions} />,
    done: () => <Done productId={state.active.productId} actions={actions} />,
    repair: () => (activeItem ? <Repair item={activeItem} actions={actions} /> : null),
  }[screenId] ?? (() => null)

  const banner = actionError ? `Actie mislukt: ${actionError}` : status === 'offline' ? 'Offline: opnieuw verbinden…' : null

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <AppBar variant={meta.bar} title={meta.title} placeholder={meta.placeholder} onKate={actions.openKate} onBack={goBack} />
      <View style={styles.body}>
        <LinearGradient colors={['#ffffff', '#ffffff', '#f3f8fc']} locations={[0, 0.3, 1]} style={styles.bg} pointerEvents="none" />
        <ScrollView ref={scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {screen()}
        </ScrollView>
      </View>
      <Fab />
      <TabBar active={meta.tab} onSelect={(id) => actions.navigate(id)} />
      {banner ? <OfflineBanner message={banner} /> : null}
      <KateScreen open={Boolean(state.kateOpen)} {...shared} />
    </View>
  )
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#f3f8fc' },
  body: { flex: 1 },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, height: 380 },
  content: { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 150 },
})
