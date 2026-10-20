// KBC Loop-categorieën uit de gedeelde catalogus (Axelle's rijen): per categorie een fototegel met
// het aantal partners en daarna de producten, met een "In gebruik"-badge voor wat de klant al leent.
import { ScrollView, StyleSheet, View } from 'react-native'
import { euro } from '@kbc-loop/shared/engine/format.js'
import { Photo } from '../../ui/Photo.js'
import { Press } from '../../ui/Press.js'
import { T } from '../../ui/T.js'
import { HeadLink, SectionHead } from '../common.js'
import { cardShadow, colors } from '../../theme.js'

function CategoryRow({ category: c, inUse, actions }) {
  const openCategory = () => actions.navigate('category', { categoryId: c.id })
  const partners = `${c.partners.length} partner${c.partners.length > 1 ? 's' : ''}`
  return (
    <View>
      <SectionHead title={c.name} right={<HeadLink onPress={openCategory}>Alles tonen</HeadLink>} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.tileRow}>
        <Press style={[styles.tile, styles.photoTile]} onPress={openCategory} label={`${c.name}: ${partners}`}>
          <Photo photoKey={c.id} tint={c.tint} icon={c.icon} iconSize={34} style={styles.tilePhoto} />
          <T style={styles.photoTileText}>{partners}</T>
        </Press>
        {c.partners.flatMap((pa) => pa.products).map((p) => (
          <Press key={p.id} style={styles.tile} label={`${p.name}, ${euro(p.monthly)} per maand`}
            onPress={() => actions.navigate('product', { productId: p.id, signalId: null, categoryId: c.id })}>
            {inUse(p.id) ? <View style={styles.inUse}><T style={styles.inUseText}>In gebruik</T></View> : null}
            <T style={styles.tileIcon}>{p.icon}</T>
            <T style={styles.tileName}>{p.name}</T>
            <T style={styles.tileSmall}>{euro(p.monthly)}/maand</T>
          </Press>
        ))}
      </ScrollView>
    </View>
  )
}

export function LoopCategories({ categories, items, actions }) {
  const inUse = (id) => items.some((i) => i.productId === id && !i.returned)
  return categories.map((c) => <CategoryRow key={c.id} category={c} inUse={inUse} actions={actions} />)
}

const styles = StyleSheet.create({
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
