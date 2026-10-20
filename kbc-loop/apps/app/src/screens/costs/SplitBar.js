// Horizontal stacked bar with a legend: where one monthly fee goes (partner, insurance, KBC),
// or how the monthly total is spread over categories. Segments of 0 are left out.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { money } from '../item/format.js'
import { colors } from '../../theme.js'

export const SPLIT_COLORS = { partner: colors.kmBlue, insurance: '#8fcdea', kbc: '#c5d3e0' }

/** parts: [{ key, label, value, color, note? }] */
export function SplitBar({ parts, total }) {
  const shown = parts.filter((p) => p.value > 0)
  const sum = total ?? shown.reduce((s, p) => s + p.value, 0)
  const label = shown.map((p) => `${p.label} ${money(p.value)}`).join(', ')
  return (
    <View accessible aria-label={label}>
      <View style={styles.bar}>
        {shown.map((p) => <View key={p.key} style={{ flex: sum ? p.value / sum : 1, backgroundColor: p.color }} />)}
      </View>
      <View style={styles.legend}>
        {shown.map((p) => (
          <View key={p.key} style={styles.item}>
            <View style={[styles.swatch, { backgroundColor: p.color }]} />
            <View style={styles.itemText}>
              <T style={styles.itemLabel}>{p.label}</T>
              {p.note ? <T style={styles.itemNote}>{p.note}</T> : null}
            </View>
            <T style={styles.itemValue}>{money(p.value)}</T>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', gap: 2, backgroundColor: colors.kmLine },
  legend: { marginTop: 14, gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatch: { width: 12, height: 12, borderRadius: 4 },
  itemText: { flex: 1 },
  itemLabel: { fontSize: 14, fontWeight: '600' },
  itemNote: { fontSize: 12, color: colors.kmSub, marginTop: 1 },
  itemValue: { fontSize: 14.5, fontWeight: '800' },
})
