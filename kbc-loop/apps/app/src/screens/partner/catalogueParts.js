// Building blocks shared by the catalogue, product and partner screens: partner logo (initials),
// the "How borrowing works" strip, and horizontal rails of partners and products.
import { ScrollView, StyleSheet, View } from 'react-native'
import { categories, partners, products } from '@kbc-loop/shared/data/index.js'
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { ProductImage } from '../../ui/ProductImage.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { cardShadow, colors } from '../../theme.js'

/** Two-letter monogram: the capitals of the short name (WashCycle → WC), else its first two letters. */
export function initials(partner) {
  const name = partner?.short ?? partner?.name ?? '?'
  const caps = name.replace(/[^A-Z]/g, '')
  return (caps.length >= 2 ? caps.slice(0, 2) : name.slice(0, 2)).toUpperCase()
}

export const categoryName = (partner) => categories.find((c) => c.id === partner?.category)?.name ?? ''

/** Products of a partner that this customer type can borrow. */
export const productsOfPartner = (partnerId, customerType) =>
  products.filter((p) => p.partnerId === partnerId && p.for.includes(customerType))

/** Every partner with at least one product for this customer type, in catalogue order. */
export const partnersFor = (customerType) =>
  categoriesFor(customerType).flatMap((c) => c.partners.map((pa) => ({ ...pa, categoryName: c.name })))

export function PartnerLogo({ partner, size = 44 }) {
  const tint = categories.find((c) => c.id === partner?.category)?.tint?.[1] ?? colors.kmNavy
  return (
    <View style={[styles.logo, { width: size, height: size, borderRadius: size * 0.28, backgroundColor: tint }]} aria-hidden>
      <T style={[styles.logoText, { fontSize: size * 0.36 }]}>{initials(partner)}</T>
    </View>
  )
}

const STEPS = [
  ['1', 'Choose', 'Pick a product from a circular partner.'],
  ['2', 'Sign with KBC', 'One contract, confirmed in KBC Mobile.'],
  ['3', 'We deliver, repair and take back', 'All included in one monthly fee.'],
]

export function HowBorrowingWorks() {
  return (
    <View style={styles.how}>
      <T style={styles.howTitle} role="heading">How borrowing works</T>
      <View style={styles.steps}>
        {STEPS.map(([n, title, body]) => (
          <View key={n} style={styles.step}>
            <View style={styles.stepNum}><T style={styles.stepNumText}>{n}</T></View>
            <T style={styles.stepTitle}>{title}</T>
            <T style={styles.stepBody}>{body}</T>
          </View>
        ))}
      </View>
    </View>
  )
}

export function RailTitle({ children, right }) {
  return (
    <View style={styles.railHead}>
      <T style={styles.railTitle} role="heading" numberOfLines={1}>{children}</T>
      {right ? <T style={styles.railRight}>{right}</T> : null}
    </View>
  )
}

function Rail({ children }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={styles.railContent}>
      {children}
    </ScrollView>
  )
}

export function PartnerRail({ partnerList, customerType, onOpen }) {
  return (
    <Rail>
      {partnerList.map((pa) => {
        const count = productsOfPartner(pa.id, customerType).length
        return (
          <Press key={pa.id} style={styles.partnerCard} label={`${pa.name}, ${categoryName(pa)}, ${count} products. Open the partner`} onPress={() => onOpen(pa.id)}>
            <PartnerLogo partner={pa} />
            <T style={styles.partnerName} numberOfLines={1}>{pa.name}</T>
            <T style={styles.partnerSub} numberOfLines={1}>{categoryName(pa)}</T>
            <T style={styles.partnerCount}>{count} product{count === 1 ? '' : 's'}</T>
          </Press>
        )
      })}
    </Rail>
  )
}

export function ProductRail({ list, onOpen }) {
  return (
    <Rail>
      {list.map((p) => (
        <Press key={p.id} style={styles.productCard} label={`${p.name}, ${euro(p.monthly)} per month. View product`} onPress={() => onOpen(p.id)}>
          <ProductImage product={p} rounded={false} style={styles.productImage} />
          <View style={styles.productBody}>
            <T style={styles.productPartner} numberOfLines={1}>{partners[p.partnerId]?.short}</T>
            <T style={styles.productName} numberOfLines={2}>{p.name}</T>
            <T style={styles.productPrice}>{euro(p.monthly)}/month</T>
          </View>
        </Press>
      ))}
    </Rail>
  )
}

const styles = StyleSheet.create({
  logo: { alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontWeight: '800', letterSpacing: 0.5 },
  how: { backgroundColor: colors.kmSky, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 12, marginTop: 14 },
  howTitle: { fontSize: 14, fontWeight: '700', color: colors.kmNavy, marginBottom: 8 },
  steps: { flexDirection: 'row', gap: 8 },
  step: { flex: 1 },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.kmNavy, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepTitle: { fontSize: 13, fontWeight: '700', color: colors.kmNavy },
  stepBody: { fontSize: 12, lineHeight: 16, color: colors.kmSub, marginTop: 2 },
  railHead: { flexDirection: 'row', alignItems: 'baseline', marginTop: 22 },
  railTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.kmNavy },
  railRight: { fontSize: 12.5, color: colors.kmSub },
  rail: { marginHorizontal: -16, marginTop: 6 },
  railContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  partnerCard: { width: 132, backgroundColor: '#fff', borderRadius: 14, padding: 12, ...cardShadow },
  partnerName: { fontSize: 14, fontWeight: '700', color: colors.ink, marginTop: 10 },
  partnerSub: { fontSize: 12, color: colors.kmSub, marginTop: 2 },
  partnerCount: { fontSize: 12, fontWeight: '600', color: colors.kmBlue, marginTop: 6 },
  productCard: { width: 156, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', ...cardShadow },
  productImage: { width: '100%', height: 104 },
  productBody: { padding: 10 },
  productPartner: { fontSize: 11.5, fontWeight: '700', color: colors.kmBlue },
  productName: { fontSize: 13.5, fontWeight: '600', color: colors.ink, marginTop: 2, minHeight: 36 },
  productPrice: { fontSize: 13, fontWeight: '700', color: colors.kmNavy, marginTop: 4 },
})
