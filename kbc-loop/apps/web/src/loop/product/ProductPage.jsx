import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { Toast } from '../Toast.jsx'
import { loopRows } from '../model.js'
import { ProductHero } from './ProductHero.jsx'
import { ActionCards } from './ActionCards.jsx'
import { ContractPanel } from './ContractPanel.jsx'
import { ReportFlow } from './flows/ReportFlow.jsx'
import { UpgradeFlow } from './flows/UpgradeFlow.jsx'
import { ReturnFlow } from './flows/ReturnFlow.jsx'
import { itemCosts } from '@kbc-loop/shared/engine/costs.js'
import './product.css'

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
  const [flow, setFlow] = useState(null) // 'report' | 'upgrade' | 'return' | 'costs'
  const [toast, setToast] = useState(null)
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
          <div className="pp-row">
            <button type="button" className="lp-btn lp-primary" onClick={onBack}>Back to your home</button>
            <button type="button" className="lp-btn" onClick={() => onOpenCatalog()}>Browse the catalogue</button>
          </div>
        </div>
      </main>
    )
  }

  const openItem = (key) => { setFlow(null); window.location.hash = `#loop/product/${encodeURIComponent(key)}` }
  const toCatalog = () => { setFlow(null); onOpenCatalog(row.category?.id) }

  return (
    <main className="lp-wrap lp-main pp">
      <Breadcrumb name={row.product.name} onBack={onBack} />
      <ProductHero row={row} cost={cost} />
      <ActionCards row={row} onOpen={(id) => (id === 'catalog' ? toCatalog() : setFlow(id))} />

      {flow === 'costs' && <ContractPanel row={row} cost={cost} onClose={closeFlow} onOpenCosts={onOpenCosts} />}
      {flow === 'report' && <ReportFlow row={row} actions={actions} onClose={closeFlow} notify={notify} />}
      {flow === 'upgrade' && <UpgradeFlow row={row} loop={loop} actions={actions} onClose={closeFlow} onOpenItem={openItem}
        onOpenCatalog={toCatalog} />}
      {flow === 'return' && <ReturnFlow row={row} actions={actions} onClose={closeFlow}
        onOpenCatalog={toCatalog} />}
      <Toast toast={toast} />
    </main>
  )
}
