// "Greener together": the green CO₂ card from KBC Mobile (dimmed) with the KBC Loop impact (vivid) below it.
// The Loop block links to KBC Loop in My KBC, or to the Loop offers while nothing has been borrowed yet.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { Dimmed } from '../../ui/Dimmed.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { Glyph } from './icons.js'
import { Dots, Pill, Section, shared } from './parts.js'
import { colors } from '../../theme.js'

const GREEN = '#1f9d55'
const PAD = 16
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

function LoopImpact({ co2Kg, carKm, onImpact, onStart }) {
  const has = co2Kg > 0
  const label = has
    ? `KBC Loop: you already saved ${num(co2Kg)} kilograms of CO₂, about ${num(carKm)} kilometres by car. View your impact`
    : 'KBC Loop: borrow instead of buying and save CO₂. Discover KBC Loop'
  return (
    <Press style={styles.loop} onPress={has ? onImpact : onStart} label={label}>
      <Glyph name="loop" size={20} color={colors.kmBlue} strokeWidth={2} />
      <View style={styles.loopText}>
        {has ? (
          <T style={styles.loopLine}>With KBC Loop you already saved <T style={styles.bold}>{num(co2Kg)} kg CO₂</T>, about {num(carKm)} km by car.</T>
        ) : (
          <T style={styles.loopLine}>Borrow instead of buying with <T style={styles.bold}>KBC Loop</T> and save CO₂ with every product.</T>
        )}
        <T style={styles.loopLink}>{has ? 'View your impact' : 'Discover KBC Loop'}</T>
      </View>
      <Glyph name="chevron" size={18} color={colors.kmBlue} strokeWidth={2} />
    </Press>
  )
}

export function Sustainability({ items, onImpact, onStart }) {
  const t = loopTotals(items)
  return (
    <Section title="Greener together">
      <View style={[shared.card, styles.card]}>
        <Dimmed style={styles.generic}>
          <Tiles />
          <Dots style={styles.dots} />
          <View style={styles.text}>
            <T style={styles.title}>How big is your CO₂ footprint? And how can we help you reduce it?</T>
            <Pill label="Tell me" color={GREEN} style={styles.pill} />
          </View>
        </Dimmed>
        <LoopImpact co2Kg={t.co2Kg} carKm={t.carKm} onImpact={onImpact} onStart={onStart} />
      </View>
    </Section>
  )
}

const styles = StyleSheet.create({
  // The dimmed generic part covers the top of the card edge to edge (cancelling the card padding).
  generic: { margin: -PAD, marginBottom: 0, padding: PAD, paddingBottom: 0 },
  card: { backgroundColor: '#e9faec', padding: PAD, overflow: 'hidden' },
  dots: { position: 'absolute', top: 8 - PAD, right: 10 - PAD },
  text: { width: '62%', minHeight: 150, justifyContent: 'center' },
  title: { fontSize: 17, lineHeight: 23 },
  pill: { marginTop: 14 },
  tiles: { position: 'absolute', top: 8 - PAD, right: 8 - PAD, width: 130, height: 160 },
  tile: { position: 'absolute', width: 44, height: 44, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-18deg' }], boxShadow: '0px 2px 6px rgba(18, 76, 40, 0.12)' },
  tileMain: { top: 52, left: 46, width: 52, height: 52, backgroundColor: GREEN },
  loop: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: '#bfe8d2', marginTop: 14, padding: 12, borderRadius: 10, backgroundColor: '#fff' },
  loopText: { flex: 1 },
  loopLine: { fontSize: 14, lineHeight: 20 },
  bold: { fontWeight: '700', fontSize: 14 },
  loopLink: { marginTop: 4, fontSize: 14, fontWeight: '700', color: colors.kmBlue },
})
