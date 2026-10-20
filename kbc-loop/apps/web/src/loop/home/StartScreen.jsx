import { KateTips } from '../KateTips.jsx'
import { Faq } from '../Faq.jsx'
import { Disclaimer } from '../Disclaimer.jsx'
import { greeting } from '../model.js'
import { Hero } from './Hero.jsx'
import { HomeTabs } from './HomeTabs.jsx'
import { Impact } from './Impact.jsx'
import { Statements } from './Statements.jsx'
import { YourHome } from './YourHome.jsx'
import { AppPreview } from './AppPreview.jsx'

/** Start screen (#loop): navy hero with the 3D loop → scroll statements → two modules ("Your home" / "Your impact") → Kate tips → the mobile app in a phone frame → FAQ. */
export function StartScreen({ customer, items, totals, coins, sections, signals, flashKey, onOpen, onBrowse, onAdd, onCosts, onRewards, tips, onHeroOver }) {
  const rows = sections.flatMap((s) => s.rows)
  return (
    <>
    <Hero targetId="lp-statements" onOver={onHeroOver} />
    <Statements />
    <main className="lp-wrap lp-main lp-start" id="lp-content">
      <div className="lp-eyebrow lp-hello">{greeting()}, {customer.name}</div>
      <HomeTabs panels={{
        home: <YourHome sections={sections} flashKey={flashKey} onOpen={onOpen} onBrowse={onBrowse} onAdd={onAdd} />,
        impact: <Impact items={items} totals={totals} coins={coins} onCosts={onCosts} onRewards={onRewards} name={customer?.fullName} />,
      }} />
      <KateTips signals={signals} rows={rows} onOpen={onOpen} {...tips} />
      <AppPreview />
      <Faq />
      <Disclaimer />
    </main>
    </>
  )
}
