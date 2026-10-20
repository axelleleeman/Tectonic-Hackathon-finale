import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { bindActions } from '@kbc-loop/shared/state/actions.js'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { PREVENTIVE_ISSUE } from '@kbc-loop/shared/data/index.js'
import { Connecting } from '@kbc-loop/web-ui/components/Connecting.jsx'
import { useAutoplay } from '../hooks/useAutoplay.js'
import { demoScript } from '../demo/presenter/demoScript.js'
import { LoopHeader } from './LoopHeader.jsx'
import { TabNav } from './TabNav.jsx'
import { Hero } from './Hero.jsx'
import { ImpactCard } from './ImpactCard.jsx'
import { QuickActions } from './QuickActions.jsx'
import { KateTips } from './KateTips.jsx'
import { HomeTable } from './HomeTable.jsx'
import { CoinsPanel } from './CoinsPanel.jsx'
import { Faq } from './Faq.jsx'
import { Marketplace, Disclaimer } from './Marketplace.jsx'
import { Drawer } from './Drawer.jsx'
import { AddModal, DefectModal, UpgradeModal } from './Modals.jsx'
import { Toast } from './Toast.jsx'
import { Presentation } from './Presentation.jsx'
import { coinFeed, homeItems } from './model.js'
import { useTheme } from './useTheme.js'
import './loop.css'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * KBC LOOP on top of the shared state (useLoop), with the same tabs as the app:
 *   Home   = hero, impact card (Kate Coins + CO₂), quick actions and Kate tips
 *   My KBC = impact card, products in your home and Kate Coins
 *   Loop   = the marketplace (also behind the "+" button)
 * "Presentation" (presenter panel, dashboards, app iframe) is reachable via #loop/presentation only.
 * Every action goes through the api, so it shows up live in the iOS/Android app and the dashboards.
 */
export function LoopPage({ tab, onTab, onBack, loop }) {
  const { state, dispatch, customer, items = [], signals = [], coins = 0, status, error } = loop
  const actions = useMemo(() => bindActions(dispatch), [dispatch])
  const autoplay = useAutoplay(dispatch, demoScript)
  const { theme, toggle: toggleTheme } = useTheme()

  const [circular, setCircular] = useState(reducedMotion)
  const [drawerKey, setDrawerKey] = useState(null)
  const [modal, setModal] = useState(null) // { kind: 'defect' | 'upgrade' | 'add', itemKey?, productId?, pick? }
  const [toast, setToast] = useState(null)
  const [flashKey, setFlashKey] = useState(null)
  const searchRef = useRef(null)
  const restoreFocus = useRef([])

  const rows = useMemo(() => (customer ? homeItems(items, customer.type) : []), [items, customer])
  const totals = useMemo(() => loopTotals(items), [items])
  const feed = useMemo(() => coinFeed(rows, items, COINS), [rows, items])
  const ownedIds = useMemo(() => new Set(rows.map((r) => r.product.id)), [rows])
  const drawerRow = rows.find((r) => r.item.key === drawerKey) ?? null

  const notify = useCallback((text) => setToast({ id: Date.now(), text }), [])

  // Like the prototype: start linear, then morph into the loop
  useEffect(() => {
    const t = setTimeout(() => setCircular(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Layers: remember focus on open, restore on close
  const pushFocus = () => restoreFocus.current.push(document.activeElement)
  const popFocus = () => { const el = restoreFocus.current.pop(); if (el && document.contains(el)) el.focus() }
  const openDrawer = (key) => { pushFocus(); setDrawerKey(key) }
  const closeDrawer = useCallback(() => { setDrawerKey(null); popFocus() }, [])
  const openModal = (m) => { pushFocus(); setModal(m) }
  const closeModal = useCallback(() => { setModal(null); popFocus() }, [])

  // Escape closes the top layer first (modal above drawer)
  useEffect(() => {
    if (!modal && !drawerKey) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (modal) closeModal()
      else closeDrawer()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [modal, drawerKey, closeModal, closeDrawer])

  // A returned item disappears from the list: close its drawer as well
  useEffect(() => {
    if (drawerKey && !drawerRow && !modal) closeDrawer()
  }, [drawerKey, drawerRow, modal, closeDrawer])

  // Scroll a freshly added product into view and highlight it
  useEffect(() => {
    if (!flashKey || tab !== 'mykbc') return
    const el = document.querySelector(`[data-item="${CSS.escape(flashKey)}"]`)
    el?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' })
  }, [flashKey, tab])

  if (!state || !customer) {
    return <div className="lp lp-loading" data-theme={theme}><Connecting error={error} /></div>
  }

  const goMarket = () => onTab('loop')
  const onAdd = () => { onTab('loop'); requestAnimationFrame(() => searchRef.current?.focus({ preventScroll: true })) }
  const onBorrowed = (productId) => {
    const added = [...rows].reverse().find((r) => r.product.id === productId)
    onTab('mykbc')
    if (added) setFlashKey(added.item.key)
    notify('Added to your home')
  }
  const onPreventive = async (itemKey) => {
    await actions.reportDefect(itemKey, PREVENTIVE_ISSUE, true)
    notify('Free replacement scheduled')
  }

  return (
    <div className="lp" data-theme={theme}>
      <LoopHeader tab={tab} onTab={onTab} onBack={onBack} onAdd={onAdd} coins={coins} avatar={customer.avatar}
        theme={theme} onToggleTheme={toggleTheme}
        kate={{
          loop,
          onRepair: (itemKey) => openModal({ kind: 'defect', itemKey }),
          onProduct: (productId) => { onTab('loop'); openModal({ kind: 'add', productId }) },
          onOverview: () => onTab('mykbc'),
        }} />

      {tab === 'home' && (
        <div className="lp-ui">
          <Hero customer={customer} rows={rows} circular={circular} onMode={setCircular} theme={theme} />
          <main className="lp-wrap lp-main">
            <ImpactCard totals={totals} coins={coins} />
            <QuickActions
              onDefect={() => openModal({ kind: 'defect', pick: true })}
              onUpgrade={() => openModal({ kind: 'upgrade', pick: true })}
              onMarket={goMarket}
              onImpact={() => { window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }); setCircular((c) => !c) }}
            />
            <KateTips signals={signals} onOffer={(productId) => openModal({ kind: 'add', productId })}
              onPreventive={onPreventive} onDismiss={(id) => actions.dismissSignal(id)} />
            <Faq />
            <Disclaimer />
          </main>
        </div>
      )}

      {tab === 'mykbc' && (
        <div className="lp-ui">
          <main className="lp-wrap lp-main">
            <header className="lp-pagehead">
              <div className="lp-eyebrow">My KBC</div>
              <h1>In your home</h1>
              <p>Everything you borrow through KBC LOOP, with its condition, repairs and monthly price.
                {' '}Monthly total: <b className="lp-num">{euro(totals.monthly)}</b>.</p>
            </header>
            <ImpactCard totals={totals} coins={coins} />
            <div className="lp-cols">
              <HomeTable rows={rows} flashKey={flashKey} onOpen={openDrawer} onMarket={goMarket} />
              <CoinsPanel coins={coins} feed={feed} />
            </div>
            <Disclaimer />
          </main>
        </div>
      )}

      {tab === 'loop' && (
        <div className="lp-ui">
          <Marketplace customerType={customer.type} ownedIds={ownedIds} searchRef={searchRef} onAdd={(productId) => openModal({ kind: 'add', productId })} />
        </div>
      )}

      <Presentation state={state} items={items} actions={actions} autoplay={autoplay} hidden={tab !== 'presentation'} />

      <div className="lp-ui">
        <TabNav active={tab} onSelect={onTab} variant="bottom" />
        {drawerRow && (
          <Drawer row={drawerRow} hasModal={Boolean(modal)} onClose={closeDrawer}
            onDefect={() => openModal({ kind: 'defect', itemKey: drawerRow.item.key })}
            onUpgrade={() => openModal({ kind: 'upgrade', itemKey: drawerRow.item.key })}
            onAdvance={async () => { await actions.advanceRepair(drawerRow.item.key); notify('Repair status updated') }}
            onCloseRepair={() => actions.closeRepair(drawerRow.item.key)}
          />
        )}
        {modal?.kind === 'defect' && <DefectModal rows={rows} itemKey={modal.itemKey} pick={modal.pick} actions={actions} onClose={closeModal} />}
        {modal?.kind === 'upgrade' && <UpgradeModal rows={rows} itemKey={modal.itemKey} pick={modal.pick} actions={actions} onClose={closeModal} onBorrowed={onBorrowed} />}
        {modal?.kind === 'add' && <AddModal productId={modal.productId} actions={actions} onClose={closeModal} onBorrowed={onBorrowed} />}
        <Toast toast={toast} />
      </div>

      {status === 'offline' && <div className="offline-badge">Connection to the server lost, retrying…</div>}
    </div>
  )
}
