// Ronde betaalknop rechtsonder, zoals in KBC Mobile (in de demo niet actief).
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '../ui/Icon.js'

export function Fab() {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.fab, { bottom: Math.max(insets.bottom, 12) + 80 }]} aria-hidden pointerEvents="none">
      <Icon name="transfer" size={26} color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 16, width: 58, height: 58, borderRadius: 29, backgroundColor: '#1aa0dc',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 16px rgba(26, 160, 220, 0.45)', zIndex: 4,
  },
})
