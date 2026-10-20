import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { Toast } from '../Toast.jsx'
import { loopRows } from '../model.js'
import { ProductHero } from './ProductHero.jsx'
import { ActionCards } from './ActionCards.jsx'
import { ContractSection } from './ContractSection.jsx'
import { ProductHistory } from './ProductHistory.jsx'
import { RepairTracker } from './RepairTracker.jsx'
import { ReportFlow } from './flows/ReportFlow.jsx'
import { UpgradeFlow } from './flows/UpgradeFlow.jsx'
import { ReturnFlow } from './flows/ReturnFlow.jsx'
import { itemCosts } from '@kbc-loop/shared/engine/costs.js'
import { upgradeOptions } from '@kbc-loop/shared/engine/upgrades.js'
import { date } from './format.js'
import './product.css'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Breadcrumb({ name, onBack }) {
  return (
    <nav className="pp-crumbs" aria-label="Breadcrumb">
      <ol>
        <li><button type="button" className="pp-crumb-back" onClick={onBack}><LoopIcon name="back" size={16} />Your home</button></li>
        {name && <li aria-current="page">{name}</li>}
      </ol>
    </nav>
  )
}

/**
 * Detail page of one item the customer has (#loop/product/<itemKey>): hero, four actions (report a problem,
 * upgrade, return, costs & contract), the contract figures and the history. Every action is a short step flow
 * that dispatches to the shared api, so the app and dashboards follow live.
 */
export function ProductPage({ itemKey, loop, actions, onBack, onOpenCatalog, onOpenCosts }) {
  const { customer, items = [] } = loop
  const row = useMemo(() => (customer ? loopRows(items, customer.type) : []).find((r) => r.item.key === itemKey) ?? null, [items, customer, itemKey])
  const [flow, setFlow] = useState(null) // 'report' | 'upgrade' | 'return'
  const [toast, setToast] = useState(null)
  const contractRef = useRef(null)
  const notify = useCallback((text) => setToast({ id: Date.now(), text }), [])
  const closeFlow = useCallback(() => setFlow(null), [])

  // A new item (e.g. after an upgrade) starts at the top with its own title focused
  useEffect(() => {
    window.scrollTo(0, 0)
    document.getElementById('pp-name')?.focus({ preventScroll: true })
  }, [itemKey])

  const cost = row ? itemCosts(row.item) : null

  if (!row || !cost) {
    return (
      <main className="lp-wrap lp-main pp">
        <Breadcrumb onBack={onBack} />
        <div className="lp-card pp-pad pp-missing">
          <h1 className="pp-title" tabIndex={-1}>Product not found</h1>
          <p className="pp-hint">This product is not (or no longer) in your home. It may belong to another customer in the demo.</p>
          <div className="pp-row">
            <button type="button" className="lp-btn lp-primary" onClick={onBack}>Back to your home</button>
            <button type="button" className="lp-btn" onClick={() => onOpenCatalog()}>Browse the catalogue</button>
          </div>
        </div>
      </main>
    )
  }

  const options = row.item.returned ? [] : upgradeOptions(row.product.id, customer.type)
  const openItem = (key) => { setFlow(null); window.location.hash = `#loop/product/${encodeURIComponent(key)}` }
  const showContract = () => {
    contractRef.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    contractRef.current?.focus({ preventScroll: true })
  }
  const onAction = (id) => (id === 'costs' ? showContract() : setFlow(id))
  const busyRepair = async (fn, message) => { await fn(row.item.key); notify(message) }

  return (
    <main className="lp-wrap lp-main pp">
      <Breadcrumb name={row.product.name} onBack={onBack} />
      <ProductHero row={row} cost={cost} />

      {row.item.returned ? (
        <section className="pp-section pp-returned lp-card pp-pad" aria-label="Returned">
          <LoopIcon name="leaf" size={22} />
          <div className="lp-min0">
            <b>Returned{row.item.returnedOn ? ` on ${date(row.item.returnedOn)}` : ''}</b>
            <p className="pp-hint">{row.partner.name} gives it a second life. Your costs and history stay available here.</p>
          </div>
          <button type="button" className="lp-btn lp-primary" onClick={() => onOpenCatalog(row.category?.id)}>Find something new</button>
        </section>
      ) : (
        <>
          {row.item.repair && (
            <section className="pp-section" aria-labelledby="pp-repair-title">
              <div className="pp-sechead"><h2 id="pp-repair-title">Repair in progress</h2></div>
              <div className="lp-card pp-pad">
                <RepairTracker row={row} compact
                  onAdvance={() => busyRepair(actions.advanceRepair, 'Repair status updated')}
                  onCloseRepair={() => busyRepair(actions.closeRepair, 'Repair closed and added to your history')} />
              </div>
            </section>
          )}
          <ActionCards row={row} cost={cost} upgradeCount={options.length} onOpen={onAction} />
        </>
      )}

      <ContractSection ref={contractRef} row={row} cost={cost} onOpenCosts={onOpenCosts} />
      <ProductHistory row={row} endDate={cost.endDate} />

      {flow === 'report' && <ReportFlow row={row} actions={actions} onClose={closeFlow} notify={notify} />}
      {flow === 'upgrade' && <UpgradeFlow row={row} loop={loop} actions={actions} onClose={closeFlow} onOpenItem={openItem}
        onOpenCatalog={() => { setFlow(null); onOpenCatalog(row.category?.id) }} />}
      {flow === 'return' && <ReturnFlow row={row} actions={actions} onClose={closeFlow}
        onOpenCatalog={() => { setFlow(null); onOpenCatalog(row.category?.id) }} />}
      <Toast toast={toast} />
    </main>
  )
}
