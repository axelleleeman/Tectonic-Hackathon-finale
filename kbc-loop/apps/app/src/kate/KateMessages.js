// Messages in the Kate conversation, as in KBC Mobile:
// Kate: the Kate circle with plain text below it (no bubble); the user: a light-blue bubble on the right.
import { StyleSheet, View } from 'react-native'
import { KateAvatar } from '../ui/KateAvatar.js'
import { Icon } from '../ui/Icon.js'
import { T } from '../ui/T.js'
import { colors } from '../theme.js'

/** "Today" + "Ask Kate, your AI assistant ✦" at the top of the conversation. */
export function KateIntro() {
  return (
    <View style={styles.intro}>
      <T style={styles.today}>Today</T>
      <View style={styles.introRow}>
        <T style={styles.introText}>Ask Kate, your AI assistant</T>
        <Icon name="sparkle" size={14} color={colors.kmBlue} fill={colors.kmBlue} strokeWidth={0.8} />
      </View>
    </View>
  )
}

export function KateMessage({ children }) {
  return (
    <View style={styles.kate}>
      <KateAvatar size={34} />
      <T style={styles.kateText}>{children}</T>
    </View>
  )
}

export function UserMessage({ children }) {
  return (
    <View style={styles.user}>
      <T style={styles.userText}>{children}</T>
    </View>
  )
}

export function Message({ from, text }) {
  return from === 'user' ? <UserMessage>{text}</UserMessage> : <KateMessage>{text}</KateMessage>
}

const styles = StyleSheet.create({
  intro: { alignItems: 'center', gap: 6, marginBottom: 26 },
  today: { fontSize: 13, color: colors.kmNavy },
  introRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  introText: { fontSize: 15, color: colors.kmBlue },
  kate: { alignItems: 'flex-start', gap: 10, marginBottom: 18 },
  kateText: { fontSize: 20, lineHeight: 28, color: colors.kmNavy },
  user: {
    alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: '#e3f1fb', marginBottom: 18,
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18, borderBottomRightRadius: 6,
  },
  userText: { fontSize: 17, lineHeight: 23, color: colors.kmNavy },
})
