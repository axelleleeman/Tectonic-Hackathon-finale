// Mijn KBC zoals in KBC Mobile: rekeningen, (kredieten), betaalmiddelen, Kate Coins, verzekeringen,
// berichten en My Trustbox. KBC Loop (statistieken + geleende producten) staat prominent na Kate Coins.
// Alleen KBC Loop is klikbaar; de rest van KBC Mobile is zichtbaar maar gedempt.
import { BankSection, KateCoinsSection, PaymentSection, bankRows } from './mykbc/BankSections.js'
import { LoopSection } from './mykbc/LoopSection.js'
import { MessagesSection, TrustboxSection } from './mykbc/InfoSections.js'

const LATER = ['Verzekeringen'] // rubrieken die in KBC Mobile onder Kate Coins staan

export function MyKbc({ customer, items, coins, actions }) {
  const rows = bankRows(customer)
  const sections = [...new Set(rows.map((r) => r.section))]
  const section = (title) => <BankSection key={title} title={title} rows={rows.filter((r) => r.section === title)} />

  return (
    <>
      {sections.filter((s) => !LATER.includes(s)).map(section)}
      <PaymentSection customer={customer} />
      <KateCoinsSection coins={coins} />
      <LoopSection customer={customer} items={items} actions={actions} />
      {sections.filter((s) => LATER.includes(s)).map(section)}
      <MessagesSection />
      <TrustboxSection />
    </>
  )
}
