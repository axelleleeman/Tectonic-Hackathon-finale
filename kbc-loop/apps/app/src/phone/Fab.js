// Round blue transfer button at the bottom right, as in KBC Mobile. Not part of KBC Loop: dimmed and non-interactive.
import { StyleSheet, View } from 'react-native'
import { Dimmed } from '../ui/Dimmed.js'
import { Icon } from '../ui/Icon.js'
import { TABBAR_HEIGHT, useTabBarBottom } from './TabBar.js'

const SIZE = 56

export function Fab() {
  const bottom = useTabBarBottom() + TABBAR_HEIGHT + 14
  return (
    <Dimmed style={[styles.place, { bottom }]} radius={SIZE / 2}>
      <View style={styles.fab}>
        <Icon name="transfer" size={28} color="#fff" />
      </View>
    </Dimmed>
  )
}

const styles = StyleSheet.create({
  place: { position: 'absolute', right: 18, zIndex: 4 },
  fab: {
    width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: '#1990d8',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0px 6px 16px rgba(25, 144, 216, 0.45)',
  },
})
