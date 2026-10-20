// Suggestions below Kate's message: outlined pill buttons in KBC blue.
// Only KBC Loop is interactive; the rest (e.g. "Call KBC Live") is shown light grey without an action.
import { StyleSheet, View } from 'react-native'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

export function KateChips({ chips, onChoose, busy }) {
  return (
    <View style={styles.row}>
      {chips.map((chip) => (chip.disabled ? (
        <View key={chip.id ?? chip.label} style={[styles.chip, styles.off]} aria-disabled>
          <T style={[styles.text, styles.offText]}>{chip.label}</T>
        </View>
      ) : (
        <Press key={chip.id ?? chip.label} style={styles.chip} label={chip.label} disabled={busy} onPress={() => onChoose(chip)}>
          <T style={styles.text}>{chip.label}</T>
        </Press>
      )))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  chip: { borderWidth: 1.5, borderColor: colors.kmBlue, borderRadius: 99, paddingVertical: 9, paddingHorizontal: 16, backgroundColor: '#fff' },
  text: { color: colors.kmBlue, fontSize: 15, fontWeight: '600' },
  off: { borderColor: colors.line },
  offText: { color: colors.off },
})
