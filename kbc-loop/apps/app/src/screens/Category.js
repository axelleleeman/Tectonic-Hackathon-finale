// Categorie: partners met elk een horizontale rij producten, plus verwante KBC-diensten.
import { ScrollView, StyleSheet, View } from 'react-native'
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { servicesForCategory } from '@kbc-loop/shared/engine/integrations.js'
import { Photo } from '../ui/Photo.js'
import { ServiceChips } from '../ui/ServiceChips.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { boxes, colors } from '../theme.js'

export function Category({ customer, categoryId, items, actions }) {
  const cat = categoriesFor(customer.type).find((c) => c.id === categoryId)
  if (!cat) return null
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)
  const services = servicesForCategory(cat.id)

  return (
    <>
      <Photo photoKey={cat.id} tint={cat.tint} icon={cat.icon} style={styles.hero}>
        <T style={styles.heroTitle}>{cat.name}</T>
        <T style={styles.heroSub}>{cat.blurb}</T>
      </Photo>

      {cat.partners.map((pa) => (
        <View key={pa.id} style={styles.partner}>
          <View style={styles.partnerHead}>
            <View style={styles.logo}><T style={styles.logoText}>{pa.short.slice(0, 2)}</T></View>
            <View style={styles.partnerText}>
              <T style={styles.partnerName}>{pa.name}</T>
              <T style={styles.partnerTag}>{pa.tagline}</T>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {pa.products.map((p) => (
              <Press key={p.id} style={styles.card}
                onPress={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: cat.id })}>
                <T style={styles.icon}>{p.icon}</T>
                <T style={styles.name}>{p.name}</T>
                <T style={styles.small}>{p.detail}</T>
                <T style={styles.from}>{inUse(p.id) ? '✓ in gebruik' : `${euro(p.monthly)}/maand`}</T>
              </Press>
            ))}
          </ScrollView>
        </View>
      ))}

      {services.length > 0 ? (
        <View style={boxes.kbcBox}>
          <T style={boxes.kbcBoxTitle}>Ook bij KBC</T>
          <ServiceChips services={services} />
        </View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  hero: { height: 150, borderRadius: 18, marginBottom: 6 },
  heroTitle: { color: '#fff', fontSize: 19, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18, marginTop: 2 },
  partner: { marginTop: 16 },
  partnerHead: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  logo: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontWeight: '800', fontSize: 13, color: colors.navy },
  partnerText: { flex: 1 },
  partnerName: { fontWeight: '700', color: colors.navy },
  partnerTag: { color: colors.muted, fontSize: 12, lineHeight: 16 },
  row: { gap: 10, paddingBottom: 4 },
  card: { width: 148, padding: 12, backgroundColor: '#fff', borderRadius: 14, gap: 2, borderWidth: 1, borderColor: colors.line },
  icon: { fontSize: 26, lineHeight: 34 },
  name: { fontWeight: '700', color: colors.ink },
  small: { color: colors.muted, fontSize: 12 },
  from: { marginTop: 6, fontWeight: '700', color: colors.navy, fontSize: 14 },
})
