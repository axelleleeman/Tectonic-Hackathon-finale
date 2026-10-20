import { KateTips } from '../KateTips.jsx'
import { Faq } from '../Faq.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { Hero } from './Hero.jsx'
import { Metrics } from './Metrics.jsx'
import { Statements } from './Statements.jsx'
import { YourHome } from './YourHome.jsx'

/** Start screen (#loop): full-viewport navy hero with the 3D loop → scroll statements and value tiles → metrics → "Your home" → Kate tips → FAQ. */
export function StartScreen({ customer, totals, coins, sections, signals, flashKey, onOpen, onBrowse, onAdd, onCosts, tips, onHeroOver }) {
  return (
    <>
    <Hero targetId="lp-statements" onOver={onHeroOver} />
    <Statements />
    <main className="lp-wrap lp-main lp-start" id="lp-content">
      <Metrics customer={customer} totals={totals} coins={coins} onCosts={onCosts} />
      <YourHome sections={sections} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} onAdd={onAdd} />
      <KateTips signals={signals} {...tips} />
      <Faq />
      <Disclaimer />
    </main>
    </>
  )
}
