import { StyleSheet, View } from 'react-native'
import { T } from './T.js'
import { colors } from '../theme.js'

export function KateAvatar() {
  return <View style={styles.dot} aria-hidden><T style={styles.k}>K</T></View>
}

const styles = StyleSheet.create({
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  k: { color: '#fff', fontWeight: '800', fontSize: 12 },
})
