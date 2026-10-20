// KBC Loop impact: four key figures (per month, CO₂ saved, repairs, Kate Coins) as big numbers with short labels.
// All figures come from the shared engine (loopTotals) and the shared state (coins),
// so the app shows exactly the same numbers as the web. Details live one tap further.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { num } from '@kbc-loop/shared/engine/format.js'
import { Icon } from './Icon.js'
import { Press } from './Press.js'
import { T } from './T.js'
import { cardShadow, colors } from '../theme.js'

const ECO = '#0f6e4a'

function Figure({ label, value, unit, color = colors.kmNavy }) {
  return (
    <View style={styles.figure}>
      <T style={styles.label}>{label}</T>
      <T style={[styles.value, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}{unit ? <T style={[styles.unit, { color }]}> {unit}</T> : null}
      </T>
    </View>
  )
}

export function ImpactSummary({ items, coins, onPress, onCosts, style }) {
  const t = loopTotals(items)
  const coinsText = num(coins)
  const co2Text = num(t.co2Kg)
  const label = `KBC Loop. ${num(t.monthly)} euro per month. CO₂ saved: ${co2Text} kilograms. `
    + `Repairs: ${t.repairs}. Kate Coins: ${coinsText}.`

  const body = (
    <>
      <View style={styles.head}>
        <T style={styles.title}>KBC Loop</T>
        {onPress ? <Icon name="chevron" size={16} color={colors.kmGrey} strokeWidth={2} /> : null}
      </View>
      <View style={styles.grid}>
        <Figure label="Per month" value={`€ ${num(t.monthly)}`} />
        <Figure label="CO₂ saved" value={co2Text} unit="kg" color={ECO} />
        <Figure label="Repairs" value={num(t.repairs)} />
        <Figure label="Kate Coins" value={coinsText} />
      </View>
    </>
  )
  // Cost overview link (screen 'costs'); kept outside the summarised block so screen readers reach it as its own button.
  const costsLink = onCosts ? (
    <Press onPress={onCosts} style={styles.costs} label={`View costs: ${num(t.monthly)} euro per month for KBC Loop`}>
      <T style={styles.costsText}>View costs</T>
      <Icon name="chevron" size={14} color={colors.kmBlue} strokeWidth={2.2} />
    </Press>
  ) : null

  if (onPress) {
    return (
      <View style={[styles.card, style]}>
        <Press onPress={onPress} label={`${label} Open KBC Loop in My KBC`}>{body}</Press>
        {costsLink}
      </View>
    )
  }
  return (
    <View style={[styles.card, style]}>
      <View role="summary" accessible accessibilityLabel={label}>{body}</View>
      {costsLink}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, ...cardShadow },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  title: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.kmNavy },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  figure: { width: '50%', paddingRight: 8 },
  label: { fontSize: 12.5, color: colors.kmSub },
  value: { fontSize: 26, fontWeight: '700', marginTop: 2, letterSpacing: -0.4 },
  unit: { fontSize: 15, fontWeight: '600' },
  costs: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 14, paddingVertical: 6 },
  costsText: { color: colors.kmBlue, fontWeight: '600', fontSize: 14 },
})
