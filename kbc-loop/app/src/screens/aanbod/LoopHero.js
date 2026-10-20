// KBC Loop-banner bovenaan Aanbod (Axelle's promo): leen in plaats van te kopen.
import { StyleSheet, View } from 'react-native'
import { Icon } from '../../ui/Icon.js'
import { PillButton } from '../../ui/Button.js'
import { T } from '../../ui/T.js'
import { BadgeNew } from '../common.js'
import { colors } from '../../theme.js'

export function LoopHero({ onDiscover }) {
  return (
    <View style={styles.promo}>
      <View style={styles.body}>
        <BadgeNew style={styles.badge} />
        <T style={styles.text}>
          <T style={[styles.text, styles.bold]}>KBC Loop</T>: leen in plaats van te kopen. De partner blijft eigenaar en herstelt, KBC regelt financiering en verzekering.
        </T>
        <PillButton onPress={onDiscover}>Ontdek de partners</PillButton>
      </View>
      <View style={styles.icon}><Icon name="loop" size={40} color={colors.kmBlue} /></View>
    </View>
  )
}

const styles = StyleSheet.create({
  promo: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: colors.kmSky, borderRadius: 12, paddingVertical: 18, paddingHorizontal: 16 },
  body: { flex: 1 },
  badge: { alignSelf: 'flex-start' },
  text: { marginTop: 8, marginBottom: 12, fontSize: 15, lineHeight: 22 },
  bold: { fontWeight: '700', marginTop: 0, marginBottom: 0 },
  icon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
})
