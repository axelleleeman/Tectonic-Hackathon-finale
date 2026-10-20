// "Berichten" en "My Trustbox" onderaan Mijn KBC: zichtbaar zoals in KBC Mobile, maar niet klikbaar.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { SectionHead } from '../common.js'
import { LineIcon } from './icons.js'
import { MUTED_OPACITY, MutedPill } from './shared.js'
import { cardShadow, colors } from '../../theme.js'

export function MessagesSection() {
  return (
    <View>
      <SectionHead title="Berichten" />
      <View style={styles.card}>
        <View style={styles.halo} />
        <View style={[styles.messageBody, styles.muted]}>
          <T style={styles.messageText}>Tik op het belletje rechts bovenaan, daar vind je voortaan je berichten.</T>
          <MutedPill>Neem een kijkje</MutedPill>
        </View>
        <View style={[styles.bell, styles.muted]}>
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
        <View style={styles.muted}><LineIcon name="trustbox" size={42} color={colors.kmBlue} /></View>
        <View style={[styles.trustText, styles.muted]}>
          <T style={styles.trustName}>My Trustbox</T>
          <T style={styles.trustSub}>Je documenten en gegevens veilig op 1 plaats.</T>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  muted: { opacity: MUTED_OPACITY },
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
