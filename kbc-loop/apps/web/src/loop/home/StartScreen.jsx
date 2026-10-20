import { KateTips } from '../KateTips.jsx'
import { Faq } from '../Faq.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { Metrics } from './Metrics.jsx'
import { YourHome } from './YourHome.jsx'

/** Start screen (#loop): metrics → "Your home" with an "Add a product" action → Kate tips → FAQ. */
export function StartScreen({ customer, totals, coins, theme, sections, signals, flashKey, onOpen, onBrowse, onAdd, onCosts, tips }) {
  return (
    <main className="lp-wrap lp-main lp-start">
      <Metrics customer={customer} totals={totals} coins={coins} theme={theme} onCosts={onCosts} />
      <YourHome sections={sections} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} onAdd={onAdd} />
      <KateTips signals={signals} {...tips} />
      <Faq />
      <Disclaimer />
    </main>
  )
}
