// De klantenapp (KBC Mobile met KBC Loop). Alle state komt live van de api via useLoop;
// knoppen sturen acties naar de api, die de nieuwe state naar alle schermen (web en app) stuurt.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BackHandler, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { useLoop } from './useLoop.js'
import { getClient } from './api.js'
import { SCREENS } from './navigation.js'
import { AppBar } from './phone/AppBar.js'
import { TabBar } from './phone/TabBar.js'
import { Fab } from './phone/Fab.js'
import { PushNotification } from './phone/PushNotification.js'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { Shop } from './screens/Shop.js'
import { Category } from './screens/Category.js'
import { Product } from './screens/Product.js'
import { Done } from './screens/Done.js'
import { Repair } from './screens/Repair.js'
import { ItemScreen } from './screens/item/ItemScreen.js'
import { ChromeContext } from './screens/item/chrome.js'
import { CostOverview } from './screens/costs/CostOverview.js'
import { RewardsScreen } from './screens/rewards/RewardsScreen.js'
import { InboxScreen, inboxList } from './screens/inbox/InboxScreen.js'
import { KateScreen } from './kate/KateScreen.js'
import { Connecting, ConnectionError, OfflineBanner } from './ConnectionScreens.js'

// Persona switch behind the header avatar: Lotte (individual) and Bakkerij Peeters (business).
const PERSONAL_ID = 'lotte'
const BUSINESS_ID = 'peeters'

export default function LoopApp() {
  const loop = useLoop()
  const { state, dispatch, customer, items, signals, coins, activeSignal, activeItem, status, error, fatal, actionError } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const scroll = useRef(null)
  // A flow inside a screen (report, upgrade, return, costs) can take over the header title and back button.
  const [chrome, setChrome] = useState(null)
  // Item key of the product that is being upgraded: its successor shows the upgrade confirmation once.
  const [celebrate, setCelebrate] = useState(null)
  const history = useRef([])

  const screenId = state?.screen
  const meta = SCREENS[screenId] ?? SCREENS.home

  // Remember the screens shown before, so item and costs can go back to where the customer came from.
  useEffect(() => {
    if (!screenId) return
    const h = history.current
    if (h[h.length - 1] !== screenId) history.current = [...h, screenId].slice(-12)
  }, [screenId])
  const previous = () => [...history.current].reverse().find((s) => s !== screenId) ?? null

  const goBack = chrome?.back ?? (meta.back && state ? () => {
    const target = meta.back(state.active, previous())
    if (Array.isArray(target)) actions.navigate(...target)
    else actions.navigate(target)
  } : null)

  const chromeApi = useMemo(() => ({
    set: (c) => setChrome(c),
    clear: (token) => setChrome((c) => (c?.token === token ? null : c)),
    scrollTop: () => scroll.current?.scrollTo({ y: 0, animated: false }),
  }), [])

  // Several actions in a fixed order (each waits for the api), e.g. close a repair and then open the product.
  const run = useCallback(async (list) => {
    try {
      for (const action of list) await getClient().dispatch(action)
    } catch {
      list.forEach(dispatch) // fall back to the regular dispatch, which shows the error banner
    }
  }, [dispatch])

  // Pushmelding: elk nieuw Kate-inzicht verschijnt één keer als melding bovenaan (per klant).
  const [push, setPush] = useState(null)
  const seen = useRef(new Set())
  useEffect(() => {
    if (!customer) return
    const fresh = (signals ?? []).find((s) => !seen.current.has(`${customer.id}:${s.id}`))
    if (!fresh) return
    seen.current.add(`${customer.id}:${fresh.id}`)
    setPush(fresh)
  }, [customer, signals])
  // Melding verdwijnt als het inzicht niet meer geldt (weggeklikt, geleend, andere klant).
  useEffect(() => { if (push && !(signals ?? []).some((s) => s.id === push.id)) setPush(null) }, [push, signals])
  const closePush = useCallback(() => setPush(null), [])
  const openPush = () => {
    const s = push
    setPush(null)
    if (s.itemKey) actions.reportDefect(s.itemKey, PREVENTIVE_ISSUE, true)
    else actions.navigate('product', { productId: s.productId, signalId: s.id, categoryId: null })
  }

  // Bij een ander scherm terug naar boven scrollen.
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }) }, [screenId, state?.active?.categoryId, state?.active?.productId, state?.active?.itemKey])

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
    // Everything happens inside Loop: the old Home and My KBC screens show Loop as well.
    home: () => <Shop {...shared} coins={coins} />,
    mykbc: () => <Shop {...shared} coins={coins} />,
    shop: () => <Shop {...shared} coins={coins} />,
    category: () => <Category {...shared} categoryId={state.active.categoryId} />,
    product: () => <Product customer={customer} productId={state.active.productId} signal={activeSignal} actions={actions} />,
    done: () => <Done productId={state.active.productId} actions={actions} />,
    repair: () => (activeItem ? <Repair item={activeItem} actions={actions} run={run} /> : null),
    item: () => (activeItem ? (
      <ItemScreen key={activeItem.key} item={activeItem} items={items} customer={customer} actions={actions}
        celebrate={celebrate} onCelebrated={() => setCelebrate(null)} onUpgrading={setCelebrate} />
    ) : null),
    costs: () => <CostOverview items={items} actions={actions} />,
    rewards: () => <RewardsScreen state={state} customer={customer} coins={coins} actions={actions} />,
    inbox: () => <InboxScreen state={state} actions={actions} />,
  }[screenId] ?? (() => null)

  const banner = actionError ? `Action failed: ${actionError}` : status === 'offline' ? 'Offline: reconnecting…' : null

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <AppBar variant={chrome ? 'back' : meta.bar} title={chrome?.title ?? meta.title} placeholder={meta.placeholder} onKate={actions.openKate} onBack={goBack}
        onPersona={() => actions.switchCustomer(customer.id === BUSINESS_ID ? PERSONAL_ID : BUSINESS_ID)} persona={customer}
        onBell={() => actions.navigate('inbox')} unread={inboxList(state).filter((n) => !n.read).length} />
      <View style={styles.body}>
        <LinearGradient colors={['#ffffff', '#ffffff', '#f3f8fc']} locations={[0, 0.3, 1]} style={styles.bg} pointerEvents="none" />
        <ScrollView ref={scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ChromeContext.Provider value={chromeApi}>{screen()}</ChromeContext.Provider>
        </ScrollView>
      </View>
      <Fab />
      <TabBar active={meta.tab} onSelect={(id) => actions.navigate(id)} />
      {banner ? <OfflineBanner message={banner} /> : null}
      {push && !state.kateOpen ? (
        <PushNotification key={`${customer.id}:${push.id}`} onOpen={openPush} onClose={closePush}
          title={push.notification?.title ?? (push.source === 'toestel' ? 'Your lamp is letting you know' : 'Kate tip')}
          body={push.notification?.body ?? push.headline} />
      ) : null}
      <KateScreen open={Boolean(state.kateOpen)} {...shared} />
    </View>
  )
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#f3f8fc' },
  body: { flex: 1 },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, height: 380 },
  content: { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 190 }, // clears the floating tab bar and the round transfer button
})
