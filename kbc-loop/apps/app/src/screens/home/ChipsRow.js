// Row of "My…" chips. MyLoop (new, from KBC Loop) is the only vivid, tappable one; the rest is dimmed.
import { ScrollView, StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { Press } from '../../ui/Press.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { Glyph } from './icons.js'
import { GUTTER, shared } from './parts.js'
import { colors } from '../../theme.js'

const CHIPS = [
  { id: 'nws', label: 'MyNWS', icon: 'news' },
  { id: 'home', label: 'MyHome', icon: 'house' },
  { id: 'mobility', label: 'MyMobility', icon: 'signpost' },
]

export function ChipsRow({ onLoop }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[shared.bleed, styles.wrap]} contentContainerStyle={styles.row}>
      <Dimmed radius={CHIP_H / 2}>
        <View style={styles.wallet}><Glyph name="purse" size={18} color="#fff" /></View>
      </Dimmed>
      <Press style={[styles.chip, styles.loop]} onPress={onLoop} label="Open MyLoop: borrow instead of buy with KBC Loop">
        <Glyph name="loop" size={17} color={colors.kmBlue} strokeWidth={2} />
        <T style={[styles.text, styles.loopText]}>MyLoop</T>
        <View style={styles.newDot} />
      </Press>
      {CHIPS.map((c) => (
        <Dimmed key={c.id} radius={CHIP_H / 2}>
          <View style={styles.chip}>
            <Glyph name={c.icon} size={17} color={colors.kmNavy} strokeWidth={1.5} />
            <T style={styles.text}>{c.label}</T>
          </View>
        </Dimmed>
      ))}
    </ScrollView>
  )
}

const CHIP_H = 32

const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  row: { gap: 7, alignItems: 'center', paddingHorizontal: GUTTER, paddingVertical: 3 },
  wallet: { width: 38, height: CHIP_H, borderRadius: CHIP_H / 2, backgroundColor: colors.kmNavy, alignItems: 'center', justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, height: CHIP_H, paddingHorizontal: 12, borderRadius: CHIP_H / 2, backgroundColor: colors.kmSky },
  loop: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.kmBlue },
  text: { fontSize: 15, color: colors.kmNavy },
  loopText: { fontWeight: '700', color: colors.kmBlue },
  newDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.kmRed },
})
