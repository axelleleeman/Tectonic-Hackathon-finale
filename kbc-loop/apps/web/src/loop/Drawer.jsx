import { useEffect, useState } from 'react'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { LoopIcon } from './LoopIcon.jsx'
import { useDialog } from './dialog.js'
import { StatusLabel } from './HomeTable.jsx'
import { duration, lifespanUsed, monthsBetween, monthYear, REPAIR_STEPS } from './model.js'

function Meter({ label, detail, value, health }) {
  // Starts at 0 and grows to its value on open (CSS transition, disabled for reduced motion)
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(value))
    return () => cancelAnimationFrame(id)
  }, [value])
  return (
    <div className="lp-meter">
      <div className="lp-mh">{label}<em>{detail}</em></div>
      <div className="lp-track" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className={`lp-fill ${health ? 'lp-h' : ''} ${health && value < 75 ? 'lp-mid' : ''}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  )
}

function RepairStatus({ row, onAdvance, onCloseRepair }) {
  const { repair } = row.item
  const steps = REPAIR_STEPS(row.partner.name, repair.preventive)
  return (
    <div className="lp-repair">
      <div className="lp-eyebrow">Repair · “{repair.issue}”</div>
      <ol className="lp-steps">
        {steps.map((s, n) => <li key={s} className={n < repair.step ? 'lp-on' : ''}>{s}</li>)}
      </ol>
      {repair.step < 3
        ? <button type="button" className="lp-btn lp-sm" onClick={onAdvance}>Next step (demo)</button>
        : <button type="button" className="lp-btn lp-sm" onClick={onCloseRepair}>Close repair</button>}
    </div>
  )
}

/** Product details: facts, lifespan and condition, KBC Insurance, history and actions. */
export function Drawer({ row, hasModal, onClose, onDefect, onUpgrade, onAdvance, onCloseRepair }) {
  const { ref, onKeyDown } = useDialog()
  const { item, product, partner } = row
  const months = monthsBetween(item.since)
  const life = lifespanUsed(item, product)
  const repairOpen = item.repair && item.repair.step < 3

  return (
    <>
      <div className="lp-scrim" onClick={onClose} />
      <div className="lp-drawer" role="dialog" aria-modal={!hasModal} aria-labelledby="lp-drawer-title" ref={ref} onKeyDown={hasModal ? undefined : onKeyDown}>
        <div className="lp-dhead">
          <div className="lp-ic"><LoopIcon name={row.icon} size={20} /></div>
          <div className="lp-min0">
            <h2 id="lp-drawer-title">{product.name}</h2>
            <div className="lp-sub">{product.detail} · {partner.name}</div>
          </div>
          <button type="button" className="lp-x" aria-label="Close" onClick={onClose}><LoopIcon name="x" /></button>
        </div>
        <div className="lp-dbody">
          <StatusLabel row={row} />
          <div className="lp-facts">
            <div><span>In use</span><b>{duration(months)} · since {monthYear(item.since)}</b></div>
            <div><span>Repairs</span><b>{item.repairs ?? 0}</b></div>
            <div><span>Monthly</span><b>{euro(product.monthly)}</b></div>
            <div><span>CO₂ saved</span><b className="lp-eco">{num(product.co2Kg)} kg</b></div>
          </div>
          <Meter label="Contract term used" detail={`${life}% of ${product.termMonths} months`} value={life} />
          <Meter label="Condition (estimate)" detail={`${row.condition}%`} value={row.condition} health />
          <p className="lp-ins"><LoopIcon name="shield" />Insured through KBC Insurance</p>
          {item.repair && <RepairStatus row={row} onAdvance={onAdvance} onCloseRepair={onCloseRepair} />}
          <div>
            <div className="lp-eyebrow lp-mb">History</div>
            <ul className="lp-timeline">
              <li>Delivered and installed<small>{monthYear(item.since)}</small></li>
              {item.repairs > 0 && <li>Repaired {item.repairs === 1 ? 'once' : `${item.repairs} times`}<small>Included in your subscription</small></li>}
              {item.repair && <li>Fault reported<small>{item.repair.issue}</small></li>}
              <li>Returns to {partner.name} at the end of the contract<small>Parts and materials are reused</small></li>
            </ul>
          </div>
          <div>
            <div className="lp-eyebrow lp-mb">Included</div>
            <ul className="lp-includes">{product.includes.map((x) => <li key={x}><LoopIcon name="check" />{x}</li>)}</ul>
          </div>
          <p className="lp-note">Returning this device earns you {COINS.return} Kate Coins.</p>
        </div>
        <div className="lp-dfoot">
          <button type="button" className="lp-btn" onClick={onDefect} disabled={repairOpen}>{repairOpen ? 'Repair in progress' : 'Report a fault'}</button>
          <button type="button" className="lp-btn lp-primary" onClick={onUpgrade}>{row.upgrade ? 'Upgrade or return' : 'Return device'}</button>
        </div>
      </div>
    </>
  )
}
