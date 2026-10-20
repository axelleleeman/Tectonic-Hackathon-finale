import { useEffect, useRef, useState } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { partnerNames, productById } from '@kbc-loop/shared/engine/catalog.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { secondLifeMonthly } from '../catalog/secondLife.js'
import { contractTerms, downloadContract } from './contract.js'
import { Modal, Notice } from './Modal.jsx'
import './borrow.css'

const SIGN_DELAY_MS = 1200 // simulated KBC Sign confirmation; no real authentication happens

/** Contract summary shown before confirming (and again, read-only, after borrowing). */
function ContractSummary({ terms, partnerName }) {
  return (
    <div className="lp-contract">
      <dl className="lp-facts lp-facts-m">
        <div><dt>Monthly fee</dt><dd>{euro(terms.monthly, Number.isInteger(terms.monthly) ? 0 : 2)}</dd></div>
        <div><dt>Term</dt><dd>{terms.term}</dd></div>
        <div><dt>Start date</dt><dd>{terms.start}</dd></div>
        <div><dt>Owner and repairer</dt><dd>{partnerName}</dd></div>
      </dl>
      <p className="lp-contract-lab">Included</p>
      <ul className="lp-includes">
        {terms.included.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}
      </ul>
      <p className="lp-ins"><LoopIcon name="shield" />{terms.insurance}</p>
      <p className="lp-contract-fine">{terms.cancellation}</p>
    </div>
  )
}

/** Add a product from the catalogue: offer → contract summary → simulated KBC Sign → BORROW. */
export function AddModal({ productId, actions, onClose, onBorrowed }) {
  const product = productById(productId) // a product or a bundle (bundles are split into products on BORROW)
  const [step, setStep] = useState('offer') // 'offer' | 'contract' | 'signing' | 'done'
  const [refurbished, setRefurbished] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  if (!product) return <Notice title="Product not found" text="This product is no longer in the catalogue." onClose={onClose} />
  const partnerName = partnerNames(product)
  const refurbMonthly = secondLifeMonthly(product)
  const terms = contractTerms(product, { refurbished })

  const confirm = () => {
    setStep('signing')
    timer.current = setTimeout(async () => {
      await actions.borrow(productId) // a refurbished unit uses the same product; the contract mentions it
      setStep('done')
    }, SIGN_DELAY_MS)
  }

  const titles = { offer: product.name, contract: 'Your contract', signing: 'Your contract', done: 'Added to your home' }

  return (
    <Modal title={titles[step]} onClose={step === 'signing' ? () => {} : onClose}>
      {step === 'offer' && (
        <>
          <p className="lp-mtext">{partnerName} · {product.detail}</p>
          {refurbMonthly && (
            <div className="lp-variant" role="radiogroup" aria-label="Unit">
              <button type="button" role="radio" aria-checked={!refurbished} className={!refurbished ? 'on' : ''} onClick={() => setRefurbished(false)}>
                <b>New</b><span>{euro(product.monthly)} / month</span>
              </button>
              <button type="button" role="radio" aria-checked={refurbished} className={refurbished ? 'on' : ''} onClick={() => setRefurbished(true)}>
                <b>Refurbished</b><span>{euro(refurbMonthly, 2)} / month</span>
              </button>
            </div>
          )}
          <dl className="lp-facts lp-facts-m">
            <div><dt>Monthly</dt><dd>{euro(terms.monthly, Number.isInteger(terms.monthly) ? 0 : 2)}</dd></div>
            <div><dt>Term</dt><dd>{product.termMonths} months</dd></div>
          </dl>
          <ul className="lp-includes">
            {product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}
          </ul>
          <p className="lp-ins"><LoopIcon name="shield" />Delivery, maintenance, repairs and insurance included.</p>
          <div className="lp-mfoot">
            <button type="button" className="lp-btn" onClick={onClose}>Cancel</button>
            <button type="button" className="lp-btn lp-primary" onClick={() => setStep('contract')}>Review contract</button>
          </div>
        </>
      )}

      {(step === 'contract' || step === 'signing') && (
        <>
          <p className="lp-mtext">{terms.product}</p>
          <ContractSummary terms={terms} partnerName={partnerName} />
          <label className="lp-agree">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} disabled={step === 'signing'} />
            <span>I agree to the contract terms</span>
          </label>
          {step === 'signing' && (
            <p className="lp-signing" role="status"><span className="lp-spinner" aria-hidden="true" />Confirming with KBC Sign…</p>
          )}
          <div className="lp-mfoot">
            <button type="button" className="lp-btn" onClick={() => setStep('offer')} disabled={step === 'signing'}>Back</button>
            <button type="button" className="lp-btn lp-primary" onClick={confirm} disabled={!agreed || step === 'signing'}>
              <LoopIcon name="shield" size={16} />Confirm with KBC
            </button>
          </div>
          <p className="lp-contract-fine">Simulated signature for this prototype. No real authentication takes place.</p>
        </>
      )}

      {step === 'done' && (
        <>
          <div className="lp-done">
            <div className="lp-big"><LoopIcon name="check" /></div>
            <h3>Contract confirmed</h3>
            <p>{partnerName} will contact you to schedule delivery of your {refurbished ? 'refurbished unit' : product.name}.</p>
            <p className="lp-contract-fine">Reference {terms.reference}</p>
          </div>
          <div className="lp-mfoot">
            <button type="button" className="lp-btn" onClick={() => downloadContract(terms, partnerName)}>Download contract</button>
            <button type="button" className="lp-btn lp-primary" onClick={() => { onClose(); onBorrowed(productId) }} data-autofocus>Done</button>
          </div>
        </>
      )}
    </Modal>
  )
}
