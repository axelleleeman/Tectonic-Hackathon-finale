// Status of a borrowed item as shown in the chip on the product detail and in lists.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'
import { partnerStatusChip } from './partnerStatus.js'

export function itemStatus(item) {
  if (item.returned) return { kind: 'returned', label: 'Returned' }
  if (item.repair) {
    return item.repair.step >= 3
      ? { kind: 'repaired', label: 'Repaired' }
      : { kind: 'repair', label: partnerStatusChip(item.repair.partnerStatus) ?? `Repair step ${item.repair.step} of 3` }
  }
  return { kind: 'active', label: 'Active' }
}

const TONES = {
  active: { bg: '#e6f6ee', ink: '#0f6e4a', dot: colors.green },
  repaired: { bg: '#e6f6ee', ink: '#0f6e4a', dot: colors.green },
  repair: { bg: '#fff4d6', ink: '#7a5600', dot: '#f2b705' },
  returned: { bg: '#edf1f5', ink: colors.kmSub, dot: colors.kmGrey },
}

export function StatusChip({ item, style }) {
  const s = itemStatus(item)
  const tone = TONES[s.kind]
  return (
    <View style={[styles.chip, { backgroundColor: tone.bg }, style]} aria-label={`Status: ${s.label}`}>
      <View style={[styles.dot, { backgroundColor: tone.dot }]} />
      <T style={[styles.text, { color: tone.ink }]}>{s.label}</T>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 99 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12.5, fontWeight: '700' },
})
