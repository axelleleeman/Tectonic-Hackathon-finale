// Building blocks for My KBC (and the Loop tab): the "+ New" link, a static head link and a static pill.
// Parts of KBC Mobile that are not KBC Loop are wrapped in <Dimmed> (ui/Dimmed.js); these blocks never mute themselves.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'

/** "+ New" next to a section heading. Tappable with onPress (KBC Loop), otherwise static. */
export function NewLink({ onPress, label }) {
  const body = (
    <>
      <View style={styles.plus}><Icon name="plus" size={14} color="#fff" /></View>
      <T style={styles.newText}>New</T>
    </>
  )
  if (!onPress) return <View style={styles.newLink}>{body}</View>
  return <Press style={styles.newLink} onPress={onPress} label={label} hitSlop={8}>{body}</Press>
}

/** Static head link in KBC Mobile blue ("Show all", "To Kate Wallet" …). */
export function StaticHeadLink({ children }) {
  return <T style={styles.headLink}>{children}</T>
}

/** Static pill button ("Take a look", "Get started"). */
export function StaticPill({ children }) {
  return <View style={styles.pill}><T style={styles.pillText}>{children}</T></View>
}

const styles = StyleSheet.create({
  newLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  plus: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.kmGreen, alignItems: 'center', justifyContent: 'center' },
  newText: { fontSize: 15 },
  headLink: { color: colors.kmBlue, fontWeight: '700', fontSize: 14 },
  pill: { alignSelf: 'flex-start', backgroundColor: colors.button, paddingVertical: 6, paddingHorizontal: 22, borderRadius: 99 },
  pillText: { color: '#fff', fontSize: 16 },
})
