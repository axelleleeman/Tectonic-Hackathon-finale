import { LoopIcon } from '../LoopIcon.jsx'
import { useReveal } from '../useReveal.js'
import { StayInControl, StoryMoment, TripleWin, Words } from './Story.jsx'

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
  { icon: 'loop', title: 'Every product gets a second life', sub: 'Refurbished and reused', eco: true },
]

function Values() {
  const [ref] = useReveal({ threshold: 0.3 })
  return (
    <section ref={ref} className="lp-values" aria-label="Always included">
      <div className="lp-wrap lp-values-grid">
        {VALUES.map((v, i) => (
          <div key={v.title} className={`lp-rv lp-value ${v.eco ? 'lp-eco-surface' : ''}`} style={{ '--i': i * 2 }}>
            <span className="lp-value-ic" aria-hidden="true"><LoopIcon name={v.icon} size={22} /></span>
            <h3>{v.title}</h3>
            <p>{v.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Scroll story between the hero and "Your home": problem → solution → two statements and three value tiles
 * → triple win → you stay in control (the real Kate level).
 */
export function Statements({ loop, actions, onNotify }) {
  return (
    <div className="lp-statements" id="lp-statements">
      <StoryMoment id="lp-problem" label="The problem" line="We can fly to the moon. Yet we can't make a light that lasts." sub="Producers earn when you buy again." />
      <StoryMoment id="lp-solution" label="The solution" line="Don't buy lamps. Pay for light." sub="One monthly fee. The partner repairs it before you even notice." />
      <Statement id="lp-stmt-1" text="We work towards a circular economy." />
      <Statement id="lp-stmt-2" text="Use instead of own. Repair before replace." panel />
      <Values />
      <TripleWin />
      <StayInControl loop={loop} actions={actions} onNotify={onNotify} />
    </div>
  )
}
