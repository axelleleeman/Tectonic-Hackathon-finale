import { useState } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { partnerNames, productById } from '@kbc-loop/shared/engine/catalog.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { Done, Modal, Notice } from './Modal.jsx'

/** Add a product from the catalogue → BORROW. */
export function AddModal({ productId, actions, onClose, onBorrowed }) {
  const product = productById(productId) // a product or a bundle (bundles are split into products on BORROW)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (!product) return <Notice title="Product not found" text="This product is no longer in the catalogue." onClose={onClose} />
  const partnerName = partnerNames(product)

  const add = async () => {
    setBusy(true)
    await actions.borrow(productId)
    setDone(true)
  }

  return (
    <Modal title={done ? 'Added to your home' : product.name} onClose={onClose}>
      {done ? (
        <Done title="Added to your home" text={`${partnerName} will contact you to schedule delivery of your ${product.name}.`} onDone={() => { onClose(); onBorrowed(productId) }} />
      ) : (
        <>
          <p className="lp-mtext">{partnerName} · {product.detail}</p>
          <dl className="lp-facts lp-facts-m">
            <div><dt>Monthly</dt><dd>{euro(product.monthly)}</dd></div>
            <div><dt>Term</dt><dd>{product.termMonths} months</dd></div>
          </dl>
          <ul className="lp-includes">
            {product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}
          </ul>
          <p className="lp-ins"><LoopIcon name="shield" />Delivery, maintenance, repairs and insurance included. Cancel monthly.</p>
          <div className="lp-mfoot">
            <button type="button" className="lp-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="lp-btn lp-primary" onClick={add} disabled={busy}>Add for {euro(product.monthly)} / month</button>
          </div>
        </>
      )}
    </Modal>
  )
}
