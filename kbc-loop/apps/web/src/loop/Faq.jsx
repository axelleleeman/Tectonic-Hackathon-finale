import { LoopIcon } from './LoopIcon.jsx'

const QA = [
  ['What happens if my device breaks?', 'Report it in the app. The partner repairs it within two working days or brings a replacement. There is no extra cost; damage is covered by KBC Insurance.'],
  ['Who owns the device?', 'The partner does. You pay for using it, so the partner has every reason to make it last as long as possible.'],
  ['What are Kate Coins?', 'Loyalty points in KBC Mobile for sustainable choices, such as having a device repaired or returning it. They are not a cryptocurrency.'],
  ['Can I cancel at any time?', 'Yes, subscriptions can be cancelled monthly. The device goes back to the partner to be repaired or reused.'],
]

export function Faq() {
  return (
    <section className="lp-faq" aria-labelledby="lp-faq-title">
      <div>
        <h2 id="lp-faq-title">Questions about KBC LOOP</h2>
        <p>Using instead of owning, explained briefly.</p>
      </div>
      <div>
        {QA.map(([q, a]) => (
          <details key={q}>
            <summary>{q}<LoopIcon name="plus" /></summary>
            <div className="lp-ans">{a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
