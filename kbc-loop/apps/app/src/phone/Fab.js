// Ronde blauwe overschrijvingsknop rechtsonder, zoals in KBC Mobile (in de demo niet actief).
import { StyleSheet, View } from 'react-native'
import { Icon } from '../ui/Icon.js'
import { TABBAR_HEIGHT, useTabBarBottom } from './TabBar.js'

export function Fab() {
  const bottom = useTabBarBottom() + TABBAR_HEIGHT + 14
  return (
    <View style={[styles.fab, { bottom }]} aria-hidden pointerEvents="none">
      <Icon name="transfer" size={28} color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', right: 18, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1990d8',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 16px rgba(25, 144, 216, 0.45)', zIndex: 4,
  },
})
