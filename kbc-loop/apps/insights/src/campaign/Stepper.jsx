import { Icon } from '../components/Icon.jsx'

/** Progress through the wizard. Completed steps are buttons to go back. */
export function Stepper({ steps, current, onGo }) {
  return (
    <ol className="ins-stepper" aria-label="Campaign steps">
      {steps.map((label, i) => {
        const n = i + 1
        const done = n < current
        const content = <><span className="ins-step-n" aria-hidden="true">{done ? <Icon name="check" size={14} /> : n}</span><span className="ins-step-t"><small>Step {n}</small><span className="ins-step-l">{label}</span></span></>
        return (
          <li key={label} className={done ? 'done' : n === current ? 'now' : ''} aria-current={n === current ? 'step' : undefined}>
            {done
              ? <button type="button" onClick={() => onGo(n)} aria-label={`Step ${n}, ${label} (completed): edit`}>{content}</button>
              : <span>{content}{n === current && <span className="ins-sr"> (current step)</span>}</span>}
          </li>
        )
      })}
    </ol>
  )
}
