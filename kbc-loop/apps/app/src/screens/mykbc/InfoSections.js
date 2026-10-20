// "Messages" and "My Trustbox" at the bottom of My KBC: as in KBC Mobile, static (My KBC wraps them in <Dimmed>).
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { SectionHead } from '../common.js'
import { LineIcon } from './icons.js'
import { StaticPill } from './shared.js'
import { cardShadow, colors } from '../../theme.js'

export function MessagesSection() {
  return (
    <View>
      <SectionHead title="Messages" />
      <View style={styles.card}>
        <View style={styles.halo} />
        <View style={styles.messageBody}>
          <T style={styles.messageText}>Tap the bell at the top right: that is where you will find your messages from now on.</T>
          <StaticPill>Take a look</StaticPill>
        </View>
        <View style={styles.bell}>
          <LineIcon name="bell" size={56} color={colors.kmBlue} strokeWidth={1.4} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  )
}

export function TrustboxSection() {
  return (
    <View>
      <SectionHead title="My Trustbox" />
      <View style={[styles.card, styles.trust]}>
        <LineIcon name="trustbox" size={42} color={colors.kmBlue} />
        <View style={styles.trustText}>
          <T style={styles.trustName}>My Trustbox</T>
          <T style={styles.trustSub}>Your documents and data safely in one place.</T>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 22, marginBottom: 12, overflow: 'hidden', ...cardShadow },
  halo: { position: 'absolute', right: -50, top: -10, width: 210, height: 210, borderRadius: 105, backgroundColor: colors.kmSky, opacity: 0.7 },
  messageBody: { flex: 1, gap: 14, paddingRight: 8 },
  messageText: { fontSize: 16, lineHeight: 22 },
  bell: { width: 80, alignItems: 'center' },
  dot: { position: 'absolute', top: 6, right: 16, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.kmRed },
  trust: { gap: 14, paddingVertical: 14 },
  trustText: { flex: 1 },
  trustName: { fontSize: 16 },
  trustSub: { fontSize: 13, color: colors.kmSub, marginTop: 1 },
})
