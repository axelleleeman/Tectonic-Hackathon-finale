import { useEffect, useState } from 'react'
import { PageHead } from '../components/PageHead.jsx'
import { Icon } from '../components/Icon.jsx'
import { Stepper } from './Stepper.jsx'
import { StepGroup } from './StepGroup.jsx'
import { StepMessage } from './StepMessage.jsx'
import { StepAudience } from './StepAudience.jsx'
import { StepReview } from './StepReview.jsx'
import { draftFor } from '../model.js'
import { href } from '../useRoute.js'

const STEPS = ['Group', 'Message', 'Audience & budget', 'Review']

/**
 * New campaign in four steps: group → Kate message → audience and budget → review & start.
 * After starting, the user lands on the results (step 5) once the api has confirmed the campaign.
 */
export function Wizard({ state, actions, segments, go, initialGroup }) {
  const running = state.campaigns ?? []
  const preset = segments.find((s) => s.id === initialGroup && !running.includes(s.id))
  const [step, setStep] = useState(preset ? 2 : 1)
  const [draft, setDraft] = useState(preset ? draftFor(preset) : null)
  const [starting, setStarting] = useState(false)
  const segment = segments.find((s) => s.id === draft?.segmentId)

  // Navigate to the results as soon as the shared state contains the new campaign.
  const live = starting && Boolean(draft) && running.includes(draft.segmentId)
  useEffect(() => {
    if (live) go(href.campaign(draft.segmentId))
  }, [live, draft, go])

  const canNext = step === 1 ? Boolean(segment) : step === 2 ? draft.message.trim().length > 0 : true
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const pick = (s) => setDraft((d) => (d?.segmentId === s.id ? d : draftFor(s)))
  const start = () => {
    setStarting(true)
    actions.startCampaign(draft.segmentId, { audience: draft.audience, budget: draft.budget, message: draft.message.trim() })
  }

  return (
    <div className="ins-wizard">
      <a className="ins-backlink" href={href.campaigns}><Icon name="back" size={16} />Cancel</a>
      <PageHead eyebrow="New campaign" title={stepTitle(step)} />
      <Stepper steps={STEPS} current={step} onGo={(n) => n < step && setStep(n)} />

      <div className="ins-step-body">
        {step === 1 && <StepGroup segments={segments} running={running} selectedId={draft?.segmentId} onPick={pick} />}
        {step === 2 && <StepMessage segment={segment} message={draft.message} onChange={(message) => update({ message })} />}
        {step === 3 && <StepAudience segment={segment} draft={draft} onChange={update} />}
        {step === 4 && <StepReview segment={segment} draft={draft} onEdit={setStep} />}
      </div>

      <div className="ins-wizard-nav">
        {step > 1 ? <button type="button" className="ins-btn ins-ghost" onClick={() => setStep(step - 1)}><Icon name="back" size={16} />Back</button> : <span />}
        {step < STEPS.length
          ? <button type="button" className="ins-btn ins-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue<Icon name="arrow" size={16} /></button>
          : <button type="button" className="ins-btn ins-primary" disabled={starting} onClick={start}>{starting ? 'Starting…' : 'Start campaign'}</button>}
      </div>
    </div>
  )
}

function stepTitle(step) {
  return ['Choose a group', 'Kate message', 'Audience & budget', 'Review'][step - 1]
}
