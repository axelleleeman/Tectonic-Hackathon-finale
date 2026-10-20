// Start (KBC Mobile-startpagina) met KBC Loop erin verweven. Dunne compositie van de secties in ./home/.
// Enkel KBC Loop is klikbaar: MyLoop-knop, Loop-kaart, Kate-tips, "Ontdek MyLoop", KBC Loop bij Extra diensten
// en de Loop-impact bij "Samen duurzamer". State verandert enkel via actions (gedeelde reducer via de api).
import { ChipsRow } from './home/ChipsRow.js'
import { AccountCarousel } from './home/AccountCarousel.js'
import { Payments } from './home/Payments.js'
import { ForYou } from './home/ForYou.js'
import { KateWallet } from './home/KateWallet.js'
import { MoneyOverview } from './home/MoneyOverview.js'
import { GroupExpenses, KateCoinsBanner, KateSuggests, Trustbox } from './home/Promos.js'
import { ExtraServices } from './home/ExtraServices.js'
import { News } from './home/News.js'
import { Sustainability } from './home/Sustainability.js'
import { Footer } from './home/Footer.js'

export function Home({ customer, signals, consent, items, coins, actions }) {
  const toShop = () => actions.navigate('shop')
  const toMyKbc = () => actions.navigate('mykbc')
  const hotIds = signals.map((s) => s.triggeredBy.id)

  return (
    <>
      <ChipsRow onLoop={toShop} />
      <AccountCarousel customer={customer} items={items} coins={coins} onLoop={toMyKbc} />
      <Payments transactions={customer.transactions} hotIds={hotIds} />
      <ForYou signals={signals} consent={consent} actions={actions} />
      <KateWallet />
      <MoneyOverview transactions={customer.transactions} />
      <KateSuggests />
      <KateCoinsBanner coins={coins} />
      <ExtraServices onLoop={toShop} />
      <GroupExpenses />
      <News />
      <Trustbox />
      <Sustainability items={items} onImpact={toMyKbc} />
      <Footer />
    </>
  )
}
