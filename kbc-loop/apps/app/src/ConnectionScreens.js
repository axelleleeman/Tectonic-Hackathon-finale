// Schermen voor de verbinding met de api: verbinden, fout en een kleine offline-melding.
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KbcLogo } from './ui/KbcLogo.js'
import { T } from './ui/T.js'
import { colors } from './theme.js'

export function Connecting() {
  return (
    <View style={styles.center}>
      <KbcLogo height={48} />
      <ActivityIndicator size="large" color={colors.kmBlue} style={styles.spinner} />
      <T style={styles.title}>Verbinden met de KBC Loop-server…</T>
    </View>
  )
}

export function ConnectionError({ error, fatal }) {
  const phone = Platform.OS !== 'web'
  return (
    <View style={styles.center}>
      <KbcLogo height={48} />
      <T style={[styles.title, styles.space]}>Geen verbinding met de KBC Loop-server</T>
      <T style={styles.text}>{error?.message}</T>
      {fatal ? null : (
        <>
          <T style={styles.text}>Start de api op je computer met <T style={styles.code}>npm run dev:api</T> (in de map kbc-loop).</T>
          {phone ? (
            <T style={styles.text}>Op een echte gsm (of als Expo Go het netwerkadres van je computer gebruikt): start de api met <T style={styles.code}>HOST=0.0.0.0 npm run dev:api</T> en zorg dat gsm en computer op hetzelfde wifi zitten.</T>
          ) : null}
          <T style={styles.retry}>De app probeert automatisch opnieuw…</T>
        </>
      )}
    </View>
  )
}

export function OfflineBanner({ message }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.banner, { top: insets.top + 68 }]} role="status" pointerEvents="none">
      <T style={styles.bannerText}>{message}</T>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  spinner: { marginTop: 28, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  space: { marginTop: 24, marginBottom: 8 },
  text: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20, marginTop: 8, maxWidth: 360 },
  code: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), color: colors.kmNavy, fontSize: 13 },
  retry: { marginTop: 18, fontSize: 12, color: colors.kmGrey },
  banner: { position: 'absolute', alignSelf: 'center', zIndex: 10, backgroundColor: colors.kmNavy, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 99 },
  bannerText: { color: '#fff', fontSize: 12, fontWeight: '600' },
})
