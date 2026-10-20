// Parts of the cost overview: category bars, a product row and the upcoming payments list.
import { StyleSheet, View } from 'react-native'
import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { ProductArt } from '../item/ProductArt.js'
import { Glyph } from '../item/Glyph.js'
import { dateText, money } from '../item/format.js'
import { colors } from '../../theme.js'

const shareText = (n) => `${num(n, 1)}%`

export function CategoryBars({ categories }) {
  return (
    <View style={styles.cats}>
      {categories.map((c, n) => (
        <View key={c.categoryId} accessible aria-label={`${c.name}: ${money(c.monthly)} per month, ${shareText(c.share)} of the total`}>
          <View style={styles.catHead}>
            <T style={styles.catName}>{c.name}</T>
            <T style={styles.catValue}>{money(c.monthly)} <T style={styles.catShare}>· {shareText(c.share)}</T></T>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(c.share, 3)}%`, backgroundColor: colors.kmBlue, opacity: Math.max(0.35, 1 - n * 0.2) }]} />
          </View>
        </View>
      ))}
    </View>
  )
}

const STATUS = { active: 'Active', repair: 'In repair', returned: 'Returned' }

export function CostItemRow({ cost, onPress, last }) {
  const product = productById(cost.productId)
  const returned = cost.status === 'returned'
  return (
    <Press onPress={onPress} style={[styles.row, last && styles.rowLast]}
      label={`${cost.name}, ${cost.partnerName}, ${STATUS[cost.status]}, ${returned ? 'no monthly fee' : `${money(cost.monthly)} per month`}. Open product details`}>
      <ProductArt product={product} size="sm" style={returned && styles.faded} />
      <View style={styles.rowText}>
        <T style={[styles.rowName, returned && styles.muted]} numberOfLines={1}>{cost.name}</T>
        <T style={styles.rowSub} numberOfLines={1}>{cost.partnerName} · {STATUS[cost.status]}</T>
      </View>
      <View style={styles.rowRight}>
        <T style={[styles.rowAmount, returned && styles.muted]}>{returned ? '€ 0' : money(cost.monthly)}</T>
        <T style={styles.rowPer}>{returned ? 'ended' : '/month'}</T>
      </View>
      <Glyph name="chevron" size={18} color={colors.kmGrey} />
    </Press>
  )
}

export function UpcomingPayments({ upcoming }) {
  return (
    <View>
      {upcoming.map((u, n) => (
        <View key={u.date} style={[styles.pay, n === upcoming.length - 1 && styles.rowLast]} accessible aria-label={`${dateText(u.date)}: ${money(u.amount)}`}>
          <View style={styles.payIcon}><Glyph name="calendar" size={18} color={colors.kmBlue} /></View>
          <T style={styles.payDate}>{dateText(u.date, { weekday: true })}</T>
          <T style={styles.payAmount}>{money(u.amount)}</T>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  cats: { gap: 14 },
  catHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catName: { fontSize: 14, fontWeight: '700' },
  catValue: { fontSize: 14, fontWeight: '800' },
  catShare: { fontSize: 13, fontWeight: '500', color: colors.kmSub },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.kmLine, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.kmLine },
  rowLast: { borderBottomWidth: 0 },
  faded: { opacity: 0.5 },
  rowText: { flex: 1 },
  rowName: { fontWeight: '700', fontSize: 14.5 },
  rowSub: { fontSize: 12.5, color: colors.kmSub, marginTop: 2 },
  muted: { color: colors.kmGrey },
  rowRight: { alignItems: 'flex-end' },
  rowAmount: { fontWeight: '800', fontSize: 15 },
  rowPer: { fontSize: 11.5, color: colors.kmSub },
  pay: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.kmLine },
  payIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  payDate: { flex: 1, fontSize: 14, fontWeight: '600' },
  payAmount: { fontSize: 14.5, fontWeight: '800' },
})
