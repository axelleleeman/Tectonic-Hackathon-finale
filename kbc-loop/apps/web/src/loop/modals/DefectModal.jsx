import { useState } from 'react'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { LoopIcon } from '../LoopIcon.jsx'
import { hasOpenRepair, issuesFor, TECHNICIAN_SLOT } from '../model.js'
import { Done, ItemPicker, Modal, Notice } from './Modal.jsx'

const NOTE_MAX = 120

/** Report a defect → REPORT_DEFECT. The partner and repair status then appear live in the app and dashboards. */
export function DefectModal({ rows, itemKey, actions, onClose }) {
  const candidates = rows.filter((r) => !r.item.returned && !hasOpenRepair(r))
  const [key, setKey] = useState(itemKey ?? candidates[0]?.item.key)
  const row = candidates.find((r) => r.item.key === key)
  const issues = row ? issuesFor(row.product.id) : []
  const [issue, setIssue] = useState(0)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  if (!row && !done) {
    return <Notice title="Report a defect" text="There is no product without an open repair to report a defect for." onClose={onClose} />
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const text = note.trim().slice(0, NOTE_MAX)
    await actions.reportDefect(row.item.key, text ? `${issues[issue]}: ${text}` : issues[issue])
    setBusy(false)
    setDone(true)
  }

  if (done) {
    const r = rows.find((x) => x.item.key === key)
    return (
      <Modal title="Report received" onClose={onClose}>
        <Done title="Report received" onDone={onClose} plus={`+${COINS.repair} Kate Coins once it is repaired`}
          text={`${r?.partner.name ?? 'The partner'} will visit on ${TECHNICIAN_SLOT}, or bring a replacement device.`} />
      </Modal>
    )
  }

  return (
    <Modal title="Report a defect" onClose={onClose}>
      <form onSubmit={submit}>
        {!itemKey && <ItemPicker rows={candidates} value={key} onChange={(k) => { setKey(k); setIssue(0) }} />}
        <p className="lp-mtext">{row.product.name} · {row.partner.name}</p>
        <fieldset className="lp-opts">
          <legend className="lp-lab">What is wrong?</legend>
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
    </Modal>
  )
}
