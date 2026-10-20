// "Report a problem": issue → details (optional description and photo) → review & send.
// Sending dispatches REPORT_DEFECT; the shared reducer then opens the repair tracker (screen 'repair').
import { useState } from 'react'
import { issuesFor } from '@kbc-loop/shared/data/index.js'
import { useFlowChrome } from '../chrome.js'
import { StepProgress } from '../parts.js'
import { DetailsStep, IssueStep, ReviewStep } from './ReportSteps.js'

const LABELS = ['Problem', 'Details', 'Review']

export function ReportFlow({ item, product, partner, actions, onExit }) {
  const [step, setStep] = useState(0)
  const [issue, setIssue] = useState(null)
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null) // local preview URI only, never uploaded

  useFlowChrome({ title: 'Report a problem', stepKey: `report-${step}`, onBack: () => (step > 0 ? setStep(step - 1) : onExit()) })

  const submit = () => actions.reportDefect(item.key, issue, false, note.trim() || null, Boolean(photo))
  const shared = { product, partner }

  return (
    <>
      <StepProgress step={step + 1} total={LABELS.length} label={LABELS[step]} />
      {step === 0 ? <IssueStep {...shared} issues={issuesFor(product.id)} issue={issue} onIssue={setIssue} onNext={() => setStep(1)} /> : null}
      {step === 1 ? <DetailsStep note={note} onNote={setNote} photo={photo} onPhoto={setPhoto} onNext={() => setStep(2)} /> : null}
      {step === 2 ? <ReviewStep {...shared} issue={issue} note={note} photo={photo} onSubmit={submit} /> : null}
    </>
  )
}
