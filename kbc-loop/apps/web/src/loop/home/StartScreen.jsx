import { KateTips } from '../KateTips.jsx'
import { Faq } from '../Faq.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { greeting } from '../model.js'
import { Hero } from './Hero.jsx'
import { HomeTabs } from './HomeTabs.jsx'
import { Impact } from './Impact.jsx'
import { Statements } from './Statements.jsx'
import { YourHome } from './YourHome.jsx'

/** Start screen (#loop): navy hero with the 3D loop → scroll statements → two modules ("Your home" / "Your impact") → Kate tips → FAQ. */
export function StartScreen({ customer, items, totals, coins, sections, signals, flashKey, onOpen, onBrowse, onAdd, onCosts, tips, onHeroOver }) {
  return (
    <>
    <Hero targetId="lp-statements" onOver={onHeroOver} />
    <Statements />
    <main className="lp-wrap lp-main lp-start" id="lp-content">
      <div className="lp-eyebrow lp-hello">{greeting()}, {customer.name}</div>
      <HomeTabs panels={{
        home: <YourHome sections={sections} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} onAdd={onAdd} />,
        impact: <Impact items={items} totals={totals} coins={coins} onCosts={onCosts} />,
      }} />
      <KateTips signals={signals} {...tips} />
      <Faq />
      <Disclaimer />
    </main>
    </>
  )
}
