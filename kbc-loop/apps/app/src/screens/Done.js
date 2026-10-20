// Bevestiging na het lenen.
import { Animated, StyleSheet, View } from 'react-native'
import { productById, partnerNames } from '@kbc-loop/shared/engine/catalog.js'
import { PrimaryButton } from '../ui/Button.js'
import { ContractSummary, ShareContract } from './ContractSummary.js'
import { contractFor } from './borrowContract.js'
import { T } from '../ui/T.js'
import { usePop } from '../ui/usePop.js'
import { colors, type } from '../theme.js'

export function Done({ productId, actions }) {
  const pop = usePop()
  const p = productById(productId)
  if (!p) return null
  const contract = contractFor(p.id)
  return (
    <View style={styles.done}>
      <Animated.View style={[styles.check, pop]}><T style={styles.checkText}>✓</T></Animated.View>
      <T style={[type.h2, type.center]} role="heading">Borrowed!</T>
      <T style={styles.text}>{partnerNames(p)} will contact you about delivery{contract?.refurbished ? ' of your refurbished unit' : ''}. Financing and insurance are ready at KBC. Something breaks? One tap in Loop and the partner comes to repair it.</T>
      {contract ? (
        <View style={styles.contract}>
          <ContractSummary terms={contract} partnerName={partnerNames(p)} />
          <T style={styles.ref}>Confirmed with KBC Sign · reference {contract.reference}</T>
          <ShareContract terms={contract} partnerName={partnerNames(p)} />
        </View>
      ) : null}
      <PrimaryButton onPress={() => actions.navigate('shop')}>Go to KBC Loop</PrimaryButton>
    </View>
  )
}

const styles = StyleSheet.create({
  done: { paddingTop: 40, alignItems: 'center' },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontSize: 36 },
  contract: { alignSelf: 'stretch' },
  ref: { color: colors.muted, fontSize: 12.5, textAlign: 'center', marginTop: 10 },
  text: { color: colors.muted, lineHeight: 22, textAlign: 'center', marginVertical: 12 },
})
