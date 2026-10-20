// Top of the product detail: large product picture, name, partner, status chip and the key facts.
import { StyleSheet, View } from 'react-native'
import { T } from '../../ui/T.js'
import { ProductArt } from './ProductArt.js'
import { StatusChip } from './status.js'
import { dateText, money } from './format.js'
import { cardShadow, colors } from '../../theme.js'

function Fact({ label, value }) {
  return (
    <View style={styles.fact} accessible aria-label={`${label}: ${value}`}>
      <T style={styles.factLabel} numberOfLines={1}>{label}</T>
      <T style={styles.factValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{value}</T>
    </View>
  )
}

export function ItemHero({ item, product, partner, cost }) {
  const ended = item.returned
  return (
    <View>
      <ProductArt product={product} size="hero" />
      <View style={styles.titleRow}>
        <View style={styles.titleText}>
          <T style={styles.partner}>{partner.name}</T>
          <T style={styles.name} role="heading">{product.name}</T>
        </View>
      </View>
      <StatusChip item={item} style={styles.chip} />
      {cost ? (
        <View style={styles.facts}>
          <Fact label="Monthly fee" value={money(cost.monthly)} />
          <View style={styles.divider} />
          <Fact label="Since" value={dateText(cost.since)} />
          <View style={styles.divider} />
          <Fact label={ended ? 'Returned on' : 'Ends on'} value={dateText(ended ? item.returnedOn : cost.endDate)} />
          <View style={styles.divider} />
          <Fact label="Paid to date" value={money(cost.paidToDate)} />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 16 },
  titleText: { flex: 1 },
  partner: { fontSize: 13.5, fontWeight: '500', color: colors.kmSub },
  name: { fontSize: 24, fontWeight: '800', color: colors.kmNavy, marginTop: 4, letterSpacing: -0.4 },
  chip: { marginTop: 10 },
  facts: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 6, marginTop: 16, ...cardShadow },
  fact: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  factLabel: { fontSize: 11.5, color: colors.kmSub, fontWeight: '600' },
  factValue: { fontSize: 14.5, fontWeight: '800', color: colors.kmNavy, marginTop: 5 },
  divider: { width: 1, backgroundColor: colors.kmLine, marginVertical: 2 },
})
