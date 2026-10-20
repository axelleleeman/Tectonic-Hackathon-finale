// KBC Loop impact hero: Kate Coins balance and CO₂ saved side by side, plus products in use and repairs.
// All figures come from the shared engine (loopTotals, carKmEquivalent) and the shared state (coins),
// so the app shows exactly the same numbers as the web.
import { StyleSheet, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { carKmEquivalent, loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { Icon } from './Icon.js'
import { Press } from './Press.js'
import { T } from './T.js'
import { cardShadow, colors } from '../theme.js'

const GOLD = '#f2b705'
const GREEN = '#1aa36f'
const LEAF = ['M5 19c0-8 5-13 14-14 0 9-5 14-13 14z', 'M5 19l7-7']

function CoinBadge() {
  return <View style={[styles.badge, styles.coinBadge]}><T style={styles.coinK}>K</T></View>
}

function LeafBadge() {
  return <View style={[styles.badge, styles.leafBadge]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {LEAF.map((d) => <Path key={d} d={d} />)}
      </Svg>
    </View>
}

function Figure({ badge, label, value, unit, caption, tint }) {
  return (
    <View style={[styles.figure, { borderColor: tint.line, backgroundColor: tint.bg }]}>
      <View style={styles.figureHead}>
        {badge}
        <T style={styles.figureLabel}>{label}</T>
      </View>
      <T style={[styles.value, { color: tint.ink }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}{unit ? <T style={[styles.unit, { color: tint.ink }]}> {unit}</T> : null}
      </T>
      <T style={styles.caption}>{caption}</T>
    </View>
  )
}

export function ImpactSummary({ items, coins, onPress, style }) {
  const t = loopTotals(items)
  const km = num(carKmEquivalent(t.co2Kg))
  const coinsText = num(coins)
  const co2Text = num(t.co2Kg)
  const label = `KBC Loop impact. Kate Coins: ${coinsText}. CO₂ saved: ${co2Text} kilograms, about ${km} kilometres by car. `
    + `Products in use: ${t.active}. Repairs instead of replacements: ${t.repairs}.`

  const body = (
    <>
      <View style={styles.head}>
        <Icon name="loop" size={18} color={colors.kmBlue} strokeWidth={2.2} />
        <T style={styles.title}>Your KBC Loop impact</T>
        {onPress ? <Icon name="chevron" size={16} color={colors.kmBlue} strokeWidth={2.2} /> : null}
      </View>
      <View style={styles.figures}>
        <Figure badge={<CoinBadge />} label="Kate Coins" value={coinsText} caption="earned by repairing and returning"
          tint={{ bg: '#fff9e6', line: '#f6e2a6', ink: colors.kmNavy }} />
        <Figure badge={<LeafBadge />} label="CO₂ saved" value={co2Text} unit="kg" caption={`≈ ${km} km by car`}
          tint={{ bg: '#e9f8f0', line: '#bfe8d2', ink: '#0f6e4a' }} />
      </View>
      <T style={styles.footer}>
        Products in use: <T style={styles.footerBold}>{t.active}</T>
        {'  ·  '}Repairs instead of replacements: <T style={styles.footerBold}>{t.repairs}</T>
      </T>
    </>
  )

  if (onPress) return <Press style={[styles.card, style]} onPress={onPress} label={`${label} Open KBC Loop in My KBC`}>{body}</Press>
  return <View style={[styles.card, style]} role="summary" accessible accessibilityLabel={label}>{body}</View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: '#cde8f6', ...cardShadow },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  title: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.kmNavy },
  figures: { flexDirection: 'row', gap: 10 },
  figure: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12 },
  figureHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  coinBadge: { backgroundColor: GOLD, borderWidth: 2, borderColor: '#fff', boxShadow: '0px 0px 0px 1.5px #0b3466' },
  coinK: { color: '#0b3466', fontSize: 14, fontWeight: '900' },
  leafBadge: { backgroundColor: GREEN },
  figureLabel: { flex: 1, fontSize: 13.5, fontWeight: '700', color: colors.kmNavy },
  value: { fontSize: 30, fontWeight: '800', marginTop: 8, letterSpacing: -0.5 },
  unit: { fontSize: 17, fontWeight: '700' },
  caption: { fontSize: 12.5, color: colors.kmSub, marginTop: 2, lineHeight: 16 },
  footer: { fontSize: 13, color: colors.kmSub, marginTop: 10, textAlign: 'center' },
  footerBold: { fontSize: 13, fontWeight: '800', color: colors.kmNavy },
})
