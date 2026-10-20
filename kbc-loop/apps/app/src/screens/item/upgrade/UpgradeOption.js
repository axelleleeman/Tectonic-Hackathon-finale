// One upgrade candidate: picture, name, partner, monthly difference and the first things included.
import { StyleSheet, View } from 'react-native'
import { partnerOf } from '@kbc-loop/shared/engine/catalog.js'
import { Press } from '../../../ui/Press.js'
import { T } from '../../../ui/T.js'
import { ProductArt } from '../ProductArt.js'
import { Glyph } from '../Glyph.js'
import { money, signedMoney } from '../format.js'
import { cardShadow, colors } from '../../../theme.js'

export function UpgradeOption({ option, quote, selected, onPress }) {
  const diff = quote?.monthlyDifference ?? 0
  return (
    <Press onPress={onPress} role="radio" aria-checked={selected}
      label={`${option.name} by ${partnerOf(option).name}, ${money(option.monthly)} per month, ${signedMoney(diff)} per month compared to now`}
      style={[styles.card, selected && styles.cardOn]}>
      <View style={styles.head}>
        <ProductArt product={option} size="md" />
        <View style={styles.headText}>
          <T style={styles.name}>{option.name}</T>
          <T style={styles.partner}>{partnerOf(option).name}</T>
          <View style={styles.priceRow}>
            <T style={styles.price}>{money(option.monthly)}<T style={styles.per}> /month</T></T>
            <View style={styles.diff}><T style={styles.diffText}>{signedMoney(diff)}</T></View>
          </View>
        </View>
        <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      </View>
      {selected ? (
        <View style={styles.includes}>
          {option.includes.slice(0, 3).map((i) => (
            <View key={i} style={styles.include}>
              <Glyph name="check" size={15} color={colors.kmBlue} strokeWidth={2.4} />
              <T style={styles.includeText}>{i}</T>
            </View>
          ))}
        </View>
      ) : null}
    </Press>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1.5, borderColor: 'transparent', ...cardShadow },
  cardOn: { borderColor: colors.kmBlue, backgroundColor: '#f5fbff' },
  head: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  headText: { flex: 1 },
  name: { fontWeight: '800', fontSize: 15.5 },
  partner: { color: colors.kmSub, fontSize: 12.5, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  price: { fontWeight: '800', fontSize: 16 },
  per: { fontWeight: '500', fontSize: 12.5, color: colors.kmSub },
  diff: { backgroundColor: colors.kmSky, borderRadius: 99, paddingVertical: 2, paddingHorizontal: 8 },
  diffText: { fontSize: 12, fontWeight: '700', color: colors.kmBlue },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#c3d1df', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.kmBlue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmBlue },
  detail: { color: colors.kmSub, fontSize: 13.5, lineHeight: 19, marginTop: 10 },
  includes: { marginTop: 12, gap: 5 },
  include: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  includeText: { flex: 1, fontSize: 13, color: colors.kmNavy, lineHeight: 18 },
})
