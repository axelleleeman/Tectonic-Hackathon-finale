// Grid of small figures (label + value), two per row.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

export function StatGrid({ stats }) {
  return (
    <View style={styles.grid}>
      {stats.map((s) => (
        <View key={s.label} style={styles.stat} accessible aria-label={`${s.label}: ${s.value}`}>
          <T style={styles.label}>{s.label}</T>
          <T style={[styles.value, s.tone === 'green' && styles.green]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{s.value}</T>
          {s.sub ? <T style={styles.sub}>{s.sub}</T> : null}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { width: '48%', flexGrow: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, ...cardShadow },
  label: { fontSize: 12.5, color: colors.kmSub, fontWeight: '600' },
  value: { fontSize: 19, fontWeight: '800', marginTop: 6, letterSpacing: -0.3 },
  green: { color: colors.savingInk },
  sub: { fontSize: 12, color: colors.kmSub, marginTop: 2 },
})
