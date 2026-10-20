// Service catalogue ("+" on the Loop tab). Without a category: the service categories for this customer type.
// With a category: its partners as sub-sections (name + tagline), each with compact product rows → product screen.
import { StyleSheet, View } from 'react-native'
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { servicesForCategory } from '@kbc-loop/shared/engine/integrations.js'
import { Icon } from '../ui/Icon.js'
import { ProductImage } from '../ui/ProductImage.js'
import { ServiceChips } from '../ui/ServiceChips.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { boxes, cardShadow, colors } from '../theme.js'

function CategoryList({ categories, actions }) {
  return (
    <>
      <T style={styles.blurb}>Choose a service to borrow instead of buy.</T>
      <View style={styles.list}>
        {categories.map((c, i) => (
          <Press key={c.id} style={[styles.catRow, i > 0 && styles.divider]} label={`${c.name}. Open the category`}
            onPress={() => actions.navigate('category', { categoryId: c.id })}>
            <View style={styles.catIcon}><T style={styles.catEmoji}>{c.icon}</T></View>
            <View style={styles.flex}>
              <T style={styles.catName}>{c.name}</T>
              <T style={styles.sub} numberOfLines={1}>{c.partners.length} partner{c.partners.length > 1 ? 's' : ''} · {c.productCount} products</T>
            </View>
            <Icon name="chevron" size={16} color={colors.kmGrey} strokeWidth={2} />
          </Press>
        ))}
      </View>
    </>
  )
}

export function Category({ customer, categoryId, items, actions }) {
  const categories = categoriesFor(customer.type)
  const cat = categoryId ? categories.find((c) => c.id === categoryId) : null
  if (!cat) return <CategoryList categories={categories} actions={actions} />
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)
  const services = servicesForCategory(cat.id)

  return (
    <>
      <T style={styles.title} role="heading">{cat.name}</T>
      {cat.blurb ? <T style={styles.blurb}>{cat.blurb}</T> : null}

      {cat.partners.map((pa) => (
        <View key={pa.id} style={styles.partner}>
          <T style={styles.partnerName}>{pa.name}</T>
          <T style={styles.sub}>{pa.tagline}</T>
          <View style={styles.list}>
            {pa.products.map((p, i) => (
              <Press key={p.id} style={[styles.prodRow, i > 0 && styles.divider]} label={`${p.name}, ${euro(p.monthly)} per month${inUse(p.id) ? ', in use' : ''}. View product`}
                onPress={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: cat.id })}>
                <ProductImage product={p} style={styles.thumb} />
                <T style={[styles.flex, styles.prodName]} numberOfLines={2}>{p.name}</T>
                <T style={inUse(p.id) ? styles.inUse : styles.price}>{inUse(p.id) ? 'In use' : `${euro(p.monthly)}/month`}</T>
              </Press>
            ))}
          </View>
        </View>
      ))}

      {services.length > 0 ? (
        <View style={[boxes.kbcBox, styles.services]}>
          <T style={boxes.kbcBoxTitle}>Also at KBC</T>
          <ServiceChips services={services} />
        </View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 21, fontWeight: '700', color: colors.kmNavy, marginTop: 6 },
  blurb: { color: colors.kmSub, fontSize: 14, lineHeight: 19, marginTop: 4 },
  list: { backgroundColor: '#fff', borderRadius: 14, marginTop: 10, overflow: 'hidden', ...cardShadow },
  divider: { borderTopWidth: 1, borderTopColor: colors.kmLine },
  flex: { flex: 1 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 14 },
  catIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.kmSky, alignItems: 'center', justifyContent: 'center' },
  catEmoji: { fontSize: 20 },
  catName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  sub: { color: colors.kmSub, fontSize: 12.5, marginTop: 2 },
  partner: { marginTop: 22 },
  partnerName: { fontSize: 16, fontWeight: '700', color: colors.kmNavy },
  prodRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  thumb: { width: 56, height: 42, borderRadius: 8 },
  prodName: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  price: { fontSize: 14, fontWeight: '600', color: colors.kmNavy },
  inUse: { fontSize: 13, fontWeight: '700', color: colors.newGreen },
  services: { marginTop: 22 },
})
