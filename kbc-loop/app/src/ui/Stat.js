import { StyleSheet, View } from 'react-native'
import { T } from './T.js'
import { cardShadow, colors } from '../theme.js'

export function Stat({ value, label, hint }) {
  return (
    <View style={styles.stat}>
      <T style={styles.value}>{value}</T>
      <T style={styles.label}>{label}</T>
      {hint ? <T style={styles.hint}>{hint}</T> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, ...cardShadow },
  value: { color: colors.green, fontSize: 18, fontWeight: '700' },
  label: { color: colors.muted, fontSize: 12, lineHeight: 16 },
  hint: { fontSize: 11, color: colors.navy, marginTop: 4 },
})
