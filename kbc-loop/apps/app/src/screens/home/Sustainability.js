// "Samen duurzamer": groene CO₂-kaart uit KBC Mobile, aangevuld met de KBC Loop-impact (vermeden CO₂).
// Enkel de KBC Loop-link is klikbaar.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { Dots, Pill, Section, TextLink, shared, tone } from './parts.js'

const GREEN = '#1f9d55'
const TILES = [
  { icon: 'tree', style: { top: 8, left: 22 } },
  { icon: 'bulb', style: { top: 30, right: 0 } },
  { icon: 'recycle', style: { top: 92, left: 0 } },
  { icon: 'home', style: { top: 112, right: 18 } },
]

function Tiles() {
  return (
    <View style={styles.tiles} aria-hidden>
      {TILES.map((t) => (
        <View key={t.icon} style={[styles.tile, t.style]}><Glyph name={t.icon} size={22} color={GREEN} strokeWidth={1.5} /></View>
      ))}
      <View style={[styles.tile, styles.tileMain]}><Glyph name="leaf" size={26} color="#fff" fill="#fff" strokeWidth={1.2} /></View>
    </View>
  )
}

export function Sustainability({ items, onImpact }) {
  const t = loopTotals(items)
  return (
    <Section title="Samen duurzamer">
      <View style={[shared.card, styles.card]}>
        <Tiles />
        <Dots style={styles.dots} />
        <View style={styles.text}>
          <T style={styles.title}>Hoe groot is jouw CO₂-voetafdruk? En hoe kunnen we je helpen om die te verkleinen?</T>
          <Pill label="Vertel het mij" mutedColor="#86c9a1" style={styles.pill} />
        </View>
        {t.co2Kg > 0 ? (
          <View style={styles.loop}>
            <Glyph name="loop" size={20} color={tone.loop} strokeWidth={2} />
            <View style={styles.loopText}>
              <T style={styles.loopLine}>Met KBC Loop vermeed je al <T style={styles.bold}>{num(t.co2Kg)} kg CO₂</T>, zo'n {num(t.carKm)} km met de auto.</T>
              <TextLink label="Bekijk je impact" onPress={onImpact} style={styles.loopLink} />
            </View>
          </View>
        ) : null}
      </View>
    </Section>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#e9faec', padding: 16, overflow: 'hidden' },
  dots: { position: 'absolute', top: 8, right: 10 },
  text: { width: '62%', minHeight: 150, justifyContent: 'center' },
  title: { fontSize: 17, lineHeight: 23 },
  pill: { marginTop: 14 },
  tiles: { position: 'absolute', top: 8, right: 8, width: 130, height: 160 },
  tile: { position: 'absolute', width: 44, height: 44, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-18deg' }], boxShadow: '0px 2px 6px rgba(18, 76, 40, 0.12)' },
  tileMain: { top: 52, left: 46, width: 52, height: 52, backgroundColor: GREEN },
  loop: { flexDirection: 'row', gap: 10, marginTop: 14, padding: 12, borderRadius: 10, backgroundColor: '#fff' },
  loopText: { flex: 1 },
  loopLine: { fontSize: 14, lineHeight: 20 },
  bold: { fontWeight: '700', fontSize: 14 },
  loopLink: { marginTop: 4, fontSize: 14 },
})
