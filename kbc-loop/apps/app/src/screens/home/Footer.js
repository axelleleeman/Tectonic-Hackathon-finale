// Bottom of Home: white list with "Personalise home" and "Handy in KBC Mobile". The rows are dimmed;
// the white background stays as is so it runs seamlessly to the bottom of the screen.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { Glyph } from './icons.js'
import { GUTTER } from './parts.js'
import { colors } from '../../theme.js'

// Same bottom padding as the scroll content in LoopApp, so the white area runs to the bottom.
const SHELL_BOTTOM_PAD = 150

const ROWS = [
  { id: 'personalise', icon: 'homeEdit', label: 'Personalise home', chevron: true },
  { id: 'handy', icon: 'heartHand', label: 'Handy in KBC Mobile' },
]

export function Footer() {
  return (
    <View style={styles.wrap}>
      <Dimmed bleed={GUTTER}>
        {ROWS.map((r) => (
          <View key={r.id} style={styles.row}>
            <Glyph name={r.icon} size={24} color={colors.kmNavy} strokeWidth={1.4} />
            <T style={styles.label}>{r.label}</T>
            {r.chevron ? <Glyph name="chevron" size={18} color={colors.kmNavy} strokeWidth={1.6} /> : null}
          </View>
        ))}
      </Dimmed>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginTop: 44, marginHorizontal: -GUTTER, marginBottom: -SHELL_BOTTOM_PAD, paddingTop: 20, paddingBottom: SHELL_BOTTOM_PAD, paddingHorizontal: GUTTER, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 12 },
  label: { flex: 1, fontSize: 17 },
})
