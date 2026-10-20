// Story moments on the start screen: problem, solution, triple win and "You stay in control" (the real Kate level).
import { useState } from 'react'
import { LoopIcon } from '../LoopIcon.jsx'
import { useReveal, useScrollProgress } from '../useReveal.js'
import { KateLevelPicker } from '../consent/KateLevelPicker.jsx'

/**
 * Words that light up one by one as you scroll (driven by `--p` from useScrollProgress on the section).
 * Decorative: the screen-reader text sits next to them.
 */
export function Words({ text }) {
  const words = text.split(' ')
  return (
    <span className="lp-scrub" style={{ '--n': words.length }}>
      {words.map((w, i) => <span key={`${w}-${i}`} className="lp-word" style={{ '--i': i }}>{w} </span>)}
    </span>
  )
}

/** A calm story moment: small label, one big line revealed word by word, one small supporting line. */
export function StoryMoment({ id, label, line, sub }) {
  const [ref] = useReveal({ threshold: 0.4 })
  useScrollProgress(ref)
  const after = line.split(' ').length + 2
  return (
    <section ref={ref} id={id} className="lp-stmt lp-moment" aria-label={label}>
      <div className="lp-wrap">
        <p className="lp-rv lp-moment-label" aria-hidden="true">{label}</p>
        <p className="lp-stmt-line lp-moment-line"><span className="lp-sr">{line}</span><span aria-hidden="true"><Words text={line} /></span></p>
        <p className="lp-rv lp-moment-sub" style={{ '--i': after }}>{sub}</p>
      </div>
    </section>
  )
}

const WINS = [
  { icon: 'heart', title: 'Customer', words: ['All-in-one', 'Predictable', 'Rewarding'] },
  { icon: 'store', title: 'Partner', words: ['Recurring revenue', 'Resilient', 'Reach'] },
  { icon: 'shield', title: 'KBC', words: ['Commission', 'Engagement', 'New customers'] },
]

/** Triple win: three subtle cards with three keywords each. */
export function TripleWin() {
  const [ref] = useReveal({ threshold: 0.3 })
  return (
    <section ref={ref} className="lp-story-block" aria-labelledby="lp-win-h">
      <div className="lp-wrap">
        <p className="lp-rv lp-moment-label">Triple win</p>
        <h2 id="lp-win-h" className="lp-rv lp-story-h">Good for everyone in the loop.</h2>
        <div className="lp-win-grid">
          {WINS.map((w, i) => (
            <article key={w.title} className="lp-rv lp-win" style={{ '--i': i * 2 + 2 }}>
              <span className="lp-win-ic" aria-hidden="true"><LoopIcon name={w.icon} size={18} /></span>
              <h3>{w.title}</h3>
              <ul>{w.words.map((k) => <li key={k}>{k}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/** You stay in control: reads and writes the real Kate level (state.dataPreferences[customerId].kateLevel). */
export function StayInControl({ loop, actions, onNotify }) {
  const [ref] = useReveal({ threshold: 0.3 })
  const [pending, setPending] = useState(null)
  const level = pending ?? loop?.dataPreferences?.kateLevel

  const choose = async (kateLevel) => {
    setPending(kateLevel)
    try {
      await actions.setDataPreferences({ kateLevel })
      onNotify?.('Saved')
    } finally {
      setPending(null)
    }
  }

  return (
    <section ref={ref} className="lp-story-block lp-control" aria-labelledby="lp-control-h">
      <div className="lp-wrap lp-control-in">
        <p className="lp-rv lp-moment-label">Your data</p>
        <h2 id="lp-control-h" className="lp-rv lp-story-h" style={{ '--i': 1 }}>You stay in control.</h2>
        <div className="lp-rv" style={{ '--i': 3 }}>
          <KateLevelPicker value={level} onChange={choose} labelId="lp-control-h" />
        </div>
        <a className="lp-rv lp-control-link" style={{ '--i': 4 }} href="#loop/consent">All data choices<LoopIcon name="chev" size={14} /></a>
      </div>
    </section>
  )
}
