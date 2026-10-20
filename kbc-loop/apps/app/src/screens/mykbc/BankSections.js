// The regular KBC Mobile sections of My KBC (accounts, loans, payment methods, insurance) and Kate Coins.
// Everything comes from the fictional customer. The bank sections are static (My KBC wraps them in <Dimmed>);
// Kate Coins stay vivid because they are earned with KBC Loop.
import { View } from 'react-native'
import { num } from '@kbc-loop/shared/engine/format.js'
import { SectionHead } from '../common.js'
import { RowCard } from './RowCard.js'
import { NewLink } from './shared.js'

// Section keys come from the shared (Dutch) customer data; the headings are shown in English.
const SECTION_TITLE = { Rekeningen: 'Accounts', Kredieten: 'Loans', Verzekeringen: 'Insurance' }
const SECTION_ICON = { Rekeningen: 'wallet', Kredieten: 'house', Verzekeringen: 'shield' }

/** All rows per section: the current account first, then the extra products from customer.myKbc. */
export function bankRows(customer) {
  const holder = customer.fullName.toUpperCase()
  const main = { section: 'Rekeningen', name: holder, sub: customer.iban, value: customer.balance, icon: 'wallet' }
  const extra = customer.myKbc.map((r) => (r.section === 'Rekeningen'
    ? { ...r, name: holder, icon: /spaar/i.test(r.name) ? 'piggy' : 'wallet' }
    : { ...r, icon: r.icon ?? SECTION_ICON[r.section] ?? 'doc' }))
  return [main, ...extra]
}

export function BankSection({ section, rows }) {
  if (rows.length === 0) return null
  return (
    <View>
      <SectionHead title={SECTION_TITLE[section] ?? section} right={<NewLink />} />
      {rows.map((r) => <RowCard key={r.name + r.sub} icon={r.icon} name={r.name} sub={r.sub} value={r.value} />)}
    </View>
  )
}

/** Debit card of the fictional customer; the last digits come from the fictional IBAN. */
export function PaymentSection({ customer }) {
  const last4 = customer.iban.replace(/\s/g, '').slice(-4)
  return (
    <View>
      <SectionHead title="Payment methods" right={<NewLink />} />
      <RowCard icon="card" name="KBC debit card" sub={customer.fullName.toUpperCase()} sub2={`**** ${last4}`} />
    </View>
  )
}

/** Kate Coins: vivid, because they are earned with KBC Loop (repairing and returning). */
export function KateCoinsSection({ coins, onEarn }) {
  return (
    <View>
      <SectionHead title="Kate Coins" />
      <RowCard icon="coins" name="Kate Coins" sub="Earned by repairing and returning with KBC Loop" value={coins} unit="KTC"
        onPress={onEarn} label={`${num(coins)} Kate Coins, earned with KBC Loop. Earn more in the Loop offers`} />
    </View>
  )
}
