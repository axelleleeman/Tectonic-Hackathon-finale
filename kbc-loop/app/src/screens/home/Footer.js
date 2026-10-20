// Onderaan de startpagina: witte lijst met "Startpagina personaliseren" en "Handig in KBC Mobile". Niet klikbaar.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { GUTTER } from './parts.js'
import { colors } from '../../theme.js'

// Zelfde ondermarge als de scrollinhoud in LoopApp, zodat het witte vlak tot onderaan doorloopt.
const SHELL_BOTTOM_PAD = 150

const ROWS = [
  { id: 'personalise', icon: 'homeEdit', label: 'Startpagina personaliseren', chevron: true },
  { id: 'handy', icon: 'heartHand', label: 'Handig in KBC Mobile' },
]

export function Footer() {
  return (
    <View style={styles.wrap}>
      {ROWS.map((r) => (
        <View key={r.id} style={styles.row}>
          <Glyph name={r.icon} size={24} color={colors.kmNavy} strokeWidth={1.4} />
          <T style={styles.label}>{r.label}</T>
          {r.chevron ? <Glyph name="chevron" size={18} color={colors.kmNavy} strokeWidth={1.6} /> : null}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginTop: 44, marginHorizontal: -GUTTER, marginBottom: -SHELL_BOTTOM_PAD, paddingTop: 20, paddingBottom: SHELL_BOTTOM_PAD, paddingHorizontal: GUTTER, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 12 },
  label: { flex: 1, fontSize: 17 },
})
