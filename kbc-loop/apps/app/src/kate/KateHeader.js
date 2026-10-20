// Kate screen header: round ← button on the left, "Kate" centred, round × button on the right.
// The header is also the handle to swipe Kate down and away (panHandlers from KateScreen).
import { StyleSheet, View } from 'react-native'
import { Icon } from '../ui/Icon.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

function RoundButton({ icon, label, onPress }) {
  return (
    <Press style={styles.round} onPress={onPress} label={label}>
      <Icon name={icon} size={22} color={colors.kmBlue} strokeWidth={2} />
    </Press>
  )
}

export function KateHeader({ top, onClose, panHandlers }) {
  return (
    <View style={[styles.bar, { paddingTop: top + 8 }]} {...panHandlers}>
      <RoundButton icon="arrowLeft" label="Back" onPress={onClose} />
      <T style={styles.title} role="heading">Kate</T>
      <RoundButton icon="close" label="Close Kate" onPress={onClose} />
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, backgroundColor: '#fff',
    boxShadow: '0px 6px 14px rgba(18, 40, 76, 0.06)', zIndex: 2,
  },
  round: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0px 3px 12px rgba(18, 40, 76, 0.14)',
  },
  title: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '600', color: colors.kmNavy },
})
