// Segmented control (two or more options) in KBC navy; the choice is local component state of the caller.
import { StyleSheet, View } from 'react-native'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'

export function Segmented({ options, value, onChange }) {
  return (
    <View style={styles.bar} role="tablist">
      {options.map((o) => {
        const on = o.id === value
        return (
          <Press key={o.id} role="tab" aria-selected={on} label={o.label} onPress={() => onChange(o.id)} style={[styles.seg, on && styles.on]}>
            <T style={[styles.text, on && styles.textOn]} numberOfLines={1}>{o.label}</T>
          </Press>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#e7edf3', borderRadius: 12, padding: 3 },
  seg: { flex: 1, minWidth: 0, paddingVertical: 9, paddingHorizontal: 4, borderRadius: 10, alignItems: 'center' },
  on: { backgroundColor: colors.kmNavy },
  text: { fontSize: 14, fontWeight: '600', color: colors.kmSub },
  textOn: { color: '#fff' },
})
