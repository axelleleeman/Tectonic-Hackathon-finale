import { LoopIcon } from '../LoopIcon.jsx'
import './intro.css'

const STEPS = [
  { icon: 'search', title: 'Choose', text: 'Pick a product from a circular partner. One monthly price, no upfront cost.' },
  { icon: 'shield', title: 'Sign with KBC', text: 'Review the contract and sign it in a few seconds with KBC Sign.' },
  { icon: 'loop', title: 'We deliver, repair and take back', text: 'The partner stays the owner: it delivers, repairs and gives the product a second life.' },
]
const INCLUDED = [
  { icon: 'wrench', text: 'Repairs' },
  { icon: 'shield', text: 'Insurance via KBC' },
  { icon: 'leaf', text: 'Take-back and reuse' },
]

/** "How borrowing works": three steps and what is always included. Short and visual. */
export function HowItWorks() {
  return (
    <section className="lp-how" aria-labelledby="lp-how-title">
      <h2 className="lp-h2" id="lp-how-title">How borrowing works</h2>
      <ol className="lp-how-steps">
        {STEPS.map((s, n) => (
          <li key={s.title} className="lp-card">
            <span className="lp-how-ic" aria-hidden="true"><LoopIcon name={s.icon} size={18} /></span>
            <div className="lp-min0">
              <span className="lp-how-n">Step {n + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="lp-how-inc">
        <span>Always included</span>
        {INCLUDED.map((x) => <span key={x.text} className="lp-how-chip"><LoopIcon name={x.icon} size={14} />{x.text}</span>)}
      </p>
    </section>
  )
}
