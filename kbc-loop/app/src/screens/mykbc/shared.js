// Bouwstenen voor Mijn KBC (en Aanbod): de "Nieuw"-link en de gedempte stijl
// voor delen van KBC Mobile die in de demo niet klikbaar zijn. Alleen KBC Loop is interactief.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'

/** Doorschijnendheid van niet-klikbare KBC Mobile-onderdelen (zichtbaar, maar duidelijk "uit"). */
export const MUTED_OPACITY = 0.5

/** "+ Nieuw" rechts van een sectiekop. Zonder onPress: gedempt en niet klikbaar. */
export function NewLink({ onPress, label }) {
  const body = (
    <>
      <View style={styles.plus}><Icon name="plus" size={14} color="#fff" /></View>
      <T style={styles.newText}>Nieuw</T>
    </>
  )
  if (!onPress) return <View style={[styles.newLink, styles.muted]} aria-hidden>{body}</View>
  return <Press style={styles.newLink} onPress={onPress} label={label}>{body}</Press>
}

/** Niet-klikbare kop-link ("Alles tonen", "Naar Kate Wallet" …) in KBC Mobile-blauw, gedempt. */
export function MutedHeadLink({ children }) {
  return <T style={[styles.headLink, styles.muted]} aria-hidden>{children}</T>
}

/** Niet-klikbare pilknop ("Neem een kijkje", "Aan de slag"). */
export function MutedPill({ children }) {
  return <View style={[styles.pill, styles.muted]} aria-hidden><T style={styles.pillText}>{children}</T></View>
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
  newLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  plus: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center' },
  newText: { fontSize: 15 },
  headLink: { color: colors.kmBlue, fontWeight: '700', fontSize: 14 },
  pill: { alignSelf: 'flex-start', backgroundColor: colors.button, paddingVertical: 6, paddingHorizontal: 22, borderRadius: 99 },
  pillText: { color: '#fff', fontSize: 16 },
})
