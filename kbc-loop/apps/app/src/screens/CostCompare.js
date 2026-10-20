// Kopen versus lenen over de looptijd, met balkjes.
import { StyleSheet, View } from 'react-native'
import { costs } from '@kbc-loop/shared/engine/pricing.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { T } from '../ui/T.js'
import { boxes, cardShadow, colors, type } from '../theme.js'

export function CostCompare({ product }) {
  const { months, buy, borrow, saving } = costs(product)
  const max = Math.max(buy, borrow)
  const rows = [
    { label: 'Buying', value: buy, note: product.insuranceMonthly ? 'Purchase + expected repairs + separate insurance' : 'Purchase + expected repairs' },
    { label: 'Borrowing via KBC Loop', value: borrow, note: 'Repairs and take-back included', loop: true },
  ]
  return (
    <>
      <T style={type.h4}>Over {months / 12} years</T>
      {rows.map((r) => (
        <View key={r.label} style={styles.bar}>
          <View style={styles.head}><T style={styles.label}>{r.label}</T><T style={styles.value}>{euro(r.value)}</T></View>
          <View style={styles.track}><View style={[styles.fill, r.loop && styles.fillLoop, { width: `${(r.value / max) * 100}%` }]} /></View>
          <T style={styles.note}>{r.note}</T>
        </View>
      ))}
      {saving > 0 ? (
        <View style={boxes.saving}><T style={boxes.savingText}>You save ± <T style={[boxes.savingText, type.bold]}>{euro(saving)}</T> and never have to pay for a repair yourself.</T></View>
      ) : (
        <View style={boxes.note}><T style={boxes.noteText}>Borrowing costs ± {euro(-saving)} more here, but you always have a working device without a large one-off expense.</T></View>
      )}
      {product.energySavingMonthly ? (
        <View style={boxes.saving}><T style={boxes.savingText}>Plus ± <T style={[boxes.savingText, type.bold]}>{euro(product.energySavingMonthly)}/month</T> lower energy bill.</T></View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  bar: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginVertical: 8, ...cardShadow },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontWeight: '700', color: colors.ink },
  value: { color: colors.ink },
  track: { height: 10, backgroundColor: colors.line, borderRadius: 6, marginTop: 8, marginBottom: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#9aa6b4', borderRadius: 6 },
  fillLoop: { backgroundColor: colors.blue },
  note: { color: colors.muted, fontSize: 12 },
})
