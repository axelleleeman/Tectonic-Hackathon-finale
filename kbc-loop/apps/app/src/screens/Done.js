// Bevestiging na het lenen.
import { Animated, StyleSheet, View } from 'react-native'
import { productById, partnerNames } from '@kbc-loop/shared/engine/catalog.js'
import { PrimaryButton } from '../ui/Button.js'
import { T } from '../ui/T.js'
import { usePop } from '../ui/usePop.js'
import { colors, type } from '../theme.js'

export function Done({ productId, actions }) {
  const pop = usePop()
  const p = productById(productId)
  if (!p) return null
  return (
    <View style={styles.done}>
      <Animated.View style={[styles.check, pop]}><T style={styles.checkText}>✓</T></Animated.View>
      <T style={[type.h2, type.center]} role="heading">Borrowed!</T>
      <T style={styles.text}>{partnerNames(p)} will contact you about delivery. Financing and insurance are ready at KBC. Something breaks? One tap in My KBC and the partner comes to repair it.</T>
      <PrimaryButton onPress={() => actions.navigate('mykbc')}>Go to My KBC</PrimaryButton>
    </View>
  )
}

const styles = StyleSheet.create({
  done: { paddingTop: 40, alignItems: 'center' },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontSize: 36 },
  text: { color: colors.muted, lineHeight: 22, textAlign: 'center', marginVertical: 12 },
})
