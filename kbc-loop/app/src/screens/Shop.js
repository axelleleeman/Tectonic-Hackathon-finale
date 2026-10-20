// Tabblad "Aanbod": KBC Loop als nieuwe rubriek, met per categorie een rij partners en producten.
import { ScrollView, StyleSheet, View } from 'react-native'
import { categoriesFor } from '@kbc-loop/shared/engine/catalog.js'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { Icon } from '../ui/Icon.js'
import { Photo } from '../ui/Photo.js'
import { PillButton } from '../ui/Button.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { BadgeNew, HeadLink, SectionHead } from './common.js'
import { cardShadow, colors } from '../theme.js'

export function Shop({ customer, items, actions }) {
  const cats = categoriesFor(customer.type)
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)
  const openCategory = (id) => actions.navigate('category', { categoryId: id })

  return (
    <>
      <View style={styles.promo}>
        <View style={styles.promoBody}>
          <BadgeNew style={styles.promoBadge} />
          <T style={styles.promoText}>
            <T style={[styles.promoText, styles.bold]}>KBC Loop</T>: leen in plaats van te kopen. De partner blijft eigenaar en herstelt, KBC regelt financiering en verzekering.
          </T>
          <PillButton onPress={() => openCategory(cats[0].id)}>Ontdek de partners</PillButton>
        </View>
        <View style={styles.promoIcon}><Icon name="loop" size={40} color={colors.kmBlue} /></View>
      </View>

      {cats.map((c) => (
        <View key={c.id}>
          <SectionHead title={c.name} right={<HeadLink onPress={() => openCategory(c.id)}>Alles tonen</HeadLink>} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.tileRow}>
            <Press style={[styles.tile, styles.photoTile]} onPress={() => openCategory(c.id)}>
              <Photo photoKey={c.id} tint={c.tint} icon={c.icon} iconSize={34} style={styles.tilePhoto} />
              <T style={styles.photoTileText}>{c.partners.length} partner{c.partners.length > 1 ? 's' : ''}</T>
            </Press>
            {c.partners.flatMap((pa) => pa.products).map((p) => (
              <Press key={p.id} style={styles.tile}
                onPress={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: c.id })}>
                {inUse(p.id) ? <View style={styles.inUse}><T style={styles.inUseText}>In gebruik</T></View> : null}
                <T style={styles.tileIcon}>{p.icon}</T>
                <T style={styles.tileName}>{p.name}</T>
                <T style={styles.tileSmall}>{euro(p.monthly)}/maand</T>
              </Press>
            ))}
          </ScrollView>
        </View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  promo: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: colors.kmSky, borderRadius: 12, paddingVertical: 18, paddingHorizontal: 16 },
  promoBody: { flex: 1 },
  promoBadge: { alignSelf: 'flex-start' },
  promoText: { marginTop: 8, marginBottom: 12, fontSize: 15, lineHeight: 22 },
  bold: { fontWeight: '700', marginTop: 0, marginBottom: 0 },
  promoIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  bleed: { marginHorizontal: -16, flexGrow: 0 },
  tileRow: { gap: 12, paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 },
  tile: { width: 116, minHeight: 128, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 14, paddingHorizontal: 8, ...cardShadow },
  photoTile: { padding: 0, paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden', justifyContent: 'flex-start' },
  tilePhoto: { width: '100%', height: 92 },
  photoTileText: { padding: 8, fontWeight: '600', fontSize: 14 },
  tileIcon: { fontSize: 34, lineHeight: 42 },
  tileName: { fontSize: 14, textAlign: 'center' },
  tileSmall: { color: colors.kmSub, fontSize: 12 },
  inUse: { position: 'absolute', top: -1, alignSelf: 'center', backgroundColor: colors.newGreen, paddingVertical: 3, paddingHorizontal: 8, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  inUseText: { color: '#fff', fontSize: 10, fontWeight: '700' },
})
