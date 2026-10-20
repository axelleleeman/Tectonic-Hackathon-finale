// "Impact" of the Loop tab: CO₂ saved and Kate Coins as two big figures, then a compact row
// (Per month → cost overview, Products in use, Repairs). All figures come from the shared loopTotals.
import { StyleSheet, View } from 'react-native'
import { loopTotals } from '@kbc-loop/shared/engine/impact.js'
import { euro, num } from '@kbc-loop/shared/engine/format.js'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

const ECO = '#0f6e4a'

function Big({ label, value, unit, note, color }) {
  return (
    <View style={styles.big} accessible accessibilityLabel={`${label}: ${value}${unit ? ` ${unit}` : ''}. ${note}`}>
      <T style={styles.label}>{label}</T>
      <T style={[styles.bigValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}{unit ? <T style={[styles.unit, { color }]}> {unit}</T> : null}
      </T>
      <T style={styles.note}>{note}</T>
    </View>
  )
}

function Small({ label, value, onPress }) {
  const body = (
    <>
      <T style={styles.smallLabel} numberOfLines={1}>{label}</T>
      <View style={styles.smallRow}>
        <T style={styles.smallValue} numberOfLines={1} adjustsFontSizeToFit>{value}</T>
        {onPress ? <Icon name="chevron" size={14} color={colors.kmGrey} strokeWidth={2.2} /> : null}
      </View>
    </>
  )
  return onPress
    ? <Press onPress={onPress} style={styles.small} label={`${label}: ${value}. View cost overview`}>{body}</Press>
    : <View style={styles.small} accessible accessibilityLabel={`${label}: ${value}`}>{body}</View>
}

export function LoopImpact({ items, coins, actions }) {
  const t = loopTotals(items)
  return (
    <View style={styles.wrap}>
      <Big label="CO₂ saved" value={num(t.co2Kg)} unit="kg" color={ECO} note={`≈ ${num(t.carKm)} km less by car`} />
      <Big label="Kate Coins" value={num(coins)} color={colors.kmBlue} note="Earned with every repair and return" />
      <View style={styles.row}>
        <Small label="Per month" value={euro(t.monthly)} onPress={() => actions.navigate('costs')} />
        <Small label="In use" value={num(t.active)} />
        <Small label="Repairs" value={num(t.repairs)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginTop: 20, gap: 12 },
  big: { backgroundColor: '#fff', borderRadius: 16, padding: 18, ...cardShadow },
  label: { fontSize: 13, color: colors.kmSub, fontWeight: '600' },
  bigValue: { fontSize: 44, fontWeight: '700', letterSpacing: -1, marginTop: 2 },
  unit: { fontSize: 20, fontWeight: '600' },
  note: { fontSize: 13, color: colors.kmSub, marginTop: 2 },
  row: { flexDirection: 'row', gap: 10 },
  small: { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12, ...cardShadow },
  smallLabel: { fontSize: 12, color: colors.kmSub },
  smallRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 4 },
  smallValue: { fontSize: 20, fontWeight: '700', color: colors.kmNavy, flexShrink: 1 },
})
