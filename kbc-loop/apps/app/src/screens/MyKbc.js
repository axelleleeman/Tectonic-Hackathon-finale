// My KBC as in KBC Mobile, with KBC Loop in focus: the KBC Loop section (impact, borrowed products) and
// the Kate Coins it earns come first, vivid and interactive. The regular KBC Mobile sections (accounts, loans,
// payment methods, insurance, messages, My Trustbox) follow in the KBC Mobile order, wrapped in <Dimmed>.
import { Dimmed } from '../ui/Dimmed.js'
import { BankSection, KateCoinsSection, PaymentSection, bankRows } from './mykbc/BankSections.js'
import { LoopSection } from './mykbc/LoopSection.js'
import { MessagesSection, TrustboxSection } from './mykbc/InfoSections.js'

const GUTTER = 16
const LATER = ['Verzekeringen'] // sections that KBC Mobile shows after payment methods

export function MyKbc({ customer, items, coins, actions }) {
  const rows = bankRows(customer)
  const sections = [...new Set(rows.map((r) => r.section))]
  const section = (key) => <BankSection key={key} section={key} rows={rows.filter((r) => r.section === key)} />

  return (
    <>
      <LoopSection customer={customer} items={items} coins={coins} actions={actions} />
      <KateCoinsSection coins={coins} onEarn={() => actions.navigate('shop')} />
      <Dimmed bleed={GUTTER}>
        {sections.filter((s) => !LATER.includes(s)).map(section)}
        <PaymentSection customer={customer} />
        {sections.filter((s) => LATER.includes(s)).map(section)}
        <MessagesSection />
        <TrustboxSection />
      </Dimmed>
    </>
  )
}
