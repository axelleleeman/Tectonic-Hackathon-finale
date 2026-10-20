import { LoopIcon } from '../LoopIcon.jsx'
import { useReveal } from '../useReveal.js'

/** One big centred line that reveals word by word (the words are decorative; the section carries the label). */
function Words({ text }) {
  return text.split(' ').map((w, i) => (
    <span key={`${w}-${i}`} className="lp-rv lp-word" style={{ '--i': i }}>{w} </span>
  ))
}

function Statement({ id, text, panel = false }) {
  const [ref] = useReveal({ threshold: 0.4 })
  return (
    <section ref={ref} id={id} className={`lp-stmt ${panel ? 'lp-stmt-panel' : ''}`}>
      <div className={panel ? 'lp-panel lp-rv' : 'lp-wrap'}>
        <p className="lp-stmt-line"><span className="lp-sr">{text}</span><span aria-hidden="true"><Words text={text} /></span></p>
      </div>
    </section>
  )
}

const VALUES = [
  { icon: 'wrench', title: 'Repairs included', sub: 'Free, within two days' },
  { icon: 'up', title: 'Upgrade anytime', sub: 'Switch when you need' },
  { icon: 'loop', title: 'Every product gets a second life', sub: 'Refurbished and reused' },
]

function Values() {
  const [ref] = useReveal({ threshold: 0.3 })
  return (
    <section ref={ref} className="lp-values" aria-label="Always included">
      <div className="lp-wrap lp-values-grid">
        {VALUES.map((v, i) => (
          <div key={v.title} className="lp-rv lp-value" style={{ '--i': i * 2 }}>
            <span className="lp-value-ic" aria-hidden="true"><LoopIcon name={v.icon} size={22} /></span>
            <h3>{v.title}</h3>
            <p>{v.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Scroll story between the hero and "Your home": two statements and three value tiles. */
export function Statements() {
  return (
    <div className="lp-statements" id="lp-statements">
      <Statement id="lp-stmt-1" text="We work towards a circular economy." />
      <Statement id="lp-stmt-2" text="Use instead of own. Repair before replace." panel />
      <Values />
    </div>
  )
}
