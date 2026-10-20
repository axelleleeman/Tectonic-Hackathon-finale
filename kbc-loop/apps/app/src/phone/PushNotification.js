// Pushmelding bovenaan het scherm, zoals een melding van KBC Mobile op je gsm ("KBC Mobile · just now").
// Kate stelt de vraag die de klant zelf nog niet stelde (bv. "Third repair this year, Sarah?").
// Tik = voorstel openen, × of na een paar seconden = verdwijnt (blijft wel in "For you" staan).
import { useEffect, useRef } from 'react'
import { Animated, Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KbcLogo } from '../ui/KbcLogo.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { cardShadow, colors } from '../theme.js'

const AUTO_HIDE_MS = 9000
const native = Platform.OS !== 'web'

export function PushNotification({ title, body, onOpen, onClose }) {
  const insets = useSafeAreaInsets()
  const y = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(y, { toValue: 1, useNativeDriver: native, friction: 8 }).start()
    const t = setTimeout(onClose, AUTO_HIDE_MS)
    return () => clearTimeout(t)
  }, [y, onClose])

  const style = {
    opacity: y,
    transform: [{ translateY: y.interpolate({ inputRange: [0, 1], outputRange: [-120, 0] }) }],
  }

  return (
    <Animated.View style={[styles.wrap, { top: insets.top + 8 }, style]} role="alert">
      <Press style={styles.card} onPress={onOpen} label={`${title} ${body}. Open the proposal`}>
        <View style={styles.head}>
          <View style={styles.app}><KbcLogo height={11} /></View>
          <T style={styles.appName}>KBC Mobile · just now</T>
        </View>
        <View style={styles.row}>
          <View style={styles.ring} aria-hidden />
          <View style={styles.flex}>
            <T style={styles.title}>{title}</T>
            <T style={styles.body}>{body}</T>
          </View>
        </View>
      </Press>
      <Press style={styles.x} onPress={onClose} label="Close notification" hitSlop={10}>
        <T style={styles.xText}>×</T>
      </Press>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 10, right: 10, zIndex: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: 16, borderWidth: 1.5, borderColor: colors.kmBlue, paddingVertical: 12, paddingLeft: 14, paddingRight: 34, ...cardShadow, boxShadow: '0px 8px 24px rgba(18, 40, 76, 0.22)' },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  app: { width: 20, height: 20, borderRadius: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.kmLine, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 12, color: colors.kmGrey },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  // Kate-ring zoals in de pitch (open cirkel in KBC-blauw).
  ring: { width: 26, height: 26, borderRadius: 13, borderWidth: 3, borderColor: colors.kmBlue, borderTopColor: 'transparent', marginTop: 2, transform: [{ rotate: '-30deg' }] },
  flex: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: colors.kmNavy, marginBottom: 2 },
  body: { fontSize: 14, lineHeight: 20, color: colors.kmSub },
  x: { position: 'absolute', top: 6, right: 10, padding: 4 },
  xText: { fontSize: 20, color: colors.kmGrey, lineHeight: 20 },
})
