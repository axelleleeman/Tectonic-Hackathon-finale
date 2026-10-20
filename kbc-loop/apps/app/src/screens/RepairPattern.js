// "The signal": de herstellingen die Kate opmerkte (Repair €85 · Repair €70 · 3rd repair €85),
// met het totaal. Wordt getoond bij een voorstel dat uit herhaalde herstellingen komt.
import { StyleSheet, View } from 'react-native'
import { euro, formatDate } from '@kbc-loop/shared/engine/format.js'
import { T } from '../ui/T.js'
import { cardShadow, colors } from '../theme.js'

export function RepairPattern({ pattern }) {
  return (
    <View style={styles.box}>
      <View style={styles.badge}><T style={styles.badgeText}>{pattern.label}</T></View>
      <View style={styles.row}>
        {pattern.steps.map((s) => (
          <View key={s.id} style={[styles.chip, s.latest && styles.chipHot]}>
            <T style={[styles.chipLabel, s.latest && styles.hot]}>{s.label}</T>
            <T style={[styles.chipAmount, s.latest && styles.hot]}>{euro(s.amount)}</T>
            <T style={styles.chipDate}>{formatDate(s.date)}</T>
          </View>
        ))}
      </View>
      <T style={styles.note}>Paying again and again for the same machine? Let the producer own it and fix it.</T>
    </View>
  )
}

const ORANGE = '#e8742c'
const styles = StyleSheet.create({
  box: { backgroundColor: colors.kmSky, borderRadius: 14, padding: 14, marginTop: 14 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#fff', borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 10 },
  badgeText: { color: '#b4541a', fontWeight: '700', fontSize: 13 },
  row: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1.5, borderColor: 'transparent', ...cardShadow },
  chipHot: { backgroundColor: '#fff1e8', borderColor: ORANGE },
  chipLabel: { fontSize: 12, color: colors.kmSub },
  chipAmount: { fontSize: 17, fontWeight: '700', color: colors.kmNavy },
  chipDate: { fontSize: 11, color: colors.kmGrey, marginTop: 2 },
  hot: { color: '#b4541a' },
  note: { fontSize: 13, color: colors.kmSub, marginTop: 10, lineHeight: 18 },
})
