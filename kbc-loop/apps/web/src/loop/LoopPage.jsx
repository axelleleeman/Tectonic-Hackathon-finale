import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { Connecting } from '@kbc-loop/web-ui/components/Connecting.jsx'
import { useAutoplay } from '../hooks/useAutoplay.js'
import { demoScript } from '../demo/presenter/demoScript.js'
import { LoopHeader } from './LoopHeader.jsx'
import { StartScreen } from './home/StartScreen.jsx'
import { Catalog } from './catalog/Catalog.jsx'
import { ProductPage } from './product/ProductPage.jsx'
import { CatalogProductPage } from './catalogProduct/CatalogProductPage.jsx'
import { PartnerPage } from './partner/PartnerPage.jsx'
import { CostsPage } from './costs/CostsPage.jsx'
import { AddModal } from './modals/AddModal.jsx'
import { DefectModal } from './modals/DefectModal.jsx'
import { Toast } from './Toast.jsx'
import { ConsentPage } from './consent/ConsentPage.jsx'
import { ConsentBanner } from './consent/ConsentBanner.jsx'
import { Presentation } from './Presentation.jsx'
import { homeSections, loopRows } from './model.js'
import { useTheme } from './useTheme.js'
import './loop.css'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * KBC LOOP on top of the shared state (useLoop). Views (see hooks/useHashRoute.js):
 *   home         = full-viewport hero with the 3D loop, metrics, "Your home" (every category with the customer's products), Kate tips and FAQ
 *   catalog      = the product catalogue behind "Add a product" (optionally opened on one category)
 *   product      = detail page of one product the customer has (product/ProductPage.jsx)
 *   catalogProduct = catalogue detail page of any product (catalogProduct/CatalogProductPage.jsx)
 *   partnerPage  = partner profile, key facts and products (partner/PartnerPage.jsx)
 *   costs        = cost overview (costs/CostsPage.jsx)
 *   rewards      = redirects to home with the Rewards tab of the framed module selected (rewards/RewardsPage.jsx, embedded)
 *   presentation = presenter panel, dashboards and app iframe (URL only)
 * Every action goes through the api, so it shows up live in the iOS/Android app and the dashboards.
 */
export function LoopPage({ route, param, go, loop }) {
  const { state, dispatch, customer, items = [], signals = [], coins = 0, status, error } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)
  const { theme, toggle: toggleTheme } = useTheme()

  const [modal, setModal] = useState(null) // { kind: 'defect' | 'add', itemKey?, productId? }
  const [toast, setToast] = useState(null)
  const [flashKey, setFlashKey] = useState(null)
  const [overHero, setOverHero] = useState(false) // header sits transparently over the start-screen hero
  const [homeTab, setHomeTab] = useState(route === 'rewards' ? 'rewards' : 'home') // Home / Impact / Rewards in the framed module
  const [frameFocus, setFrameFocus] = useState(route === 'rewards') // scroll the framed module into view once home renders
  const searchRef = useRef(null)
  const restoreFocus = useRef([])

  const rows = useMemo(() => (customer ? loopRows(items, customer.type) : []), [items, customer])
  const sections = useMemo(() => (customer ? homeSections(rows, customer.type) : []), [rows, customer])
  const totals = useMemo(() => loopTotals(items), [items])
  const ownedIds = useMemo(() => new Set(rows.filter((r) => !r.item.returned).map((r) => r.product.id)), [rows])

  const notify = useCallback((text) => setToast({ id: Date.now(), text }), [])

  // Layers: remember focus on open, restore on close
  const pushFocus = () => restoreFocus.current.push(document.activeElement)
  const popFocus = () => { const el = restoreFocus.current.pop(); if (el && document.contains(el)) el.focus() }
  const openModal = (m) => { pushFocus(); setModal(m) }
  const closeModal = useCallback(() => { setModal(null); popFocus() }, [])

  // Escape closes an open dialog (Kate's panel handles its own Escape)
  useEffect(() => {
    if (!modal) return undefined
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal, closeModal])

  // #loop/rewards opens the start screen with the Rewards tab selected
  useEffect(() => {
    if (route !== 'rewards') return
    setHomeTab('rewards')
    setFrameFocus(true)
    window.history.replaceState(null, '', '#loop') // replace, so Back does not bounce into the redirect again
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [route])

  useEffect(() => {
    if (!frameFocus || route !== 'home' || !state) return undefined
    const id = requestAnimationFrame(() => {
      document.querySelector('.lp-frame')?.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' })
      setFrameFocus(false)
    })
    return () => cancelAnimationFrame(id)
  }, [frameFocus, route, state])

  // Scroll a freshly added product into view and highlight it
  useEffect(() => {
    if (!flashKey || route !== 'home') return
    const el = document.querySelector(`[data-item="${CSS.escape(flashKey)}"]`)
    el?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' })
  }, [flashKey, route])

  if (!state || !customer) {
    if (error) return <div className="lp lp-loading" data-theme={theme}><Connecting error={error} /></div>
    return (
      <div className="lp" data-theme={theme} aria-busy="true">
        <div className="lp-skel-bar" />
        <div className="lp-skel" role="status">
          <span className="lp-sr">Loading KBC LOOP…</span>
          <i style={{ height: 20, width: 180 }} />
          <i style={{ height: 56, borderRadius: 999 }} />
          <i style={{ height: 160 }} />
          <i style={{ height: 160 }} />
        </div>
      </div>
    )
  }

  const goHome = () => go('home')
  const showRewards = () => { setHomeTab('rewards'); setFrameFocus(true); if (route !== 'home') go('home') }
  const openProduct = (itemKey) => go('product', itemKey)
  const openCosts = () => go('costs')
  const openCatalog = (categoryId = null) => {
    go('catalog', categoryId)
    requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true }))
  }
  const borrowModal = (productId) => openModal({ kind: 'add', productId })
  const openCatalogProduct = (productId) => go('catalogProduct', productId)
  const openPartner = (partnerId) => go('partnerPage', partnerId)
  const onBorrowed = (productId) => {
    const added = [...rows].reverse().find((r) => r.product.id === productId && !r.item.returned)
    go('home')
    if (added) setFlashKey(added.item.key)
    notify('Added to your home')
  }
  const onPreventive = async (itemKey) => {
    await actions.reportDefect(itemKey, PREVENTIVE_ISSUE, true)
    notify('Free replacement scheduled')
  }
  const showHome = () => {
    go('home')
    requestAnimationFrame(() => document.getElementById('lp-home')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }))
  }

  return (
    <div className={`lp ${overHero && route === 'home' ? 'lp-at-hero' : ''}`} data-theme={theme}>
      <LoopHeader onBack={() => go(null)} onHome={goHome} coins={coins} avatar={customer.avatar}
        theme={theme} overHero={overHero && route === 'home'} onToggleTheme={toggleTheme}
        onCoins={showRewards} inbox={{ loop, actions, go }}
        persona={{ customer, consentDone: Boolean(loop.dataPreferences?.completedOn), onConsent: () => go('consent'), onSwitch: (id) => { actions.switchCustomer(id); setModal(null); go('home'); notify('Customer switched') } }}
        kate={{
          loop,
          onRepair: (itemKey) => openModal({ kind: 'defect', itemKey }),
          onProduct: (productId) => { go('catalog'); openModal({ kind: 'add', productId }) },
          onOverview: showHome,
        }} />

      {route === 'home' && (
        <div className="lp-ui">
          <StartScreen customer={customer} items={items} totals={totals} coins={coins} sections={sections} signals={signals} onHeroOver={setOverHero}
            flashKey={flashKey} onOpen={openProduct} onBrowse={openCatalog} onAdd={() => openCatalog()} onCosts={openCosts} onRewards={showRewards}
            tab={homeTab} onTab={setHomeTab} loop={loop} actions={actions} onNotify={notify}
            notice={<ConsentBanner preferences={loop.dataPreferences} onReview={() => go('consent')} />}
            tips={{
              onOffer: (productId) => openModal({ kind: 'add', productId }),
              onPreventive,
              onDismiss: (id) => actions.dismissSignal(id),
            }} />
        </div>
      )}

      {route === 'catalog' && (
        <div className="lp-ui">
          <Catalog key={param ?? 'all'} customerType={customer.type} initialCategory={param} ownedIds={ownedIds} searchRef={searchRef}
            onAdd={borrowModal} onOpen={openCatalogProduct} onPartner={openPartner} onBack={goHome} />
        </div>
      )}

      {route === 'catalogProduct' && (
        <div className="lp-ui">
          <CatalogProductPage key={param} productId={param} customerType={customer.type} rows={rows} onBack={() => go('catalog')}
            onAdd={borrowModal} onOpen={openCatalogProduct} onPartner={openPartner} onOwned={openProduct} />
        </div>
      )}

      {route === 'partnerPage' && (
        <div className="lp-ui">
          <PartnerPage key={param} partnerId={param} customerType={customer.type} state={state} rows={rows} onBack={() => go('catalog')}
            onAdd={borrowModal} onOpen={openCatalogProduct} />
        </div>
      )}

      {route === 'product' && (
        <div className="lp-ui">
          <ProductPage key={param} itemKey={param} loop={loop} actions={actions} onBack={goHome}
            onOpenCatalog={() => openCatalog()} onOpenCosts={openCosts} />
        </div>
      )}


      {route === 'consent' && (
        <div className="lp-ui">
          <ConsentPage loop={loop} actions={actions} onBack={goHome} onSaved={() => { goHome(); notify('Your data choices are saved') }} />
        </div>
      )}

      {route === 'costs' && (
        <div className="lp-ui">
          <CostsPage loop={loop} onOpenProduct={openProduct} onBack={goHome} />
        </div>
      )}

      <Presentation state={state} items={items} actions={actions} autoplay={autoplay} hidden={route !== 'presentation'} />

      <div className="lp-ui">
        {modal?.kind === 'defect' && <DefectModal rows={rows} itemKey={modal.itemKey} actions={actions} onClose={closeModal} />}
        {modal?.kind === 'add' && <AddModal productId={modal.productId} actions={actions} onClose={closeModal} onBorrowed={onBorrowed} />}
        <Toast toast={toast} />
      </div>

      {status === 'offline' && <div className="offline-badge">Connection to the server lost, retrying…</div>}
    </div>
  )
}
