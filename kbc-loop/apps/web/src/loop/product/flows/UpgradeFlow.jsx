import { useMemo, useState } from 'react'
import { LoopIcon } from '../../LoopIcon.jsx'
import { FlowDialog, Steps, Success } from '../FlowDialog.jsx'
import { ProductThumb } from '../ProductThumb.jsx'
import { upgradeOptions, upgradeQuote } from '@kbc-loop/shared/engine/upgrades.js'
import { money, signedMoney } from '../format.js'

const STEPS = ['Choose', 'Review', 'Confirm']

/** Finds the item that the upgrade added: a new key with the chosen product. */
function newItemKey(snapshot, customerId, beforeKeys, productId) {
  const list = snapshot?.state?.items?.[customerId] ?? []
  return [...list].reverse().find((i) => !beforeKeys.has(i.key) && i.productId === productId && !i.returned)?.key ?? null
}

/** Upgrade: pick a newer model → review old vs new → confirm (UPGRADE_ITEM) → open the new product's page. */
export function UpgradeFlow({ row, loop, actions, onClose, onOpenCatalog, onOpenItem }) {
  const { product } = row
  const options = useMemo(() => upgradeOptions(product.id, loop.customer.type), [product.id, loop.customer.type])
  const [stage, setStage] = useState('choose')
  const [choice, setChoice] = useState(options[0]?.id ?? null)
  const [busy, setBusy] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [failed, setFailed] = useState(false)
  const chosen = options.find((p) => p.id === choice) ?? null
  const quote = chosen ? upgradeQuote(product.id, chosen.id) : null

  const confirm = async () => {
    setBusy(true)
    setFailed(false)
    const before = new Set(loop.items.map((i) => i.key))
    const snapshot = await actions.upgradeItem(row.item.key, chosen.id)
    const key = newItemKey(snapshot, loop.state.customerId, before, chosen.id)
    setBusy(false)
    if (!snapshot) { setFailed(true); return }
    setNewKey(key)
    setStage('done')
  }

  let body
  let footer
  if (!options.length) {
    body = (
      <div className="pp-empty">
        <p className="pp-q">No newer model yet</p>
      </div>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onClose}>Keep current</button><button type="button" className="lp-btn lp-primary" onClick={onOpenCatalog}>Browse the catalogue</button></>
  } else if (stage === 'choose') {
    body = (
      <fieldset className="pp-choices">
        <legend className="pp-q">New model</legend>
        {options.map((p) => {
          const diff = upgradeQuote(product.id, p.id).monthlyDifference
          return (
            <label key={p.id} className="pp-choice pp-option">
              <input type="radio" name="pp-upgrade" checked={choice === p.id} onChange={() => setChoice(p.id)} data-autofocus={choice === p.id || undefined} />
              <ProductThumb product={p} size="lg" />
              <span className="pp-option-text">
                <b>{p.name}</b>
                <small>{p.detail}</small>
              </span>
              <span className="pp-option-price">
                <b>{money(p.monthly)}</b><small>/ month</small>
                <em>{signedMoney(diff)}</em>
              </span>
            </label>
          )
        })}
      </fieldset>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onClose}>Cancel</button><button type="button" className="lp-btn lp-primary" onClick={() => setStage('review')} disabled={!chosen}>Review upgrade<LoopIcon name="arrow" size={16} /></button></>
  } else if (stage === 'review') {
    body = (
      <>
        <div className="pp-compare">
          <div className="pp-compare-card">
            <small>Current</small>
            <ProductThumb product={product} size="lg" />
            <b>{product.name}</b>
            <span>{money(product.monthly)} / month</span>
          </div>
          <span className="pp-compare-arrow" aria-hidden="true"><LoopIcon name="arrow" size={20} /></span>
          <div className="pp-compare-card pp-compare-new">
            <small>New</small>
            <ProductThumb product={chosen} size="lg" />
            <b>{chosen.name}</b>
            <span>{money(chosen.monthly)} / month</span>
          </div>
        </div>
        <dl className="pp-review">
          <div><dt>Monthly fee</dt><dd>{signedMoney(quote.monthlyDifference)} per month</dd></div>
          <div><dt>Return bonus</dt><dd className="lp-eco">+{quote.coinsForReturn} Kate Coins</dd></div>
          <div><dt>Second life</dt><dd>{quote.co2Note}</dd></div>
        </dl>
        {failed && <p className="pp-error" role="alert">The upgrade could not be sent. Check your connection and try again.</p>}
      </>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={() => setStage('choose')}><LoopIcon name="back" size={16} />Back</button><button type="button" className="lp-btn lp-primary" onClick={confirm} disabled={busy} data-autofocus>{busy ? 'Confirming…' : 'Confirm upgrade'}</button></>
  } else {
    body = (
      <Success title="Upgrade confirmed" coins={quote?.coinsForReturn}>
        <p>{chosen.name} is on its way.</p>
      </Success>
    )
    footer = newKey
      ? <button type="button" className="lp-btn lp-primary" onClick={() => onOpenItem(newKey)} data-autofocus>Go to your {chosen.name}<LoopIcon name="arrow" size={16} /></button>
      : <button type="button" className="lp-btn lp-primary" onClick={onClose} data-autofocus>Done</button>
  }

  const current = !options.length ? -1 : stage === 'choose' ? 0 : stage === 'review' ? 1 : 3
  return (
    <FlowDialog title="Upgrade" stepKey={stage} onClose={newKey ? () => onOpenItem(newKey) : onClose} footer={footer}>
      <Steps labels={STEPS} current={current} />
      {body}
    </FlowDialog>
  )
}
