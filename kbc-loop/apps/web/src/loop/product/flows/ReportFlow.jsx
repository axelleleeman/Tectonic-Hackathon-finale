import { useState } from 'react'
import { TECHNICIAN_SLOT } from '@kbc-loop/shared/config/index.js'
import { MAX_NOTE_LENGTH } from '@kbc-loop/shared/state/loopReducer.js'
import { issuesFor } from '@kbc-loop/shared/data/index.js'
import { LoopIcon } from '../../LoopIcon.jsx'
import { FlowDialog, Steps, Success } from '../FlowDialog.jsx'
import { PhotoPicker } from '../PhotoPicker.jsx'
import { usePreviewUrl } from '../usePreviewUrl.js'
import { RepairTracker } from '../RepairTracker.jsx'

const STEPS = ['Issue', 'Details', 'Photo', 'Review']
const ORDER = ['issue', 'describe', 'photo', 'review']
const NOTE_MAX = MAX_NOTE_LENGTH
const OTHER = 'Other problem'

/**
 * Report a problem: issue → describe → optional photo → review → submit (REPORT_DEFECT) → confirmation
 * → live repair tracker. Opens straight on the tracker when a repair is already running.
 */
export function ReportFlow({ row, actions, onClose, notify }) {
  const [stage, setStage] = useState(row.item.repair ? 'track' : 'issue')
  const [issue, setIssue] = useState(null)
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState(false)
  const previewUrl = usePreviewUrl(photo)
  const issues = [...issuesFor(row.product.id), OTHER]
  const { product } = row
  const step = ORDER.indexOf(stage)
  const needsNote = issue === OTHER && !note.trim()

  const submit = async () => {
    setBusy(true)
    const text = note.trim().slice(0, NOTE_MAX)
    await actions.reportDefect(row.item.key, issue, false, text || null, Boolean(photo))
    setBusy(false)
    setStage('done')
  }
  const run = async (fn, message) => {
    setBusy(true)
    await fn(row.item.key)
    setBusy(false)
    notify(message)
  }
  const closeRepair = async () => {
    await run(actions.closeRepair, 'Repair closed and added to your history')
    setStage('closed')
  }

  const back = (to) => <button type="button" className="lp-btn lp-ghost" onClick={() => setStage(to)}><LoopIcon name="back" size={16} />Back</button>
  const next = (to, label = 'Continue', disabled = false) => (
    <button type="button" className="lp-btn lp-primary" onClick={() => setStage(to)} disabled={disabled}>{label}<LoopIcon name="arrow" size={16} /></button>
  )

  let body
  let footer
  if (stage === 'issue') {
    body = (
      <fieldset className="pp-choices">
        <legend className="pp-q">What is wrong?</legend>
        {issues.map((label) => (
          <label key={label} className="pp-choice">
            <input type="radio" name="pp-issue" checked={issue === label} onChange={() => setIssue(label)} data-autofocus={label === (issue ?? issues[0]) || undefined} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onClose}>Cancel</button>{next('describe', 'Continue', !issue)}</>
  } else if (stage === 'describe') {
    body = (
      <>
        <label className="pp-q" htmlFor="pp-note">{issue === OTHER ? 'Describe the problem' : 'Details'}<small>{issue === OTHER ? 'Required' : 'Optional'}</small></label>
        <textarea id="pp-note" data-autofocus rows={5} maxLength={NOTE_MAX} value={note} onChange={(e) => setNote(e.target.value)}
          aria-describedby="pp-note-count" placeholder="What happens?" />
        <p id="pp-note-count" className="pp-hint pp-count">{note.length} / {NOTE_MAX}</p>
      </>
    )
    footer = <>{back('issue')}{next('photo', 'Continue', needsNote)}</>
  } else if (stage === 'photo') {
    body = (
      <>
        <p className="pp-q">Add a photo <small>Optional</small></p>
        <PhotoPicker file={photo} previewUrl={previewUrl} onChange={setPhoto} />
      </>
    )
    footer = <>{back('describe')}{next('review', photo ? 'Continue' : 'Skip and continue')}</>
  } else if (stage === 'review') {
    body = (
      <>
        <dl className="pp-review">
          <div><dt>Product</dt><dd>{product.name}</dd></div>
          <div><dt>Problem</dt><dd>{issue}</dd></div>
          <div><dt>Details</dt><dd>{note.trim() || <span className="pp-muted">—</span>}</dd></div>
          <div><dt>Photo</dt><dd>{previewUrl ? <img className="pp-review-img" src={previewUrl} alt="Your photo of the problem" /> : <span className="pp-muted">—</span>}</dd></div>
        </dl>
      </>
    )
    footer = <>{back('photo')}<button type="button" className="lp-btn lp-primary" onClick={submit} disabled={busy} data-autofocus>{busy ? 'Sending…' : 'Submit report'}</button></>
  } else if (stage === 'done') {
    body = (
      <Success title="Report received">
        <div className="pp-slot"><LoopIcon name="wrench" size={20} /><span><small>Technician visit</small><b>{TECHNICIAN_SLOT}</b></span></div>
      </Success>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onClose}>Close</button><button type="button" className="lp-btn lp-primary" onClick={() => setStage('track')} data-autofocus>Track repair</button></>
  } else if (stage === 'closed') {
    body = (
      <Success title="Repair closed">
      </Success>
    )
    footer = <button type="button" className="lp-btn lp-primary" onClick={onClose} data-autofocus>Done</button>
  } else {
    body = row.item.repair
      ? <RepairTracker row={row} busy={busy} onAdvance={() => run(actions.advanceRepair, 'Repair status updated')} onCloseRepair={closeRepair} />
      : <p className="pp-hint">No open repair.</p>
    footer = <button type="button" className="lp-btn lp-ghost" onClick={onClose}>Close</button>
  }

  const title = stage === 'track' ? 'Repair status' : 'Report a problem'
  return (
    <FlowDialog title={title} stepKey={stage} onClose={onClose} footer={footer}>
      <Steps labels={STEPS} current={step} />
      {body}
    </FlowDialog>
  )
}
