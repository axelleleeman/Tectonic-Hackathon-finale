// A borrowed product as one calm row: picture, name, partner, monthly fee and a status dot.
// Tapping opens the product detail (screen 'item') with the lifecycle, repairs and all actions.
import { StyleSheet, View } from 'react-native'
import { productById, partnerOf } from '@kbc-loop/shared/engine/catalog.js'
import { Press } from '../ui/Press.js'
import { T } from '../ui/T.js'
import { ProductArt } from './item/ProductArt.js'
import { itemStatus } from './item/status.js'
import { Glyph } from './item/Glyph.js'
import { money } from './item/format.js'
import { cardShadow, colors } from '../theme.js'
import { radius, space, tabular } from '../ui/tokens.js'

const DOT = { ok: '#1aa36f', warn: '#e0a100', off: 'transparent' }

export function LoopItemCard({ item, actions }) {
  const p = productById(item.productId)
  if (!p) return null
  const partner = partnerOf(p)
  const open = () => actions.navigate('item', { itemKey: item.key })
  const status = itemStatus(item)
  const tone = item.returned ? 'off' : item.repair && item.repair.step < 3 ? 'warn' : 'ok'

  return (
    <Press onPress={open} style={[styles.card, item.returned && styles.returned]}
      label={`${p.name}, ${partner.name}, ${status.label}, ${money(p.monthly)} per month. Open product details`}>
      <View style={styles.head}>
        <ProductArt product={p} size="sm" />
        <View style={styles.headText}>
          <T style={styles.name} numberOfLines={1}>{p.name}</T>
          <T style={styles.small} numberOfLines={1}>{partner.name}</T>
        </View>
        <T style={[styles.fee, item.returned && styles.muted]}>{item.returned ? '—' : money(p.monthly)}</T>
        <View style={[styles.dot, { backgroundColor: DOT[tone] }, tone === 'off' && styles.dotOff]} aria-hidden />
        <Glyph name="chevron" size={18} color={colors.kmGrey} />
      </View>
    </Press>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: radius.lg, paddingVertical: space.md, paddingHorizontal: space.md, marginVertical: 6, ...cardShadow },
  returned: { opacity: 0.7 },
  head: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  headText: { flex: 1 },
  name: { fontWeight: '600', color: colors.ink, fontSize: 15 },
  small: { color: colors.kmSub, fontSize: 13, marginTop: 2 },
  fee: { fontWeight: '600', color: colors.ink, fontSize: 15, ...tabular },
  muted: { color: colors.muted },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOff: { borderWidth: 1.5, borderColor: colors.muted },
})
