// Small status pill: neutral, positive (green) or attention (amber).
import { StyleSheet, View } from 'react-native'
import { T } from './T.js'
import { colors } from '../theme.js'
import { font, radius, space } from './tokens.js'

const TONES = {
  neutral: { bg: colors.kmSky, ink: colors.kmNavy },
  positive: { bg: colors.savingBg, ink: colors.savingInk },
  attention: { bg: colors.noteBg, ink: '#8a5a00' },
}

export function Badge({ children, tone = 'neutral', style }) {
  const t = TONES[tone] ?? TONES.neutral
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <T style={[styles.text, { color: t.ink }]}>{children}</T>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: space.sm, paddingVertical: 3, borderRadius: radius.pill },
  text: { ...font.micro },
})
