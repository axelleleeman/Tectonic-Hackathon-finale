// Compact cost card for the Impact segment: monthly total, one stacked bar per category
// (blue hue family), a small legend and the saving versus buying. Data from the shared costOverview.
import { StyleSheet, View } from 'react-native'
import { costOverview } from '@kbc-loop/shared/engine/costs.js'
import { money } from '../item/format.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

const PALETTE = ['#12284c', '#0a64b8', '#4a93d6', '#8dbde8', '#c3dcf3']
const MAX = 5
const ECO = '#0f6e4a'

function topCategories(byCategory) {
  if (byCategory.length <= MAX) return byCategory
  const rest = byCategory.slice(MAX - 1)
  const monthly = Math.round(rest.reduce((s, c) => s + c.monthly, 0) * 100) / 100
  return [...byCategory.slice(0, MAX - 1), { categoryId: 'other', name: 'Other', monthly }]
}

export function CostSnapshot({ items, onViewAll }) {
  const o = costOverview(items)
  const cats = topCategories(o.byCategory)
  const label = `Costs: ${money(o.monthlyTotal)} per month. `
    + cats.map((c) => `${c.name} ${money(c.monthly)}`).join(', ')
    + (o.savingVsBuying > 0 ? `. Saving versus buying ${money(o.savingVsBuying)}.` : '.')
  return (
    <Press style={styles.card} onPress={onViewAll} label={`${label} View all costs.`} accessibilityLabel={`${label} View all costs.`}>
      <View style={styles.head}>
        <View style={{ flexShrink: 1 }}>
          <T style={styles.title}>Costs</T>
          <T style={styles.total} numberOfLines={1}>{money(o.monthlyTotal)}<T style={styles.per}> / month</T></T>
        </View>
        <View style={styles.link}>
          <T style={styles.linkText}>View all</T>
          <Icon name="chevron" size={13} color={colors.kmBlue} strokeWidth={2.4} />
        </View>
      </View>
      {cats.length ? (
        <>
          <View style={styles.bar}>
            {cats.map((c, n) => (
              <View key={c.categoryId ?? n} style={{ flexGrow: c.monthly, flexBasis: 0, minWidth: 4, backgroundColor: PALETTE[n] }} />
            ))}
          </View>
          <View style={styles.legend}>
            {cats.map((c, n) => (
              <View key={c.categoryId ?? n} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: PALETTE[n] }]} />
                <T style={styles.legendName} numberOfLines={1}>{c.name}</T>
                <T style={styles.legendAmt}>{money(c.monthly)}</T>
              </View>
            ))}
          </View>
        </>
      ) : <T style={styles.legendName}>No running products yet.</T>}
      {o.savingVsBuying > 0 ? (
        <T style={styles.save}>Saving vs buying <T style={styles.saveValue}>{money(o.savingVsBuying)}</T></T>
      ) : null}
    </Press>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 12, ...cardShadow },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { fontSize: 13, color: colors.kmSub, fontWeight: '600' },
  total: { fontSize: 24, fontWeight: '700', color: colors.kmNavy, marginTop: 2 },
  per: { fontSize: 13, fontWeight: '500', color: colors.kmSub },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 2 },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.kmBlue },
  bar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2, backgroundColor: '#eef2f7' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendName: { fontSize: 13, color: colors.kmSub },
  legendAmt: { fontSize: 13, fontWeight: '700', color: colors.kmNavy },
  save: { fontSize: 13, color: colors.kmSub, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#dde3ea', paddingTop: 10 },
  saveValue: { fontWeight: '700', color: ECO },
})
