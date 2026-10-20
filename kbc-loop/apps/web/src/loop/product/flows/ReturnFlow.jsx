import { useMemo, useState } from 'react'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { LoopIcon } from '../../LoopIcon.jsx'
import { FlowDialog, Steps, Success } from '../FlowDialog.jsx'
import { dayLabel, nextWeekdays } from '../format.js'

const STEPS = ['Reason', 'Pickup', 'Summary']
const ORDER = ['reason', 'pickup', 'summary']
const REASONS = ['No longer needed', 'Moving house', 'Want something else', 'Other']
const TIMES = ['8:00–12:00', '13:00–17:00', '9:00–13:00']

/** Return: optional reason → pickup slot → summary → confirm (RETURN_ITEM) → confirmation. */
export function ReturnFlow({ row, actions, onClose, onOpenCatalog }) {
  const { product } = row
  const slots = useMemo(() => nextWeekdays(3).map((iso, n) => ({ id: iso, label: `${dayLabel(iso)} · ${TIMES[n]}` })), [])
  const [stage, setStage] = useState('reason')
  const [reason, setReason] = useState(null)
  const [slot, setSlot] = useState(slots[0].id)
  const [busy, setBusy] = useState(false)
  const slotLabel = slots.find((s) => s.id === slot)?.label

  const confirm = async () => {
    setBusy(true)
    await actions.returnItem(row.item.key)
    setBusy(false)
    setStage('done')
  }

  const back = (to) => <button type="button" className="lp-btn lp-ghost" onClick={() => setStage(to)}><LoopIcon name="back" size={16} />Back</button>
  let body
  let footer
  if (stage === 'reason') {
    body = (
      <fieldset className="pp-choices">
        <legend className="pp-q">Reason <small>Optional</small></legend>
        {REASONS.map((r) => (
          <label key={r} className="pp-choice">
            <input type="radio" name="pp-reason" checked={reason === r} onChange={() => setReason(r)} data-autofocus={r === (reason ?? REASONS[0]) || undefined} />
            <span>{r}</span>
          </label>
        ))}
      </fieldset>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onClose}>Keep it</button><button type="button" className="lp-btn lp-primary" onClick={() => setStage('pickup')}>{reason ? 'Continue' : 'Skip'}<LoopIcon name="arrow" size={16} /></button></>
  } else if (stage === 'pickup') {
    body = (
      <fieldset className="pp-choices">
        <legend className="pp-q">Pickup</legend>
        {slots.map((s) => (
          <label key={s.id} className="pp-choice">
            <input type="radio" name="pp-slot" checked={slot === s.id} onChange={() => setSlot(s.id)} data-autofocus={slot === s.id || undefined} />
            <span>{s.label}</span>
          </label>
        ))}
      </fieldset>
    )
    footer = <>{back('reason')}<button type="button" className="lp-btn lp-primary" onClick={() => setStage('summary')}>Continue<LoopIcon name="arrow" size={16} /></button></>
  } else if (stage === 'summary') {
    body = (
      <>
        <dl className="pp-review">
          <div><dt>Product</dt><dd>{product.name}</dd></div>
          <div><dt>Pickup</dt><dd>{slotLabel}</dd></div>
          {reason && <div><dt>Reason</dt><dd>{reason}</dd></div>}
          <div><dt>Monthly fee</dt><dd>Stops after pickup</dd></div>
          <div><dt>Reward</dt><dd className="lp-eco">+{COINS.return} Kate Coins</dd></div>
        </dl>
        <p className="pp-second lp-eco-surface"><LoopIcon name="leaf" size={18} />Second life · {num(product.co2Kg)} kg CO₂ saved</p>
      </>
    )
    footer = <>{back('pickup')}<button type="button" className="lp-btn lp-primary" onClick={confirm} disabled={busy} data-autofocus>{busy ? 'Confirming…' : 'Confirm return'}</button></>
  } else {
    body = (
      <Success title="Return confirmed" coins={COINS.return}>
        <p>{slotLabel}</p>
      </Success>
    )
    footer = <><button type="button" className="lp-btn lp-ghost" onClick={onOpenCatalog}>Browse the catalogue</button><button type="button" className="lp-btn lp-primary" onClick={onClose} data-autofocus>Done</button></>
  }

  return (
    <FlowDialog title={`Return ${product.name}`} stepKey={stage} onClose={onClose} footer={footer}>
      <Steps labels={STEPS} current={stage === 'done' ? 3 : ORDER.indexOf(stage)} />
      {body}
    </FlowDialog>
  )
}
