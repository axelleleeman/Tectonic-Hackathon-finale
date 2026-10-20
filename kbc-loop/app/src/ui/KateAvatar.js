// Kate's avatar: het Kate-merkje (blauwe lijntjes) in een lichtblauw rondje, zoals in KBC Mobile.
import { StyleSheet, View } from 'react-native'
import { Icon } from './Icon.js'
import { colors } from '../theme.js'

export function KateAvatar({ size = 24 }) {
  return (
    <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2 }]} aria-hidden>
      <Icon name="kate" size={Math.round(size * 0.6)} color={colors.kmBlue} />
    </View>
  )
}

const styles = StyleSheet.create({
  dot: { backgroundColor: '#e3f3fb', borderWidth: 1, borderColor: '#cfe6f7', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
})
