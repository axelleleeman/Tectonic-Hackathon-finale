// Bestaande KBC-diensten als chips (officiële naam als toegankelijk label).
import { StyleSheet, View } from 'react-native'
import { T } from './T.js'
import { colors } from '../theme.js'

export function ServiceChips({ services, withRole = false }) {
  return (
    <View style={[styles.chips, withRole && styles.rows]}>
      {services.map((s) => (
        <View key={`${s.role ?? ''}-${s.id}`} style={[styles.chip, withRole && styles.chipRow]} aria-label={s.name}>
          <View style={styles.badge}><T style={styles.badgeText}>KBC</T></View>
          <T style={styles.text}>
            {withRole && s.role ? <><T style={[styles.text, styles.role]}>{s.role}</T> · </> : null}{s.label}
          </T>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rows: { flexDirection: 'column', alignItems: 'flex-start' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.softBlue, borderRadius: 99, paddingVertical: 4, paddingLeft: 4, paddingRight: 10, maxWidth: '100%' },
  chipRow: { borderRadius: 10, paddingVertical: 6, paddingLeft: 6 },
  badge: { backgroundColor: colors.navy, borderRadius: 99, paddingVertical: 2, paddingHorizontal: 6 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  text: { color: colors.navy, fontSize: 12, lineHeight: 16, flexShrink: 1 },
  role: { fontWeight: '700' },
})
