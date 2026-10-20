// Shown once on the new item's product detail right after an upgrade.
import { StyleSheet, View } from 'react-native'
import { COINS } from '@kbc-loop/shared/config/index.js'
import { productById } from '@kbc-loop/shared/engine/catalog.js'
import { useFlowChrome } from '../chrome.js'
import { ActionButton, Card, SuccessHeader, SummaryRow } from '../parts.js'
import { ProductArt } from '../ProductArt.js'
import { addDays, dateText, money, today } from '../format.js'

export function UpgradeSuccess({ item, product, partner, oldItem, onDone }) {
  const old = oldItem ? productById(oldItem.productId) : null
  useFlowChrome({ title: 'Upgrade confirmed', stepKey: 'upgrade-done', onBack: onDone })
  return (
    <>
      <SuccessHeader title="Upgrade confirmed" />
      <View style={styles.art}><ProductArt product={product} size="lg" /></View>
      <Card style={styles.card}>
        <SummaryRow label="New product" value={product.name} />
        <SummaryRow label="Monthly fee" value={`${money(product.monthly)}/month`} strong />
        <SummaryRow label="Delivery" value={dateText(addDays(today, 7))} />
        {old ? <SummaryRow label="Returned" value={old.name} /> : null}
        <SummaryRow label="Kate Coins" value={`+${COINS.return}`} strong last />
      </Card>
      <ActionButton onPress={onDone} label={`View your new ${product.name}`}>View product</ActionButton>
    </>
  )
}

const styles = StyleSheet.create({
  art: { alignItems: 'center', marginTop: 16 },
  card: { marginTop: 16, paddingVertical: 6 },
})
