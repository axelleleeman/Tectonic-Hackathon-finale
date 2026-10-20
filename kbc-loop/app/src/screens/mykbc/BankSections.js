// De gewone KBC Mobile-rubrieken van Mijn KBC (rekeningen, kredieten, betaalmiddelen, Kate Coins,
// verzekeringen). Alles komt uit de fictieve klant; behalve KBC Loop is hier niets klikbaar.
import { View } from 'react-native'
import { SectionHead } from '../common.js'
import { RowCard } from './RowCard.js'
import { NewLink } from './shared.js'

const SECTION_ICON = { Rekeningen: 'wallet', Kredieten: 'house', Verzekeringen: 'shield' }

/** Alle rijen per rubriek: de zichtrekening bovenaan, dan de extra producten uit customer.myKbc. */
export function bankRows(customer) {
  const holder = customer.fullName.toUpperCase()
  const main = { section: 'Rekeningen', name: holder, sub: customer.iban, value: customer.balance, icon: 'wallet' }
  const extra = customer.myKbc.map((r) => (r.section === 'Rekeningen'
    ? { ...r, name: holder, icon: /spaar/i.test(r.name) ? 'piggy' : 'wallet' }
    : { ...r, icon: r.icon ?? SECTION_ICON[r.section] ?? 'doc' }))
  return [main, ...extra]
}

export function BankSection({ title, rows, withNew = true }) {
  if (rows.length === 0) return null
  return (
    <View>
      <SectionHead title={title} right={withNew ? <NewLink /> : null} />
      {rows.map((r) => <RowCard key={r.name + r.sub} muted icon={r.icon} name={r.name} sub={r.sub} value={r.value} />)}
    </View>
  )
}

/** Debetkaart van de fictieve klant; de laatste cijfers komen uit zijn fictieve IBAN. */
export function PaymentSection({ customer }) {
  const last4 = customer.iban.replace(/\s/g, '').slice(-4)
  return (
    <View>
      <SectionHead title="Betaalmiddelen" right={<NewLink />} />
      <RowCard muted icon="card" name="KBC-Debetkaart" sub={customer.fullName.toUpperCase()} sub2={`**** ${last4}`} />
    </View>
  )
}

/** Kate Coins: in volle kleur, want ze worden verdiend met KBC Loop (herstellen en inleveren). */
export function KateCoinsSection({ coins }) {
  return (
    <View>
      <SectionHead title="Kate Coins" />
      <RowCard icon="coins" name="Kate Coins" sub="Verdiend met herstellen en inleveren" value={coins} unit="KTC" />
    </View>
  )
}
