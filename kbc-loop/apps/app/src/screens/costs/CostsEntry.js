// Compact link card to the cost overview, shown at the top of the Loop tab when the customer borrows something.
import { StyleSheet, View } from 'react-native'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { Glyph } from '../item/Glyph.js'
import { dateText, money, plural } from '../item/format.js'
import { cardShadow, colors } from '../../theme.js'

export function CostsEntry({ items, onPress, style }) {
  if (!items?.length) return null
  const o = costOverview(items)
  const running = o.items.filter((c) => c.status !== 'returned').length
  const sub = `${plural(running, 'product')}${o.nextPaymentDate ? ` · next payment ${dateText(o.nextPaymentDate, { withYear: false })}` : ''}`
  return (
    <Press onPress={onPress} label={`Your KBC Loop costs: ${money(o.monthlyTotal)} per month, ${sub}. View costs`} style={[styles.card, style]}>
      <View style={styles.icon}><Glyph name="receipt" size={22} color="#5b45c9" strokeWidth={2} /></View>
      <View style={styles.text}>
        <T style={styles.title}>Your costs · {money(o.monthlyTotal)}/month</T>
        <T style={styles.sub}>{sub}</T>
      </View>
      <T style={styles.link}>View costs</T>
      <Glyph name="chevron" size={16} color={colors.kmBlue} strokeWidth={2.2} />
    </Press>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, ...cardShadow },
  icon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#eeeafd', alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  title: { fontWeight: '800', fontSize: 15 },
  sub: { fontSize: 12.5, color: colors.kmSub, marginTop: 2 },
  link: { color: colors.kmBlue, fontWeight: '700', fontSize: 13.5 },
})
