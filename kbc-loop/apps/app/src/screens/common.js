// Small building blocks shared by several screens.
import { StyleSheet, View } from 'react-native'
import { T } from '../ui/T.js'
import { Press } from '../ui/Press.js'
import { colors } from '../theme.js'

/** Section heading with a title and an optional link on the right ("Show all" …). */
export function SectionHead({ title, right }) {
  return (
    <View style={styles.head}>
      <T style={styles.title} role="heading">{title}</T>
      {right}
    </View>
  )
}

export function HeadLink({ children, onPress, label }) {
  return (
    <Press onPress={onPress} label={label} hitSlop={8}><T style={styles.link}>{children}</T></Press>
  )
}

export function BadgeNew({ style }) {
  return <View style={[styles.badge, style]}><T style={styles.badgeText}>New</T></View>
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 26, marginBottom: 12 },
  title: { fontSize: 19, fontWeight: '700', color: colors.kmNavy, flexShrink: 1 },
  link: { color: colors.kmBlue, fontWeight: '700', fontSize: 14 },
  badge: { backgroundColor: colors.newGreen, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 7, alignSelf: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
})
