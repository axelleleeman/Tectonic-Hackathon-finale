import { useRef } from 'react'
import { KATE_LEVELS, kateLevelOf } from '@kbc-loop/shared/data/dataChoices.js'

/**
 * Kate level as a pill radio group (Basic · Proactive · Ecosystem) with the one-line explanation of the selected level.
 * Controlled: `value` is the current level, `onChange(id)` is called with a known level id only.
 */
export function KateLevelPicker({ value, onChange, disabled = false, labelId }) {
  const current = kateLevelOf(value)
  const refs = useRef([])
  const index = KATE_LEVELS.findIndex((l) => l.id === current)

  // Arrow keys move between the options (radio group pattern); selection follows focus.
  const onKey = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (index + step + KATE_LEVELS.length) % KATE_LEVELS.length
    refs.current[next]?.focus()
    onChange(KATE_LEVELS[next].id)
  }

  return (
    <div className="lp-level">
      <div className="lp-level-pills" role="radiogroup" aria-labelledby={labelId} onKeyDown={onKey}>
        {KATE_LEVELS.map((l, i) => (
          <button key={l.id} ref={(el) => { refs.current[i] = el }} type="button" role="radio"
            aria-checked={l.id === current} tabIndex={l.id === current ? 0 : -1} disabled={disabled}
            className="lp-level-pill" onClick={() => l.id !== current && onChange(l.id)}>
            {l.label}
          </button>
        ))}
      </div>
      <p className="lp-level-line" aria-live="polite">{KATE_LEVELS[index].line}</p>
    </div>
  )
}
