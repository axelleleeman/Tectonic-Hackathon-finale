// Afsluiter van Aanbod: tips en tricks voor KBC Mobile (niet klikbaar in de demo).
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { LineIcon } from '../mykbc/icons.js'
import { MUTED_OPACITY, MutedPill } from '../mykbc/shared.js'
import { colors } from '../../theme.js'

export function TipsCard() {
  return (
    <View style={styles.tips}>
      <View style={styles.head}>
        <View style={[styles.bulb, styles.muted]}>
          <LineIcon name="rays" size={46} color={colors.kmNavy} strokeWidth={1.4} />
          <View style={styles.bulbInner}><LineIcon name="bulb" size={30} color={colors.kmNavy} strokeWidth={1.5} /></View>
        </View>
        <T style={styles.title}>Ontdek handige tips en tricks in KBC Mobile</T>
      </View>
      <T style={[styles.text, styles.muted]}>Maak jij al optimaal gebruik van onze app? Gebruik KBC Mobile als een pro.</T>
      <MutedPill>Aan de slag</MutedPill>
    </View>
  )
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
  tips: { marginTop: 40, paddingHorizontal: 16, gap: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bulb: { width: 46, height: 46 },
  bulbInner: { position: 'absolute', left: 8, top: 10 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', lineHeight: 23 },
  text: { fontSize: 16, lineHeight: 22 },
})
