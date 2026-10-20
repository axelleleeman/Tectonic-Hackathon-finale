// Buttons from the web version: primary (filled pill), link (underlined) and pill button.
import { StyleSheet } from 'react-native'
import { Press } from './Press.js'
import { T } from './T.js'
import { colors } from '../theme.js'

export function PrimaryButton({ children, onPress }) {
  return (
    <Press onPress={onPress} style={styles.primary}><T style={styles.primaryText}>{children}</T></Press>
  )
}

export function LinkButton({ children, onPress, small = false, label }) {
  return (
    <Press onPress={onPress} label={label} style={small ? styles.linkSmall : styles.link}><T style={styles.linkText}>{children}</T></Press>
  )
}

export function PillButton({ children, onPress, label }) {
  return (
    <Press onPress={onPress} label={label} style={styles.pill}><T style={styles.pillText}>{children}</T></Press>
  )
}

const styles = StyleSheet.create({
  primary: { width: '100%', backgroundColor: colors.button, paddingVertical: 14, paddingHorizontal: 14, borderRadius: 99, marginTop: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  link: { width: '100%', padding: 10, alignItems: 'center' },
  linkSmall: { paddingVertical: 8, paddingHorizontal: 4 },
  linkText: { color: colors.muted, fontSize: 13, textDecorationLine: 'underline' },
  pill: { alignSelf: 'flex-start', backgroundColor: colors.button, paddingVertical: 9, paddingHorizontal: 18, borderRadius: 99 },
  pillText: { color: '#fff', fontWeight: '600', fontSize: 15 },
})
