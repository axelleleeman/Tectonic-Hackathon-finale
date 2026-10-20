import { useState } from 'react'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { partnerNames, productById } from '@kbc-loop/shared/engine/catalog.js'
import { LoopIcon } from './LoopIcon.jsx'
import { useDialog } from './dialog.js'
import { issuesFor, TECHNICIAN_SLOT } from './model.js'

const NOTE_MAX = 120

export function Modal({ title, onClose, children }) {
  const { ref, onKeyDown } = useDialog()
  return (
    <div className="lp-mscrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="lp-modal" role="dialog" aria-modal="true" aria-labelledby="lp-modal-title" ref={ref} onKeyDown={onKeyDown}>
        <div className="lp-mhead">
          <h2 id="lp-modal-title">{title}</h2>
          <button type="button" className="lp-x" aria-label="Close" onClick={onClose}><LoopIcon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Done({ title, text, plus, onDone }) {
  return (
    <>
      <div className="lp-done">
        <div className="lp-big"><LoopIcon name="check" /></div>
        <h3>{title}</h3>
        <p>{text}</p>
        {plus && <p className="lp-plus">{plus}</p>}
      </div>
      <div className="lp-mfoot"><button type="button" className="lp-btn lp-primary" onClick={onDone} data-autofocus>Done</button></div>
    </>
  )
}

// Lets the customer choose which product an action applies to (when opened from the quick actions).
function ItemPicker({ rows, value, onChange }) {
  if (rows.length < 2) return null
  return (
    <>
      <label className="lp-lab" htmlFor="lp-pick">Product</label>
      <select id="lp-pick" className="lp-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {rows.map((r) => <option key={r.item.key} value={r.item.key}>{r.product.name} · {r.partner.short}</option>)}
      </select>
    </>
  )
}

/** Report a fault → REPORT_DEFECT. The partner and repair status then appear live in the app and dashboards. */
export function DefectModal({ rows, itemKey, pick, actions, onClose }) {
  const candidates = rows.filter((r) => !r.item.repair || r.item.repair.step >= 3)
  const [key, setKey] = useState(itemKey ?? candidates[0]?.item.key)
  const row = rows.find((r) => r.item.key === key)
  const issues = row ? issuesFor(row.product.id) : []
  const [issue, setIssue] = useState(0)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (!row) {
    return (
      <Modal title="Report a fault" onClose={onClose}>
        <p className="lp-mtext">There is no product without an open repair to report a fault for.</p>
        <div className="lp-mfoot"><button type="button" className="lp-btn lp-primary" onClick={onClose}>OK</button></div>
      </Modal>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const text = note.trim().slice(0, NOTE_MAX)
    await actions.reportDefect(row.item.key, text ? `${issues[issue]}: ${text}` : issues[issue])
    setBusy(false)
    setDone(true)
  }

  return (
    <Modal title={done ? 'Report received' : 'Report a fault'} onClose={onClose}>
      {done ? (
        <Done title="Report received" onDone={onClose} plus={`+${COINS.repair} Kate Coins once it is repaired`}
          text={`${row.partner.name} will visit on ${TECHNICIAN_SLOT}, or bring a replacement device.`} />
      ) : (
        <form onSubmit={submit}>
          {pick && <ItemPicker rows={candidates} value={key} onChange={(k) => { setKey(k); setIssue(0) }} />}
          <p className="lp-mtext">{row.product.name} · {row.partner.name}</p>
          <fieldset className="lp-opts">
            <legend className="lp-sr">What is wrong?</legend>
            {issues.map((label, n) => (
              <label key={label} className="lp-opt">
                <input type="radio" name="issue" checked={issue === n} onChange={() => setIssue(n)} />
                <b>{label}</b>
              </label>
            ))}
          </fieldset>
          <label className="lp-lab" htmlFor="lp-note">What happened? (optional)</label>
          <textarea id="lp-note" maxLength={NOTE_MAX} value={note} onChange={(e) => setNote(e.target.value)} placeholder="For example: the battery drains quickly" />
          <p className="lp-ins"><LoopIcon name="shield" />No cost to you. Repairs are part of your subscription; damage is covered by KBC Insurance.</p>
          <div className="lp-mfoot">
            <button type="button" className="lp-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="lp-btn lp-primary" disabled={busy}>Submit report</button>
          </div>
        </form>
      )}
    </Modal>
  )
}

/**
 * Upgrade or return. There is no upgrade action in the reducer, so an upgrade = RETURN_ITEM + BORROW of the
 * next product from the same partner. Without a sensible next product, only returning is offered.
 */
export function UpgradeModal({ rows, itemKey, pick, actions, onClose, onBorrowed }) {
  const [key, setKey] = useState(itemKey ?? (rows.find((r) => r.upgrade) ?? rows[0])?.item.key)
  const row = rows.find((r) => r.item.key === key)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)

  if (done) {
    return (
      <Modal title={done.title} onClose={onClose}>
        <Done title={done.title} text={done.text} plus={`+${COINS.return} Kate Coins for returning`} onDone={() => { onClose(); if (done.productId) onBorrowed(done.productId) }} />
      </Modal>
    )
  }
  if (!row) {
    return (
      <Modal title="Upgrade or return" onClose={onClose}>
        <p className="lp-mtext">You have no products to upgrade or return yet.</p>
        <div className="lp-mfoot"><button type="button" className="lp-btn lp-primary" onClick={onClose}>OK</button></div>
      </Modal>
    )
  }

  const { product, partner, upgrade } = row
  const returnOnly = async () => {
    setBusy(true)
    await actions.returnItem(row.item.key)
    setDone({ title: 'Return requested', text: `${partner.name} will collect your ${product.name}. Its parts and materials are reused.` })
  }
  const doUpgrade = async () => {
    setBusy(true)
    await actions.returnItem(row.item.key)
    await actions.borrow(upgrade.id)
    setDone({ title: 'Upgrade requested', productId: upgrade.id, text: `Your ${upgrade.name} is on its way. ${partner.name} collects your ${product.name} at the same time.` })
  }

  return (
    <Modal title={upgrade ? 'Request an upgrade' : 'Return a device'} onClose={onClose}>
      {pick && <ItemPicker rows={rows} value={key} onChange={setKey} />}
      {upgrade ? (
        <>
          <div className="lp-vs">
            <div><small>Current</small><b>{product.name}</b><small>{euro(product.monthly)} / month</small></div>
            <div className="lp-arr"><LoopIcon name="arrow" /></div>
            <div className="lp-nw"><small>New</small><b>{upgrade.name}</b><small>{euro(upgrade.monthly)} / month</small></div>
          </div>
          <p className="lp-mtext">{upgrade.detail}. {euro(upgrade.monthly - product.monthly)} more per month. Your current device goes back to {partner.name} for reuse.</p>
        </>
      ) : (
        <p className="lp-mtext">There is no newer model of {product.name} yet. You can return it: {partner.name} collects it and gives it a second life.</p>
      )}
      <p className="lp-note">Or keep your current device longer: every extra year avoids another purchase.</p>
      <div className="lp-mfoot">
        {upgrade ? (
          <>
            <button type="button" className="lp-btn" onClick={returnOnly} disabled={busy}>Return only</button>
            <button type="button" className="lp-btn lp-primary" onClick={doUpgrade} disabled={busy}>Request upgrade</button>
          </>
        ) : (
          <>
            <button type="button" className="lp-btn" onClick={onClose}>Keep it</button>
            <button type="button" className="lp-btn lp-primary" onClick={returnOnly} disabled={busy}>Return (+{COINS.return} Kate Coins)</button>
          </>
        )}
      </div>
    </Modal>
  )
}

/** Add a product from the marketplace → BORROW. */
export function AddModal({ productId, actions, onClose, onBorrowed }) {
  const product = productById(productId) // a product or a bundle (bundles are split into products on BORROW)
  const partnerName = partnerNames(product)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

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
          <div className="lp-facts lp-facts-m">
            <div><span>Monthly</span><b>{euro(product.monthly)}</b></div>
            <div><span>Term</span><b>{product.termMonths} months</b></div>
          </div>
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
