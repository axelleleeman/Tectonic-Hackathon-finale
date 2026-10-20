// Home (the KBC Mobile start page) with KBC Loop woven in. A thin composition of the sections in ./home/.
// Only KBC Loop stands out: the MyLoop chip, the impact hero, the KBC Loop card, the Loop tips from Kate,
// the KBC Loop extra-service tile and the Loop CO₂ impact. Everything else is wrapped in <Dimmed>.
// State only changes through actions (shared reducer via the api).
import { Dimmed } from '../ui/Dimmed.js'
import { ImpactSummary } from '../ui/ImpactSummary.js'
import { ChipsRow } from './home/ChipsRow.js'
import { AccountCarousel } from './home/AccountCarousel.js'
import { Payments } from './home/Payments.js'
import { ForYou, GenericTips } from './home/ForYou.js'
import { KateWallet } from './home/KateWallet.js'
import { MoneyOverview } from './home/MoneyOverview.js'
import { GroupExpenses, KateCoinsBanner, KateSuggests, Trustbox } from './home/Promos.js'
import { ExtraServices } from './home/ExtraServices.js'
import { News } from './home/News.js'
import { Sustainability } from './home/Sustainability.js'
import { Footer } from './home/Footer.js'
import { GUTTER } from './home/parts.js'

export function Home({ customer, signals, consent, items, coins, actions }) {
  const toShop = () => actions.navigate('shop')
  const toMyKbc = () => actions.navigate('mykbc')
  const hotIds = signals.map((s) => s.triggeredBy.id)

  return (
    <>
      <ChipsRow onLoop={toShop} />
      <ImpactSummary items={items} coins={coins} onPress={toMyKbc} style={{ marginBottom: 18 }} />
      <AccountCarousel customer={customer} items={items} coins={coins} onLoop={toMyKbc} />
      <Dimmed bleed={GUTTER}>
        <Payments transactions={customer.transactions} hotIds={hotIds} />
      </Dimmed>
      <ForYou signals={signals} consent={consent} actions={actions} />
      <Dimmed bleed={GUTTER}>
        <GenericTips />
        <KateWallet />
        <MoneyOverview transactions={customer.transactions} />
        <KateSuggests />
        <KateCoinsBanner coins={coins} />
      </Dimmed>
      <ExtraServices onLoop={toShop} />
      <Dimmed bleed={GUTTER}>
        <GroupExpenses />
        <News />
        <Trustbox />
      </Dimmed>
      <Sustainability items={items} onImpact={toMyKbc} onStart={toShop} />
      <Footer />
    </>
  )
}
