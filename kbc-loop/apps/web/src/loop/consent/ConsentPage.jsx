import { useState } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { date } from '../product/format.js'
import { CHOICES, NEVER } from '@kbc-loop/shared/data/dataChoices.js'
import './consent.css'

/** Accessible on/off switch with a visible label and description. */
function Choice({ choice, on, onToggle }) {
  const id = `cs-${choice.key}`
  return (
    <li className="cs-row">
      <div className="cs-row-text">
        <b id={`${id}-l`}>{choice.title}</b>
        <small id={`${id}-d`}>{choice.what} <span className="cs-who">{choice.who}</span></small>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-labelledby={`${id}-l`} aria-describedby={`${id}-d`}
        className="cs-switch" onClick={onToggle}>
        <span className="cs-knob" aria-hidden="true" />
        <span className="cs-state" aria-hidden="true">{on ? 'On' : 'Off'}</span>
      </button>
    </li>
  )
}

/** #loop/consent: choose what happens with your data. Nothing beyond what the service needs is shared unless switched on here. */
export function ConsentPage({ loop, actions, onBack, onSaved }) {
  const current = loop.dataPreferences ?? {}
  const [prefs, setPrefs] = useState(() => Object.fromEntries(CHOICES.map((c) => [c.key, current[c.key] === true])))
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setBusy(true)
    await actions.setDataPreferences(prefs)
    setBusy(false)
    setSaved(true)
  }

  return (
    <main className="lp-wrap lp-main cs">
      <nav className="pp-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><button type="button" className="pp-crumb-back" onClick={onBack}><LoopIcon name="back" size={16} />Your home</button></li>
          <li aria-current="page">Your data</li>
        </ol>
      </nav>
      <h1 className="cs-h1">Choose what happens with your data</h1>
      <p className="cs-lead">
        KBC Loop works with the products you borrow. Below you decide what we may use and who sees it.
        Nothing beyond what the service needs is shared unless you switch it on{current.completedOn ? `; last saved on ${date(current.completedOn)}` : ''}.
      </p>

      {saved ? (
        <section className="lp-card cs-done" aria-live="polite">
          <span className="cs-ok"><LoopIcon name="check" size={20} /></span>
          <div><b>Your choices are saved</b><small>You can change them here at any time.</small></div>
          <button type="button" className="lp-btn lp-primary lp-sm" onClick={onSaved} autoFocus>Back to home</button>
        </section>
      ) : (
        <>
          <ul className="cs-list lp-card" aria-label="Data choices">
            {CHOICES.map((c) => (
              <Choice key={c.key} choice={c} on={prefs[c.key]} onToggle={() => setPrefs((p) => ({ ...p, [c.key]: !p[c.key] }))} />
            ))}
          </ul>
          <div className="cs-actions">
            {/* Equal weight on purpose: no nudging towards one answer */}
            <button type="button" className="lp-btn" onClick={onBack}>Not now</button>
            <button type="button" className="lp-btn" onClick={save} disabled={busy}>Save choices</button>
          </div>
        </>
      )}

      <section className="cs-never" aria-labelledby="cs-never-h">
        <h2 id="cs-never-h" className="cs-h2">What we never do</h2>
        <ul>{NEVER.map((n) => <li key={n}><LoopIcon name="check" size={16} />{n}</li>)}</ul>
      </section>
    </main>
  )
}
