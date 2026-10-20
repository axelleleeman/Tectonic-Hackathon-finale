// KBC Loop banner at the top of the Loop tab: one short line and one action.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { PillButton } from '../../ui/Button.js'
import { T } from '../../ui/T.js'
import { colors } from '../../theme.js'

export function LoopHero({ onDiscover }) {
  return (
    <View style={styles.promo}>
      <View style={styles.body}>
        <T style={styles.title}>KBC Loop</T>
        <T style={styles.text}>Use instead of own. Repairs and insurance included.</T>
        <PillButton onPress={onDiscover} label="Discover the KBC Loop partners">Discover partners</PillButton>
      </View>
      <View style={styles.icon}><Icon name="loop" size={40} color={colors.kmBlue} /></View>
    </View>
  )
}

const styles = StyleSheet.create({
  promo: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: colors.kmSky, borderRadius: 12, paddingVertical: 18, paddingHorizontal: 16 },
  body: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: colors.kmNavy },
  text: { marginTop: 4, marginBottom: 12, fontSize: 14, lineHeight: 20, color: colors.kmSub },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
})
